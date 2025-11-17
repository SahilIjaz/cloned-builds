import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';
import dbConnect from '@/lib/mongodb';
import Cart from '@/models/Cart';
import User from '@/models/User';
import Order from '@/models/Order';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2025-10-29.clover',
});

// POST - Create Stripe checkout session
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

    const cart = await Cart.findOne({ userId: user._id });

    if (!cart || cart.items.length === 0) {
      return NextResponse.json(
        { error: 'Cart is empty' },
        { status: 400 }
      );
    }

    // Create line items for Stripe
    const lineItems = cart.items.map((item) => ({
      price_data: {
        currency: 'usd',
        product_data: {
          name: item.buildName,
          description: `PC Build with ${item.components.length} components`,
        },
        unit_amount: Math.round(item.totalPrice * 100), // Convert to cents
      },
      quantity: 1,
    }));

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

    // Calculate total amount
    const totalAmount = cart.items.reduce((sum, item) => sum + item.totalPrice, 0);

    // Create order before redirecting to Stripe
    const order = await Order.create({
      userId: user._id,
      userEmail: user.email,
      items: cart.items,
      totalAmount,
      status: 'checkout',
    });

    // Create Stripe checkout session
    const checkoutSession = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${baseUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/cart`,
      customer_email: user.email,
      metadata: {
        userId: String(user._id),
        cartId: String(cart._id),
        orderId: String(order._id),
      },
    });

    // Update order with Stripe session ID
    order.stripeSessionId = checkoutSession.id;
    await order.save();

    return NextResponse.json({
      url: checkoutSession.url,
      sessionId: checkoutSession.id,
      orderId: order._id,
    });
  } catch (error: any) {
    console.error('Create checkout session error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}
