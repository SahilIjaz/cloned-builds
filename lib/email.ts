import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendOTPEmail(email: string, otp: string, username: string) {
  try {
    const { data, error } = await resend.emails.send({
      from: 'Custom PC Builder <onboarding@resend.dev>', // Replace with your verified domain
      to: [email],
      subject: 'Verify Your Email - Custom PC Builder',
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Verify Your Email</title>
          </head>
          <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
              <h1 style="color: white; margin: 0;">Custom PC Builder</h1>
            </div>

            <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px;">
              <h2 style="color: #333; margin-top: 0;">Welcome, ${username}!</h2>

              <p style="font-size: 16px;">Thank you for signing up with Custom PC Builder. To complete your registration, please verify your email address.</p>

              <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center;">
                <p style="margin: 0 0 10px 0; color: #666; font-size: 14px;">Your verification code is:</p>
                <div style="font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #7ED348; padding: 15px; background: #f0f0f0; border-radius: 8px; display: inline-block;">
                  ${otp}
                </div>
              </div>

              <p style="font-size: 14px; color: #666;">This code will expire in <strong>10 minutes</strong>.</p>

              <p style="font-size: 14px; color: #666;">If you didn't create an account with us, please ignore this email.</p>

              <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd;">
                <p style="font-size: 12px; color: #999; margin: 0;">
                  This is an automated message, please do not reply to this email.
                </p>
                <p style="font-size: 12px; color: #999; margin: 5px 0 0 0;">
                  © ${new Date().getFullYear()} Custom PC Builder. All rights reserved.
                </p>
              </div>
            </div>
          </body>
        </html>
      `,
      text: `
        Welcome to Custom PC Builder, ${username}!

        Your verification code is: ${otp}

        This code will expire in 10 minutes.

        If you didn't create an account with us, please ignore this email.

        © ${new Date().getFullYear()} Custom PC Builder. All rights reserved.
      `,
    });

    if (error) {
      console.error('Error sending email:', error);
      throw new Error('Failed to send verification email');
    }

    console.log('Email sent successfully:', data);
    return { success: true, data };
  } catch (error) {
    console.error('Error in sendOTPEmail:', error);
    throw error;
  }
}

export async function sendWelcomeEmail(email: string, username: string) {
  try {
    const { data, error } = await resend.emails.send({
      from: 'Custom PC Builder <onboarding@resend.dev>',
      to: [email],
      subject: 'Welcome to Custom PC Builder!',
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Welcome to Custom PC Builder</title>
          </head>
          <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
              <h1 style="color: white; margin: 0;">Custom PC Builder</h1>
            </div>

            <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px;">
              <h2 style="color: #333; margin-top: 0;">Welcome aboard, ${username}! 🎉</h2>

              <p style="font-size: 16px;">Your email has been verified successfully! You're now part of the Custom PC Builder community.</p>

              <p style="font-size: 16px;">Here's what you can do:</p>

              <ul style="font-size: 15px; color: #555;">
                <li>Browse our curated PC builds</li>
                <li>Ask questions in our community forum</li>
                <li>Get expert advice on components</li>
                <li>Build your dream PC configuration</li>
              </ul>

              <div style="text-align: center; margin: 30px 0;">
                <a href="${process.env.NEXTAUTH_URL || 'http://localhost:3000'}"
                   style="background: #7ED348; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">
                  Start Building
                </a>
              </div>

              <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd;">
                <p style="font-size: 12px; color: #999; margin: 0;">
                  © ${new Date().getFullYear()} Custom PC Builder. All rights reserved.
                </p>
              </div>
            </div>
          </body>
        </html>
      `,
    });

    if (error) {
      console.error('Error sending welcome email:', error);
      // Don't throw error for welcome email, just log it
      return { success: false, error };
    }

    return { success: true, data };
  } catch (error) {
    console.error('Error in sendWelcomeEmail:', error);
    return { success: false, error };
  }
}
