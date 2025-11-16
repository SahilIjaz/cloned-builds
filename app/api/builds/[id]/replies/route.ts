import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../auth/[...nextauth]/route';
import dbConnect from '@/lib/mongodb';
import Build from '@/models/Build';
import Reply from '@/models/Reply';
import User from '@/models/User';

// GET replies for a build
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const { id } = await params;

    const replies = await Reply.find({ buildId: id })
      .sort({ createdAt: 1 })
      .lean();

    return NextResponse.json({ replies }, { status: 200 });
  } catch (error: any) {
    console.error('Get replies error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch replies' },
      { status: 500 }
    );
  }
}

// POST - Create new reply
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    const { id } = await params;

    // Check if build exists
    const build = await Build.findById(id);
    if (!build) {
      return NextResponse.json({ error: 'Build not found' }, { status: 404 });
    }

    const body = await request.json();
    const { content } = body;

    // Validation
    if (!content || content.trim().length < 1) {
      return NextResponse.json(
        { error: 'Reply content is required' },
        { status: 400 }
      );
    }

    if (content.trim().length > 1000) {
      return NextResponse.json(
        { error: 'Reply content must be less than 1000 characters' },
        { status: 400 }
      );
    }

    // Get user details
    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Create reply
    const reply = await Reply.create({
      buildId: id,
      userId: user._id,
      username: user.username,
      userImage: user.image,
      content: content.trim(),
    });

    // Increment reply count on build
    await Build.findByIdAndUpdate(id, { $inc: { replyCount: 1 } });

    return NextResponse.json(
      {
        message: 'Reply added successfully',
        reply,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Create reply error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create reply' },
      { status: 500 }
    );
  }
}
