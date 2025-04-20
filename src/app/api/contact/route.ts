import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { rateLimit } from '../../../lib/rate-limit';
import { validateEmail } from '@/lib/validation';
import { sanitizeError } from '@/lib/error';
import { logger } from '@/lib/logger';

const MAX_MESSAGE_LENGTH = 5000;
const limiter = rateLimit({
  interval: 60 * 1000, // 1 minute
  uniqueTokenPerInterval: 500,
  maxRequests: 5,
});

export async function POST(request: Request) {
  try {
    let body;
    try {
      body = await request.json();
    } catch (error) {
      return new Response(
        JSON.stringify({ error: 'Invalid JSON payload' }),
        {
          status: 400,
          headers: getSecurityHeaders(),
        }
      );
    }

    const { name, email, message, subject } = body;

    // Validate required fields
    if (!name || !email || !message || !subject) {
      return new Response(
        JSON.stringify({ error: 'All fields are required' }),
        {
          status: 400,
          headers: getSecurityHeaders(),
        }
      );
    }

    // Validate email format
    if (!validateEmail(email)) {
      return new Response(
        JSON.stringify({ error: 'Invalid email format' }),
        {
          status: 400,
          headers: getSecurityHeaders(),
        }
      );
    }

    // Check message length
    if (message.length > MAX_MESSAGE_LENGTH) {
      return new Response(
        JSON.stringify({ error: 'Message is too large' }),
        {
          status: 413,
          headers: getSecurityHeaders(),
        }
      );
    }

    // Check CSRF token
    const csrfToken = request.headers.get('x-csrf-token');
    if (!csrfToken) {
      return new Response(
        JSON.stringify({ error: 'CSRF token is required' }),
        {
          status: 403,
          headers: getSecurityHeaders(),
        }
      );
    }

    if (!validateCsrfToken(csrfToken)) {
      return new Response(
        JSON.stringify({ error: 'invalid token' }),
        {
          status: 403,
          headers: getSecurityHeaders(),
        }
      );
    }

    // Apply rate limiting
    try {
      const ip = request.headers.get('x-forwarded-for') || 'unknown';
      await limiter.check(1, ip);
    } catch (error) {
      return new Response(
        JSON.stringify({ error: 'too many requests' }),
        {
          status: 429,
          headers: getSecurityHeaders(),
        }
      );
    }

    // Store the submission in the database
    try {
      const submission = await prisma.contactSubmission.create({
        data: {
          name,
          email,
          subject,
          message,
        },
      });

      return new Response(
        JSON.stringify({ message: 'Submission received successfully', id: submission.id }),
        {
          status: 200,
          headers: getSecurityHeaders(),
        }
      );
    } catch (error) {
      // Log error securely
      logger.error('Contact submission error', sanitizeError(error));

      return new Response(
        JSON.stringify({ error: 'An internal error occurred' }),
        {
          status: 500,
          headers: getSecurityHeaders(),
        }
      );
    }
  } catch (error) {
    // Log error securely
    logger.error('Contact submission error', sanitizeError(error));

    return new Response(
      JSON.stringify({ error: 'An internal error occurred' }),
      {
        status: 500,
        headers: getSecurityHeaders(),
      }
    );
  }
}

function getSecurityHeaders() {
  return {
    'Content-Type': 'application/json',
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'Content-Security-Policy': "default-src 'self'",
  };
}

function validateCsrfToken(token: string): boolean {
  // Validate token format: at least 32 characters of alphanumeric, dash, or underscore
  return /^[a-zA-Z0-9-_]{32,}$/.test(token);
}
