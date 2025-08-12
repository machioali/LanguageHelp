"use client";

import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { UserRole } from '@/lib/constants';
import type { UserRoleType } from '@/lib/constants';

interface InterpreterProtectionProps {
  children: React.ReactNode;
  allowedForInterpreters?: boolean;
  redirectTo?: string;
  requireAuth?: boolean;
  allowedRoles?: UserRoleType[];
}

export function InterpreterProtection({ 
  children, 
  allowedForInterpreters = false,
  redirectTo = '/interpreter-portal',
  requireAuth = false,
  allowedRoles = []
}: InterpreterProtectionProps) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    console.log('[InterpreterProtection] Session status:', status);
    console.log('[InterpreterProtection] Session:', session);
    
    // Wait for session to load
    if (status === 'loading') return;
    
    // If authentication is required and user is not authenticated
    if (requireAuth && status === 'unauthenticated') {
      console.log('[InterpreterProtection] Authentication required, redirecting to interpreter portal');
      router.replace('/interpreter-portal');
      return;
    }
    
    // If specific roles are required
    if (allowedRoles.length > 0 && session?.user?.role) {
      if (!allowedRoles.includes(session.user.role)) {
        console.log('[InterpreterProtection] Role not allowed, redirecting');
        router.replace(redirectTo);
        return;
      }
    }
    
    // If user is a signed-in interpreter and this page is not allowed for interpreters
    if (session?.user?.role === UserRole.INTERPRETER && !allowedForInterpreters) {
      console.log('[InterpreterProtection] Interpreter access not allowed, redirecting to interpreter dashboard');
      router.replace(redirectTo);
      return;
    }
  }, [session, status, router, allowedForInterpreters, redirectTo, requireAuth, allowedRoles]);

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

  // Don't render children if user is an interpreter trying to access restricted content
  if (session?.user?.role === UserRole.INTERPRETER && !allowedForInterpreters) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return <>{children}</>;
}

// Helper component specifically for interpreter dashboard pages (requires authentication)
export function InterpreterDashboardProtection({ children }: { children: React.ReactNode }) {
  return (
    <InterpreterProtection 
      requireAuth={true}
      allowedForInterpreters={true}
      redirectTo="/auth/interpreter-signin"
      allowedRoles={[UserRole.INTERPRETER]}
    >
      {children}
    </InterpreterProtection>
  );
}

// Helper component for unauthenticated-only pages (like interpreter portal landing page)
export function InterpreterUnauthenticatedOnlyProtection({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'loading') return;
    
    if (session?.user?.role === UserRole.INTERPRETER) {
      router.replace('/interpreter-portal/interpreter');
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

  if (session?.user?.role === UserRole.INTERPRETER) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return <>{children}</>;
}
