'use client';

import { useState } from 'react';
import { Mail } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useAuth } from '@/app/context/AuthContext';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { resetPassword } = useAuth(); // 🔥 kailangan mo ito

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    try {
      await resetPassword(email);
      setMessage('Password reset link sent to your email.');
    } catch (err: any) {
      setError(err.message || 'Failed to send reset email');
    } finally {
      setLoading(false);
    }
  };

return (
  <div
    className="min-h-screen flex items-center justify-center p-4 bg-cover bg-center relative"
    style={{
      backgroundImage: "url('/bg.jpg')",
    }}
  >
    {/* 🔥 BLUR */}
    <div className="absolute inset-0 backdrop-blur-sm"></div>

    {/* 🔥 CARD */}
    <div className="relative w-full max-w-md bg-white/90 p-8 rounded-2xl shadow-2xl">

      <h1 className="text-3xl font-bold text-center mb-2">
        Forgot Password
      </h1>
      <p className="text-center text-slate-600 mb-6">
        Enter your email to reset your password
      </p>

      {/* ✅ ERROR */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded-lg text-sm mb-3">
          {error}
        </div>
      )}

      {/* ✅ SUCCESS */}
      {message && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-2 rounded-lg text-sm mb-3">
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">

        {/* EMAIL */}
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <Input
            type="email"
            placeholder="Email"
            className="pl-10 h-14 bg-gray-50 border border-gray-200 rounded-xl"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loading}
          />
        </div>

        {/* BUTTON */}
        <Button
          className="w-full h-14 text-white font-semibold rounded-xl bg-[#2787b4] hover:bg-[#1f6f94] transition shadow-md"
          disabled={loading}
        >
          {loading ? 'Sending...' : 'Send Reset Link'}
        </Button>
      </form>

      {/* BACK */}
      <div className="mt-6 text-center">
        <Link
          href="/login"
          className="text-sm font-medium text-[#2787b4] hover:text-[#1f6f94] hover:underline transition"
        >
          Back to Login
        </Link>
      </div>

    </div>
  </div>
);
}