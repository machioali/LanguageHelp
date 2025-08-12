'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { LogIn, Globe, AlertCircle } from 'lucide-react';

const SignInPage = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    if (!email.trim() || !password.trim()) {
      setError('Please enter both email and password');
      setIsLoading(false);
      return;
    }

    try {
      const result = await signIn('credentials', {
        email: email.trim().toLowerCase(),
        password,
        redirect: false,
      });

      if (result?.error) {
        setError('Invalid email or password. Please try again.');
      } else if (result?.ok) {
        // Get session to check user role
        const response = await fetch('/api/auth/session');
        const session = await response.json();
        
        if (!session?.user) {
          setError('Authentication failed. Please try again.');
          return;
        }

        // Check if user is CLIENT role
        if (session.user.role !== 'CLIENT') {
          setError(`Access denied. This is for clients only. ${session.user.role === 'ADMIN' ? 'Use admin sign-in.' : session.user.role === 'INTERPRETER' ? 'Use interpreter sign-in.' : ''}`);
          return;
        }

        // Successful CLIENT sign-in
        router.push('/dashboard');
      }
    } catch (err) {
      console.error('Sign-in error:', err);
      setError('An error occurred during sign-in. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="max-w-md w-full">
        <CardHeader className="space-y-1">
          <div className="flex justify-center mb-4">
            <div className="bg-primary/10 p-3 rounded-full">
              <Globe className="h-8 w-8 text-primary" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-center">Client Sign In</CardTitle>
          <CardDescription className="text-center">
            Access your client dashboard to book and manage interpretation sessions
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-4" role="alert">
              <div className="flex items-center">
                <AlertCircle className="h-4 w-4 mr-2" />
                <span className="block sm:inline">{error}</span>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="client@example.com"
                required
                value={email}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link 
                  href="/auth/forgot-password" 
                  className="text-sm text-primary hover:text-primary/80"
                >
                  Forgot password?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
              />
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="remember" 
                checked={rememberMe}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setRememberMe(e.target.checked)}
              />
              <Label htmlFor="remember" className="text-sm font-normal">Remember me for 30 days</Label>
            </div>
            <Button 
              type="submit" 
              className="w-full" 
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Signing in...
                </span>
              ) : (
                <span className="flex items-center justify-center">
                  <LogIn className="mr-2 h-4 w-4" />
                  Sign in to Dashboard
                </span>
              )}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <div className="text-sm text-center text-muted-foreground">
            <span>New to LanguageHelp? </span>
            <Link 
              href="/auth/signup" 
              className="text-primary hover:text-primary/80 font-medium"
            >
              Start your 14-day free trial
            </Link>
          </div>
            <div className="text-sm text-center text-muted-foreground">
            <span>Are you an interpreter? </span>
            <Link 
              href="/auth/interpreter-signin" 
              className="text-primary hover:text-primary/80 font-medium"
            >
              Interpreter sign-in
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

export default SignInPage;