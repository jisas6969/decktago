'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import {
  applyActionCode,
  checkActionCode,
  deleteUser,
} from 'firebase/auth';

import {
  doc,
  deleteDoc,
} from 'firebase/firestore';

import { auth, db } from '@/lib/firebase';

export default function DeleteConfirmPage() {

  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {

    const handleDelete = async () => {

      try {

        const params = new URLSearchParams(
          window.location.search
        );

        const oobCode = params.get('oobCode');

        if (!oobCode) {
          setMessage('Invalid deletion link.');
          setLoading(false);
          return;
        }

        await checkActionCode(auth, oobCode);

        await applyActionCode(auth, oobCode);

        const user = auth.currentUser;

        if (!user) {
          setMessage(
            'Please login again before deleting your account.'
          );
          setLoading(false);
          return;
        }

        // DELETE FIRESTORE USER DATA
        await deleteDoc(
          doc(db, 'users', user.uid)
        );

        // DELETE AUTH ACCOUNT
        await deleteUser(user);

        setMessage(
          'Your account has been deleted successfully.'
        );

        setTimeout(() => {
          router.push('/');
        }, 3000);

      } catch (error) {

        console.error(error);

        setMessage(
          'This deletion link is invalid or expired.'
        );
      }

      setLoading(false);
    };

    handleDelete();

  }, [router]);

  return (

    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">

      <div className="bg-white rounded-lg shadow-sm border p-10 max-w-md w-full text-center">

        {loading ? (
          <>
            <h1 className="text-2xl font-semibold text-gray-800 mb-4">
              Deleting Account...
            </h1>

            <p className="text-gray-500">
              Please wait while we process your request.
            </p>
          </>
        ) : (
          <>
            <h1 className="text-2xl font-semibold text-gray-800 mb-4">
              Account Deletion
            </h1>

            <p className="text-gray-600">
              {message}
            </p>
          </>
        )}

      </div>

    </div>

  );
}