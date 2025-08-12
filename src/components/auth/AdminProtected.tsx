"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { UserRole } from "@/lib/constants";
import { Card, CardContent } from "@/components/ui/card";
import { Shield, AlertTriangle, Loader2 } from "lucide-react";

interface AdminProtectedProps {
  children: React.ReactNode;
}

export function AdminProtected({ children }: AdminProtectedProps) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isVerifying, setIsVerifying] = useState(true);
  const [authState, setAuthState] = useState<'loading' | 'authenticated' | 'unauthenticated' | 'unauthorized'>('loading');

  useEffect(() => {
    if (status === "loading") return; // Still loading

    // If not authenticated, redirect to admin sign in
    if (status === "unauthenticated" || !session) {
      console.log("[AdminProtected] Unauthenticated user, redirecting to admin sign in");
      setAuthState('unauthenticated');
      router.push("/auth/admin?callbackUrl=" + encodeURIComponent(window.location.pathname));
      return;
    }

    // If authenticated but not admin role, redirect to unauthorized
    if (session.user?.role !== UserRole.ADMIN) {
      console.log(`[AdminProtected] Non-admin user (${session.user?.role}) attempting admin access`);
      setAuthState('unauthorized');
      router.push("/unauthorized");
      return;
    }

    // Additional security: Check if this is the authorized admin email
    const AUTHORIZED_ADMIN_EMAIL = 'machio2024@hotmail.com';
    if (session.user?.email !== AUTHORIZED_ADMIN_EMAIL) {
      console.log(`[AdminProtected] Unauthorized admin email: ${session.user?.email}`);
      setAuthState('unauthorized');
      router.push("/unauthorized");
      return;
    }

    // All checks passed
    setAuthState('authenticated');
    setIsVerifying(false);
  }, [session, status, router]);

  // Single return with conditional rendering to avoid hooks violation
  return (
    <>
      {(status === "loading" || isVerifying || authState === 'loading') && (
        <div className="min-h-screen flex items-center justify-center bg-background">
          <Card className="w-96">
            <CardContent className="flex flex-col items-center justify-center p-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
              <h3 className="text-lg font-semibold mb-2">Verifying Access</h3>
              <p className="text-sm text-muted-foreground text-center">
                Checking your authentication and permissions...
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {authState === 'unauthorized' && (
        <div className="min-h-screen flex items-center justify-center bg-background">
          <Card className="w-96 border-red-200 dark:border-red-800">
            <CardContent className="flex flex-col items-center justify-center p-8">
              <AlertTriangle className="h-8 w-8 text-red-600 mb-4" />
              <h3 className="text-lg font-semibold mb-2">Access Denied</h3>
              <p className="text-sm text-muted-foreground text-center mb-4">
                You don't have permission to access this area. Redirecting...
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {authState === 'unauthenticated' && (
        <div className="min-h-screen flex items-center justify-center bg-background">
          <Card className="w-96">
            <CardContent className="flex flex-col items-center justify-center p-8">
              <Shield className="h-8 w-8 text-primary mb-4" />
              <h3 className="text-lg font-semibold mb-2">Authentication Required</h3>
              <p className="text-sm text-muted-foreground text-center">
                Redirecting to sign in...
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {authState === 'authenticated' && children}
    </>
  );
}
