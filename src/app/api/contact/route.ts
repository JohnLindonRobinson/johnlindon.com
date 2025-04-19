import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { name, email, subject, message } = await request.json();

    // Validate the input
    if (!name || !email || !subject || !message) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    // Store the submission in the database
    const submission = await prisma.contactSubmission.create({
      data: {
        name,
        email,
        subject,
        message,
      },
    });

    return NextResponse.json(
      { message: 'Submission received successfully', id: submission.id },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error storing submission:', error);
    return NextResponse.json({ error: 'Failed to store submission' }, { status: 500 });
  }
}
