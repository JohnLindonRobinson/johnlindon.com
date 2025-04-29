import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const updateSchema = z.object({
  status: z.enum(['new', 'read', 'replied']),
});

interface RouteSegment {
  id: string;
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: RouteSegment }
) {
  try {
    const id = parseInt(params.id);
    if (isNaN(id)) {
      return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
    }

    const body = await req.json();
    const validatedData = updateSchema.parse(body);

    const submission = await prisma.contactSubmission.update({
      where: { id },
      data: { status: validatedData.status },
    });

    return NextResponse.json(submission);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    return NextResponse.json(
      { error: 'Failed to update submission' },
      { status: 500 }
    );
  }
}
