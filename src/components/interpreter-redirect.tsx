"use client";

import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { UserRole } from '@/lib/constants';

export function InterpreterRedirect() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    // Only redirect if session is loaded and user is an INTERPRETER
    if (status === 'loading') return; // Still loading
    
    if (session?.user?.role === UserRole.INTERPRETER) {
      router.replace('/interpreter-portal/interpreter');
    }
  }, [session, status, router]);

  return null; // This component doesn't render anything
}
