'use client';

import { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { ArrowLeft, ShoppingBag, Mail, MapPin, Phone } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';

interface UserData {
  name: string;
  email: string;
  location: string;
  phone: string;
  joined: string;
}

export default function AccountPage() {
  const [user] = useAuthState(auth);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchUserData = async () => {
      if (user) {
        try {
          const docRef = doc(db, 'users', user.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            setUserData(docSnap.data() as UserData);
          }
        } catch (error) {
          console.error('Failed to load user data:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchUserData();
  }, [user]);

  if (!user) {
    return (
      <main className="text-center py-20 text-gray-700 dark:text-gray-300">
        <p>Please login to view your account.</p>
        <Link href="/login">
          <button className="mt-4 bg-pink-600 hover:bg-pink-700 text-white py-2 px-4 rounded-xl transition-all">
            Go to Login
          </button>
        </Link>
      </main>
    );
  }

  if (loading) {
    return (
      <main className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-pink-500 border-opacity-70"></div>
      </main>
    );
  }

  if (!userData) {
    return (
      <main className="max-w-xl mx-auto text-center py-20 px-4 text-gray-700 dark:text-gray-300">
        <h1 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">Profile Incomplete</h1>
        <p className="mb-6">We couldn’t find your account details. Please go to settings and complete your profile.</p>
        <button
          onClick={() => router.push('/settings')}
          className="bg-pink-600 hover:bg-pink-700 text-white py-2 px-6 rounded-xl transition"
        >
          Go to Settings
        </button>
      </main>
    );
  }

  return (
    <main className="max-w-5xl mx-auto px-4 py-16">
      {/* Back Button */}
      <button
        onClick={() => router.push('/')}
        className="mb-6 inline-flex items-center gap-2 text-pink-600 dark:text-pink-400 hover:text-pink-700 dark:hover:text-pink-300 transition text-sm font-medium"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Home
      </button>

      {/* Title */}
      <motion.h1
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="text-4xl font-bold text-center mb-12 text-gray-900 dark:text-white"
      >
        My Account
      </motion.h1>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Profile Card */}
        <motion.div
          initial={{ opacity: 0, x: -15 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-white dark:bg-[#1a0933] border border-gray-200 dark:border-[#2f194e] p-6 rounded-2xl shadow-lg space-y-5"
        >
          <div className="flex items-center gap-4">
            <div className="bg-pink-600 text-white w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold shadow-md uppercase">
              {userData.name?.[0] ?? 'U'}
            </div>
            <div>
              <p className="text-xl font-semibold text-gray-900 dark:text-white">
                {userData.name}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Joined: {userData.joined}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300 text-sm">
            <Mail className="w-5 h-5 text-pink-500 dark:text-pink-400" />
            <span>{userData.email}</span>
          </div>

          <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300 text-sm">
            <Phone className="w-5 h-5 text-pink-500 dark:text-pink-400" />
            <span>{userData.phone}</span>
          </div>

          <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300 text-sm">
            <MapPin className="w-5 h-5 text-pink-500 dark:text-pink-400" />
            <span>{userData.location}</span>
          </div>

          <Link href="/settings">
            <button className="w-full bg-pink-600 hover:bg-pink-700 text-white py-2 rounded-xl font-medium transition-all duration-200">
              Edit Profile
            </button>
          </Link>
        </motion.div>

        {/* Order Info */}
        <motion.div
          initial={{ opacity: 0, x: 15 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-[#fdf4f8] dark:bg-[#2a1342] border border-gray-200 dark:border-[#3b2460] p-6 rounded-2xl shadow-lg"
        >
          <div className="flex items-center gap-3 mb-4">
            <ShoppingBag className="w-5 h-5 text-pink-600 dark:text-pink-400" />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Recent Orders
            </h2>
          </div>

          <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
            You haven’t placed any orders yet. Once you do, they'll show up here.
          </p>

          <Link href="/products">
            <button className="w-full bg-pink-600 hover:bg-pink-700 text-white py-2 rounded-xl text-sm font-medium transition-all">
              Browse Products
            </button>
          </Link>
        </motion.div>
      </div>
    </main>
  );
}
