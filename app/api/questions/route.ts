import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';
import dbConnect from '@/lib/mongodb';
import Question from '@/models/Question';
import User from '@/models/User';

// GET all questions
export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '50');
    const page = parseInt(searchParams.get('page') || '1');
    const skip = (page - 1) * limit;

    const questions = await Question.find({})
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip)
      .lean();

    const total = await Question.countDocuments({});

    return NextResponse.json(
      {
        questions,
        pagination: {
          total,
          page,
          pages: Math.ceil(total / limit),
        },
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Get questions error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch questions' },
      { status: 500 }
    );
  }
}

// POST - Create new question
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    const body = await request.json();
    const { content } = body;

    // Validation
    if (!content || content.trim().length < 3) {
      return NextResponse.json(
        { error: 'Question must be at least 3 characters long' },
        { status: 400 }
      );
    }

    if (content.trim().length > 500) {
      return NextResponse.json(
        { error: 'Question must be less than 500 characters' },
        { status: 400 }
      );
    }

    // Get user details
    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Create question
    const question = await Question.create({
      userId: user._id,
      username: user.username,
      userEmail: user.email,
      userImage: user.image,
      content: content.trim(),
      answerCount: 0,
    });

    return NextResponse.json(
      {
        message: 'Question created successfully',
        question,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Create question error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create question' },
      { status: 500 }
    );
  }
}
