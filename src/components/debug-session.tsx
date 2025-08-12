"use client";

import { useSession } from 'next-auth/react';
import { UserRole } from '@/lib/constants';

export function DebugSession() {
  const { data: session, status } = useSession();

  // Only show in development
  if (process.env.NODE_ENV === 'production') {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 bg-black text-white p-4 rounded-lg z-50 text-xs max-w-xs">
      <h4 className="font-bold mb-2">🐛 Debug Session</h4>
      <div>Status: {status}</div>
      <div>Role: {session?.user?.role || 'None'}</div>
      <div>Email: {session?.user?.email || 'None'}</div>
      <div>Is Client: {session?.user?.role === UserRole.CLIENT ? '✅' : '❌'}</div>
    </div>
  );
}
