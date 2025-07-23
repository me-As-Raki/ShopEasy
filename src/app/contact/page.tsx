'use client';

import { useState, useRef } from 'react';
import { Mail, Phone, MapPin, Send, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import toast, { Toaster } from 'react-hot-toast';
import emailjs from '@emailjs/browser';

export default function ContactPage() {
  const formRef = useRef<HTMLFormElement | null>(null);
  const [isSending, setIsSending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSending(true);

    console.log('📡 Attempting to send email...');

    try {
      const result = await emailjs.sendForm(
        process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!,
        process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID!,
        formRef.current!,
        process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY!
      );

      console.log('✅ Email sent:', result.status, result.text);
      toast.success('✅ Message sent successfully!');
      formRef.current?.reset();
    } catch (error) {
      console.error('❌ Email send failed:', error);
      toast.error('❌ Failed to send message. Please try again.');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <section className="min-h-screen bg-gradient-to-b from-white to-pink-50 dark:from-[#10002B] dark:to-[#1f1f1f] px-4 py-20 text-gray-800 dark:text-white">
      <Toaster position="top-center" reverseOrder={false} />

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="text-center mb-10"
      >
        <h1 className="text-4xl font-bold mb-2">Contact Us</h1>
        <p className="text-gray-600 dark:text-gray-300 italic">
          We'd love to hear from you — feedback, support, or just hello.
        </p>
      </motion.div>

      {/* Grid */}
      <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12">
        {/* Info */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-6"
        >
          <InfoItem icon={Mail} label="Email" value="rakeshpoojary960@gmail.com" />
          <InfoItem icon={Phone} label="Phone" value="+91 9845735790" />
          <InfoItem icon={MapPin} label="Address" value="Brahmavara,Udupi 576213, India" />
          <Link
            href="/home"
            className="inline-flex items-center gap-2 mt-6 text-pink-600 hover:text-pink-700 transition"
          >
            <ArrowLeft size={18} /> Back to Home
          </Link>
        </motion.div>

        {/* Contact Form */}
        <motion.form
          ref={formRef}
          onSubmit={handleSubmit}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white dark:bg-[#1f1f1f] p-8 rounded-2xl shadow-md space-y-5"
        >
          <input type="hidden" name="to_email" value="support@shopeasy.com" />
          <Input name="user_name" placeholder="Your Name" />
          <Input name="user_email" type="email" placeholder="Your Email" />
          <Input name="subject" placeholder="Subject" />
          <Textarea name="message" placeholder="Your Message" />

          <button
            type="submit"
            disabled={isSending}
            className="w-full bg-pink-600 text-white py-3 rounded-xl hover:bg-pink-700 transition flex items-center justify-center gap-2 font-medium"
          >
            <Send size={18} />
            {isSending ? 'Sending...' : 'Send Message'}
          </button>
        </motion.form>
      </div>
    </section>
  );
}

// Reusable UI components
function InfoItem({ icon: Icon, label, value }: any) {
  return (
    <div className="flex items-start gap-4">
      <Icon className="text-pink-600 mt-1" />
      <div>
        <p className="font-medium">{label}</p>
        <p className="text-sm text-gray-600 dark:text-gray-300">{value}</p>
      </div>
    </div>
  );
}

function Input({ name, type = 'text', placeholder }: any) {
  return (
    <input
      name={name}
      type={type}
      placeholder={placeholder}
      required
      className="w-full border border-gray-300 dark:border-gray-700 rounded-xl px-4 py-3 bg-transparent focus:outline-none focus:ring-2 focus:ring-pink-500 dark:focus:ring-pink-400"
    />
  );
}

function Textarea({ name, placeholder }: any) {
  return (
    <textarea
      name={name}
      placeholder={placeholder}
      rows={4}
      required
      className="w-full border border-gray-300 dark:border-gray-700 rounded-xl px-4 py-3 bg-transparent focus:outline-none focus:ring-2 focus:ring-pink-500 dark:focus:ring-pink-400"
    />
  );
}
