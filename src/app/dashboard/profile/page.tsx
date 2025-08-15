'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { toast } from '@/components/ui/use-toast';
import {
  User,
  Mail,
  Phone,
  Building,
  MapPin,
  Globe,
  Settings,
  Save,
  Camera
} from 'lucide-react';

interface ProfileData {
  client: {
    id: string;
    email: string;
    name: string;
    emailVerified: boolean;
  };
  profile: {
    firstName: string;
    lastName: string;
    phone?: string;
    phoneVerified: boolean;
    company?: string;
    jobTitle?: string;
    country?: string;
    timezone?: string;
    primaryLanguage: string;
    frequentLanguages: string[];
    preferredInterpreterGender?: string;
    preferredInterpreterRegion?: string;
    emailNotifications: boolean;
    smsNotifications: boolean;
    sessionReminders: boolean;
    marketingEmails: boolean;
  };
}

const countries = [
  'United States', 'Canada', 'United Kingdom', 'Australia', 'Germany', 'France', 'Spain', 'Italy', 'Japan', 'China', 'Brazil', 'Mexico', 'Other'
];

const timezones = [
  'America/New_York', 'America/Chicago', 'America/Denver', 'America/Los_Angeles',
  'Europe/London', 'Europe/Paris', 'Europe/Berlin', 'Asia/Tokyo', 'Asia/Shanghai',
  'Australia/Sydney', 'UTC'
];

const languages = [
  'English', 'Spanish', 'French', 'German', 'Italian', 'Portuguese', 'Chinese (Mandarin)',
  'Japanese', 'Korean', 'Arabic', 'Russian', 'Hindi', 'Dutch', 'Swedish', 'Other'
];

export default function ProfilePage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [data, setData] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<Partial<ProfileData['profile']>>({});

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch('/api/client/profile');
        const result = await response.json();
        
        if (result.success) {
          setData(result);
          setFormData(result.profile);
        }
      } catch (error) {
        console.error('Failed to fetch profile:', error);
        toast({
          title: 'Error',
          description: 'Failed to load profile data',
          variant: 'destructive'
        });
      } finally {
        setLoading(false);
      }
    };

    if (session) {
      fetchProfile();
    }
  }, [session]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await fetch('/api/client/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const result = await response.json();
      
      if (result.success) {
        setData(result);
        toast({
          title: 'Success',
          description: 'Profile updated successfully'
        });
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error('Failed to save profile:', error);
      toast({
        title: 'Error',
        description: 'Failed to update profile',
        variant: 'destructive'
      });
    } finally {
      setSaving(false);
    }
  };

  const updateField = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (loading) {
    return (
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="animate-pulse space-y-8">
          <div className="h-8 bg-gray-300 rounded w-1/4"></div>
          <div className="space-y-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-20 bg-gray-300 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="px-4 sm:px-6 lg:px-8">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-muted-foreground">Failed to load profile data.</p>
              <Button onClick={() => window.location.reload()} className="mt-4">
                Try Again
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden">
      {/* Decorative Background */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute left-[calc(50%-15rem)] top-10 -z-10 transform-gpu blur-3xl sm:left-[calc(50%-25rem)]" aria-hidden="true">
          <div className="aspect-[1108/632] w-[50rem] bg-gradient-to-r from-primary/20 to-secondary/20 opacity-20" style={{ clipPath: 'polygon(73.6% 51.7%, 91.7% 11.8%, 100% 46.4%, 97.4% 82.2%, 92.5% 84.9%, 75.7% 64%, 55.3% 47.5%, 46.5% 49.4%, 45% 62.9%, 50.3% 87.2%, 21.3% 64.1%, 0.1% 100%, 5.4% 51.1%, 21.4% 63.9%, 58.9% 0.2%, 73.6% 51.7%)' }} />
        </div>
      </div>

      <div className="px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto py-8">
        {/* Hero Header */}
        <section className="relative py-8 mb-8">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-4 flex justify-center">
              <div className="relative rounded-full px-4 py-2 text-sm leading-6 text-muted-foreground ring-1 ring-primary/10 hover:ring-primary/20 transition-all duration-300">
                Your profile settings
                <Link href="/dashboard" className="font-semibold text-primary ml-1">
                  <span className="absolute inset-0" aria-hidden="true" />
                  Back to dashboard <span aria-hidden="true">→</span>
                </Link>
              </div>
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Profile
              <span className="bg-gradient-to-r from-primary via-primary/80 to-secondary bg-clip-text text-transparent"> Settings</span>
            </h1>
            <p className="mt-4 text-lg leading-8 text-muted-foreground max-w-2xl mx-auto">
              Manage your personal information and preferences.
            </p>
          </div>
        </section>

      <div className="space-y-6">
        {/* Profile Header */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Profile Information
            </CardTitle>
            <CardDescription>
              Update your personal details and contact information.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Avatar Section */}
            <div className="flex items-center space-x-4">
              <Avatar className="h-20 w-20">
                <AvatarImage src={session?.user?.image || ''} alt={data.client.name} />
                <AvatarFallback className="text-lg">
                  {data.client.name?.[0] || 'U'}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="text-lg font-medium">{data.client.name}</h3>
                <p className="text-sm text-muted-foreground">{data.client.email}</p>
                <Button variant="outline" size="sm" className="mt-2">
                  <Camera className="h-4 w-4 mr-2" />
                  Change Photo
                </Button>
              </div>
            </div>

            <Separator />

            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  value={formData.firstName || ''}
                  onChange={(e) => updateField('firstName', e.target.value)}
                  placeholder="Enter your first name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  value={formData.lastName || ''}
                  onChange={(e) => updateField('lastName', e.target.value)}
                  placeholder="Enter your last name"
                />
              </div>
            </div>

            {/* Contact Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phone" className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  Phone Number
                </Label>
                <Input
                  id="phone"
                  value={formData.phone || ''}
                  onChange={(e) => updateField('phone', e.target.value)}
                  placeholder="Enter your phone number"
                />
                {data.profile.phoneVerified && (
                  <p className="text-xs text-green-600">✓ Verified</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  Email Address
                </Label>
                <Input
                  id="email"
                  value={data.client.email}
                  disabled
                  className="bg-gray-50 dark:bg-gray-800"
                />
                {data.client.emailVerified && (
                  <p className="text-xs text-green-600">✓ Verified</p>
                )}
              </div>
            </div>

            {/* Work Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="company" className="flex items-center gap-2">
                  <Building className="h-4 w-4" />
                  Company
                </Label>
                <Input
                  id="company"
                  value={formData.company || ''}
                  onChange={(e) => updateField('company', e.target.value)}
                  placeholder="Enter your company name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="jobTitle">Job Title</Label>
                <Input
                  id="jobTitle"
                  value={formData.jobTitle || ''}
                  onChange={(e) => updateField('jobTitle', e.target.value)}
                  placeholder="Enter your job title"
                />
              </div>
            </div>

            {/* Location & Timezone */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="country" className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Country
                </Label>
                <Select
                  value={formData.country || ''}
                  onValueChange={(value) => updateField('country', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select your country" />
                  </SelectTrigger>
                  <SelectContent>
                    {countries.map((country) => (
                      <SelectItem key={country} value={country}>
                        {country}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="timezone" className="flex items-center gap-2">
                  <Globe className="h-4 w-4" />
                  Timezone
                </Label>
                <Select
                  value={formData.timezone || ''}
                  onValueChange={(value) => updateField('timezone', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select your timezone" />
                  </SelectTrigger>
                  <SelectContent>
                    {timezones.map((tz) => (
                      <SelectItem key={tz} value={tz}>
                        {tz}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Language Preferences */}
        <Card>
          <CardHeader>
            <CardTitle>Language Preferences</CardTitle>
            <CardDescription>
              Set your language preferences for interpretation services.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="primaryLanguage">Primary Language</Label>
              <Select
                value={formData.primaryLanguage || 'English'}
                onValueChange={(value) => updateField('primaryLanguage', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select your primary language" />
                </SelectTrigger>
                <SelectContent>
                  {languages.map((lang) => (
                    <SelectItem key={lang} value={lang}>
                      {lang}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Interpreter Preferences */}
        <Card>
          <CardHeader>
            <CardTitle>Interpreter Preferences</CardTitle>
            <CardDescription>
              Set your preferences for interpreter selection.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="preferredGender">Preferred Gender</Label>
                <Select
                  value={formData.preferredInterpreterGender || 'Any'}
                  onValueChange={(value) => updateField('preferredInterpreterGender', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select preference" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Any">No Preference</SelectItem>
                    <SelectItem value="Male">Male</SelectItem>
                    <SelectItem value="Female">Female</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="preferredRegion">Preferred Region</Label>
                <Select
                  value={formData.preferredInterpreterRegion || 'Any'}
                  onValueChange={(value) => updateField('preferredInterpreterRegion', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select preference" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Any">No Preference</SelectItem>
                    <SelectItem value="North America">North America</SelectItem>
                    <SelectItem value="Europe">Europe</SelectItem>
                    <SelectItem value="Asia">Asia</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Notification Preferences */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Notification Preferences
            </CardTitle>
            <CardDescription>
              Choose how you want to receive notifications.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-base">Email Notifications</Label>
                <p className="text-sm text-muted-foreground">
                  Receive email updates about your sessions
                </p>
              </div>
              <Switch
                checked={formData.emailNotifications ?? true}
                onCheckedChange={(checked) => updateField('emailNotifications', checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-base">SMS Notifications</Label>
                <p className="text-sm text-muted-foreground">
                  Receive text message updates
                </p>
              </div>
              <Switch
                checked={formData.smsNotifications ?? false}
                onCheckedChange={(checked) => updateField('smsNotifications', checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-base">Session Reminders</Label>
                <p className="text-sm text-muted-foreground">
                  Get reminders before scheduled sessions
                </p>
              </div>
              <Switch
                checked={formData.sessionReminders ?? true}
                onCheckedChange={(checked) => updateField('sessionReminders', checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-base">Marketing Emails</Label>
                <p className="text-sm text-muted-foreground">
                  Receive updates about new features and offers
                </p>
              </div>
              <Switch
                checked={formData.marketingEmails ?? false}
                onCheckedChange={(checked) => updateField('marketingEmails', checked)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Save Button */}
        <div className="flex justify-end">
          <Button onClick={handleSave} disabled={saving} className="min-w-32">
            {saving ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </>
            )}
          </Button>
        </div>
      </div>
      </div>
    </div>
  );
}
