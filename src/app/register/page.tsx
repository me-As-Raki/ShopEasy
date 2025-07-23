'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  createUserWithEmailAndPassword,
  signInWithPopup,
} from 'firebase/auth';
import { auth, provider } from '@/lib/firebase';
import { FcGoogle } from 'react-icons/fc';
import { Moon, Sun, Loader2 } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

export default function RegisterPage() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('theme') as 'light' | 'dark' | null;
    const current = saved || 'light';
    setTheme(current);
    document.documentElement.classList.toggle('dark', current === 'dark');
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    localStorage.setItem('theme', newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
    setTheme(newTheme);
  };

  const formatError = (code: string) => {
    switch (code) {
      case 'auth/email-already-in-use':
        return 'This email is already registered.';
      case 'auth/invalid-email':
        return 'Please enter a valid email address.';
      case 'auth/weak-password':
        return 'Password must be at least 6 characters.';
      default:
        return 'Registration failed. Please try again.';
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (!email || !password) {
      toast.error('Please fill in both email and password.');
      setIsLoading(false);
      return;
    }

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      toast.success('Account created! Redirecting...');
      router.push('/home');
    } catch (err: any) {
      toast.error(formatError(err.code));
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      await signInWithPopup(auth, provider);
      toast.success('Signed up with Google!');
      router.push('/home');
    } catch {
      toast.error('Google sign-up failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#10002B] transition-colors">
      <Toaster position="top-center" />

      {/* Theme Toggle */}
      <button
        onClick={toggleTheme}
        className="absolute top-6 right-6 text-gray-700 dark:text-white hover:scale-105 transition"
        aria-label="Toggle Theme"
      >
        {theme === 'dark' ? <Sun size={22} /> : <Moon size={22} />}
      </button>

      <div className="flex items-start justify-center pt-10 md:pt-20 px-4">
        <div className="max-w-md w-full bg-white dark:bg-[#1f1f1f] p-8 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 space-y-6 animate-fadeIn">
          <h1 className="text-4xl font-extrabold text-center text-pink-600 dark:text-pink-400">
            Shop<span className="text-gray-900 dark:text-white">Easy</span>
          </h1>
          <h2 className="text-lg font-medium text-center text-gray-700 dark:text-gray-300">
            Create your account
          </h2>

          <form onSubmit={handleRegister} className="space-y-4">
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-[#2a2a2a] text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-pink-500 transition"
            />

            <input
              type="password"
              placeholder="Create a password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-[#2a2a2a] text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-pink-500 transition"
            />

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-pink-600 hover:bg-pink-700 text-white py-2 rounded-lg font-medium flex items-center justify-center gap-2 transition"
            >
              {isLoading && <Loader2 className="animate-spin" size={18} />}
              {isLoading ? 'Registering...' : 'Register'}
            </button>
          </form>

          <button
            onClick={handleGoogleSignIn}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-3 border border-gray-300 dark:border-gray-700 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-[#333] transition text-gray-700 dark:text-white"
          >
            {isLoading ? <Loader2 className="animate-spin" size={18} /> : <FcGoogle size={20} />}
            {isLoading ? 'Signing up...' : 'Sign up with Google'}
          </button>

          <p className="text-sm text-center text-gray-600 dark:text-gray-400">
            Already have an account?{' '}
            <a
              href="/"
              className="text-pink-600 underline hover:text-pink-700 dark:hover:text-pink-400 transition"
            >
              Login here
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
