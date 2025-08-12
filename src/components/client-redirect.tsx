"use client";

import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { UserRole } from '@/lib/constants';

export function ClientRedirect() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    // Only redirect if session is loaded and user is a CLIENT
    if (status === 'loading') return; // Still loading
    
    if (session?.user?.role === UserRole.CLIENT) {
      router.replace('/dashboard');
    }
  }, [session, status, router]);

  return null; // This component doesn't render anything
}
