'use client';

import { usePathname } from 'next/navigation';
import { Navbar } from './navbar';
import { Footer } from './footer';

interface LayoutWrapperProps {
  children: React.ReactNode;
}

export function LayoutWrapper({ children }: LayoutWrapperProps) {
  const pathname = usePathname();
  
  // Hide main navbar and footer on dashboard pages
  const isDashboardPage = pathname?.startsWith('/dashboard');
  const isInterpreterPortalPage = pathname?.startsWith('/interpreter-portal');
  const isAdminPage = pathname?.startsWith('/admin');
  
  // Pages where we want to hide the main navbar and footer
  const hideMainNavAndFooter = isDashboardPage || isInterpreterPortalPage || isAdminPage;

  return (
    <div className="relative flex min-h-screen flex-col">
      {!hideMainNavAndFooter && <Navbar />}
      <main className={hideMainNavAndFooter ? "min-h-screen" : "flex-1"}>
        {children}
      </main>
      {!hideMainNavAndFooter && <Footer />}
    </div>
  );
}
