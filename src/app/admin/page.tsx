'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { auth, db } from '@/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { addDoc, collection } from 'firebase/firestore';
import { Loader2 } from 'lucide-react';

const ADMIN_EMAIL = 'rakeshpoojary850@gmail.com';

export default function AdminPage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    price: '',
    image: '',
    description: '',
    rating: '',
    stock: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const router = useRouter();

  // Auth check
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user || user.email !== ADMIN_EMAIL) {
        router.push('/home');
      } else {
        setUser(user);
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, [router]);

  const handleChange = (e: any) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const { name, category, price, image, description, rating, stock } = formData;
    if (!name || !category || !price || !image || !description || !rating || !stock) {
      setError('Please fill all fields');
      return;
    }

    try {
      await addDoc(collection(db, 'products'), {
        ...formData,
        price: parseFloat(price),
        rating: parseFloat(rating),
        stock: parseInt(stock),
        createdAt: new Date().toISOString(),
      });
      setSuccess('Product added successfully!');
      setFormData({
        name: '',
        category: '',
        price: '',
        image: '',
        description: '',
        rating: '',
        stock: '',
      });
    } catch (err: any) {
      setError('Failed to add product. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="w-6 h-6 animate-spin text-pink-500" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-6 text-center text-pink-600 dark:text-pink-400">
        Admin - Add Product
      </h1>

      {error && <p className="text-red-500 text-center mb-4">{error}</p>}
      {success && <p className="text-green-500 text-center mb-4">{success}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        {[
          { label: 'Product Name', name: 'name' },
          { label: 'Category', name: 'category' },
          { label: 'Price', name: 'price', type: 'number' },
          { label: 'Image URL', name: 'image' },
          { label: 'Description', name: 'description' },
          { label: 'Rating (0-5)', name: 'rating', type: 'number' },
          { label: 'Stock Quantity', name: 'stock', type: 'number' },
        ].map(({ label, name, type = 'text' }) => (
          <div key={name}>
            <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-white">
              {label}
            </label>
            <input
              type={type}
              name={name}
              value={(formData as any)[name]}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#1f1f1f] text-black dark:text-white"
            />
          </div>
        ))}

        <button
          type="submit"
          className="w-full py-2 bg-pink-600 hover:bg-pink-700 text-white font-medium rounded-lg transition"
        >
          Add Product
        </button>
      </form>
    </div>
  );
}
