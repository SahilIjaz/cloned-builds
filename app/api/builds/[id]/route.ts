import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';
import dbConnect from '@/lib/mongodb';
import Build from '@/models/Build';
import User from '@/models/User';

// GET single build
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const { id } = await params;

    const build = await Build.findById(id).lean();

    if (!build) {
      return NextResponse.json({ error: 'Build not found' }, { status: 404 });
    }

    // Increment view count
    await Build.findByIdAndUpdate(id, { $inc: { viewCount: 1 } });

    return NextResponse.json({ build }, { status: 200 });
  } catch (error: any) {
    console.error('Get build error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch build' },
      { status: 500 }
    );
  }
}

// PUT - Update build
export async function PUT(
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

    const build = await Build.findById(id);

    if (!build) {
      return NextResponse.json({ error: 'Build not found' }, { status: 404 });
    }

    // Get user
    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Check ownership
    if (build.userId.toString() !== String(user._id)) {
      return NextResponse.json(
        { error: 'You can only edit your own builds' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { name, description, components, totalPrice, isPublic } = body;

    // Update build
    build.name = name?.trim() || build.name;
    build.description = description?.trim() || build.description;
    build.components = components || build.components;
    build.totalPrice = totalPrice !== undefined ? totalPrice : build.totalPrice;
    build.isPublic = isPublic !== undefined ? isPublic : build.isPublic;

    await build.save();

    return NextResponse.json(
      {
        message: 'Build updated successfully',
        build,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Update build error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update build' },
      { status: 500 }
    );
  }
}

// DELETE build
export async function DELETE(
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

    const build = await Build.findById(id);

    if (!build) {
      return NextResponse.json({ error: 'Build not found' }, { status: 404 });
    }

    // Get user
    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Check ownership
    if (build.userId.toString() !== String(user._id)) {
      return NextResponse.json(
        { error: 'You can only delete your own builds' },
        { status: 403 }
      );
    }

    await Build.findByIdAndDelete(id);

    return NextResponse.json(
      { message: 'Build deleted successfully' },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Delete build error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to delete build' },
      { status: 500 }
    );
  }
}
