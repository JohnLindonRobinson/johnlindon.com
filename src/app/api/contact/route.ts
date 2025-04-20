import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { rateLimit } from '@/lib/rate-limit';
import { sanitizeInput } from '@/lib/validation';
import { logger } from '@/lib/logger';
import { headers } from 'next/headers';
import type { ContactSubmission } from '@prisma/client';

const contactSchema = z.object({
  name: z.string().min(1).max(100),
  email: z.string().email(),
  subject: z.string().min(1).max(200),
  message: z.string().min(1).max(5000),
});

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const ip = headers().get('x-forwarded-for') || 'unknown';
    const limiter = rateLimit({
      maxRequests: 5,
      interval: 60 * 1000, // 1 minute
      uniqueTokenPerInterval: 500,
    });
    await limiter.check(5, ip); // Pass maxRequests as first argument

    const body = await request.json();
    const validatedData = contactSchema.parse({
      ...body,
      name: sanitizeInput(body.name),
      subject: sanitizeInput(body.subject),
      message: sanitizeInput(body.message),
    });

    const submission = await prisma.contactSubmission.create({
      data: validatedData,
    });

    return NextResponse.json(
      { message: 'Message sent successfully', id: submission.id },
      { status: 201 }
    );
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    if (error instanceof Error && error.message === 'Rate limit exceeded') {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 }
      );
    }
    console.error('Contact form error:', error);
    return NextResponse.json(
      { error: 'Failed to send message' },
      { status: 500 }
    );
  }
}
