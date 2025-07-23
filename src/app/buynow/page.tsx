'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { db, auth } from '@/lib/firebase';
import {
  doc,
  getDoc,
  addDoc,
  serverTimestamp,
  collection,
} from 'firebase/firestore';
import toast from 'react-hot-toast';
import {
  IndianRupee,
  CreditCard,
  Truck,
  Loader2,
  ShoppingBag,
  CheckCircle,
} from 'lucide-react';

export default function BuyNowPage() {
  const router = useRouter();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [placingOrder, setPlacingOrder] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'UPI' | 'CARD' | 'COD'>('UPI');
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      const productId = localStorage.getItem('buyNowProductId');
      if (!productId) {
        toast.error('No product selected');
        return router.push('/products');
      }

      try {
        const snap = await getDoc(doc(db, 'products', productId));
        if (snap.exists()) {
          const data = { id: snap.id, ...snap.data() };
          setProduct(data);
        } else {
          toast.error('Product not found');
          router.push('/products');
        }
      } catch (error) {
        console.error('Error fetching product:', error);
        toast.error('Failed to load product');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [router]);

  const createOrder = async () => {
    const user = auth.currentUser;
    if (!user || !product) {
      toast.error('User not logged in or product missing');
      return;
    }

    setPlacingOrder(true);

    try {
      await addDoc(collection(db, 'orders'), {
        userId: user.uid,
        items: [{ ...product, quantity: 1 }],
        total: product.price,
        paymentMethod,
        status: paymentMethod === 'COD' ? 'PLACED' : 'PENDING',
        createdAt: serverTimestamp(),
      });

      setOrderPlaced(true);
      toast.success('Order placed!');
      localStorage.removeItem('buyNowProductId');
    } catch (error) {
      console.error('Order error:', error);
      toast.error('Order failed');
    } finally {
      setPlacingOrder(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-[#10002B]">
        <Loader2 className="w-6 h-6 text-pink-600 animate-spin" />
        <p className="ml-2 text-sm text-gray-700 dark:text-white">Loading product...</p>
      </div>
    );
  }

  if (orderPlaced) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-white dark:bg-[#10002B] text-center">
        <CheckCircle className="w-16 h-16 text-green-600 mb-4" />
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Order Confirmed!</h1>
        <p className="text-gray-600 dark:text-gray-300 mt-2">
          Your order will be delivered within <strong>3-5 business days</strong>.
        </p>
        <button
          onClick={() => router.push('/products')}
          className="mt-6 px-6 py-2 rounded-lg bg-pink-600 hover:bg-pink-700 text-white text-sm"
        >
          Continue Shopping
        </button>
      </div>
    );
  }

  if (!product) return null;

  return (
    <div className="min-h-screen py-10 px-4 bg-white dark:bg-[#10002B]">
      <div className="max-w-xl mx-auto space-y-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <ShoppingBag className="w-6 h-6 text-pink-500" /> Buy Now
        </h1>

        <div className="bg-gray-100 dark:bg-[#1a1a2e] p-5 rounded-xl shadow space-y-3">
          {product.image && (
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-48 object-contain rounded"
            />
          )}
          <div>
            <p className="text-lg font-bold text-gray-800 dark:text-white">{product.name}</p>
            <p className="text-sm text-gray-500 dark:text-gray-300">{product.category}</p>
            <p className="text-xl font-bold text-pink-600 dark:text-pink-400">₹{product.price}</p>
          </div>
        </div>

        <div className="bg-gray-100 dark:bg-[#1a1a2e] p-5 rounded-xl space-y-3">
          <h2 className="text-md font-semibold text-gray-800 dark:text-white">Select Payment Method</h2>
          {[
            { method: 'UPI', icon: <IndianRupee className="w-4 h-4 text-pink-600" />, label: 'UPI Payment' },
            { method: 'CARD', icon: <CreditCard className="w-4 h-4 text-pink-600" />, label: 'Card Payment' },
            { method: 'COD', icon: <Truck className="w-4 h-4 text-pink-600" />, label: 'Cash on Delivery' },
          ].map(({ method, icon, label }) => (
            <label
              key={method}
              className="flex items-center gap-3 p-2 rounded-lg cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700"
            >
              <input
                type="radio"
                name="payment"
                value={method}
                checked={paymentMethod === method}
                onChange={() => setPaymentMethod(method as any)}
              />
              {icon}
              <span className="text-gray-800 dark:text-gray-200 text-sm">{label}</span>
            </label>
          ))}
        </div>

        <button
          onClick={() => setConfirmVisible(true)}
          className="w-full bg-pink-600 hover:bg-pink-700 text-white py-3 rounded-lg text-lg font-semibold transition"
        >
          Proceed to Pay
        </button>
      </div>

      {/* Confirmation Modal */}
      {confirmVisible && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
          <div className="bg-white dark:bg-[#1a1a2e] p-6 rounded-lg max-w-sm w-full shadow-lg space-y-4 text-center">
            <h2 className="text-lg font-bold text-gray-800 dark:text-white">Confirm Order</h2>
            <p className="text-gray-600 dark:text-gray-300">
              Are you sure you want to pay ₹<strong>{product.price}</strong> using <strong>{paymentMethod}</strong>?
            </p>
            <div className="flex justify-center gap-3">
              <button
                onClick={() => {
                  setConfirmVisible(false);
                  toast.error('Order cancelled');
                }}
                className="px-4 py-2 text-sm rounded-lg border dark:border-gray-500 text-gray-800 dark:text-gray-200"
              >
                No
              </button>
              <button
                onClick={createOrder}
                disabled={placingOrder}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg"
              >
                {placingOrder ? 'Placing...' : 'Yes, Confirm'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
