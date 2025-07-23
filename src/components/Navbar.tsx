'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import {
  Moon, Sun, ShoppingCart, User, Search, Menu, X, LogOut,
  Settings, Box, Info, Phone, Home
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import toast from 'react-hot-toast';

export default function Navbar() {
  const [theme, setTheme] = useState('light');
  const [menuOpen, setMenuOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [showNavbar, setShowNavbar] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const accountRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Theme toggle
  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);
  const toggleTheme = () => setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));

  // Click outside account menu
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (accountRef.current && !accountRef.current.contains(event.target as Node)) {
        setAccountOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Scroll behavior
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setShowNavbar(currentScrollY < lastScrollY || currentScrollY < 100);
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  // Logout handler
  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast.success('Logged out successfully');
      router.push('/');
    } catch (error) {
      toast.error('Failed to logout');
      console.error('Logout error:', error);
    }
  };

  return (
    <header className={`fixed top-0 w-full z-50 transition-transform duration-300 ease-in-out ${showNavbar ? 'translate-y-0' : '-translate-y-full'} bg-white/80 dark:bg-[#10002B]/90 backdrop-blur shadow-sm`}>
      <div className="max-w-7xl mx-auto px-4 md:px-8 flex items-center justify-between h-16">
        {/* Logo */}
        <Link href="/" className="text-2xl font-bold text-pink-600 dark:text-pink-300 tracking-tight">
          Shop<span className="text-gray-800 dark:text-white">Easy</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6 text-sm">
          <NavItem href="/home" label="Home" icon={<Home className="w-4 h-4" />} />
          <NavItem href="/products" label="Products" icon={<Box className="w-4 h-4" />} />
          <NavItem href="/about" label="About" icon={<Info className="w-4 h-4" />} />
          <NavItem href="/contact" label="Contact" icon={<Phone className="w-4 h-4" />} />
          <NavItem href="/cart" label="Cart" icon={<ShoppingCart className="w-4 h-4" />} />

          {/* Account Dropdown */}
          <div className="relative" ref={accountRef}>
            <button
              onClick={() => setAccountOpen((prev) => !prev)}
              className="hover:text-pink-600 dark:hover:text-pink-300"
              aria-haspopup="true"
              aria-expanded={accountOpen}
            >
              <User className="w-5 h-5" />
            </button>
            {accountOpen && (
              <div className="absolute right-0 mt-2 w-44 bg-white dark:bg-gray-900 rounded-xl shadow-xl border dark:border-gray-700 text-sm overflow-hidden z-50">
                <LinkItem href="/account" label="My Account" icon={<User className="w-4 h-4" />} />
                <LinkItem href="/settings" label="Settings" icon={<Settings className="w-4 h-4" />} />
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-left"
                >
                  <LogOut className="w-4 h-4" /> Logout
                </button>
              </div>
            )}
          </div>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-pink-900"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
        </nav>

        {/* Mobile Hamburger */}
        <button
          className="md:hidden"
          onClick={() => setMenuOpen((prev) => !prev)}
          aria-label="Toggle menu"
        >
          {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Dropdown */}
      {menuOpen && (
        <div className="md:hidden px-4 py-3 bg-white dark:bg-[#10002B] space-y-3 text-sm">
          <NavItem href="/home" label="Home" icon={<Home className="w-4 h-4" />} />
          <NavItem href="/products" label="Products" icon={<Box className="w-4 h-4" />} />
          <NavItem href="/about" label="About" icon={<Info className="w-4 h-4" />} />
          <NavItem href="/contact" label="Contact" icon={<Phone className="w-4 h-4" />} />
          <NavItem href="/cart" label="Cart" icon={<ShoppingCart className="w-4 h-4" />} />
          <NavItem href="/account" label="Account" icon={<User className="w-4 h-4" />} />
          <NavItem href="/settings" label="Settings" icon={<Settings className="w-4 h-4" />} />
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-left"
          >
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </div>
      )}
    </header>
  );
}

// NavItem for reuse
function NavItem({ href, label, icon }: { href: string; label: string; icon: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="flex items-center gap-1 hover:text-pink-600 dark:hover:text-pink-300"
    >
      {icon}
      {label}
    </Link>
  );
}

// LinkItem for dropdown
function LinkItem({ href, label, icon }: { href: string; label: string; icon: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
    >
      {icon}
      {label}
    </Link>
  );
}
