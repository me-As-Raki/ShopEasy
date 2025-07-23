'use client';

import {
  ShoppingBag,
  ShoppingCart,
  ListOrdered,
  UserCircle,
  Mail,
  Phone,
  MapPin,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { motion } from 'framer-motion';
import toast, { Toaster } from 'react-hot-toast';

export default function HomePage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Shuffle function
  const shuffleArray = (array: any[]) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  // Firestore product fetch
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'products'));
        const items: any[] = [];
        querySnapshot.forEach((doc) => items.push({ id: doc.id, ...doc.data() }));
        setProducts(shuffleArray(items).slice(0, 6));
      } catch (error) {
        console.error('❌ Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Exit confirmation on back
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = '';
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, []);

  return (
    <div className="min-h-screen flex flex-col justify-between">
      <Toaster position="top-center" />
      {/* Hero Section */}
      <section className="w-full bg-[radial-gradient(circle_at_top_left,white,#e0f2ff)] dark:bg-gradient-to-br dark:from-[#10002B] dark:to-[#3C1A59] transition-colors">
        <motion.div
          className="max-w-6xl mx-auto text-center py-20 px-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 dark:text-white font-serif">
            Welcome to <span className="text-blue-600 dark:text-pink-400">ShopEasy</span>
          </h1>
          <p className="mt-4 text-lg text-gray-700 dark:text-gray-300 font-light max-w-xl mx-auto">
            Discover high-quality products crafted for your lifestyle. Smooth checkout, clean design, and dark mode built-in.
          </p>
          <Link href="/products">
            <button className="mt-8 px-6 py-3 bg-blue-600 text-white dark:bg-white dark:text-black rounded-full shadow-md hover:scale-105 transition font-medium">
              Browse All Products
            </button>
          </Link>
        </motion.div>
      </section>

      {/* Product Section */}
      <section className="mt-16 px-4 flex-grow">
        <h2 className="text-2xl font-bold mb-6 text-center text-slate-800 dark:text-white font-sans tracking-wide">
          Handpicked Just For You
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto mb-16">
          {loading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-80 bg-gray-200 dark:bg-gray-800 animate-pulse rounded-xl" />
            ))
          ) : products.length === 0 ? (
            <p className="text-center col-span-full text-gray-500 dark:text-gray-300">
              No products available.
            </p>
          ) : (
            products.map((product) => (
              <motion.div
                key={product.id}
                whileHover={{ scale: 1.05 }}
                transition={{ type: 'spring', stiffness: 300 }}
                className="bg-white dark:bg-[#1f1f1f] rounded-xl shadow hover:shadow-xl transition p-4"
              >
                <Link href="/products">
                  <div className="w-full h-48 overflow-hidden rounded-lg">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                    />
                  </div>
                  <div className="mt-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate">{product.name}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{product.category}</p>
                    <p className="text-base font-bold text-blue-600 dark:text-pink-400 mt-2">₹{product.price}</p>
                  </div>
                </Link>
              </motion.div>
            ))
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-100 dark:bg-[#1a1a1a] text-gray-700 dark:text-gray-300 border-t dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">
          <div>
            <h3 className="text-2xl font-extrabold text-pink-600 dark:text-pink-400 mb-4">
              Shop<span className="text-gray-900 dark:text-white">Easy</span>
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Your trusted destination for premium products and seamless shopping experience.
            </p>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-3 text-sm">
              <li><Link href="/products" className="flex gap-2 items-center hover:text-pink-600"><ShoppingBag size={16} /> Products</Link></li>
              <li><Link href="/cart" className="flex gap-2 items-center hover:text-pink-600"><ShoppingCart size={16} /> Cart</Link></li>
              <li><Link href="/orders" className="flex gap-2 items-center hover:text-pink-600"><ListOrdered size={16} /> Orders</Link></li>
              <li><Link href="/account" className="flex gap-2 items-center hover:text-pink-600"><UserCircle size={16} /> Account</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact</h4>
            <ul className="text-sm space-y-3">
              <li className="flex items-center gap-2"><Mail size={16} /> rakeshpoojary960@gmail.com</li>
              <li className="flex items-center gap-2"><Phone size={16} /> +91 77952 92573</li>
              <li className="flex items-center gap-2"><MapPin size={16} /> Udupi, Karnataka</li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Newsletter</h4>
            <form className="flex gap-2">
              <input type="email" placeholder="Your email" className="w-full px-3 py-2 rounded-lg border bg-white dark:bg-[#2a2a2a]" />
              <button type="submit" className="bg-pink-600 text-white px-4 py-2 rounded-lg hover:bg-pink-700">Subscribe</button>
            </form>
          </div>
        </div>
        <div className="text-center py-4 text-xs text-gray-500 dark:text-gray-600 border-t dark:border-gray-700">
          &copy; {new Date().getFullYear()} ShopEasy. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
