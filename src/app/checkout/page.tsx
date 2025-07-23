'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { db, auth } from '@/lib/firebase';
import {
  collection,
  getDocs,
  addDoc,
  doc,
  deleteDoc,
  serverTimestamp,
} from 'firebase/firestore';
import toast from 'react-hot-toast';
import {
  CreditCard,
  Truck,
  IndianRupee,
  Loader2,
  CheckCircle2,
} from 'lucide-react';

export default function CheckoutPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState<'UPI' | 'CARD' | 'COD'>('UPI');
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [placingOrder, setPlacingOrder] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);

  const isBuyNow = searchParams.get('buynow') === 'true';

  useEffect(() => {
    const fetchData = async () => {
      const user = auth.currentUser;
      if (!user) {
        router.push('/');
        return;
      }

      try {
        if (isBuyNow) {
          const stored = localStorage.getItem('buynow-item');
          if (stored) {
            const product = JSON.parse(stored);
            setItems([{ ...product, quantity: 1 }]);
          } else {
            toast.error('No product found');
            router.push('/products');
          }
        } else {
          const cartRef = collection(db, 'carts', user.uid, 'items');
          const snap = await getDocs(cartRef);
          setItems(snap.docs.map(doc => ({ id: doc.id, ...(doc.data() as any) })));
        }
      } catch (err) {
        toast.error('Error loading products.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const total = items.reduce((sum, item) => sum + item.price * (item.quantity || 1), 0);
  const deliveryDate = new Date();
  deliveryDate.setDate(deliveryDate.getDate() + 4);

  const createOrder = async () => {
    const user = auth.currentUser;
    if (!user) {
      toast.error('Login required');
      return;
    }

    setPlacingOrder(true);

    try {
      const orderRef = await addDoc(collection(db, 'orders'), {
        userId: user.uid,
        items,
        total,
        paymentMethod,
        status: paymentMethod === 'COD' ? 'PLACED' : 'PENDING',
        createdAt: serverTimestamp(),
      });

      if (!isBuyNow) {
        const cartCol = collection(db, 'carts', user.uid, 'items');
        for (const item of items) {
          await deleteDoc(doc(cartCol, item.id));
        }
      }

      setOrderPlaced(true);
      setOrderId(orderRef.id);
      toast.success('Order placed!');
    } catch (err) {
      toast.error('Order failed.');
    } finally {
      setPlacingOrder(false);
      setConfirmVisible(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-pink-600" />
      </div>
    );
  }

if (orderPlaced) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-[#10002B] text-center px-4">
      <div className="max-w-md bg-gray-100 dark:bg-[#1a1a2e] p-6 rounded-lg shadow-lg space-y-4">
        <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto" />
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Order Confirmed!</h2>
        <p className="text-gray-700 dark:text-gray-300">
          Your order has been placed successfully.
        </p>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Estimated delivery by <span className="font-medium">{deliveryDate.toDateString()}</span>
        </p>
        <button
          onClick={() => router.push('/orders')} // 👈 updated this line
          className="mt-4 px-6 py-2 bg-pink-600 text-white rounded-lg"
        >
          View My Orders
        </button>
      </div>
    </div>
  );
}


  if (items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-gray-700 dark:text-gray-300">
        <p>No items found for checkout.</p>
        <button
          onClick={() => router.push('/products')}
          className="mt-4 px-6 py-2 bg-pink-600 text-white rounded-lg"
        >
          Shop Now
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-10 px-4 bg-white dark:bg-[#10002B]">
      <div className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Checkout</h1>

        {/* Items List */}
        <div className="bg-gray-100 dark:bg-[#1a1a2e] p-5 rounded-lg space-y-4">
          {items.map((item, i) => (
            <div key={i} className="flex justify-between items-center gap-4">
              <img src={item.image} alt={item.name} className="w-16 h-16 rounded-lg object-cover" />
              <div className="flex-1">
                <p className="font-semibold text-gray-900 dark:text-white">{item.name}</p>
                <p className="text-sm text-gray-500">{item.category}</p>
              </div>
              <p className="text-gray-800 dark:text-gray-300">
                ₹{item.price} × {item.quantity || 1}
              </p>
            </div>
          ))}
          <hr className="my-2 border-gray-300 dark:border-gray-700" />
          <div className="flex justify-between font-bold text-lg text-gray-800 dark:text-white">
            <span>Total</span>
            <span>₹{total}</span>
          </div>
        </div>

        {/* Payment Method */}
        <div className="bg-gray-100 dark:bg-[#1a1a2e] p-5 rounded-lg">
          <h2 className="font-semibold mb-4 text-gray-800 dark:text-white">Payment Method</h2>
          {['UPI', 'CARD', 'COD'].map(method => {
            const Icon = method === 'UPI' ? IndianRupee : method === 'CARD' ? CreditCard : Truck;
            return (
              <label
                key={method}
                className="flex items-center gap-3 p-3 rounded-md cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700"
              >
                <input
                  type="radio"
                  name="payment"
                  value={method}
                  checked={paymentMethod === method}
                  onChange={() => setPaymentMethod(method as any)}
                />
                <Icon className="w-5 h-5 text-pink-600 dark:text-pink-300" />
                <span className="text-gray-800 dark:text-gray-100">
                  {method === 'COD'
                    ? 'Cash on Delivery'
                    : method === 'UPI'
                    ? 'UPI Payment'
                    : 'Card Payment'}
                </span>
              </label>
            );
          })}
        </div>

        {/* Place Order Button */}
        <button
          onClick={() => setConfirmVisible(true)}
          className="w-full bg-pink-600 hover:bg-pink-700 text-white py-3 rounded-lg text-lg font-semibold"
        >
          Place Order
        </button>
      </div>

      {/* Confirmation Modal */}
      {confirmVisible && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-[#1a1a2e] p-6 rounded-xl max-w-sm w-full text-center space-y-4">
            <h2 className="text-xl font-bold text-gray-800 dark:text-white">Confirm Order</h2>
            <p className="text-gray-700 dark:text-gray-300">
              Pay ₹{total} using {paymentMethod}?
            </p>
            <div className="flex justify-center gap-4 mt-4">
              <button
                onClick={() => setConfirmVisible(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={createOrder}
                disabled={placingOrder}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-60"
              >
                {placingOrder ? 'Placing...' : 'Yes, Place Order'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
