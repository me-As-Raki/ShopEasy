'use client';

import React, { useEffect, useState } from 'react';
import { db, auth } from '@/lib/firebase';
import {
  collection,
  getDocs,
  doc,
  deleteDoc,
  updateDoc,
  increment,
} from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { Trash2, Loader2, Plus, Minus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

export default function CartPage() {
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const handleCheckout = () => {
    toast.success('Proceeding to checkout...');
    router.push('/checkout'); // 👈 Redirects to checkout page
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        router.push('/login');
        return;
      }

      try {
        const itemsRef = collection(db, 'carts', user.uid, 'items');
        const snapshot = await getDocs(itemsRef);
        const items = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setCartItems(items);
        setLoading(false);
      } catch (err) {
        console.error('Failed to load cart:', err);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleRemove = async (itemId: string) => {
    const user = auth.currentUser;
    if (!user) return;

    try {
      await deleteDoc(doc(db, 'carts', user.uid, 'items', itemId));
      setCartItems((prev) => prev.filter((item) => item.id !== itemId));
      toast.success('Item removed from cart.');
    } catch (error) {
      console.error('Error removing item:', error);
    }
  };

  const updateQuantity = async (itemId: string, delta: number) => {
    const user = auth.currentUser;
    if (!user) return;

    const itemRef = doc(db, 'carts', user.uid, 'items', itemId);
    try {
      await updateDoc(itemRef, { quantity: increment(delta) });
      setCartItems((prev) =>
        prev.map((item) =>
          item.id === itemId ? { ...item, quantity: item.quantity + delta } : item
        )
      );
    } catch (error) {
      console.error('Error updating quantity:', error);
    }
  };

  const totalAmount = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <div className="min-h-screen bg-white dark:bg-[#10002B] text-gray-800 dark:text-white p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">🛒 Your Cart</h1>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="animate-spin h-8 w-8 text-blue-500" />
        </div>
      ) : cartItems.length === 0 ? (
        <p className="text-center text-gray-500">Your cart is empty.</p>
      ) : (
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-4 rounded-lg shadow bg-gray-50 dark:bg-[#1f1f1f]"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-24 h-24 object-cover rounded-md"
                  />
                  <div>
                    <h3 className="text-lg font-semibold">{item.name}</h3>
                    <p className="text-sm text-gray-500">{item.category}</p>
                    <p className="font-bold text-pink-600 dark:text-pink-400">
                      ₹{item.price} × {item.quantity} = ₹{item.price * item.quantity}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <button
                        onClick={() => updateQuantity(item.id, -1)}
                        disabled={item.quantity <= 1}
                        className="p-1 rounded bg-gray-200 dark:bg-gray-700 hover:bg-gray-300"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="text-sm font-medium">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, 1)}
                        className="p-1 rounded bg-gray-200 dark:bg-gray-700 hover:bg-gray-300"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => handleRemove(item.id)}
                  className="text-red-500 hover:text-red-700 transition"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>

          <div className="bg-gray-50 dark:bg-[#1f1f1f] p-6 rounded-lg shadow h-fit">
            <h2 className="text-xl font-bold mb-4">Price Details</h2>
            <div className="flex justify-between mb-2">
              <span>Total</span>
              <span className="font-bold text-green-600 dark:text-green-400">
                ₹{totalAmount}
              </span>
            </div>
    <button
      onClick={handleCheckout}
      className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md text-sm font-medium mt-4"
    >
      Proceed to Checkout
    </button>
          </div>
        </div>
      )}
    </div>
  );
}
