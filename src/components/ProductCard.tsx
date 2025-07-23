'use client';

import { useState } from 'react';
import { ShoppingCart, CreditCard } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { db } from '@/lib/firebase';
import { doc, setDoc } from 'firebase/firestore';
import toast from 'react-hot-toast';

export default function ProductCard({ product, user }: any) {
  const router = useRouter();
  const [confirmAction, setConfirmAction] = useState<'cart' | 'buy' | null>(null);

  const handleConfirmedAction = async () => {
    if (!user) {
      router.push('/login');
      return;
    }

    try {
      if (confirmAction === 'cart') {
        const cartRef = doc(db, 'carts', user.uid, 'items', product.id);
        await setDoc(cartRef, {
          ...product,
          quantity: 1,
          addedAt: new Date().toISOString(),
        });
        toast.success(`${product.name} added to cart`);
      } else if (confirmAction === 'buy') {
        localStorage.setItem('buyNowProductId', product.id);
        toast.success(`Proceeding to buy ${product.name}`);
        router.push('/buynow');
      }
    } catch (error) {
      console.error('❌ Firebase error:', error);
      toast.error('Something went wrong');
    } finally {
      setConfirmAction(null);
    }
  };

  return (
    <div className="relative flex flex-col justify-between rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1a1a1a] shadow-sm hover:shadow-lg transition-all duration-300 hover:border-indigo-500 dark:hover:border-indigo-400 group">
      
      {/* Product Image */}
      <div className="w-full h-60 overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>

      {/* Product Info */}
      <div className="p-4 space-y-1">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white line-clamp-1">
          {product.name}
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {product.category}
        </p>
        <p className="text-lg font-bold text-indigo-600 dark:text-indigo-400">
          ₹{product.price}
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 px-4 pb-4 pt-2">
        <button
          onClick={() => setConfirmAction('cart')}
          className="flex-1 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-900 dark:text-white py-2 rounded-md text-sm font-medium flex items-center justify-center gap-2 transition"
        >
          <ShoppingCart className="w-4 h-4" />
          Add to Cart
        </button>
        <button
          onClick={() => setConfirmAction('buy')}
          className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-md text-sm font-medium flex items-center justify-center gap-2 transition"
        >
          <CreditCard className="w-4 h-4" />
          Buy Now
        </button>
      </div>

      {/* Confirmation Modal */}
      {confirmAction && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-center justify-center">
          <div className="bg-white dark:bg-[#262626] p-6 rounded-xl shadow-2xl w-full max-w-sm text-center">
            <h2 className="text-lg font-bold text-gray-800 dark:text-white mb-2">
              Confirm Action
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-6">
              {confirmAction === 'cart'
                ? `Do you want to add "${product.name}" to your cart?`
                : `Do you want to buy "${product.name}" now?`}
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => setConfirmAction(null)}
                className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmedAction}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium"
              >
                Yes, Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
