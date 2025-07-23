'use client';

import { usePathname } from 'next/navigation';
import Navbar from './Navbar';

const hideNavbarPaths = ['/', '/register'];

export default function ClientWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const showNavbar = !hideNavbarPaths.includes(pathname);

  return (
    <>
      {showNavbar && <Navbar />}
      <main className="max-w-6xl mx-auto px-4 py-6">{children}</main>
    </>
  );
}
