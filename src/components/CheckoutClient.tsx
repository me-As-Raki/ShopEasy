'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { auth, db } from '@/lib/firebase';
import {
  collection,
  doc,
  getDocs,
  deleteDoc,
  addDoc,
  serverTimestamp,
} from 'firebase/firestore';
import toast from 'react-hot-toast';
import {
  IndianRupee,
  CreditCard,
  Truck,
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
    const fetchItems = async () => {
      const user = auth.currentUser;
      if (!user) {
        router.push('/');
        return;
      }

      try {
        if (typeof window !== 'undefined' && isBuyNow) {
          const storedItem = localStorage.getItem('buynow-item');
          if (storedItem) {
            const product = JSON.parse(storedItem);
            setItems([{ ...product, quantity: 1 }]);
          } else {
            toast.error('No Buy Now item found');
            router.push('/products');
          }
        } else {
          const cartRef = collection(db, 'carts', user.uid, 'items');
          const snap = await getDocs(cartRef);
          const cartItems = snap.docs.map(doc => ({ id: doc.id, ...(doc.data() as any) }));
          setItems(cartItems);
        }
      } catch (err) {
        toast.error('Failed to load checkout items');
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, []);

  const total = items.reduce((sum, item) => sum + item.price * (item.quantity || 1), 0);

  const deliveryDate = new Date();
  deliveryDate.setDate(deliveryDate.getDate() + 4);

  const placeOrder = async () => {
    const user = auth.currentUser;
    if (!user) {
      toast.error('You need to log in');
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
        const cartRef = collection(db, 'carts', user.uid, 'items');
        for (const item of items) {
          await deleteDoc(doc(cartRef, item.id));
        }
      }

      setOrderId(orderRef.id);
      setOrderPlaced(true);
      toast.success('Order placed!');
    } catch (err) {
      toast.error('Failed to place order');
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
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="max-w-md text-center bg-gray-100 dark:bg-[#1a1a2e] p-6 rounded-lg">
          <CheckCircle2 className="w-10 h-10 text-green-500 mx-auto" />
          <h2 className="text-xl font-bold mt-4">Order Confirmed</h2>
          <p className="text-sm mt-2">
            Delivery by <strong>{deliveryDate.toDateString()}</strong>
          </p>
          <button
            className="mt-6 px-6 py-2 bg-pink-600 text-white rounded-lg"
            onClick={() => router.push('/orders')}
          >
            View My Orders
          </button>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center text-gray-700 dark:text-gray-300">
        <p>No items available for checkout.</p>
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
    <div className="min-h-screen px-4 py-10 bg-white dark:bg-[#10002B]">
      <div className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Checkout</h1>

        {/* Items */}
        <div className="bg-gray-100 dark:bg-[#1a1a2e] rounded-lg p-5 space-y-4">
          {items.map((item, index) => (
            <div key={index} className="flex items-center justify-between gap-4">
              <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded-lg" />
              <div className="flex-1">
                <p className="font-semibold">{item.name}</p>
                <p className="text-sm text-gray-500">{item.category}</p>
              </div>
              <p className="text-sm">₹{item.price} × {item.quantity || 1}</p>
            </div>
          ))}
          <div className="flex justify-between font-bold text-lg mt-2">
            <span>Total</span>
            <span>₹{total}</span>
          </div>
        </div>

        {/* Payment Method */}
        <div className="bg-gray-100 dark:bg-[#1a1a2e] p-5 rounded-lg space-y-2">
          <h2 className="font-semibold">Select Payment Method</h2>
          {['UPI', 'CARD', 'COD'].map(method => {
            const Icon = method === 'UPI' ? IndianRupee : method === 'CARD' ? CreditCard : Truck;
            return (
              <label
                key={method}
                className="flex items-center gap-3 cursor-pointer p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-md"
              >
                <input
                  type="radio"
                  name="payment"
                  value={method}
                  checked={paymentMethod === method}
                  onChange={() => setPaymentMethod(method as any)}
                />
                <Icon className="w-5 h-5 text-pink-600" />
                <span>{method === 'COD' ? 'Cash on Delivery' : method}</span>
              </label>
            );
          })}
        </div>

        {/* Confirm Order */}
        <button
          onClick={() => setConfirmVisible(true)}
          className="w-full bg-pink-600 hover:bg-pink-700 text-white py-3 rounded-lg text-lg font-semibold"
        >
          Place Order
        </button>
      </div>

      {/* Modal */}
      {confirmVisible && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-[#1a1a2e] p-6 rounded-lg w-full max-w-sm space-y-4 text-center">
            <h2 className="text-xl font-bold">Confirm Order</h2>
            <p>Pay ₹{total} using {paymentMethod}?</p>
            <div className="flex justify-center gap-4 mt-4">
              <button
                onClick={() => setConfirmVisible(false)}
                className="px-4 py-2 border rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={placeOrder}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg"
                disabled={placingOrder}
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
