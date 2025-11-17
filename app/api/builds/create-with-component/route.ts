import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';
import dbConnect from '@/lib/mongodb';
import Build from '@/models/Build';
import User from '@/models/User';

// POST - Create new build with initial component
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
    const { buildName, componentType, componentName, componentPrice, componentImage } = body;

    if (!buildName || !componentType || !componentName) {
      return NextResponse.json(
        { error: 'Build name, component type and name are required' },
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
      'network-card': 'storage',
    };

    const componentField = componentFieldMap[componentType] || 'storage';

    // Create components object with the initial component (store full component object)
    const components: any = {};
    components[componentField] = {
      name: componentName,
      price: componentPrice || 0,
      imageUrl: componentImage || '',
      category: componentType,
    };

    // Create new build
    const build = await Build.create({
      name: buildName.trim(),
      userId: user._id,
      username: user.username,
      userEmail: user.email,
      userImage: user.image,
      description: 'Work in progress',
      components,
      totalPrice: componentPrice || 0,
      isPublic: false, // New builds are private by default
      viewCount: 0,
      replyCount: 0,
    });

    return NextResponse.json(
      {
        message: `Build "${buildName}" created with ${componentName}!`,
        build,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Create build with component error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create build' },
      { status: 500 }
    );
  }
}
