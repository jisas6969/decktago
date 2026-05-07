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
  const { signup, logout, loginWithGoogle } = useAuth();
  

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setError('');

  // 🔹 Full Name Validation
  if (fullName.trim().length < 3) {
    setError('Full name must be at least 3 characters');
    return;
  }

  // 🔹 Phone Number Validation
  const phoneRegex = /^[0-9]{11}$/;

  if (!phoneRegex.test(phoneNumber)) {
    setError('Phone number must be 11 digits');
    return;
  }

  // 🔹 Company Name Validation
  if (companyName.trim().length < 2) {
    setError('Company name is required');
    return;
  }

  // 🔹 Email Validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(email)) {
    setError('Please enter a valid email address');
    return;
  }

  // 🔹 Password Validation
  if (password.length < 6) {
    setError('Password must be at least 6 characters');
    return;
  }

  // 🔹 Confirm Password
  if (password !== confirmPassword) {
    setError('Passwords do not match');
    return;
  }

  setLoading(true);

  try {
    await signup(
      email,
      password,
      fullName,
      phoneNumber,
      companyName
    );

    await logout();
    router.push('/login');

  } catch (err: any) {

    let message = 'Failed to create account';

    if (err.code === 'auth/email-already-in-use') {
      message = 'Email is already registered';
    } else if (err.code === 'auth/invalid-email') {
      message = 'Invalid email address';
    } else if (err.code === 'auth/weak-password') {
      message = 'Password is too weak';
    }

    setError(message);

  } finally {
    setLoading(false);
  }
};

  return (
  <div
    className="min-h-screen flex items-center justify-center p-4 bg-cover bg-center relative"
    style={{ backgroundImage: "url('/bg.jpg')" }}
  >
    {/* 🔥 BLUR */}
    <div className="absolute inset-0 backdrop-blur-sm"></div>

    {/* 🔥 CARD */}
    <div className="relative w-full max-w-md bg-white/90 p-8 rounded-2xl shadow-2xl">

      <h1 className="text-3xl font-bold text-center mb-2">
        Create Account
      </h1>
      <p className="text-center text-slate-600 mb-6">
        Join us for an amazing shopping experience
      </p>
      

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded-lg text-sm mb-3">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">

        <InputField label="Full Name" value={fullName} setValue={setFullName} />
        <InputField label="Phone Number" value={phoneNumber} setValue={setPhoneNumber} />
        <InputField label="Company Name" value={companyName} setValue={setCompanyName} />
        <InputField label="Email" type="email" value={email} setValue={setEmail} />

        <PasswordField
          label="Password"
          value={password}
          setValue={setPassword}
          show={showPassword}
          toggle={() => setShowPassword(!showPassword)}
        />

        <PasswordField
          label="Confirm Password"
          value={confirmPassword}
          setValue={setConfirmPassword}
          show={showConfirmPassword}
          toggle={() => setShowConfirmPassword(!showConfirmPassword)}
        />
        

        <Button
          type="submit"
          className="w-full h-14 text-white font-semibold rounded-xl bg-[#2787b4] hover:bg-[#1f6f94] transition shadow-md"
          disabled={loading}
        >
          {loading ? 'Creating Account...' : 'Sign Up'}
        </Button>
        {/* 🔻 DIVIDER */}
<div className="flex items-center gap-3 my-6">
  <div className="flex-1 h-px bg-gray-300"></div>
  <span className="text-sm text-gray-500 whitespace-nowrap">
    or sign up with
  </span>
  <div className="flex-1 h-px bg-gray-300"></div>
</div>
        <Button
  type="button"
  onClick={async () => {
    try {

      const res = await loginWithGoogle();

if (!res.isProfileComplete) {
  router.push('/account');
} else {
  router.push('/'); // 👉 complete na
}

    } catch (err: any) {
      setError(err.message);
    }
  }}
  className="bg-transparent shadow-none hover:bg-transparent p-0 flex justify-center mx-auto"
>
  <img src="/google.png" alt="google" className="w-8 h-8" />
</Button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-slate-600">
          Already have an account?{' '}
          <Link
            href="/login"
            className="font-medium text-[#2787b4] hover:text-[#1f6f94]"
          >
            
            Log in
          </Link>
        </p>
      </div>

    </div>
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