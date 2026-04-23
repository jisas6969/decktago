'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/app/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';

// 🔥 ICONS
import { Eye, EyeOff, Lock } from 'lucide-react';

export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [companyName, setCompanyName] = useState('');

  // 🔥 FIXED STATES
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const { signup, logout } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      await signup(email, password, fullName, phoneNumber, companyName);
      await logout();
      router.push('/login');
    } catch (err: any) {
      setError(err.message || 'Failed to create account');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      <Card className="w-full max-w-md">
        <div className="p-8">
          <h1 className="text-3xl font-bold text-center mb-2">Create Account</h1>
          <p className="text-center text-slate-600 mb-6">
            Join us for an amazing shopping experience
          </p>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">

            <InputField label="Full Name" value={fullName} setValue={setFullName} />
            <InputField label="Phone Number" value={phoneNumber} setValue={setPhoneNumber} />
            <InputField label="Company Name" value={companyName} setValue={setCompanyName} />
            <InputField label="Email" type="email" value={email} setValue={setEmail} />

            {/* 🔒 PASSWORD */}
            <PasswordField
              label="Password"
              value={password}
              setValue={setPassword}
              show={showPassword}
              toggle={() => setShowPassword(!showPassword)}
            />

            {/* 🔒 CONFIRM PASSWORD */}
            <PasswordField
              label="Confirm Password"
              value={confirmPassword}
              setValue={setConfirmPassword}
              show={showConfirmPassword}
              toggle={() => setShowConfirmPassword(!showConfirmPassword)}
            />

            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              disabled={loading}
            >
              {loading ? 'Creating Account...' : 'Sign Up'}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-slate-600">
              Already have an account?{' '}
              <Link href="/login" className="text-blue-600 hover:text-blue-700 font-medium">
                Log in
              </Link>
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}

/* 🔹 INPUT FIELD */
function InputField({ label, value, setValue, type = 'text' }: any) {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-2">{label}</label>
      <Input
        type={type}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="h-12"
        required
      />
    </div>
  );
}

/* 🔹 PASSWORD FIELD WITH 👁️ ICON */
function PasswordField({ label, value, setValue, show, toggle }: any) {
  return (
    <div className="relative">
      <label className="block text-sm font-medium text-slate-700 mb-2">
        {label}
      </label>

      {/* 🔒 LEFT ICON */}
      <Lock className="absolute left-3 top-[38px] text-gray-400" size={18} />

      <Input
        type={show ? 'text' : 'password'}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="pl-10 pr-10 h-12"
        required
      />

      {/* 👁️ RIGHT ICON */}
      {value && (
        <button
          type="button"
          onClick={toggle}
          className="absolute right-3 top-[38px] text-gray-400 hover:text-gray-600"
        >
          {show ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      )}
    </div>
  );
}