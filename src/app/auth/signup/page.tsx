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
import { LogIn, Globe, User, AlertCircle, CheckCircle } from 'lucide-react';

const SignUpPage = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const validatePassword = (password: string) => {
    const minLength = password.length >= 6;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    
    return {
      minLength,
      hasUpperCase,
      hasLowerCase,
      hasNumbers,
      isValid: minLength && hasUpperCase && hasLowerCase && hasNumbers
    };
  };

  const passwordValidation = validatePassword(password);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    // Client-side validation
    if (!name.trim()) {
      setError('Full name is required');
      setIsLoading(false);
      return;
    }

    if (!email.trim()) {
      setError('Email is required');
      setIsLoading(false);
      return;
    }

    if (!passwordValidation.isValid) {
      setError('Password must be at least 6 characters and contain uppercase, lowercase, and numbers');
      setIsLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    if (!agreedToTerms) {
      setError('Please agree to the Terms of Service and Privacy Policy');
      setIsLoading(false);
      return;
    }

    try {
      // Register user
      const registerResponse = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim().toLowerCase(),
          password,
          role: 'CLIENT'
        }),
      });

      const registerData = await registerResponse.json();

      if (!registerResponse.ok) {
        throw new Error(registerData.error || 'Registration failed');
      }

      setSuccess('Account created successfully! Signing you in...');

      // Automatically sign in the user after successful registration
      const signInResult = await signIn('credentials', {
        email: email.trim().toLowerCase(),
        password,
        redirect: false,
      });

      if (signInResult?.error) {
        throw new Error('Registration successful but sign-in failed. Please try signing in manually.');
      }

      // Redirect to dashboard
      router.push('/dashboard');
      
    } catch (err: any) {
      console.error('Registration error:', err);
      setError(err.message || 'Registration failed. Please try again.');
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
              <User className="h-8 w-8 text-primary" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-center">Create a Client Account</CardTitle>
          <CardDescription className="text-center">
            Sign up for a client account to book language services
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
          
          {success && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md mb-4" role="alert">
              <div className="flex items-center">
                <CheckCircle className="h-4 w-4 mr-2" />
                <span className="block sm:inline">{success}</span>
              </div>
            </div>
          )}

          <div className="text-center text-sm text-muted-foreground mb-4">
            <span>Looking to register as an interpreter? </span>
            <Link href="/contact" className="text-primary hover:text-primary/80 font-medium">
              Contact us
            </Link>
            <span> to apply.</span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="John Doe"
                required
                value={name}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                required
                value={email}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
              />
              {password.length > 0 && (
                <div className="text-xs space-y-1">
                  <div className={`flex items-center ${passwordValidation.minLength ? 'text-green-600' : 'text-gray-400'}`}>
                    <CheckCircle className={`h-3 w-3 mr-1 ${passwordValidation.minLength ? '' : 'opacity-30'}`} />
                    At least 6 characters
                  </div>
                  <div className={`flex items-center ${passwordValidation.hasUpperCase ? 'text-green-600' : 'text-gray-400'}`}>
                    <CheckCircle className={`h-3 w-3 mr-1 ${passwordValidation.hasUpperCase ? '' : 'opacity-30'}`} />
                    One uppercase letter
                  </div>
                  <div className={`flex items-center ${passwordValidation.hasLowerCase ? 'text-green-600' : 'text-gray-400'}`}>
                    <CheckCircle className={`h-3 w-3 mr-1 ${passwordValidation.hasLowerCase ? '' : 'opacity-30'}`} />
                    One lowercase letter
                  </div>
                  <div className={`flex items-center ${passwordValidation.hasNumbers ? 'text-green-600' : 'text-gray-400'}`}>
                    <CheckCircle className={`h-3 w-3 mr-1 ${passwordValidation.hasNumbers ? '' : 'opacity-30'}`} />
                    One number
                  </div>
                </div>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                required
                value={confirmPassword}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setConfirmPassword(e.target.value)}
              />
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="terms" 
                checked={agreedToTerms}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAgreedToTerms(e.target.checked)}
                required 
              />
              <Label htmlFor="terms" className="text-sm font-normal">
                I agree to the{' '}
                <Link href="/terms" className="text-primary hover:text-primary/80">
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link href="/privacy" className="text-primary hover:text-primary/80">
                  Privacy Policy
                </Link>
              </Label>
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
                  Creating account...
                </span>
              ) : (
                'Sign Up'
              )}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-center text-gray-600">
            Already have an account?{' '}
            <Link 
              href="/auth/signin" 
              className="text-primary hover:text-primary/80 font-medium"
            >
              Sign in
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default SignUpPage;