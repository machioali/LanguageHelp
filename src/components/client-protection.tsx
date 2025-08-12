"use client";

import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { UserRole } from '@/lib/constants';
import type { UserRoleType } from '@/lib/constants';

interface ClientProtectionProps {
  children: React.ReactNode;
  allowedForClients?: boolean;
  redirectTo?: string;
  requireAuth?: boolean;
  allowedRoles?: UserRoleType[];
}

export function ClientProtection({ 
  children, 
  allowedForClients = false,
  redirectTo = '/dashboard',
  requireAuth = false,
  allowedRoles = []
}: ClientProtectionProps) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    console.log('[ClientProtection] Session status:', status);
    console.log('[ClientProtection] Session:', session);
    
    // Wait for session to load
    if (status === 'loading') return;
    
    // If authentication is required and user is not authenticated
    if (requireAuth && status === 'unauthenticated') {
      console.log('[ClientProtection] Authentication required, redirecting to home');
      router.replace('/');
      return;
    }
    
    // If specific roles are required
    if (allowedRoles.length > 0 && session?.user?.role) {
      if (!allowedRoles.includes(session.user.role)) {
        console.log('[ClientProtection] Role not allowed, redirecting');
        router.replace(redirectTo);
        return;
      }
    }
    
    // If user is a signed-in client and this page is not allowed for clients
    if (session?.user?.role === UserRole.CLIENT && !allowedForClients) {
      console.log('[ClientProtection] Client access not allowed, redirecting to dashboard');
      router.replace(redirectTo);
      return;
    }
  }, [session, status, router, allowedForClients, redirectTo, requireAuth, allowedRoles]);

  // Show loading while checking authentication
  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Block unauthenticated users from protected content
  if (requireAuth && status === 'unauthenticated') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Block users with wrong roles
  if (allowedRoles.length > 0 && session?.user?.role && !allowedRoles.includes(session.user.role)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Don't render children if user is a client trying to access restricted content
  if (session?.user?.role === UserRole.CLIENT && !allowedForClients) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return <>{children}</>;
}

// Helper component specifically for dashboard pages (requires authentication)
export function DashboardProtection({ children }: { children: React.ReactNode }) {
  return (
    <ClientProtection 
      requireAuth={true}
      allowedForClients={true}
      redirectTo="/"
      allowedRoles={[UserRole.CLIENT, UserRole.INTERPRETER, UserRole.ADMIN]}
    >
      {children}
    </ClientProtection>
  );
}

// Helper component for unauthenticated-only pages (like landing page)
export function UnauthenticatedOnlyProtection({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'loading') return;
    
    if (session?.user?.role === UserRole.CLIENT) {
      router.replace('/dashboard');
      return;
    }
  }, [session, status, router]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (session?.user?.role === UserRole.CLIENT) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return <>{children}</>;
}
