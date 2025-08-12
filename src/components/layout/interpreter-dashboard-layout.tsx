'use client';

import React from 'react';

interface InterpreterDashboardLayoutProps {
  children: React.ReactNode;
}

export function InterpreterDashboardLayout({ children }: InterpreterDashboardLayoutProps) {
  return (
    <div className="relative flex min-h-screen flex-col">
      {/* No Navbar for the interpreter dashboard */}
      <main className="flex-1">
        {children}
      </main>
      {/* Footer completely removed as requested */}
    </div>
  );
}