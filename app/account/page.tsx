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

  // 🔐 Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [loadingPassword, setLoadingPassword] = useState(false);

  // ✅ Sync Firestore data
  useEffect(() => {
    if (userData) {
      setFullName(userData.fullName || '');
      setPhoneNumber(userData.phoneNumber || '');
      setCompanyName(userData.companyName || '');
    }
  }, [userData]);

  // 💾 Save profile
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
      console.error(error);
      alert('Error updating profile');
    }
    setLoading(false);
  };

  // 🔐 Change password
  const handleChangePassword = async () => {
    if (!user || !user.email) return;

    if (!currentPassword) {
      alert('Enter current password');
      return;
    }

    if (newPassword.length < 6) {
      alert('Password must be at least 6 characters');
      return;
    }

    if (newPassword !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }

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
      setIsModalOpen(false);
    } catch (error: any) {
      console.error(error);

      if (error.code === 'auth/wrong-password') {
        alert('Incorrect current password');
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
    <div className="max-w-xl mx-auto p-6 space-y-8">
      <h1 className="text-2xl font-bold">My Account</h1>

      {/* 🧑 Profile */}
      <div className="space-y-4">
        <h2 className="font-semibold text-lg">Profile Information</h2>

        <input
          placeholder="Full Name"
          className="w-full border p-2 rounded"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
        />

        <input
          placeholder="Phone Number"
          className="w-full border p-2 rounded"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
        />

        <input
          placeholder="Company Name"
          className="w-full border p-2 rounded"
          value={companyName}
          onChange={(e) => setCompanyName(e.target.value)}
        />

        <Button onClick={handleSave} disabled={loading}>
          {loading ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>

      {/* 🔐 Change Password Trigger */}
      <div className="space-y-4">
        <h2 className="font-semibold text-lg">Security</h2>

        <Button onClick={() => setIsModalOpen(true)}>
          Change Password
        </Button>
      </div>

      {/* 🚪 Logout */}
      <div>
        <Button onClick={logout} variant="destructive">
          Logout
        </Button>
      </div>

      {/* 🔥 MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md space-y-4">
            <h2 className="text-xl font-semibold">Change Password</h2>

            {/* Current */}
            <div className="relative">
              <input
                type={showCurrent ? 'text' : 'password'}
                placeholder="Current Password"
                className="w-full border p-2 rounded pr-10"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowCurrent(!showCurrent)}
                className="absolute right-3 top-2.5 text-gray-500"
              >
                {showCurrent ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {/* New */}
            <div className="relative">
              <input
                type={showNew ? 'text' : 'password'}
                placeholder="New Password"
                className="w-full border p-2 rounded pr-10"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowNew(!showNew)}
                className="absolute right-3 top-2.5 text-gray-500"
              >
                {showNew ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {/* Confirm */}
            <div className="relative">
              <input
                type={showConfirm ? 'text' : 'password'}
                placeholder="Confirm New Password"
                className="w-full border p-2 rounded pr-10"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-3 top-2.5 text-gray-500"
              >
                {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-2 pt-2">
              <Button
                variant="ghost"
                onClick={() => setIsModalOpen(false)}
              >
                Cancel
              </Button>

              <Button
                onClick={handleChangePassword}
                disabled={loadingPassword}
              >
                {loadingPassword ? 'Updating...' : 'Update Password'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}