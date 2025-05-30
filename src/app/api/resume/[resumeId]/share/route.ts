import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth'; // Assuming authOptions are exported from here

export async function PATCH(
  request: Request,
  { params }: { params: { resumeId: string } }
) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user || !session.user.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { resumeId } = params;
  let body;
  try {
    body = await request.json();
  } catch (error) {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  const { isPublic } = body;

  if (typeof isPublic !== 'boolean') {
    return NextResponse.json({ error: 'isPublic must be a boolean' }, { status: 400 });
  }

  try {
    const updatedResume = await prisma.resume.updateMany({
      where: {
        id: resumeId,
        userId: session.user.id, // Ensure the user owns the resume
      },
      data: {
        isPublic: isPublic,
        lastSharedAt: isPublic ? new Date() : null, // Update timestamp only when making public or set to null
      },
    });

    if (updatedResume.count === 0) {
      return NextResponse.json(
        { error: 'Resume not found or user not authorized' },
        { status: 404 }
      );
    }

    // Fetch the sharedId to return it, as updateMany doesn't return the record
    // This is useful if the client wants to immediately use the sharedId
    const resumeWithSharedId = await prisma.resume.findUnique({
        where: { id: resumeId },
        select: { sharedId: true, isPublic: true, lastSharedAt: true }
    });

    return NextResponse.json({
      message: 'Resume sharing status updated successfully',
      sharedId: resumeWithSharedId?.sharedId,
      isPublic: resumeWithSharedId?.isPublic,
      lastSharedAt: resumeWithSharedId?.lastSharedAt,
    }, { status: 200 });

  } catch (error) {
    console.error('Error updating resume sharing status:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
