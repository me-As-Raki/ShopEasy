'use client';

import {
  ShoppingBag,
  Globe,
  HeartHandshake,
  Truck,
  Star,
  Users,
} from 'lucide-react';
import { motion } from 'framer-motion';

const features = [
  {
    icon: Globe,
    title: 'Global Reach',
    desc: 'We deliver across India with plans to expand worldwide.',
  },
  {
    icon: Truck,
    title: 'Fast Delivery',
    desc: 'Quick, safe, and reliable delivery at your doorstep.',
  },
  {
    icon: HeartHandshake,
    title: 'Trusted Partnerships',
    desc: 'We only partner with quality suppliers and authentic brands.',
  },
  {
    icon: ShoppingBag,
    title: 'Curated Products',
    desc: 'Every item is handpicked for style, price, and quality.',
  },
  {
    icon: Star,
    title: 'Top-rated Support',
    desc: '24/7 customer service to assist you anytime.',
  },
  {
    icon: Users,
    title: 'Customer-first',
    desc: 'Your satisfaction is our biggest reward.',
  },
];

export default function AboutPage() {
  return (
    <section className="min-h-screen bg-white dark:bg-[#10002B] text-gray-800 dark:text-white">

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-pink-50 to-white dark:from-[#1f1f1f] dark:to-[#10002B] py-20 px-4 text-center">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl md:text-5xl font-extrabold mb-4"
        >
          About <span className="text-pink-600 dark:text-pink-400">ShopEasy</span>
        </motion.h1>
        <p className="text-lg max-w-2xl mx-auto text-gray-600 dark:text-gray-300">
          Making your shopping experience smoother, faster, and smarter — anytime, anywhere.
        </p>
      </div>

      {/* Mission Section */}
      <div className="max-w-6xl mx-auto py-16 px-4 grid md:grid-cols-2 gap-10 items-center">
        <motion.img
          src="/about_mission.png"
          alt="Our Mission"
          className="rounded-2xl shadow-xl w-full"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        />

        <motion.div
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl font-bold mb-4">Our Mission</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
            At <span className="font-semibold text-pink-600 dark:text-pink-400">ShopEasy</span>, we aim to empower customers with a seamless online shopping experience — from discovery to delivery.
          </p>
          <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
            Our team is passionate about curating quality products, innovating with technology, and building trust with every click.
          </p>
        </motion.div>
      </div>

      {/* Features Section */}
      <div className="bg-gray-100 dark:bg-[#1a1a2e] py-16 px-4">
        <div className="max-w-6xl mx-auto text-center mb-10">
          <h2 className="text-3xl font-bold mb-2">Why Choose ShopEasy?</h2>
          <p className="text-gray-600 dark:text-gray-300">
            Built with purpose, backed by passion.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {features.map((feature, idx) => (
            <motion.div
              key={idx}
              className="bg-white dark:bg-[#1f1f1f] p-6 rounded-2xl shadow-md border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all"
              whileHover={{ scale: 1.03 }}
            >
              <feature.icon className="text-pink-600 dark:text-pink-400 w-7 h-7 mb-3" />
              <h3 className="font-semibold text-lg mb-1">{feature.title}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Call to Action */}
      <div className="text-center py-20 px-4">
        <h2 className="text-2xl md:text-3xl font-bold mb-4">
          Start Shopping Today
        </h2>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          Discover products that suit your lifestyle, all in one place.
        </p>
        <a
          href="/products"
          className="inline-block bg-pink-600 text-white px-6 py-3 rounded-full font-medium hover:bg-pink-700 transition"
        >
          Browse Products
        </a>
      </div>
    </section>
  );
}
