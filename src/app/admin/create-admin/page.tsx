"use client";

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { AdminProtected } from "@/components/auth/AdminProtected";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { 
  User, 
  Shield, 
  CheckCircle,
  ArrowLeft,
  Copy,
  Eye,
  EyeOff,
  AlertTriangle
} from "lucide-react";
import Link from "next/link";

export default function CreateAdminPage() {
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    password: '',
    confirmPassword: '',
    generatePassword: false,
  });

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [showResult, setShowResult] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const generateRandomPassword = () => {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
    let password = '';
    
    // Ensure at least one of each type
    password += 'abcdefghijklmnopqrstuvwxyz'[Math.floor(Math.random() * 26)];
    password += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'[Math.floor(Math.random() * 26)];
    password += '0123456789'[Math.floor(Math.random() * 10)];
    password += '!@#$%^&*'[Math.floor(Math.random() * 8)];
    
    // Fill the rest
    for (let i = 4; i < 12; i++) {
      password += chars[Math.floor(Math.random() * chars.length)];
    }
    
    // Shuffle
    return password.split('').sort(() => Math.random() - 0.5).join('');
  };

  const handleGeneratePassword = () => {
    const newPassword = generateRandomPassword();
    setFormData({
      ...formData,
      password: newPassword,
      confirmPassword: newPassword,
      generatePassword: true
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validate required fields
      if (!formData.email || !formData.name || !formData.password) {
        alert('Please fill in all required fields');
        return;
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        alert('Please enter a valid email address');
        return;
      }

      // Validate password match
      if (formData.password !== formData.confirmPassword) {
        alert('Passwords do not match');
        return;
      }

      // Validate password strength
      if (formData.password.length < 8) {
        alert('Password must be at least 8 characters long');
        return;
      }

      // Create admin user
      const response = await fetch('/api/admin/users/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email.toLowerCase(),
          name: formData.name,
          password: formData.password,
          role: 'ADMIN'
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create admin user');
      }

      setResult({
        ...data,
        credentials: {
          email: formData.email,
          password: formData.password,
          loginUrl: `${window.location.origin}/auth/signin`,
          generatedPassword: formData.generatePassword
        }
      });
      setShowResult(true);

      // Reset form
      setFormData({
        email: '',
        name: '',
        password: '',
        confirmPassword: '',
        generatePassword: false,
      });

    } catch (error: any) {
      console.error('Error creating admin user:', error);
      alert(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const copyCredentials = () => {
    if (result?.credentials) {
      const text = `Admin Login Credentials for ${result.user.name}

Email: ${result.credentials.email}
Password: ${result.credentials.password}
Login URL: ${result.credentials.loginUrl}

${result.credentials.generatedPassword ? 
  'This password was automatically generated. Please share it securely with the admin user.' : 
  'Please share these credentials securely with the admin user.'
}`;
      
      navigator.clipboard.writeText(text);
      alert('Credentials copied to clipboard!');
    }
  };

  return (
    <AdminProtected>
      <div className="container mx-auto p-6 max-w-2xl">
      {/* Header */}
      <div className="mb-8">
        <Link href="/admin/dashboard" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Admin Dashboard
        </Link>
        <h1 className="text-3xl font-bold tracking-tight text-foreground mb-2">
          Create New Admin User
        </h1>
        <p className="text-muted-foreground">
          Add a new administrator to the platform with full admin privileges.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Admin Information
            </CardTitle>
            <CardDescription>
              Enter the basic information for the new admin user.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="email">Email Address *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                placeholder="admin@company.com"
                required
              />
            </div>
            <div>
              <Label htmlFor="name">Full Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                placeholder="John Doe"
                required
              />
            </div>
          </CardContent>
        </Card>

        {/* Password Configuration */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Password Configuration
            </CardTitle>
            <CardDescription>
              Set up the login password for the admin user.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-2 p-3 border rounded-lg bg-muted/50">
              <Button
                type="button"
                onClick={handleGeneratePassword}
                variant="outline"
                size="sm"
              >
                Generate Secure Password
              </Button>
              <span className="text-sm text-muted-foreground">
                Automatically creates a strong 12-character password
              </span>
            </div>

            <div>
              <Label htmlFor="password">Password *</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  placeholder="Enter a secure password"
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-2 top-1/2 -translate-y-1/2"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Password must be at least 8 characters long
              </p>
            </div>

            <div>
              <Label htmlFor="confirmPassword">Confirm Password *</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                  placeholder="Confirm the password"
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-2 top-1/2 -translate-y-1/2"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            {formData.password && formData.confirmPassword && formData.password !== formData.confirmPassword && (
              <div className="flex items-center gap-2 p-2 text-sm text-red-600 bg-red-50 dark:bg-red-950/20 rounded">
                <AlertTriangle className="h-4 w-4" />
                Passwords do not match
              </div>
            )}
          </CardContent>
        </Card>

        {/* Security Notice */}
        <Card className="border-orange-200 dark:border-orange-800">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <Shield className="h-5 w-5 text-orange-600 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium text-orange-800 dark:text-orange-200 mb-1">
                  Admin Privileges Notice
                </p>
                <p className="text-orange-700 dark:text-orange-300">
                  This user will have full administrative access to the platform, including the ability to:
                </p>
                <ul className="list-disc list-inside mt-1 text-orange-700 dark:text-orange-300 space-y-1">
                  <li>Create and manage interpreter accounts</li>
                  <li>Review and approve applications</li>
                  <li>Access admin dashboard and tools</li>
                  <li>Create other admin users</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Submit */}
        <div className="flex gap-4">
          <Button type="submit" disabled={loading} className="flex-1">
            {loading ? "Creating Admin User..." : "Create Admin User"}
          </Button>
          <Link href="/admin/dashboard">
            <Button type="button" variant="outline">
              Cancel
            </Button>
          </Link>
        </div>
      </form>

      {/* Success Dialog */}
      <Dialog open={showResult} onOpenChange={setShowResult}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              Admin User Created Successfully!
            </DialogTitle>
            <DialogDescription>
              The admin account has been created and is ready to use.
            </DialogDescription>
          </DialogHeader>

          {result && (
            <div className="space-y-4">
              <div className="p-4 bg-muted rounded-lg">
                <h4 className="font-semibold mb-2">Account Details</h4>
                <div className="text-sm space-y-1">
                  <p><strong>Name:</strong> {result.user.name}</p>
                  <p><strong>Email:</strong> {result.user.email}</p>
                  <p><strong>Role:</strong> {result.user.role}</p>
                  <p><strong>Created:</strong> {new Date(result.user.createdAt).toLocaleString()}</p>
                </div>
              </div>

              {result.credentials && (
                <div className="p-4 border rounded-lg bg-yellow-50 dark:bg-yellow-950/20">
                  <div className="flex justify-between items-center mb-3">
                    <h4 className="font-semibold">Login Credentials</h4>
                    <Button onClick={copyCredentials} size="sm" variant="outline">
                      <Copy className="h-4 w-4 mr-2" />
                      Copy All
                    </Button>
                  </div>
                  <div className="text-sm space-y-2 font-mono">
                    <p><strong>Email:</strong> {result.credentials.email}</p>
                    <p><strong>Password:</strong> {result.credentials.password}</p>
                    <p><strong>Login URL:</strong> {result.credentials.loginUrl}</p>
                  </div>
                  <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-950/20 rounded text-sm">
                    <p className="font-medium mb-2">Security Instructions:</p>
                    <ul className="list-disc list-inside space-y-1">
                      <li>Share these credentials securely with the admin user</li>
                      <li>Advise them to change their password after first login</li>
                      <li>Ensure they understand their admin responsibilities</li>
                      {result.credentials.generatedPassword && (
                        <li>This password was auto-generated - make sure to save it safely</li>
                      )}
                    </ul>
                  </div>
                </div>
              )}

              <div className="flex gap-2">
                <Button onClick={() => setShowResult(false)} className="flex-1">
                  Close
                </Button>
                <Button onClick={() => window.location.reload()} variant="outline">
                  Create Another
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
    </AdminProtected>
  );
}
