'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/app/context/AuthContext';
import { Button } from '@/components/ui/button';

import {
  EmailAuthProvider,
  reauthenticateWithCredential,
  updatePassword,
  verifyBeforeUpdateEmail,
  linkWithCredential,
  sendEmailVerification,
  deleteUser
} from 'firebase/auth';

import { Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { db } from '@/lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import regions from '@/data/ph/regions.json';
import provinces from '@/data/ph/provinces.json';
import citiesData from '@/data/ph/cities.json';
import barangays from '@/data/ph/barangays.json';


export default function AccountPage() {
  const { user, userData, updateUserData, logout } = useAuth();

  const isGoogleUser = user?.providerData?.[0]?.providerId === 'google.com';
  const hasPasswordProvider = user?.providerData?.some((provider) => provider.providerId === 'password');
  const isCreatePasswordFlow = isGoogleUser && !hasPasswordProvider;
  const isIncomplete = !userData?.companyName || !userData?.phoneNumber;

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

  const [isPasswordVerified, setIsPasswordVerified] = useState(false);
  const [verifyPasswordError, setVerifyPasswordError] = useState('');
  const [loadingVerify, setLoadingVerify] = useState(false);

  // Navigation State
  const [activeTab, setActiveTab] = useState<'profile' | 'addresses' | 'password' | 'privacy'>('profile');

  // Delete Flow State
  const [deleteStep, setDeleteStep] = useState<'default' | 'warning' | 'confirm'>('default');
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteMessage, setDeleteMessage] = useState({ type: '', text: '' });

  // Image Upload State
  const [uploadingImage, setUploadingImage] = useState(false);
  const [photoURL, setPhotoURL] = useState('');
  const [uploadError, setUploadError] = useState('');

  // Email Update State
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [newEmail, setNewEmail] = useState('');
  const [emailPassword, setEmailPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [loadingEmail, setLoadingEmail] = useState(false);

  // Addresses State
  const [addresses, setAddresses] = useState<any[]>([]);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formError, setFormError] = useState('');
  
  // Picker State
  const [showPicker, setShowPicker] = useState(false);
  const [step, setStep] = useState<'region' | 'province' | 'city' | 'barangay'>('region');
  const cities: any[] = citiesData as any[];
  const regionsList: any[] = regions as any[];
  const provincesList: any[] = provinces as any[];
  const barangaysList: any[] = barangays as any[];

  const [selectedRegion, setSelectedRegion] = useState('');
  const [selectedProvince, setSelectedProvince] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedRegionName, setSelectedRegionName] = useState('');
  const [selectedProvinceName, setSelectedProvinceName] = useState('');
  const [selectedCityName, setSelectedCityName] = useState('');
  const hasProvinces = provincesList.some((p: any) => p.regionCode === selectedRegion);

  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    province: '',
    city: '',
    barangay: '',
    postalCode: '',
    street: '',
  });

  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  
  useEffect(() => {
    if (userData) {
      setFullName(userData.fullName || '');
      setPhoneNumber(userData.phoneNumber || '');
      setCompanyName(userData.companyName || '');
      setPhotoURL(userData.photoURL || '');
    }
  }, [userData]);

  useEffect(() => {
    const fetchAddresses = async () => {
      if (!user?.uid) return;
      const ref = doc(db, 'users', user.uid);
      const snap = await getDoc(ref);
      if (snap.exists() && snap.data().addresses) {
        setAddresses(snap.data().addresses || []);
      }
    };
    fetchAddresses();
  }, [user]);

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

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate size (1MB)
    if (file.size > 1024 * 1024) {
      setUploadError('Image exceeds 1MB limit.');
      return;
    }

    // Validate type
    if (file.type !== 'image/jpeg' && file.type !== 'image/png') {
      setUploadError('Only .JPEG or .PNG allowed.');
      return;
    }

    setUploadError('');
    setUploadingImage(true);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!);
      
      const res = await fetch(`https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`, {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (data.secure_url) {
        setPhotoURL(data.secure_url);
        // Save to firestore
        await updateUserData({ photoURL: data.secure_url });
        alert('Profile image updated!');
      } else {
        setUploadError('Failed to upload image.');
      }
    } catch (err) {
      setUploadError('Error uploading image.');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleChangeEmail = async () => {
    if (!user || !user.email) return;
    
    setEmailError('');
    if (!newEmail.trim() || !emailPassword) {
      setEmailError('Please enter the new email and your current password.');
      return;
    }

    setLoadingEmail(true);

    try {
      const credential = EmailAuthProvider.credential(user.email, emailPassword);
      await reauthenticateWithCredential(user, credential);

      await verifyBeforeUpdateEmail(
  user,
  newEmail
);

alert(
  `Verification email sent to ${newEmail}. Please verify it before changes apply.`
);
      setShowEmailModal(false);
      setNewEmail('');
      setEmailPassword('');
    } catch (error: any) {
      console.error(error);
      if (error.code === 'auth/wrong-password') {
        setEmailError('Incorrect password. Please try again.');
      } else if (error.code === 'auth/email-already-in-use') {
        setEmailError('This email is already in use by another account.');
      } else if (error.code === 'auth/invalid-email') {
        setEmailError('Please enter a valid email address.');
      } else if (error.code === 'auth/requires-recent-login') {
        setEmailError('Please log out and log back in before changing your email.');
      } else {
        setEmailError('An error occurred. Please try again later.');
      }
    }

    setLoadingEmail(false);
  };

  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');

  const handleVerifyPassword = async () => {
    if (!user || !user.email) return;

    setVerifyPasswordError('');

    if (!currentPassword) {
      setVerifyPasswordError('Please enter your current password.');
      return;
    }

    setLoadingVerify(true);

    try {
      const credential = EmailAuthProvider.credential(user.email, currentPassword);
      await reauthenticateWithCredential(user, credential);
      setIsPasswordVerified(true);
    } catch (error: any) {
      console.error(error);
      if (error.code === 'auth/wrong-password') {
        setVerifyPasswordError('Incorrect password');
      } else if (error.code === 'auth/too-many-requests') {
        setVerifyPasswordError('Too many failed attempts. Please try again later.');
      } else {
        setVerifyPasswordError('An error occurred. Please try again.');
      }
    }

    setLoadingVerify(false);
  };

  const handleChangePassword = async () => {
    if (!user || !user.email) return;

    setPasswordError('');
    setPasswordSuccess('');
    
    if (newPassword.length < 6) {
      setPasswordError('New password must be at least 6 characters.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError('Passwords do not match.');
      return;
    }

    setLoadingPassword(true);

    try {
      if (isCreatePasswordFlow) {
        // Create password by linking Email Auth Provider
        const credential = EmailAuthProvider.credential(user.email, newPassword);
        await linkWithCredential(user, credential);
        setPasswordSuccess('Password created successfully! You can now log in using email and password.');
      } else {
        // Update password for Email users (already verified)
        await updatePassword(user, newPassword);
        setPasswordSuccess('Password updated successfully!');
      }

      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error: any) {
      console.error(error);
      if (error.code === 'auth/provider-already-linked' || error.code === 'auth/credential-already-in-use') {
        setPasswordError('This account already has a password set.');
      } else if (error.code === 'auth/requires-recent-login') {
        setPasswordError('Please log out and log back in before changing your password.');
      } else {
        setPasswordError('Failed to update password. Please try again.');
      }
    }

    setLoadingPassword(false);
  };

  const handleSaveAddress = async () => {
    setFormError('');

    if (
      !formData.fullName.trim() ||
      !formData.phone.trim() ||
      !formData.street.trim() ||
      !formData.postalCode.trim() ||
      !formData.barangay.trim()
    ) {
      setFormError('Please complete all required fields');
      return;
    }

    if (formData.fullName.trim().length < 3 || !/^[a-zA-Z\s'-]+$/.test(formData.fullName)) {
      setFormError('Please enter a valid full name');
      return;
    }

    if (!/^09\d{9}$/.test(formData.phone)) {
      setFormError('Invalid Philippine phone number');
      return;
    }

    if (!/^\d{4}$/.test(formData.postalCode)) {
      setFormError('Postal code must be 4 digits');
      return;
    }

    if (formData.street.trim().length < 5) {
      setFormError('Please enter a complete street address');
      return;
    }

    let existing = addresses;
    let updated;

    if (isEditing && editingId) {
      updated = existing.map((addr) =>
        addr.id === editingId ? { ...addr, ...formData } : addr
      );
    } else {
      const newAddress = {
        id: Date.now().toString(),
        fullName: formData.fullName,
        phone: formData.phone,
        province: formData.province,
        city: formData.city,
        barangay: formData.barangay,
        postalCode: formData.postalCode,
        street: formData.street,
        isDefault: existing.length === 0,
      };
      updated = [...existing, newAddress];
    }

    if (user) {
      const ref = doc(db, 'users', user.uid);
      await setDoc(ref, { addresses: updated }, { merge: true });
    }

    setAddresses(updated);
    setIsEditing(false);
    setEditingId(null);
    setShowAddressModal(false);
  };

  const handleSetDefault = async (id: string) => {
    if (!user) return;
    const updated = addresses.map((addr) => ({
      ...addr,
      isDefault: addr.id === id,
    }));
    const ref = doc(db, 'users', user.uid);
    await setDoc(ref, { addresses: updated }, { merge: true });
    setAddresses(updated);
  };

  const handleDeleteAddress = async (id: string) => {
    if (!user) return;
    const addressToDelete = addresses.find((a) => a.id === id);
    if (addressToDelete?.isDefault) {
      alert("You cannot delete your default address. Please set another address as default first.");
      return;
    }
    const updated = addresses.filter((addr) => addr.id !== id);
    const ref = doc(db, 'users', user.uid);
    await setDoc(ref, { addresses: updated }, { merge: true });
    setAddresses(updated);
  };

  const handleSendDeleteConfirmation = async () => {
    if (!user) return;
    setDeleteLoading(true);
    setDeleteMessage({ type: '', text: '' });
    
    try {
      await sendEmailVerification(user, {
        url: `${window.location.origin}/account/delete-confirm`,
        handleCodeInApp: true,
      });
      setDeleteMessage({ type: 'success', text: 'Verification email sent. Please check your Gmail to continue account deletion.' });
    } catch (error: any) {
      console.error(error);
      setDeleteMessage({ type: 'error', text: 'Failed to send verification email. Please try again.' });
    }
    
    setDeleteLoading(false);
  };

  if (!user) {
    return <p className="p-6">Please login first.</p>;
  }
  const maskEmail = (email?: string | null) => {
  if (!email) return '';

  const [name, domain] = email.split('@');

  if (name.length <= 2) {
    return `${name[0]}***@${domain}`;
  }

  return `${name.slice(0, 2)}********@${domain}`;
};

  return (
  <div className="min-h-screen bg-gray-100 py-10 px-4">
    <div className="max-w-6xl mx-auto bg-white shadow-sm border rounded-md flex overflow-hidden">

      {/* SIDEBAR */}
      <div className="w-[260px] border-r bg-white p-6">
        
        {/* PROFILE */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-14 h-14 rounded-full bg-gray-200 overflow-hidden shrink-0 flex items-center justify-center">
            {photoURL ? (
              <img src={photoURL} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <svg className="w-full h-full text-gray-400 mt-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            )}
          </div>
          
          <div>
            <h2 className="font-semibold text-gray-800">
              {fullName || 'User'}
            </h2>

            <button
  onClick={() => setActiveTab('profile')}
  className="text-sm text-gray-500 hover:text-[#2787b4] transition"
>
  Edit Profile
</button>
          </div>
        </div>

        {/* MENU */}
        <div className="space-y-1">

          <p className="text-sm font-semibold text-gray-800 mb-3">
            My Account
          </p>

          <button 
            onClick={() => setActiveTab('profile')}
            className={`block w-full text-left px-3 py-2 rounded-md font-medium ${activeTab === 'profile' ? 'bg-[#e9f4fa] text-[#2787b4]' : 'hover:bg-gray-100 text-gray-700'}`}
          >
            Profile
          </button>

          <button 
            onClick={() => setActiveTab('addresses')}
            className={`block w-full text-left px-3 py-2 rounded-md font-medium ${activeTab === 'addresses' ? 'bg-[#e9f4fa] text-[#2787b4]' : 'hover:bg-gray-100 text-gray-700'}`}
          >
            Addresses
          </button>

          <button 
            onClick={() => setActiveTab('password')}
            className={`block w-full text-left px-3 py-2 rounded-md font-medium ${activeTab === 'password' ? 'bg-[#e9f4fa] text-[#2787b4]' : 'hover:bg-gray-100 text-gray-700'}`}
          >
            Change Password
          </button>

          <button 
            onClick={() => setActiveTab('privacy')}
            className={`block w-full text-left px-3 py-2 rounded-md font-medium ${activeTab === 'privacy' ? 'bg-[#e9f4fa] text-[#2787b4]' : 'hover:bg-gray-100 text-gray-700'}`}
          >
            Privacy Settings
          </button>

        </div>
      </div>

      {/* RIGHT CONTENT */}
      <div className="flex-1 p-10">
        {activeTab === 'profile' && (
          <>
            {/* HEADER */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-800">
                My Profile
              </h1>
              <p className="text-gray-500">
                Manage and protect your account
              </p>
            </div>

            {/* CONTENT SPLIT */}
            <div className="flex flex-col-reverse md:flex-row gap-10">
              
              {/* LEFT: FORM */}
              <div className="flex-1 space-y-6">
                {/* FULL NAME */}
                <div>
                  <label className="block text-sm text-gray-600 mb-2">Full Name</label>
                  <input
                    className="w-full border border-gray-300 rounded-md px-4 py-3 focus:ring-2 focus:ring-[#2787b4] outline-none"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                  />
                </div>
                {/* EMAIL */}
<div>
  <label className="block text-sm text-gray-600 mb-2">
    Email
  </label>
  {isGoogleUser && !hasPasswordProvider && (
  <p className="text-xs text-gray-400 mt-2">
    Set a password first before changing your email.
  </p>
)}

  <div className="flex items-center gap-3 h-[50px] px-4 border border-gray-300 rounded-md bg-gray-50">

    <span className="text-gray-800 text-sm">
      {maskEmail(user?.email)}
    </span>

    {isGoogleUser && !hasPasswordProvider ? (
  <button
    type="button"
    onClick={() => setActiveTab('password')}
    className="text-[#2787b4] text-sm hover:underline cursor-pointer"
  >
    Create Password
  </button>
) : (
  <button
    type="button"
    onClick={() => setShowEmailModal(true)}
    className="text-[#2787b4] text-sm hover:underline cursor-pointer"
  >
    Change
  </button>
)}

  </div>
</div>

                {/* PHONE */}
                <div>
                  <label className="block text-sm text-gray-600 mb-2">Phone Number</label>
                  <input
                    className="w-full border border-gray-300 rounded-md px-4 py-3 focus:ring-2 focus:ring-[#2787b4] outline-none"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                  />
                </div>

                {/* COMPANY */}
                <div>
                  <label className="block text-sm text-gray-600 mb-2">Company Name</label>
                  <input
                    className="w-full border border-gray-300 rounded-md px-4 py-3 focus:ring-2 focus:ring-[#2787b4] outline-none"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                  />
                </div>

                {/* SAVE BUTTON */}
                <Button
                  onClick={handleSave}
                  disabled={loading}
                  className="bg-[#2787b4] hover:bg-[#1f6f94] text-white px-8 py-3 rounded-md mt-4"
                >
                  {loading ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>

              {/* RIGHT: IMAGE UPLOAD */}
              <div className="w-full md:w-[300px] flex flex-col items-center justify-start md:border-l md:pl-10 space-y-5 pt-4">
                <div className="w-[100px] h-[100px] rounded-full overflow-hidden border bg-gray-100 flex items-center justify-center shrink-0">
                  {photoURL ? (
                    <img src={photoURL} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <svg className="w-16 h-16 text-gray-300 mt-3" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  )}
                </div>

                {uploadError && (
                  <div className="text-red-500 text-sm text-center">
                    {uploadError}
                  </div>
                )}

                <label className="cursor-pointer bg-white border border-gray-300 px-4 py-2 text-sm text-gray-700 font-medium hover:bg-gray-50 rounded shadow-sm transition">
                  {uploadingImage ? 'Uploading...' : 'Select Image'}
                  <input
                    type="file"
                    className="hidden"
                    accept=".jpg,.jpeg,.png"
                    onChange={handleImageUpload}
                    disabled={uploadingImage}
                  />
                </label>

                <div className="text-xs text-gray-400 text-center space-y-1">
                  <p>File size: maximum 1 MB</p>
                  <p>File extension: .JPEG, .PNG</p>
                </div>
              </div>

            </div>
          </>
        )}
        
        {activeTab === 'addresses' && (
          <>
            <div className="flex justify-between items-center mb-8 pb-4 border-b">
              <div>
                <h1 className="text-2xl font-semibold text-gray-800">My Addresses</h1>
              </div>
              <button
                onClick={() => {
                  setFormData({
                    fullName: '',
                    phone: '',
                    province: '',
                    city: '',
                    barangay: '',
                    postalCode: '',
                    street: '',
                  });
                  setIsEditing(false);
                  setEditingId(null);
                  setSelectedRegion('');
                  setSelectedProvince('');
                  setSelectedCity('');
                  setSelectedRegionName('');
                  setSelectedProvinceName('');
                  setSelectedCityName('');
                  setStep('region');
                  setShowAddressModal(true);
                }}
                className="bg-[#2787b4] hover:bg-[#1f6f94] text-white px-4 py-2 rounded shadow-sm font-medium transition"
              >
                + Add Address
              </button>
            </div>

            <div className="space-y-4">
              {addresses.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  You don't have any addresses yet.
                </div>
              ) : (
                addresses.map((addr) => (
                  <div key={addr.id} className="py-4 border-b flex justify-between items-start">
                    <div className="space-y-1">
                      <div className="flex items-center gap-3">
                        <span className="font-medium text-gray-800 text-lg">{addr.fullName}</span>
                        <span className="text-gray-400">|</span>
                        <span className="text-gray-600">{addr.phone}</span>
                      </div>
                      <div className="text-gray-600 text-sm mt-2">{addr.street}</div>
                      <div className="text-gray-600 text-sm">{addr.barangay}, {addr.city}, {addr.province} {addr.postalCode}</div>
                      {addr.isDefault && (
  <span className="mt-2 inline-block text-xs bg-red-100 text-red-500 px-2 py-1 rounded w-fit">
    Default
  </span>
)}
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <div className="flex gap-3 text-sm">
                        <button
                          onClick={() => {
                            setFormData(addr);
                            setEditingId(addr.id);
                            setIsEditing(true);
                            setShowAddressModal(true);
                          }}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          Edit
                        </button>
                        {!addr.isDefault && (
                          <button
                            onClick={() => handleDeleteAddress(addr.id)}
                            className="text-red-500 hover:text-red-700"
                          >
                            Delete
                          </button>
                        )}
                      </div>
                      <button
                        onClick={() => handleSetDefault(addr.id)}
                        disabled={addr.isDefault}
                        className={`mt-2 px-3 py-1 text-sm border rounded ${addr.isDefault ? 'bg-white text-gray-400 cursor-not-allowed border-gray-200' : 'bg-white text-gray-700 hover:bg-gray-50 border-gray-300'}`}
                      >
                        Set as default
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </>
        )}

        {activeTab === 'password' && (
          <div className="max-w-2xl relative">
            {(!isCreatePasswordFlow && !isPasswordVerified) ? (
              <div className="max-w-md mx-auto flex flex-col items-center justify-center mt-10">
                <div className="w-full relative flex items-center justify-center mb-6">
                  <button 
                    onClick={() => setActiveTab('profile')}
                    className="absolute left-0 text-[#2787b4] hover:text-[#1f6f94]"
                  >
                    <ArrowLeft size={24} />
                  </button>
                  <h1 className="text-2xl font-semibold text-gray-800">Enter Your Password</h1>
                </div>

                {verifyPasswordError && (
                  <div className="mb-4 w-full rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                    {verifyPasswordError}
                  </div>
                )}
                
                <div className="w-full relative mb-6">
                  <input
                    type={showCurrent ? 'text' : 'password'}
                    className="w-full border border-gray-300 rounded-md px-4 py-3 focus:ring-2 focus:ring-[#2787b4] outline-none text-center"
                    placeholder="Input your current password to verify"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrent(!showCurrent)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showCurrent ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                
                <Button
                  onClick={handleVerifyPassword}
                  disabled={loadingVerify}
                  className="w-full bg-[#2787b4] hover:bg-[#1f6f94] text-white py-3 rounded-md transition font-medium disabled:bg-gray-400"
                >
                  {loadingVerify ? 'Verifying...' : 'CONFIRM'}
                </Button>
              </div>
            ) : (
              <div>
                <h1 className="text-2xl font-semibold text-gray-800 mb-2">
                  {isCreatePasswordFlow ? 'Create Password' : 'Change Password'}
                </h1>
                <p className="text-gray-500 mb-8 border-b pb-4">
                  {isCreatePasswordFlow 
                    ? 'Create a password so you can also login using email/password.'
                    : 'For your account\'s security, do not share your password with anyone else.'}
                </p>

                {passwordError && (
                  <div className="mb-6 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                    {passwordError}
                  </div>
                )}
                {passwordSuccess && (
                  <div className="mb-6 rounded-md border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-600">
                    {passwordSuccess}
                  </div>
                )}

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm text-gray-600 mb-2">New Password</label>
                    <div className="relative">
                      <input
                        type={showNew ? 'text' : 'password'}
                        className="w-full border border-gray-300 rounded-md px-4 py-3 focus:ring-2 focus:ring-[#2787b4] outline-none"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                      />
                      <button
                        type="button"
                        onClick={() => setShowNew(!showNew)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showNew ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm text-gray-600 mb-2">Confirm Password</label>
                    <div className="relative">
                      <input
                        type={showConfirm ? 'text' : 'password'}
                        className="w-full border border-gray-300 rounded-md px-4 py-3 focus:ring-2 focus:ring-[#2787b4] outline-none"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirm(!showConfirm)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showConfirm ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                    </div>
                  </div>

                  <Button
                    onClick={handleChangePassword}
                    disabled={loadingPassword}
                    className="bg-[#2787b4] hover:bg-[#1f6f94] text-white px-8 py-3 rounded-md mt-4 transition font-medium disabled:bg-gray-400"
                  >
                    {loadingPassword ? (isCreatePasswordFlow ? 'Creating...' : 'Updating...') : (isCreatePasswordFlow ? 'Create Password' : 'Update Password')}
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'privacy' && (
          <div className="max-w-2xl">
            {deleteStep === 'default' && (
              <div>
                <h1 className="text-2xl font-semibold text-gray-800 mb-8">Privacy Settings</h1>
                <div className="flex items-center justify-between border-t py-6 border-b">
                  <div>
                    <h3 className="text-lg font-medium text-gray-800">Request Account Deletion</h3>
                    <p className="text-sm text-gray-500 mt-1">Permanently delete your account and all associated data.</p>
                  </div>
                  <Button
                    onClick={() => setDeleteStep('warning')}
                    className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-md font-medium transition"
                  >
                    Delete
                  </Button>
                </div>
              </div>
            )}

            {deleteStep === 'warning' && (
              <div className="max-w-md mx-auto mt-10">
                <h1 className="text-2xl font-semibold text-gray-800 mb-6 text-center">Important</h1>
                <p className="text-gray-700 mb-4">By clicking on "Proceed", you agree to the following:</p>
                <ul className="list-disc pl-5 space-y-2 text-gray-600 mb-8">
                  <li>Account deletion is irreversible</li>
                  <li>User can no longer login</li>
                  <li>Account data may be permanently deleted</li>
                  <li>Pending transactions may prevent deletion</li>
                </ul>
                <div className="flex gap-4">
                  <Button
                    onClick={() => setDeleteStep('default')}
                    className="flex-1 py-3 text-gray-600 border border-gray-300 hover:bg-gray-50 bg-white"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={() => setDeleteStep('confirm')}
                    className="flex-1 bg-[#2787b4] hover:bg-[#1f6f94] text-white py-3"
                  >
                    Proceed
                  </Button>
                </div>
              </div>
            )}

            {deleteStep === 'confirm' && (
              <div className="max-w-md mx-auto mt-10">
                <h1 className="text-2xl font-semibold text-gray-800 mb-6 text-center">Confirm Account Deletion</h1>
                
                {deleteMessage.text && (
                  <div className={`mb-6 p-4 rounded-md text-sm border ${deleteMessage.type === 'success' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'}`}>
                    {deleteMessage.text}
                  </div>
                )}
                
                <div className="bg-gray-50 rounded-md p-6 border mb-8">
                  <p className="text-gray-600 mb-4 text-center">You are about to delete the account associated with:</p>
                  <p className="font-medium text-gray-800 text-lg text-center mb-4">{user?.email}</p>
                  <p className="text-sm text-gray-500 text-center">A final confirmation may be sent to your email to complete this process.</p>
                </div>
                <div className="flex gap-4">
                  <Button
                    onClick={() => setDeleteStep('warning')}
                    className="flex-1 py-3 text-gray-600 border border-gray-300 hover:bg-gray-50 bg-white"
                  >
                    Back
                  </Button>
                  <Button
                    onClick={handleSendDeleteConfirmation}
                    disabled={deleteLoading}
                    className="flex-1 bg-red-500 hover:bg-red-600 text-white py-3 disabled:bg-gray-400"
                  >
                    {deleteLoading ? 'Sending...' : 'Send Confirmation'}
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>

    {/* ================= ADD / EDIT MODAL ================= */}
    {showAddressModal && (
      <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
        <div className="bg-white w-full max-w-2xl rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-6">
            {isEditing ? 'Edit Address' : 'New Address'}
          </h2>
          {formError && (
            <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
              {formError}
            </div>
          )}
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-600">Full Name</label>
                <input
                  id="address-fullname"
                  name="fullName"
                  className="w-full border rounded px-3 py-2 mt-1"
                  value={formData.fullName}
                  onChange={handleChange}
                  autoComplete="name"
                />
              </div>
              <div>
                <label className="text-sm text-gray-600">Phone</label>
                <input
                  id="address-phone"
                  name="phone"
                  className="w-full border rounded px-3 py-2 mt-1"
                  value={formData.phone}
                  onChange={handleChange}
                  inputMode="numeric"
                  maxLength={11}
                  autoComplete="tel"
                />
              </div>
            </div>

            <div>
              <label className="text-sm text-gray-600">Region, Province, City, Barangay</label>
              <button
                id="address-picker"
                onClick={() => {
                  setShowPicker(true);
                  setStep('region');
                }}
                className="w-full border rounded px-3 py-2 mt-1 text-left text-sm bg-white"
              >
                {formData.barangay
                  ? `${formData.barangay}, ${formData.city}, ${formData.province}`
                  : 'Select Region, Province, City, Barangay'}
              </button>
            </div>
            
            <div>
              <label className="text-sm text-gray-600">Postal Code</label>
              <input
                name="postalCode"
                className="w-full border rounded px-3 py-2 mt-1"
                value={formData.postalCode}
                onChange={handleChange}
              />
            </div>
            
            <div>
              <label className="text-sm text-gray-600">Street Name, Building, House No.</label>
              <input
                name="street"
                className="w-full border rounded px-3 py-2 mt-1"
                value={formData.street}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <button
              onClick={() => {
                setFormError('');
                setShowAddressModal(false);
                setFormData({
                  fullName: '', phone: '', province: '', city: '',
                  barangay: '', postalCode: '', street: '',
                });
                setIsEditing(false);
                setEditingId(null);
                setSelectedRegion('');
                setSelectedProvince('');
                setSelectedCity('');
                setSelectedRegionName('');
                setSelectedProvinceName('');
                setSelectedCityName('');
                setStep('region');
                setShowPicker(false);
              }}
              className="px-4 py-2"
            >
              Cancel
            </button>
            <button
              id="address-submit"
              onClick={handleSaveAddress}
              className="bg-[#2787b4] text-white px-6 py-2 rounded hover:bg-[#1f6f94]"
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    )}

    {/* ================= ADDRESS PICKER ================= */}
    {showPicker && (
      <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[60]">
        <div className="bg-white w-full max-w-md rounded-lg">
          <div className="flex justify-between items-center border-b p-3">
            <span className="font-medium">Select Address</span>
            <button onClick={() => setShowPicker(false)}>✕</button>
          </div>
          <div className="flex border-b text-sm">
            <div
              onClick={() => setStep('region')}
              className={`flex-1 text-center py-2 cursor-pointer ${step === 'region' && 'text-[#2787b4] border-b-2 border-[#2787b4]'}`}
            >
              {selectedRegionName || 'Region'}
            </div>
            {(!selectedRegion || provinces.some((p: any) => p.regionCode === selectedRegion)) && (
              <div
                onClick={() => selectedRegion && setStep('province')}
                className={`flex-1 text-center py-2 cursor-pointer ${step === 'province' && 'text-[#2787b4] border-b-2 border-[#2787b4]'}`}
              >
                {selectedProvinceName || 'Province'}
              </div>
            )}
            {(!selectedProvince || cities.some((c: any) => c.provinceCode === selectedProvince) || !provinces.some((p: any) => p.regionCode === selectedRegion)) && (
              <div
                onClick={() => (selectedProvince || (selectedRegion && !provinces.some((p: any) => p.regionCode === selectedRegion))) && setStep('city')}
                className={`flex-1 text-center py-2 cursor-pointer ${step === 'city' && 'text-[#2787b4] border-b-2 border-[#2787b4]'}`}
              >
                {selectedCityName || 'City'}
              </div>
            )}
            <div
              onClick={() => selectedCity && setStep('barangay')}
              className={`flex-1 text-center py-2 cursor-pointer ${step === 'barangay' && 'text-[#2787b4] border-b-2 border-[#2787b4]'}`}
            >
              Barangay
            </div>
          </div>

          <div className="p-4 max-h-80 overflow-y-auto">
            {step === 'region' && (
              regionsList.map((r: any) => (
                <div
                  key={r.code}
                  onClick={() => {
                    setSelectedRegion(r.code);
                    setSelectedRegionName(r.name);
                    setSelectedProvince('');
                    setSelectedProvinceName('');
                    setSelectedCity('');
                    setSelectedCityName('');
                    const hp = provincesList.some((p: any) => p.regionCode === r.code);
                    if (!hp) setStep('city');
                    else setStep('province');
                  }}
                  className="py-2 cursor-pointer hover:bg-gray-100"
                >
                  {r.name}
                </div>
              ))
            )}
            {step === 'province' && (
              provincesList
                .filter((p: any) => p.regionCode === selectedRegion)
                .map((p: any) => (
                  <div
                    key={p.code}
                    onClick={() => {
                      setSelectedProvince(p.code);
                      setSelectedProvinceName(p.name);
                      setSelectedCity('');
                      setSelectedCityName('');
                      setStep('city');
                    }}
                    className="py-2 cursor-pointer hover:bg-gray-100"
                  >
                    {p.name}
                  </div>
                ))
            )}
            {step === 'city' && (
              cities
                .filter((c: any) => {
                  const hp = provincesList.some((p: any) => p.regionCode === selectedRegion);
                  return hp ? c.provinceCode === selectedProvince : c.regionCode === selectedRegion;
                })
                .map((c: any) => (
                  <div
                    key={c.code}
                    onClick={() => {
                      setSelectedCity(c.code);
                      setSelectedCityName(c.name);
                      setStep('barangay');
                    }}
                    className="py-2 cursor-pointer hover:bg-gray-100"
                  >
                    {c.name}
                  </div>
                ))
            )}
            {step === 'barangay' && (
              barangaysList
                .filter((b: any) => b.cityCode === selectedCity)
                .map((b: any) => (
                  <div
                    key={b.code}
                    onClick={() => {
                      const hp = provincesList.some((p: any) => p.regionCode === selectedRegion);
                      setFormData(prev => ({
                        ...prev,
                        province: hp ? provincesList.find((p: any) => p.code === selectedProvince)?.name || '' : selectedRegionName || '',
                        city: cities.find((c: any) => c.code === selectedCity)?.name || '',
                        barangay: b.name
                      }));
                      setShowPicker(false);
                      setStep('region');
                    }}
                    className="py-2 cursor-pointer hover:bg-gray-100"
                  >
                    {b.name}
                  </div>
                ))
            )}
          </div>
        </div>
      </div>
    )}

    {/* ================= CHANGE EMAIL MODAL ================= */}
    {showEmailModal && (
      <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
        <div className="bg-white w-full max-w-md rounded-lg p-6 shadow-md">
          <h2 className="text-xl font-semibold mb-6 text-gray-800">
            Change Email
          </h2>

          {emailError && (
            <div className="mb-4 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
              {emailError}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-600 mb-2">New Email</label>
              <input
                type="email"
                className="w-full border border-gray-300 rounded-md px-4 py-3 focus:ring-2 focus:ring-[#2787b4] outline-none"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
              />
            </div>
            
            <div>
              <label className="block text-sm text-gray-600 mb-2">Current Password</label>
              <input
                type="password"
                className="w-full border border-gray-300 rounded-md px-4 py-3 focus:ring-2 focus:ring-[#2787b4] outline-none"
                value={emailPassword}
                onChange={(e) => setEmailPassword(e.target.value)}
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <button
              onClick={() => {
                setShowEmailModal(false);
                setNewEmail('');
                setEmailPassword('');
                setEmailError('');
              }}
              className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded transition font-medium"
            >
              Cancel
            </button>
            <button
              onClick={handleChangeEmail}
              disabled={loadingEmail}
              className="bg-[#2787b4] text-white px-6 py-2 rounded hover:bg-[#1f6f94] disabled:bg-gray-400 transition font-medium"
            >
              {loadingEmail ? 'Updating...' : 'Update Email'}
            </button>
          </div>
        </div>
      </div>
    )}
  </div>
);
}