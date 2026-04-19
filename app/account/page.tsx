
'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/app/context/AuthContext';
import { Button } from '@/components/ui/button';

import {
  EmailAuthProvider,
  reauthenticateWithCredential,
  updatePassword,
} from 'firebase/auth';

import { Eye, EyeOff } from 'lucide-react';

export default function AccountPage() {
  const { user, userData, updateUserData, logout } = useAuth();

  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [companyName, setCompanyName] = useState('');

  const [loading, setLoading] = useState(false);

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [loadingPassword, setLoadingPassword] = useState(false);

  useEffect(() => {
    if (userData) {
      setFullName(userData.fullName || '');
      setPhoneNumber(userData.phoneNumber || '');
      setCompanyName(userData.companyName || '');
    }
  }, [userData]);

  const handleSave = async () => {
    setLoading(true);
    try {
      await updateUserData({
        fullName,
        phoneNumber,
        companyName,
      });
      alert('Profile updated!');
    } catch (error) {
      alert('Error updating profile');
    }
    setLoading(false);
  };

  const handleChangePassword = async () => {
    if (!user || !user.email) return;

    if (!currentPassword) return alert('Enter current password');
    if (newPassword.length < 6) return alert('Minimum 6 characters');
    if (newPassword !== confirmPassword)
      return alert('Passwords do not match');

    setLoadingPassword(true);

    try {
      const credential = EmailAuthProvider.credential(
        user.email,
        currentPassword
      );

      await reauthenticateWithCredential(user, credential);
      await updatePassword(user, newPassword);

      alert('Password updated!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error: any) {
      if (error.code === 'auth/wrong-password') {
        alert('Wrong password');
      } else {
        alert('Error updating password');
      }
    }

    setLoadingPassword(false);
  };

  if (!user) {
    return <p className="p-6">Please login first.</p>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-xl mx-auto space-y-8">

        {/* HEADER */}
        <div>
          <h1 className="text-3xl font-bold text-gray-800">My Account</h1>
          <p className="text-gray-500">Manage your profile</p>
        </div>

        {/* MAIN CONTAINER */}
        <div className="bg-white rounded-2xl shadow-md p-8 border space-y-8">

          {/* FULL NAME */}
          <div className="space-y-2">
            <label className="text-sm text-gray-600 font-medium">
              Full Name
            </label>
            <input
              className="w-full border border-gray-300 rounded-xl px-5 py-4 text-base
              focus:ring-2 focus:ring-[#2787b4] focus:border-[#2787b4] outline-none transition"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
          </div>

          {/* PHONE */}
          <div className="space-y-2">
            <label className="text-sm text-gray-600 font-medium">
              Phone Number
            </label>
            <input
              className="w-full border border-gray-300 rounded-xl px-5 py-4 text-base
              focus:ring-2 focus:ring-[#2787b4] focus:border-[#2787b4] outline-none transition"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
          </div>

          {/* COMPANY */}
          <div className="space-y-2">
            <label className="text-sm text-gray-600 font-medium">
              Company Name
            </label>
            <input
              className="w-full border border-gray-300 rounded-xl px-5 py-4 text-base
              focus:ring-2 focus:ring-[#2787b4] focus:border-[#2787b4] outline-none transition"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
            />
          </div>

          {/* SAVE BUTTON */}
          <Button
            onClick={handleSave}
            disabled={loading}
            className="w-full bg-[#2787b4] hover:bg-[#1f6f94] text-white rounded-xl py-4 text-base font-semibold"
          >
            {loading ? 'Saving...' : 'Save Changes'}
          </Button>

          {/* SECURITY */}
          <div className="border-t pt-6 space-y-6">

            <h2 className="font-semibold text-gray-700">Security</h2>

            {/* PASSWORD SECTION */}
            <div className="space-y-4">

              {/* CURRENT PASSWORD */}
              <div className="space-y-2">
                <label className="text-sm text-gray-600 font-medium">
                  Current Password
                </label>
                <div className="relative">
                  <input
                    type={showCurrent ? 'text' : 'password'}
                    className="w-full border border-gray-300 rounded-xl px-5 py-4 text-base
                    focus:ring-2 focus:ring-[#2787b4] focus:border-[#2787b4] outline-none transition"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrent(!showCurrent)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500"
                  >
                    {showCurrent ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              {/* NEW PASSWORD */}
              <div className="space-y-2">
                <label className="text-sm text-gray-600 font-medium">
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showNew ? 'text' : 'password'}
                    className="w-full border border-gray-300 rounded-xl px-5 py-4 text-base
                    focus:ring-2 focus:ring-[#2787b4] focus:border-[#2787b4] outline-none transition"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowNew(!showNew)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500"
                  >
                    {showNew ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              {/* CONFIRM PASSWORD */}
              <div className="space-y-2">
                <label className="text-sm text-gray-600 font-medium">
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    type={showConfirm ? 'text' : 'password'}
                    className="w-full border border-gray-300 rounded-xl px-5 py-4 text-base
                    focus:ring-2 focus:ring-[#2787b4] focus:border-[#2787b4] outline-none transition"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500"
                  >
                    {showConfirm ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              {/* UPDATE BUTTON */}
              <Button
                onClick={handleChangePassword}
                disabled={loadingPassword}
                className="w-full bg-[#2787b4] hover:bg-[#1f6f94] text-white rounded-xl py-4 text-base font-semibold"
              >
                {loadingPassword ? 'Updating...' : 'Update Password'}
              </Button>

            </div>

            {/* LOGOUT */}
            <Button
              onClick={logout}
              className="w-full bg-red-500 hover:bg-red-600 text-white rounded-xl py-4 text-base font-semibold"
            >
              Logout
            </Button>

          </div>
        </div>
      </div>
    </div>
  );
}

