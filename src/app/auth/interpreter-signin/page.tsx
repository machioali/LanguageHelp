'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signIn, getSession } from 'next-auth/react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { LogIn, Languages, AlertCircle } from 'lucide-react';

interface SignInData {
  email: string;
  password?: string;
  token?: string;
  newPassword?: string;
}

const InterpreterSignInPage = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [token, setToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isFirstLogin, setIsFirstLogin] = useState(false);
  const [requirePasswordChange, setRequirePasswordChange] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // Validate inputs
      if (!email) {
        setError('Email is required');
        return;
      }
      
      if (!password && !token && !requirePasswordChange) {
        setError('Password or login token is required');
        return;
      }

      if (requirePasswordChange) {
        if (!newPassword) {
          setError('New password is required');
          return;
        }
        if (newPassword !== confirmPassword) {
          setError('Passwords do not match');
          return;
        }
        if (newPassword.length < 8) {
          setError('Password must be at least 8 characters long');
          return;
        }
      }

      // Use the custom interpreter sign-in API endpoint
      const response = await fetch('/api/auth/interpreter-signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email.toLowerCase().trim(),
          password,
          token,
          newPassword: requirePasswordChange ? newPassword : undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Sign-in failed');
        return;
      }

      if (data.success) {
        // Check if password change is required
        if (data.requirePasswordChange) {
          setRequirePasswordChange(true);
          setIsFirstLogin(true);
          return;
        }

        // Use NextAuth signIn to establish session
        const result = await signIn('credentials', {
          email: email.toLowerCase().trim(),
          password: data.authPassword,
          redirect: false,
        });

        if (result?.error) {
          setError('Failed to establish session. Please try again.');
          return;
        }

        // Successful sign-in - redirect to interpreter portal
        router.push('/interpreter-portal/interpreter');
      } else {
        setError('Sign-in failed. Please try again.');
      }
      
    } catch (error: any) {
      console.error('Sign-in error:', error);
      setError(error.message || 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="max-w-md w-full">
        <CardHeader className="space-y-1">
          <div className="flex justify-center mb-4">
            <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded-full">
              <Languages className="h-8 w-8 text-green-600 dark:text-green-400" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-center text-green-800 dark:text-green-200">Interpreter Portal</CardTitle>
          <CardDescription className="text-center text-green-600 dark:text-green-400">
            Access your interpreter dashboard to manage sessions and availability
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-4" role="alert">
              <div className="flex items-start">
                <AlertCircle className="h-5 w-5 mt-0.5 mr-2 flex-shrink-0" />
                <span className="block sm:inline">{error}</span>
              </div>
            </div>
          )}

          {requirePasswordChange && (
            <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded-md mb-4" role="alert">
              <div className="flex items-start">
                <AlertCircle className="h-5 w-5 mt-0.5 mr-2 flex-shrink-0" />
                <span className="block sm:inline">
                  This is your first login. Please set a new password to continue.
                </span>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="interpreter@example.com"
                required
                value={email}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                disabled={requirePasswordChange}
              />
            </div>

            {!requirePasswordChange && (
              <>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Password</Label>
                    <Link 
                      href="/contact" 
                      className="text-sm text-primary hover:text-primary/80"
                    >
                      Need help?
                    </Link>
                  </div>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                  />
                </div>

                <div className="text-center text-sm text-muted-foreground">
                  <span>OR</span>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="token">Login Token</Label>
                  <Input
                    id="token"
                    type="text"
                    placeholder="Enter your login token (for first-time access)"
                    value={token}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setToken(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">
                    Use the login token provided by the administrator for first-time access
                  </p>
                </div>
              </>
            )}

            {requirePasswordChange && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="newPassword">New Password</Label>
                  <Input
                    id="newPassword"
                    type="password"
                    placeholder="Enter your new password (min 8 characters)"
                    required
                    value={newPassword}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewPassword(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="Confirm your new password"
                    required
                    value={confirmPassword}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setConfirmPassword(e.target.value)}
                  />
                </div>
              </>
            )}

            {!requirePasswordChange && (
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="remember" 
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <Label htmlFor="remember" className="text-sm font-normal">Remember me for 30 days</Label>
              </div>
            )}
            <Button 
              type="submit" 
              className="w-full" 
              disabled={isLoading || (!password && !token && !requirePasswordChange)}
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {requirePasswordChange ? 'Setting Password...' : 'Signing in...'}
                </span>
              ) : (
                <span className="flex items-center justify-center">
                  <LogIn className="mr-2 h-4 w-4" />
                  {requirePasswordChange ? 'Set Password & Continue' : 'Sign in to Dashboard'}
                </span>
              )}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <div className="text-sm text-center text-muted-foreground">
            <span>Only for registered interpreters. </span>
            <Link 
              href="/contact" 
              className="text-primary hover:text-primary/80 font-medium"
            >
              Contact us
            </Link>
            <span> to become an interpreter.</span>
          </div>
          <div className="text-sm text-center text-muted-foreground">
            <span>Are you a client? </span>
            <Link 
              href="/auth/signin" 
              className="text-primary hover:text-primary/80 font-medium"
            >
              Client sign-in
            </Link>
          </div>
          <div className="text-sm text-center text-muted-foreground">
            <span>Administrator access? </span>
            <Link 
              href="/auth/admin" 
              className="text-primary hover:text-primary/80 font-medium"
            >
              Admin sign-in
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default InterpreterSignInPage;