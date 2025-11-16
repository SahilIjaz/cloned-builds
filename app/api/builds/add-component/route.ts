import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';
import dbConnect from '@/lib/mongodb';
import Build from '@/models/Build';
import User from '@/models/User';

// POST - Add component to build (creates new build or updates draft)
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized. Please login first.' }, { status: 401 });
    }

    await dbConnect();

    const body = await request.json();
    const { componentType, componentName, componentPrice } = body;

    if (!componentType || !componentName) {
      return NextResponse.json(
        { error: 'Component type and name are required' },
        { status: 400 }
      );
    }

    // Get user
    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Map component category to build component field
    const componentFieldMap: { [key: string]: string } = {
      'cpu': 'cpu',
      'Cpu': 'cpu',
      'graphics-card': 'gpu',
      'gpu': 'gpu',
      'motherboard': 'motherboard',
      'memory': 'ram',
      'ram': 'ram',
      'storage': 'storage',
      'power-supply': 'psu',
      'psu': 'psu',
      'case': 'case',
      'cpu-cooler': 'cooling',
      'cooling': 'cooling',
      'fans': 'cooling',
      'network-card': 'storage', // You might want to add a network field to the schema
    };

    const componentField = componentFieldMap[componentType] || 'storage';

    // Check if user has a draft build (unpublished build)
    let build = await Build.findOne({
      userId: user._id,
      name: { $regex: /^My Build - Draft/i },
    }).sort({ createdAt: -1 });

    if (build) {
      // Update existing draft build
      const components = build.components || {};
      components[componentField as keyof typeof components] = componentName;
      build.components = components;

      // Update total price
      const currentPrice = build.totalPrice || 0;
      build.totalPrice = currentPrice + (componentPrice || 0);

      await build.save();

      return NextResponse.json(
        {
          message: `${componentName} added to your build!`,
          build,
          isNew: false,
        },
        { status: 200 }
      );
    } else {
      // Create new draft build
      const components: any = {};
      components[componentField] = componentName;

      build = await Build.create({
        name: `My Build - Draft ${new Date().getTime()}`,
        userId: user._id,
        username: user.username,
        userEmail: user.email,
        userImage: user.image,
        description: 'Draft build - Work in progress',
        components,
        totalPrice: componentPrice || 0,
        isPublic: false, // Draft builds are private
        viewCount: 0,
        replyCount: 0,
      });

      return NextResponse.json(
        {
          message: `New build created with ${componentName}!`,
          build,
          isNew: true,
        },
        { status: 201 }
      );
    }
  } catch (error: any) {
    console.error('Add component error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to add component to build' },
      { status: 500 }
    );
  }
}
