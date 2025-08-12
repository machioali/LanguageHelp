"use client";

import { useState } from "react";
import { signIn, getSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Shield, Eye, EyeOff, Lock, AlertTriangle, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function AdminSignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/admin/dashboard';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const result = await signIn("credentials", {
        email: email.toLowerCase(),
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("Invalid admin credentials. Please check your email and password.");
        setIsLoading(false);
        return;
      }

      if (result?.ok) {
        // Get the session to check user role and permissions
        const session = await getSession();
        
        if (!session?.user) {
          setError("Authentication failed. Please try again.");
          setIsLoading(false);
          return;
        }

        // Check if user has admin role
        if (session.user.role !== "ADMIN") {
          setError("Access denied. Admin privileges required.");
          setIsLoading(false);
          return;
        }

        // Additional security check for authorized admin email
        const AUTHORIZED_ADMIN_EMAIL = 'machio2024@hotmail.com';
        if (session.user.email !== AUTHORIZED_ADMIN_EMAIL) {
          setError("Unauthorized admin account. Access denied.");
          setIsLoading(false);
          return;
        }

        // Success - redirect to callback URL or admin dashboard
        console.log(`[Admin Auth] Successful admin login: ${session.user.email}`);
        console.log(`[Admin Auth] Redirecting to: ${callbackUrl}`);
        router.push(callbackUrl);
        router.refresh();
      }
    } catch (error) {
      console.error("Admin sign in error:", error);
      setError("An error occurred during sign in. Please try again.");
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-blue-950 dark:to-indigo-950 px-4">
      <div className="w-full max-w-md">
        {/* Back to regular sign in */}
        <div className="mb-6">
          <Link href="/auth/signin" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Regular Sign In
          </Link>
        </div>

        <Card className="border-2 border-blue-200 dark:border-blue-800 shadow-2xl">
          <CardHeader className="text-center pb-2">
            {/* Admin Shield Icon */}
            <div className="flex justify-center mb-4">
              <div className="p-4 bg-blue-100 dark:bg-blue-900/30 rounded-full border-2 border-blue-200 dark:border-blue-800">
                <Shield className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
            
            <CardTitle className="text-2xl font-bold text-blue-800 dark:text-blue-200">
              Admin Access
            </CardTitle>
            <CardDescription className="text-blue-600 dark:text-blue-400">
              Sign in with your administrator credentials
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Security Notice */}
            <div className="bg-amber-50 dark:bg-amber-950/20 p-4 rounded-lg border border-amber-200 dark:border-amber-800">
              <div className="flex items-start gap-3">
                <Lock className="h-5 w-5 text-amber-600 dark:text-amber-400 mt-0.5" />
                <div className="text-sm">
                  <p className="font-medium text-amber-800 dark:text-amber-200 mb-1">
                    Secure Admin Portal
                  </p>
                  <p className="text-amber-700 dark:text-amber-300">
                    This area is restricted to authorized administrators only.
                    All access attempts are monitored and logged.
                  </p>
                </div>
              </div>
            </div>

            {/* Error Alert */}
            {error && (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* Sign In Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">
                  Admin Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="h-11"
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium">
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="h-11 pr-10"
                    disabled={isLoading}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-2 top-1/2 -translate-y-1/2 h-7 w-7 p-0"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isLoading}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white font-medium"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Authenticating...
                  </>
                ) : (
                  <>
                    <Shield className="h-4 w-4 mr-2" />
                    Sign In to Admin Portal
                  </>
                )}
              </Button>
            </form>

            {/* Security Footer */}
            <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="bg-blue-50 dark:bg-blue-950/30 p-3 rounded-lg">
                <div className="flex items-center gap-2 text-blue-700 dark:text-blue-300 mb-2">
                  <Shield className="h-4 w-4" />
                  <span className="text-xs font-medium">SECURITY FEATURES</span>
                </div>
                <ul className="text-xs text-blue-600 dark:text-blue-400 space-y-1">
                  <li>• Role-based access control</li>
                  <li>• Multi-layer authentication</li>
                  <li>• Activity monitoring & logging</li>
                  <li>• Secure session management</li>
                </ul>
              </div>
            </div>

            {/* Support Notice */}
            <div className="text-center pt-2">
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Having trouble accessing your admin account?{" "}
                <span className="text-blue-600 dark:text-blue-400 font-medium">
                  Contact system administrator
                </span>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Additional Security Notice */}
        <div className="mt-6 text-center">
          <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-lg border">
            <p className="text-xs text-gray-600 dark:text-gray-400">
              🔒 This is a secure admin portal. All login attempts are monitored for security purposes.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
