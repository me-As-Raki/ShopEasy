'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { auth, db } from '@/lib/firebase';
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
} from 'firebase/firestore';
import {
  updatePassword,
  updateEmail,
  deleteUser,
  onAuthStateChanged,
} from 'firebase/auth';
import toast, { Toaster } from 'react-hot-toast';
import {
  User,
  Mail,
  Lock,
  Save,
  Phone,
  MapPin,
  Trash2,
  Loader2,
  PackageCheck,
} from 'lucide-react';

export default function SettingsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [settings, setSettings] = useState({
    name: '',
    email: '',
    phone: '',
    location: '',
    password: '',
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (authUser) => {
      if (authUser) {
        setUser(authUser);
        const userRef = doc(db, 'users', authUser.uid);
        const userSnap = await getDoc(userRef);

        if (!userSnap.exists()) {
          await setDoc(userRef, {
            name: authUser.displayName || '',
            email: authUser.email || '',
            phone: '',
            location: '',
            joinedAt: new Date().toISOString(),
          });
        }

        const data = userSnap.exists() ? userSnap.data() : {};
        setSettings({
          name: data.name || authUser.displayName || '',
          email: authUser.email || '',
          phone: data.phone || '',
          location: data.location || '',
          password: '',
        });
      } else {
        toast.error('Please login to access settings.');
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setSettings((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e: any) => {
    e.preventDefault();
    if (!user) return;
    setSaving(true);

    try {
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, {
        name: settings.name,
        email: settings.email,
        phone: settings.phone,
        location: settings.location,
      });

      if (settings.email !== user.email) {
        await updateEmail(user, settings.email);
      }

      if (settings.password.length > 5) {
        await updatePassword(user, settings.password);
      }

      toast.success('Settings saved successfully!');
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || 'Error saving settings');
    }
    setSaving(false);
  };

  const handleDelete = async () => {
    const confirmed = confirm('Are you sure? This will delete your account permanently.');
    if (!confirmed || !user) return;

    try {
      await deleteDoc(doc(db, 'users', user.uid));
      await deleteUser(user);
      toast.success('Account deleted successfully');
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || 'Error deleting account');
    }
  };

  const goToOrders = () => {
    router.push('/orders'); // Adjust the path if needed
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="animate-spin h-8 w-8 text-pink-500" />
      </div>
    );
  }

  return (
    <main className="max-w-2xl mx-auto px-4 py-16">
      <Toaster position="top-center" />
      <h1 className="text-4xl font-bold text-center text-gray-900 dark:text-white mb-10">
        Account Settings
      </h1>

      <form
        onSubmit={handleSave}
        className="space-y-6 bg-white dark:bg-[#1f1f1f] p-6 rounded-2xl shadow-xl"
      >
        {/* Name */}
        <div className="flex items-center gap-3">
          <User className="text-pink-600 dark:text-pink-400" />
          <input
            name="name"
            value={settings.name}
            onChange={handleChange}
            placeholder="Your Name"
            className="w-full border border-gray-300 dark:border-gray-700 bg-transparent px-4 py-2 rounded-xl focus:outline-none"
          />
        </div>

        {/* Email */}
        <div className="flex items-center gap-3">
          <Mail className="text-pink-600 dark:text-pink-400" />
          <input
            name="email"
            type="email"
            value={settings.email}
            onChange={handleChange}
            placeholder="Your Email"
            className="w-full border border-gray-300 dark:border-gray-700 bg-transparent px-4 py-2 rounded-xl focus:outline-none"
          />
        </div>

        {/* Phone */}
        <div className="flex items-center gap-3">
          <Phone className="text-pink-600 dark:text-pink-400" />
          <input
            name="phone"
            value={settings.phone}
            onChange={handleChange}
            placeholder="Phone Number"
            className="w-full border border-gray-300 dark:border-gray-700 bg-transparent px-4 py-2 rounded-xl focus:outline-none"
          />
        </div>

        {/* Location */}
        <div className="flex items-center gap-3">
          <MapPin className="text-pink-600 dark:text-pink-400" />
          <input
            name="location"
            value={settings.location}
            onChange={handleChange}
            placeholder="Location"
            className="w-full border border-gray-300 dark:border-gray-700 bg-transparent px-4 py-2 rounded-xl focus:outline-none"
          />
        </div>

        {/* Password */}
        <div className="flex items-center gap-3">
          <Lock className="text-pink-600 dark:text-pink-400" />
          <input
            name="password"
            type="password"
            value={settings.password}
            onChange={handleChange}
            placeholder="New Password"
            className="w-full border border-gray-300 dark:border-gray-700 bg-transparent px-4 py-2 rounded-xl focus:outline-none"
          />
        </div>

        {/* Save Button */}
        <button
          type="submit"
          className="w-full flex justify-center items-center gap-2 bg-pink-600 text-white py-2 px-6 rounded-xl hover:bg-pink-700 transition"
          disabled={saving}
        >
          {saving ? (
            <Loader2 className="animate-spin w-4 h-4" />
          ) : (
            <>
              <Save className="w-4 h-4" />
              Save Settings
            </>
          )}
        </button>

        {/* Delete Account */}
        <div className="text-center pt-4">
          <button
            type="button"
            className="flex items-center justify-center text-red-600 hover:underline gap-2 text-sm"
            onClick={handleDelete}
          >
            <Trash2 className="w-4 h-4" />
            Delete Account
          </button>
        </div>

        {/* View Orders Button */}
        <div className="text-center pt-4">
          <button
            type="button"
            onClick={goToOrders}
            className="flex items-center justify-center text-pink-600 dark:text-pink-400 hover:underline gap-2 text-sm"
          >
            <PackageCheck className="w-4 h-4" />
            View Your Orders
          </button>
        </div>
      </form>
    </main>
  );
}
