import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';
import dbConnect from '@/lib/mongodb';
import Build from '@/models/Build';
import User from '@/models/User';

// POST - Add component to specific existing build
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Unauthorized. Please login first.' },
        { status: 401 }
      );
    }

    await dbConnect();

    const body = await request.json();
    const { buildId, componentType, componentName, componentPrice, componentImage } = body;

    if (!buildId || !componentType || !componentName) {
      return NextResponse.json(
        { error: 'Build ID, component type and name are required' },
        { status: 400 }
      );
    }

    // Get user
    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Find the build and verify ownership
    const build = await Build.findById(buildId);
    if (!build) {
      return NextResponse.json({ error: 'Build not found' }, { status: 404 });
    }

    if (build.userId.toString() !== String(user._id)) {
      return NextResponse.json(
        { error: 'You do not have permission to modify this build' },
        { status: 403 }
      );
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
      'network-card': 'storage',
    };

    const componentField = componentFieldMap[componentType] || 'storage';

    // Update the build with the new component (store full component object)
    // Initialize components if it doesn't exist
    if (!build.components) {
      build.components = {};
    }

    // Set the component using dot notation to ensure proper Mongoose handling
    build.set(`components.${componentField}`, {
      name: componentName,
      price: componentPrice || 0,
      imageUrl: componentImage || '',
      category: componentType,
    });

    // Update total price
    const currentPrice = build.totalPrice || 0;
    build.totalPrice = currentPrice + (componentPrice || 0);

    await build.save();

    return NextResponse.json(
      {
        message: `${componentName} added to ${build.name}!`,
        build,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Add to existing build error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to add component to build' },
      { status: 500 }
    );
  }
}
