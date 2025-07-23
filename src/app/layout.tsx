import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/context/ThemeContext';
import { AuthProvider } from '@/context/AuthContext';
import ClientWrapper from '@/components/ClientWrapper';
import { Toaster } from 'react-hot-toast';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'ShopEasy - Your Online Store',
  description: 'Buy what you love.',
  icons: {
    icon: '/favicon.ico', // 👈 this tells Next.js to use your public/favicon.ico
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body
        className={`${inter.className} bg-lightBlush text-black dark:bg-darkBg dark:text-white transition-colors duration-300`}
      >
        <ThemeProvider>
          <AuthProvider>
            <ClientWrapper>
              <div className="pt-16">
                {children}
              </div>
              <Toaster position="top-right" />
            </ClientWrapper>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
