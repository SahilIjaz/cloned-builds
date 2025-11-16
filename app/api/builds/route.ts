import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';
import dbConnect from '@/lib/mongodb';
import Build from '@/models/Build';
import User from '@/models/User';

// GET all builds
export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    const session = await getServerSession(authOptions);
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const limit = parseInt(searchParams.get('limit') || '20');
    const page = parseInt(searchParams.get('page') || '1');
    const skip = (page - 1) * limit;

    let query: any = { isPublic: true };

    // If user is logged in, include their private builds too
    if (session && session.user) {
      const user = await User.findOne({ email: session.user.email });
      if (user) {
        query = {
          $or: [
            { isPublic: true },
            { userId: user._id, isPublic: false }, // Include user's private builds
          ],
        };
      }
    }

    // If userId is specified, override query to show only that user's builds
    if (userId) {
      query = { userId };
    }

    const builds = await Build.find(query)
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip)
      .lean();

    const total = await Build.countDocuments(query);

    return NextResponse.json(
      {
        builds,
        pagination: {
          total,
          page,
          pages: Math.ceil(total / limit),
        },
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Get builds error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch builds' },
      { status: 500 }
    );
  }
}

// POST - Create new build
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    const body = await request.json();
    const { name, description, components, totalPrice, isPublic } = body;

    // Validation
    if (!name || name.trim().length < 3) {
      return NextResponse.json(
        { error: 'Build name must be at least 3 characters long' },
        { status: 400 }
      );
    }

    // Get user details
    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Create build
    const build = await Build.create({
      name: name.trim(),
      description: description?.trim(),
      components,
      totalPrice,
      isPublic: isPublic !== false, // Default to true
      userId: user._id,
      username: user.username,
      userEmail: user.email,
      userImage: user.image,
      viewCount: 0,
      replyCount: 0,
    });

    return NextResponse.json(
      {
        message: 'Build created successfully',
        build,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Create build error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create build' },
      { status: 500 }
    );
  }
}
