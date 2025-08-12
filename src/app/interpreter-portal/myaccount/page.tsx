'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { InterpreterDashboardProtection } from '@/components/interpreter-protection';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import toast from 'react-hot-toast';
import { 
  User, 
  Globe, 
  Award, 
  Settings, 
  Bell, 
  Shield, 
  Calendar, 
  DollarSign, 
  Star, 
  Clock, 
  Phone, 
  Video,
  CheckCircle,
  Eye,
  EyeOff,
  CircleDot,
  TrendingUp,
  Languages,
  FileText,
  Briefcase,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { useRouter } from 'next/navigation';

interface InterpreterProfile {
  id: string;
  firstName: string;
  lastName: string;
  phone?: string;
  hourlyRate?: number;
  bio?: string;
  experience?: number;
  status: string;
  isVerified: boolean;
  availability?: string;
  languages: {
    languageCode: string;
    languageName: string;
    proficiency: string;
    isNative: boolean;
  }[];
  specializations: string[];
  certifications: {
    name: string;
    issuingOrganization: string;
    issueDate?: string;
    expiryDate?: string;
    certificateNumber?: string;
    isVerified: boolean;
  }[];
}

interface InterpreterData {
  interpreter: {
    id: string;
    email: string;
    name: string;
    role: string;
  };
  profile: InterpreterProfile;
  credentials: {
    isFirstLogin: boolean;
    lastLoginAt?: Date;
  };
  stats: {
    today: { sessions: number; hours: number; earnings: number };
    thisWeek: { sessions: number; hours: number; earnings: number };
    thisMonth: { sessions: number; hours: number; earnings: number };
    rating: number;
    totalSessions: number;
    completionRate: number;
  };
}

export default function MyAccountPage() {
  return (
    <InterpreterDashboardProtection>
      <MyAccountContent />
    </InterpreterDashboardProtection>
  );
}

function MyAccountContent() {
  const router = useRouter();
  const [interpreterData, setInterpreterData] = useState<InterpreterData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  
  // UI State - Remove editing capabilities
  const [currentStatus, setCurrentStatus] = useState<'available' | 'busy' | 'break' | 'offline'>('available');
  
  // Communication Preferences State
  const [vriCallsEnabled, setVriCallsEnabled] = useState(true);
  const [opiCallsEnabled, setOpiCallsEnabled] = useState(true);
  const [smsAlertsEnabled, setSmsAlertsEnabled] = useState(true);
  
  // Password Change State
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');
  
  // Profile Edit State
  const [editedProfile, setEditedProfile] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    bio: '',
    hourlyRate: 0,
    experience: 0
  });

  // Fetch interpreter data on component mount
  useEffect(() => {
    const fetchInterpreterData = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/interpreter/profile', {
          method: 'GET',
          credentials: 'include',
        });

        const data = await response.json();

        if (!response.ok) {
          if (response.status === 401) {
            router.push('/auth/interpreter-signin');
            return;
          }
          throw new Error(data.error || 'Failed to fetch profile');
        }

        if (data.success) {
          setInterpreterData(data);
          // Initialize edited profile with current data
          const profile = data.profile;
          setEditedProfile({
            firstName: profile.firstName || '',
            lastName: profile.lastName || '',
            email: data.interpreter.email || '',
            phone: profile.phone || '',
            bio: profile.bio || '',
            hourlyRate: profile.hourlyRate || 0,
            experience: profile.experience || 0
          });
        } else {
          throw new Error('Failed to load interpreter data');
        }
      } catch (error: any) {
        console.error('Error fetching interpreter data:', error);
        setError(error.message || 'Failed to load interpreter data');
      } finally {
        setLoading(false);
      }
    };

    fetchInterpreterData();
  }, [router]);

  const handlePasswordChange = async () => {
    if (!passwordForm.currentPassword || !passwordForm.newPassword) {
      setPasswordError('Please fill in all password fields');
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError('New passwords do not match');
      return;
    }

    if (passwordForm.newPassword.length < 8) {
      setPasswordError('New password must be at least 8 characters long');
      return;
    }

    try {
      setSaving(true);
      setPasswordError('');
      
      const response = await fetch('/api/interpreter/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to change password');
      }

      setPasswordSuccess('Password changed successfully!');
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setTimeout(() => {
        setShowPasswordModal(false);
        setPasswordSuccess('');
      }, 2000);

    } catch (error: any) {
      setPasswordError(error.message || 'Failed to change password');
    } finally {
      setSaving(false);
    }
  };

  // Communication preferences handlers
  const handleVriCallsToggle = (checked: boolean) => {
    console.log('VRI Calls toggle clicked, new value:', checked);
    setVriCallsEnabled(checked);
    toast.success(`VRI Calls ${checked ? 'enabled' : 'disabled'}`);
  };

  const handleOpiCallsToggle = (checked: boolean) => {
    console.log('OPI Calls toggle clicked, new value:', checked);
    setOpiCallsEnabled(checked);
    toast.success(`OPI Calls ${checked ? 'enabled' : 'disabled'}`);
  };

  const handleSmsAlertsToggle = (checked: boolean) => {
    console.log('SMS Alerts toggle clicked, new value:', checked);
    setSmsAlertsEnabled(checked);
    toast.success(`SMS Alerts ${checked ? 'enabled' : 'disabled'}`);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'text-green-500';
      case 'busy': return 'text-red-500'; 
      case 'break': return 'text-yellow-500';
      case 'offline': return 'text-gray-500';
      default: return 'text-gray-500';
    }
  };

  const getStatusBgColor = (status: string) => {
    switch (status) {
      case 'available': return 'bg-green-500';
      case 'busy': return 'bg-red-500';
      case 'break': return 'bg-yellow-500'; 
      case 'offline': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  // Show loading state
  if (loading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-center py-12">
            <div className="text-center space-y-4">
              <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
              <p className="text-muted-foreground">Loading your account information...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-center py-12">
            <div className="text-center space-y-4">
              <AlertCircle className="h-8 w-8 text-red-500 mx-auto" />
              <p className="text-red-600 font-medium">Error loading account</p>
              <p className="text-muted-foreground">{error}</p>
              <Button onClick={() => window.location.reload()} variant="outline">
                Try Again
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!interpreterData) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-center py-12">
            <div className="text-center space-y-4">
              <AlertCircle className="h-8 w-8 text-yellow-500 mx-auto" />
              <p className="text-yellow-600 font-medium">No account data found</p>
              <p className="text-muted-foreground">Please try signing in again</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const { interpreter, profile, stats } = interpreterData;
  const displayName = `${profile.firstName} ${profile.lastName}`;
  const interpreterIdDisplay = `INT-${profile.id.slice(-6).toUpperCase()}`;

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header with Status */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                <User className="h-8 w-8 text-primary" />
              </div>
              <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-background ${getStatusBgColor(currentStatus)}`}></div>
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">{displayName}</h1>
              <p className="text-muted-foreground">Interpreter ID: {interpreterIdDisplay}</p>
              <div className="flex items-center gap-2 mt-1">
                <CircleDot className={`h-4 w-4 ${getStatusColor(currentStatus)}`} />
                <span className="text-sm font-medium capitalize">{currentStatus}</span>
                <Badge 
                  variant={profile.status === 'ACTIVE' ? 'default' : 'secondary'}
                  className={`ml-2 ${profile.status === 'ACTIVE' ? 'bg-green-600' : ''}`}
                >
                  {profile.status}
                </Badge>
                {profile.isVerified && (
                  <Badge variant="outline" className="ml-1">
                    ✓ Verified
                  </Badge>
                )}
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <Button onClick={() => router.push('/interpreter-portal/interpreter')}>
              Go to Dashboard
            </Button>
          </div>
        </div>

        {/* Status & Performance Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 p-2 rounded-full">
                  <Star className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.rating || 'N/A'}</p>
                  <p className="text-xs text-muted-foreground">Rating ({stats.totalSessions} sessions)</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="bg-green-500/10 p-2 rounded-full">
                  <DollarSign className="h-5 w-5 text-green-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">${stats.thisMonth.earnings || 0}</p>
                  <p className="text-xs text-muted-foreground">This month</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="bg-blue-500/10 p-2 rounded-full">
                  <Clock className="h-5 w-5 text-blue-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.thisMonth.hours || 0}</p>
                  <p className="text-xs text-muted-foreground">Hours worked</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="bg-orange-500/10 p-2 rounded-full">
                  <TrendingUp className="h-5 w-5 text-orange-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.completionRate || 0}%</p>
                  <p className="text-xs text-muted-foreground">Completion rate</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Professional Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5 text-primary" />
                  Professional Profile
                </CardTitle>
                <CardDescription>Your interpreter identity and credentials</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      value={profile.firstName}
                      disabled
                      className="bg-muted/50 text-muted-foreground"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      value={profile.lastName}
                      disabled
                      className="bg-muted/50 text-muted-foreground"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      value={interpreter.email}
                      disabled
                      className="bg-muted/50 text-muted-foreground"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      value={profile.phone || 'Not provided'}
                      disabled
                      className="bg-muted/50 text-muted-foreground"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="hourlyRate">Hourly Rate ($)</Label>
                    <Input
                      id="hourlyRate"
                      type="number"
                      value={profile.hourlyRate || 0}
                      disabled
                      className="bg-muted/50 text-muted-foreground"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="experience">Years of Experience</Label>
                    <Input
                      id="experience"
                      type="number"
                      value={profile.experience || 0}
                      disabled
                      className="bg-muted/50 text-muted-foreground"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bio">Professional Bio</Label>
                  <Textarea
                    id="bio"
                    value={profile.bio || 'No bio provided'}
                    disabled
                    className="min-h-[80px] bg-muted/50 text-muted-foreground"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Language Expertise */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Languages className="h-5 w-5 text-primary" />
                  Language Expertise
                </CardTitle>
                <CardDescription>Your certified language pairs and proficiency</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  {profile.languages.length > 0 ? (
                    profile.languages.map((lang, index) => (
                      <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                        <div className="flex items-center gap-3">
                          <Globe className="h-5 w-5 text-primary" />
                          <div>
                            <p className="font-medium">{lang.languageName}</p>
                            <p className="text-sm text-muted-foreground">
                              {lang.proficiency} {lang.isNative && '(Native)'}
                            </p>
                          </div>
                        </div>
                        <Badge className={lang.isNative ? "bg-green-100 text-green-800" : "bg-blue-100 text-blue-800"}>
                          {lang.isNative ? 'Native' : 'Certified'}
                        </Badge>
                      </div>
                    ))
                  ) : (
                    <p className="text-muted-foreground text-center py-4">No languages configured</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Certifications & Documents */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5 text-primary" />
                  Certifications & Documents
                </CardTitle>
                <CardDescription>Your professional credentials and uploaded documents</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  {profile.certifications.length > 0 ? (
                    profile.certifications.map((cert, index) => (
                      <div key={index} className="flex items-center justify-between p-3 rounded-lg border">
                        <div className="flex items-center gap-3">
                          <FileText className="h-5 w-5 text-primary" />
                          <div>
                            <p className="font-medium">{cert.name}</p>
                            <p className="text-sm text-muted-foreground">{cert.issuingOrganization}</p>
                          </div>
                        </div>
                        <Badge className={cert.isVerified ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}>
                          {cert.isVerified ? 'Verified' : 'Pending'}
                        </Badge>
                      </div>
                    ))
                  ) : (
                    <p className="text-muted-foreground text-center py-4">No certifications uploaded</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Specializations */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Briefcase className="h-5 w-5 text-primary" />
                  Specializations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {profile.specializations.length > 0 ? (
                    profile.specializations.map((spec, index) => (
                      <div key={index} className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium">
                        {spec}
                      </div>
                    ))
                  ) : (
                    <p className="text-muted-foreground text-sm">No specializations configured</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Communication Preferences */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5 text-primary" />
                  Communication
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Video className="h-4 w-4" />
                      <Label>VRI Calls</Label>
                    </div>
                    <Switch 
                      checked={vriCallsEnabled} 
                      onCheckedChange={handleVriCallsToggle}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      <Label>OPI Calls</Label>
                    </div>
                    <Switch 
                      checked={opiCallsEnabled} 
                      onCheckedChange={handleOpiCallsToggle}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Bell className="h-4 w-4" />
                      <Label>SMS Alerts</Label>
                    </div>
                    <Switch 
                      checked={smsAlertsEnabled} 
                      onCheckedChange={handleSmsAlertsToggle}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Security Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              Security & Account
            </CardTitle>
            <CardDescription>Manage your account security and privacy settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 border rounded-lg bg-muted/10">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Password</p>
                    <p className="text-sm text-muted-foreground">
                      Last changed {interpreterData.credentials.lastLoginAt 
                        ? new Date(interpreterData.credentials.lastLoginAt).toLocaleDateString()
                        : 'Never'
                      }
                    </p>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setShowPasswordModal(true)}
                  >
                    Change
                  </Button>
                </div>
              </div>
              <div className="p-4 border rounded-lg bg-muted/10">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Two-Factor Auth</p>
                    <p className="text-sm text-muted-foreground">Not enabled</p>
                  </div>
                  <Button variant="outline" size="sm">
                    Enable
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Password Change Modal */}
        {showPasswordModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <Card className="w-full max-w-md mx-4">
              <CardHeader>
                <CardTitle>Change Password</CardTitle>
                <CardDescription>Enter your current password and choose a new one</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {passwordError && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
                    <div className="flex items-center gap-2">
                      <AlertCircle className="h-4 w-4" />
                      <span className="text-sm">{passwordError}</span>
                    </div>
                  </div>
                )}
                {passwordSuccess && (
                  <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4" />
                      <span className="text-sm">{passwordSuccess}</span>
                    </div>
                  </div>
                )}
                
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Current Password</Label>
                  <div className="relative">
                    <Input
                      id="currentPassword"
                      type={showCurrentPassword ? "text" : "password"}
                      value={passwordForm.currentPassword}
                      onChange={(e) => setPasswordForm(prev => ({ ...prev, currentPassword: e.target.value }))}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    >
                      {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="newPassword">New Password</Label>
                  <div className="relative">
                    <Input
                      id="newPassword"
                      type={showNewPassword ? "text" : "password"}
                      value={passwordForm.newPassword}
                      onChange={(e) => setPasswordForm(prev => ({ ...prev, newPassword: e.target.value }))}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                    >
                      {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      value={passwordForm.confirmPassword}
                      onChange={(e) => setPasswordForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>

                <div className="flex gap-2 pt-4">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowPasswordModal(false);
                      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
                      setPasswordError('');
                      setPasswordSuccess('');
                    }}
                    disabled={saving}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handlePasswordChange}
                    disabled={saving}
                    className="flex-1"
                  >
                    {saving ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        Changing...
                      </>
                    ) : (
                      'Change Password'
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

      </div>
    </div>
  );
}
