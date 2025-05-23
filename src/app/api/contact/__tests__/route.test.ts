import { POST } from '../route';
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock Next.js Response
vi.mock('next/server', () => ({
  NextResponse: {
    json: vi.fn((data, init) => {
      const response = new Response(JSON.stringify(data), {
        status: init?.status || 200,
        headers: {
          'Content-Type': 'application/json',
        },
      });
      Object.defineProperty(response, 'ok', {
        get: () => init?.status === undefined || init?.status === 200,
      });
      return response;
    }),
  },
}));

// Mock Prisma
vi.mock('@/lib/prisma', () => ({
  prisma: {
    contactSubmission: {
      create: vi.fn(),
    },
  },
}));

describe('Contact API Route', () => {
  const mockPrismaCreate = prisma.contactSubmission.create as ReturnType<typeof vi.fn>;
  const mockNextResponseJson = NextResponse.json as ReturnType<typeof vi.fn>;

  beforeEach(() => {
    // Reset mocks before each test
    vi.resetAllMocks();
  });

  it('successfully creates a contact submission', async () => {
    const mockSubmission = {
      id: 1,
      name: 'Test User',
      email: 'test@example.com',
      subject: 'Test Subject',
      message: 'Test Message',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    mockPrismaCreate.mockResolvedValue(mockSubmission);

    const request = new Request('http://localhost:3000/api/contact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: 'Test User',
        email: 'test@example.com',
        subject: 'Test Subject',
        message: 'Test Message',
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toEqual({
      message: 'Submission received successfully',
      id: mockSubmission.id,
    });
    expect(mockPrismaCreate).toHaveBeenCalledWith({
      data: {
        name: 'Test User',
        email: 'test@example.com',
        subject: 'Test Subject',
        message: 'Test Message',
      },
    });
  });

  it('returns 400 when required fields are missing', async () => {
    const request = new Request('http://localhost:3000/api/contact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: 'Test User',
        // email missing
        subject: 'Test Subject',
        message: 'Test Message',
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data).toEqual({
      error: 'All fields are required',
    });
    expect(mockPrismaCreate).not.toHaveBeenCalled();
  });

  it('returns 500 when database operation fails', async () => {
    mockPrismaCreate.mockRejectedValue(new Error('Database error'));

    const request = new Request('http://localhost:3000/api/contact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: 'Test User',
        email: 'test@example.com',
        subject: 'Test Subject',
        message: 'Test Message',
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data).toEqual({
      error: 'Failed to store submission',
    });
  });

  it('handles malformed JSON in request body', async () => {
    const request = new Request('http://localhost:3000/api/contact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: 'invalid json',
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data).toEqual({
      error: 'Failed to store submission',
    });
    expect(mockPrismaCreate).not.toHaveBeenCalled();
  });
}); 