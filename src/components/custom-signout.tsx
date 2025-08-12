"use client";

import { signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export function useCustomSignOut() {
  const router = useRouter();

  const customSignOut = async () => {
    try {
      console.log('[CustomSignOut] Starting signout process...');
      
      // Sign out and redirect to home page
      await signOut({ 
        redirect: false // Don't use NextAuth's redirect
      });
      
      console.log('[CustomSignOut] NextAuth signout completed');
      
      // Clear any additional client-side cache/storage
      if (typeof window !== 'undefined') {
        // Clear localStorage
        localStorage.clear();
        // Clear sessionStorage
        sessionStorage.clear();
        console.log('[CustomSignOut] Cleared client storage');
      }
      
      // Force a hard refresh to clear any cached data
      if (typeof window !== 'undefined') {
        console.log('[CustomSignOut] Performing hard refresh...');
        window.location.href = '/';
      } else {
        // Fallback for server-side
        router.push('/');
      }
    } catch (error) {
      console.error('[CustomSignOut] Sign out error:', error);
      // Fallback: still redirect even if there's an error
      if (typeof window !== 'undefined') {
        window.location.href = '/';
      } else {
        router.push('/');
      }
    }
  };

  return customSignOut;
}
