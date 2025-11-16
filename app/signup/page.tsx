'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

export default function SignupPage() {
  const router = useRouter();
  const [step, setStep] = useState(1); // 1: signup, 2: OTP verification
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });
  const [otp, setOtp] = useState('');
  const [userId, setUserId] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Signup failed');
      }

      setUserId(data.userId);
      setStep(2);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, otp }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'OTP verification failed');
      }

      // Redirect to login
      router.push('/login?verified=true');
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full space-y-8">
        {/* Logo */}
        <div className="text-center">
          <Link href="/">
            <Image
              src="/logo.png"
              alt="Logo"
              width={120}
              height={120}
              className="mx-auto"
            />
          </Link>
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            {step === 1 ? 'Create your account' : 'Verify your email'}
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            {step === 1
              ? 'Join us to build your dream PC'
              : 'Enter the 6-digit code sent to your email'}
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}


        {/* Step 1: Signup Form */}
        {step === 1 && (
          <form className="mt-8 space-y-6" onSubmit={handleSignup}>
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="username"
                  className="block text-sm font-medium text-gray-700"
                >
                  Username
                </label>
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  minLength={3}
                  value={formData.username}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-gray-900 focus:outline-none focus:ring-[#7ED348] focus:border-[#7ED348]"
                  placeholder="johndoe"
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-gray-900 focus:outline-none focus:ring-[#7ED348] focus:border-[#7ED348]"
                  placeholder="you@example.com"
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700"
                >
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  minLength={6}
                  value={formData.password}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-gray-900 focus:outline-none focus:ring-[#7ED348] focus:border-[#7ED348]"
                  placeholder="••••••••"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Must be at least 6 characters
                </p>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#7ED348] hover:bg-[#6BC240] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#7ED348] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating account...' : 'Create account'}
            </button>

            {/* Sign In Link */}
            <div className="text-center">
              <p className="text-sm text-gray-600">
                Already have an account?{' '}
                <Link
                  href="/login"
                  className="font-medium text-[#7ED348] hover:text-[#6BC240]"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </form>
        )}

        {/* Step 2: OTP Verification */}
        {step === 2 && (
          <form className="mt-8 space-y-6" onSubmit={handleVerifyOTP}>
            <div>
              <label
                htmlFor="otp"
                className="block text-sm font-medium text-gray-700 text-center"
              >
                Enter OTP
              </label>
              <input
                id="otp"
                type="text"
                required
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                className="mt-2 block w-full px-3 py-3 border border-gray-300 rounded-md shadow-sm text-gray-900 text-center text-2xl tracking-widest focus:outline-none focus:ring-[#7ED348] focus:border-[#7ED348]"
                placeholder="000000"
              />
              <p className="mt-2 text-xs text-gray-500 text-center">
                Check your email for the 6-digit code
              </p>
            </div>

            <button
              type="submit"
              disabled={loading || otp.length !== 6}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#7ED348] hover:bg-[#6BC240] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#7ED348] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Verifying...' : 'Verify Email'}
            </button>

            {/* Back to signup */}
            <div className="text-center">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="text-sm text-gray-600 hover:text-gray-900"
              >
                ← Back to signup
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
