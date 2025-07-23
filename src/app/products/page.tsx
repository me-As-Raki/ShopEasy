'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { db, auth } from '@/lib/firebase';
import {
  collection,
  getDocs,
  query,
} from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { ArrowLeft, Search, Tags, ShoppingBag } from 'lucide-react';
import ProductCard from '@/components/ProductCard';
import { motion, AnimatePresence } from 'framer-motion';

const categories = ['All', 'Clothing', 'Electronics', 'Home', 'Books'];

export default function ProductsPage() {
  const router = useRouter();
  const [products, setProducts] = useState<any[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => setUser(u));
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      const q = query(collection(db, 'products'));
      const querySnapshot = await getDocs(q);
      const data = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setProducts(data);
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    const filtered = products.filter((product) => {
      const matchesCategory =
        selectedCategory === 'All' || product.category === selectedCategory;
      const matchesSearch = product.name
        .toLowerCase()
        .includes(search.toLowerCase());
      return matchesCategory && matchesSearch;
    });
    setFilteredProducts(filtered);
  }, [search, selectedCategory, products]);

  return (
    <section className="px-4 py-8 max-w-7xl mx-auto relative">
      <button
        onClick={() => router.back()}
        className="absolute top-6 right-4 text-sm font-medium text-pink-600 dark:text-pink-400 hover:underline flex items-center gap-1"
      >
        <ArrowLeft className="w-4 h-4" />
        Back
      </button>

      <h2 className="text-3xl font-bold mb-6 flex items-center gap-2">
        <ShoppingBag className="w-7 h-7 text-pink-600 dark:text-pink-400" />
        All Products
      </h2>

      <div className="relative mb-6">
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full border border-gray-300 dark:border-gray-700 rounded-2xl px-5 py-3 pl-11 text-sm bg-white dark:bg-[#1f1f1f] focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all"
        />
        <Search className="absolute left-4 top-3 text-gray-500 w-5 h-5" />
      </div>

      <div className="flex flex-wrap gap-3 mb-8">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 text-sm rounded-full border transition-all flex items-center gap-1 ${
              selectedCategory === cat
                ? 'bg-pink-600 text-white border-pink-600'
                : 'bg-gray-100 dark:bg-[#1f1f1f] text-gray-700 dark:text-white border-gray-300 dark:border-gray-700 hover:bg-pink-100 hover:text-pink-600'
            }`}
            aria-pressed={selectedCategory === cat}
          >
            <Tags className="w-4 h-4" />
            {cat}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={`${search}-${selectedCategory}`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} user={user} />
            ))
          ) : (
            <div className="col-span-full text-center text-gray-500 dark:text-gray-400 py-10">
              No products found.
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </section>
  );
}
