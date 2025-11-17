import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';
import dbConnect from '@/lib/mongodb';
import Cart from '@/models/Cart';
import Build from '@/models/Build';
import User from '@/models/User';

// POST - Add entire build to cart
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
    const { buildId, buildName } = body;

    if (!buildId) {
      return NextResponse.json(
        { error: 'Build ID is required' },
        { status: 400 }
      );
    }

    // Get user
    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Get the build
    const build = await Build.findById(buildId);
    if (!build) {
      return NextResponse.json({ error: 'Build not found' }, { status: 404 });
    }

    // Extract components from build
    const components: any[] = [];
    if (build.components) {
      Object.values(build.components).forEach((component: any) => {
        if (component && component.name) {
          components.push({
            name: component.name,
            price: component.price || 0,
            imageUrl: component.imageUrl || '',
            category: component.category || '',
          });
        }
      });
    }

    if (components.length === 0) {
      return NextResponse.json(
        { error: 'Build has no components to add to cart' },
        { status: 400 }
      );
    }

    // Find or create cart for user
    let cart = await Cart.findOne({ userId: user._id });

    if (!cart) {
      // Create new cart
      cart = await Cart.create({
        userId: user._id,
        userEmail: user.email,
        items: [
          {
            buildId: build._id,
            buildName: buildName || build.name,
            components,
            totalPrice: build.totalPrice || 0,
          },
        ],
      });
    } else {
      // Check if build already in cart
      const existingItemIndex = cart.items.findIndex(
        (item) => item.buildId.toString() === buildId
      );

      if (existingItemIndex >= 0) {
        return NextResponse.json(
          { error: 'This build is already in your cart' },
          { status: 400 }
        );
      }

      // Add build to cart
      cart.items.push({
        buildId: build._id,
        buildName: buildName || build.name,
        components,
        totalPrice: build.totalPrice || 0,
      } as any);

      await cart.save();
    }

    return NextResponse.json(
      {
        message: 'Build added to cart successfully!',
        cart,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Add to cart error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to add build to cart' },
      { status: 500 }
    );
  }
}
