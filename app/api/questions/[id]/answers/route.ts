import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../auth/[...nextauth]/route';
import dbConnect from '@/lib/mongodb';
import Question from '@/models/Question';
import Answer from '@/models/Answer';
import User from '@/models/User';

// GET answers for a question
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const { id } = await params;

    const answers = await Answer.find({ questionId: id })
      .sort({ createdAt: 1 })
      .lean();

    return NextResponse.json({ answers }, { status: 200 });
  } catch (error: any) {
    console.error('Get answers error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch answers' },
      { status: 500 }
    );
  }
}

// POST - Create new answer
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

    // Check if question exists
    const question = await Question.findById(id);
    if (!question) {
      return NextResponse.json(
        { error: 'Question not found' },
        { status: 404 }
      );
    }

    const body = await request.json();
    const { content } = body;

    // Validation
    if (!content || content.trim().length < 1) {
      return NextResponse.json(
        { error: 'Answer content is required' },
        { status: 400 }
      );
    }

    if (content.trim().length > 1000) {
      return NextResponse.json(
        { error: 'Answer must be less than 1000 characters' },
        { status: 400 }
      );
    }

    // Get user details
    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Create answer
    const answer = await Answer.create({
      questionId: id,
      userId: user._id,
      username: user.username,
      userEmail: user.email,
      userImage: user.image,
      content: content.trim(),
    });

    // Increment answer count on question
    await Question.findByIdAndUpdate(id, { $inc: { answerCount: 1 } });

    return NextResponse.json(
      {
        message: 'Answer added successfully',
        answer,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Create answer error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create answer' },
      { status: 500 }
    );
  }
}
