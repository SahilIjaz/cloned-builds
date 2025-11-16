import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import { sendWelcomeEmail } from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
    const { userId, otp } = await request.json();

    if (!userId || !otp) {
      return NextResponse.json(
        { error: 'User ID and OTP are required' },
        { status: 400 }
      );
    }

    await dbConnect();

    const user = await User.findById(userId);

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    if (user.emailVerified) {
      return NextResponse.json(
        { error: 'Email already verified' },
        { status: 400 }
      );
    }

    if (!user.otp || !user.otpExpiry) {
      return NextResponse.json(
        { error: 'No OTP found. Please request a new one' },
        { status: 400 }
      );
    }

    if (new Date() > user.otpExpiry) {
      return NextResponse.json(
        { error: 'OTP has expired. Please request a new one' },
        { status: 400 }
      );
    }

    if (user.otp !== otp) {
      return NextResponse.json(
        { error: 'Invalid OTP' },
        { status: 400 }
      );
    }

    // Verify user
    user.emailVerified = true;
    user.otp = undefined;
    user.otpExpiry = undefined;
    await user.save();

    // Send welcome email
    try {
      await sendWelcomeEmail(user.email, user.username);
      console.log(`Welcome email sent successfully to ${user.email}`);
    } catch (emailError) {
      console.error('Failed to send welcome email:', emailError);
      // Continue even if welcome email fails - user is already verified
    }

    return NextResponse.json(
      {
        message: 'Email verified successfully. You can now login.',
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('OTP verification error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
