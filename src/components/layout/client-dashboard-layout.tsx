'use client';

import React from 'react';

interface ClientDashboardLayoutProps {
  children: React.ReactNode;
}

export function ClientDashboardLayout({ children }: ClientDashboardLayoutProps) {
  return (
    <div className="relative flex min-h-screen flex-col">
      {/* No Navbar for the client dashboard */}
      <main className="flex-1">
        {children}
      </main>
      {/* Footer completely removed as requested */}
    </div>
  );
}