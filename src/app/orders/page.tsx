'use client';

import { useEffect, useState } from 'react';
import { db, auth } from '@/lib/firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';
import {
  Loader2,
  PackageSearch,
  CalendarDays,
  IndianRupee,
  BadgeCheck,
  Truck,
  ArrowLeft,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

export default function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [user] = useAuthState(auth);
  const router = useRouter();

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user) return;
      try {
        const q = query(collection(db, 'orders'), where('userId', '==', user.uid));
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setOrders(data);
      } catch (err) {
        console.error(err);
        toast.error('Failed to fetch orders. Please check your internet connection.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[70vh]">
        <Loader2 className="w-8 h-8 animate-spin text-pink-600" />
      </div>
    );
  }

  if (!orders.length) {
    return (
      <div className="flex flex-col items-center justify-center mt-20 text-center text-gray-500 dark:text-gray-400">
        <PackageSearch className="w-10 h-10 mb-2" />
        <h2 className="text-xl font-semibold">No Orders Found</h2>
        <p>Your recent orders will appear here.</p>
        <button
          onClick={() => router.push('/home')}
          className="mt-6 px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition"
        >
          Go Back Home
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-pink-600 hover:text-pink-800 transition"
        >
          <ArrowLeft className="w-5 h-5" />
          Back
        </button>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">My Orders</h1>
      </div>

      <div className="space-y-6">
        {orders.map((order) => (
          <div
            key={order.id}
            className="border rounded-xl bg-white dark:bg-[#1c1c2e] shadow hover:shadow-lg transition-all duration-300"
          >
            <div className="p-4 border-b flex justify-between items-center flex-wrap gap-2">
              <div className="text-gray-800 dark:text-gray-300 space-y-1 text-sm">
                <p className="font-medium">🧾 Order ID: <span className="text-pink-600">{order.id}</span></p>
                <p className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                  <CalendarDays className="w-4 h-4" />
                  Ordered on:{' '}
                  {order.createdAt?.toDate
                    ? order.createdAt.toDate().toLocaleDateString()
                    : 'Unknown'}
                </p>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <span className={`px-3 py-1 rounded-full font-medium ${
                  order.status === 'PLACED'
                    ? 'bg-green-100 text-green-700'
                    : 'bg-yellow-100 text-yellow-700'
                }`}>
                  {order.status === 'PLACED' ? 'Confirmed ✅' : 'Pending ⏳'}
                </span>
                <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 font-medium">
                  {order.paymentMethod?.toUpperCase() || 'N/A'}
                </span>
              </div>
            </div>

            {order.items?.map((item: any, idx: number) => (
              <div
                key={idx}
                className="p-4 flex items-start sm:items-center gap-4 border-t"
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-24 h-24 rounded-md object-cover border"
                />
                <div className="text-sm text-gray-800 dark:text-gray-200 space-y-1">
                  <p>
                    <BadgeCheck className="inline w-4 h-4 text-green-500 mr-1" />
                    <strong>{item.name}</strong>
                  </p>
                  <p>
                    <span className="font-medium text-gray-600 dark:text-gray-400">Category:</span>{' '}
                    {item.category}
                  </p>
                  <p className="flex items-center gap-1">
                    <IndianRupee className="w-4 h-4 text-pink-600" />
                    <span className="font-semibold">₹{item.price}</span>
                  </p>
                  <p className="flex items-center gap-1">
                    <Truck className="w-4 h-4 text-yellow-500" />
                    Estimated delivery in 5-7 days
                  </p>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
