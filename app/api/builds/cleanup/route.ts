import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';
import dbConnect from '@/lib/mongodb';
import Build from '@/models/Build';
import User from '@/models/User';

// DELETE - Remove all builds for current user (cleanup old schema builds)
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await dbConnect();

    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Delete all builds for this user
    const result = await Build.deleteMany({ userId: user._id });

    return NextResponse.json({
      message: `Deleted ${result.deletedCount} builds`,
      deletedCount: result.deletedCount,
    });
  } catch (error: any) {
    console.error('Cleanup builds error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to cleanup builds' },
      { status: 500 }
    );
  }
}
