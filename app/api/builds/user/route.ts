import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';
import dbConnect from '@/lib/mongodb';
import Build from '@/models/Build';
import User from '@/models/User';

// GET - Fetch all builds for current user
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Unauthorized. Please login first.' },
        { status: 401 }
      );
    }

    await dbConnect();

    // Get user
    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Fetch all builds for this user
    const builds = await Build.find({ userId: user._id }).sort({
      createdAt: -1,
    });

    return NextResponse.json(
      {
        builds,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Fetch user builds error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch builds' },
      { status: 500 }
    );
  }
}
