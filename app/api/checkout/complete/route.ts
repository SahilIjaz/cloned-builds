import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';
import dbConnect from '@/lib/mongodb';
import Order from '@/models/Order';
import Cart from '@/models/Cart';
import User from '@/models/User';

// POST - Complete order after successful payment
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await dbConnect();

    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const body = await request.json();
    const { sessionId } = body;

    if (!sessionId) {
      return NextResponse.json(
        { error: 'Session ID is required' },
        { status: 400 }
      );
    }

    // Find order by Stripe session ID
    const order = await Order.findOne({ stripeSessionId: sessionId });

    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    // Verify ownership
    if (order.userId.toString() !== String(user._id)) {
      return NextResponse.json(
        { error: 'You do not have permission to complete this order' },
        { status: 403 }
      );
    }

    // Update order status to completed
    order.status = 'completed';
    await order.save();

    // Clear the user's cart
    await Cart.findOneAndUpdate(
      { userId: user._id },
      { $set: { items: [] } }
    );

    return NextResponse.json({
      message: 'Order completed successfully',
      order,
    });
  } catch (error: any) {
    console.error('Complete order error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to complete order' },
      { status: 500 }
    );
  }
}
