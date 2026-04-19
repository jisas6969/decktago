'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/app/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

// 🔥 ICONS
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      router.push('/');
    } catch (err: any) {
      setError(err.message || 'Failed to log in');
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
    {/* 🔥 BLUR + OVERLAY */}
    <div className="absolute inset-0 backdrop-blur-sm"></div>

    {/* 🔥 MAIN CARD */}
    <div className="relative w-full max-w-5xl min-h-[500px] bg-white/90 rounded-2xl shadow-2xl overflow-hidden grid md:grid-cols-2">

      {/* 🔵 LEFT SIDE */}
      <div className="hidden md:flex flex-col items-center justify-center bg-white/60 p-10">

        <img src="/logo.png" alt="logo" className="w-44 mb-2" />

        <h1 className="text-2xl font-bold tracking-tight -mt-6">
          <span className="text-black">Deckta</span>
          <span className="text-2xl font-extrabold" style={{ color: '#2787b4' }}>G</span>
          <span style={{ color: '#2787b4' }}>o</span>
        </h1>

        <p className="text-sm text-slate-500 mt-1">
          Pacific Equities
        </p>
      </div>

      {/* 🔶 RIGHT SIDE */}
      <div className="p-8 flex flex-col justify-center">
        <h1 className="text-3xl font-bold text-center mb-2">Login</h1>
        <p className="text-center text-slate-600 mb-6">Sign in to your account</p>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* EMAIL */}
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="pl-10 pr-4 h-14 bg-gray-50 border border-gray-200 rounded-xl text-base shadow-sm focus:ring-2 focus:ring-blue-500"
              required
              disabled={loading}
            />
          </div>

          {/* PASSWORD */}
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />

            <Input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="pl-10 pr-10 h-14 bg-gray-50 border border-gray-200 rounded-xl text-base"
              required
              disabled={loading}
            />

            {password && (
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            )}
          </div>

          {/* BUTTON */}
          <Button
            type="submit"
            className="w-full h-14 text-base font-semibold text-white rounded-xl bg-[#2787b4] hover:bg-[#1f6f94] shadow-md hover:shadow-lg transition"
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-slate-600">
            Don&apos;t have an account?{' '}
            <Link href="/signup" className="font-medium text-[#2787b4] hover:text-[#1f6f94]">
              Sign up
            </Link>
          </p>
        </div>
      </div>

    </div>
    </div>
  );
}