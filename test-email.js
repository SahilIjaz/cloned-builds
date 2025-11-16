// Simple test script to verify Resend is working
require('dotenv').config({ path: '.env.local' });
const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

async function testEmail() {
  console.log('Testing Resend email...');
  console.log('API Key:', process.env.RESEND_API_KEY ? 'Found ✓' : 'Missing ✗');

  try {
    const { data, error } = await resend.emails.send({
      from: 'Custom PC Builder <onboarding@resend.dev>',
      to: ['test@example.com'], // Replace with your email to test
      subject: 'Test Email from Custom PC Builder',
      html: '<p>This is a test email to verify Resend integration.</p>',
    });

    if (error) {
      console.error('Error:', error);
      return;
    }

    console.log('Success! Email sent:', data);
  } catch (error) {
    console.error('Failed to send email:', error);
  }
}

testEmail();
