"use client";

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { AdminProtected } from "@/components/auth/AdminProtected";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { 
  Plus, 
  Trash2, 
  User, 
  Languages, 
  Building, 
  Award, 
  CheckCircle,
  ArrowLeft,
  Copy
} from "lucide-react";
import Link from "next/link";

interface Language {
  languageCode: string;
  languageName: string;
  proficiency: string;
  isNative: boolean;
}

interface Certification {
  name: string;
  issuingOrganization: string;
  issueDate: string;
  expiryDate: string;
  certificateNumber: string;
  isVerified: boolean;
}

const PROFICIENCY_LEVELS = ['NATIVE', 'FLUENT', 'ADVANCED', 'INTERMEDIATE', 'BASIC'];
const SPECIALIZATIONS = [
  'HEALTHCARE', 'LEGAL', 'BUSINESS', 'EDUCATION', 'GOVERNMENT',
  'TECHNICAL', 'CONFERENCE', 'EMERGENCY', 'GENERAL'
];

export default function CreateInterpreterPage() {
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    phone: '',
    hourlyRate: '',
    bio: '',
    experience: '',
    sendCredentials: true,
    autoApprove: false,
  });

  const [languages, setLanguages] = useState<Language[]>([]);
  const [selectedSpecializations, setSelectedSpecializations] = useState<string[]>([]);
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [showResult, setShowResult] = useState(false);

  const addLanguage = () => {
    setLanguages([...languages, {
      languageCode: '',
      languageName: '',
      proficiency: 'FLUENT',
      isNative: false
    }]);
  };

  const removeLanguage = (index: number) => {
    setLanguages(languages.filter((_, i) => i !== index));
  };

  const updateLanguage = (index: number, field: keyof Language, value: any) => {
    const updated = [...languages];
    updated[index] = { ...updated[index], [field]: value };
    setLanguages(updated);
  };

  const addCertification = () => {
    setCertifications([...certifications, {
      name: '',
      issuingOrganization: '',
      issueDate: '',
      expiryDate: '',
      certificateNumber: '',
      isVerified: false
    }]);
  };

  const removeCertification = (index: number) => {
    setCertifications(certifications.filter((_, i) => i !== index));
  };

  const updateCertification = (index: number, field: keyof Certification, value: any) => {
    const updated = [...certifications];
    updated[index] = { ...updated[index], [field]: value };
    setCertifications(updated);
  };

  const toggleSpecialization = (spec: string) => {
    if (selectedSpecializations.includes(spec)) {
      setSelectedSpecializations(selectedSpecializations.filter(s => s !== spec));
    } else {
      setSelectedSpecializations([...selectedSpecializations, spec]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validate required fields
      if (!formData.email || !formData.firstName || !formData.lastName) {
        alert('Please fill in all required fields');
        return;
      }

      if (languages.length === 0) {
        alert('Please add at least one language');
        return;
      }

      if (selectedSpecializations.length === 0) {
        alert('Please select at least one specialization');
        return;
      }

      // Prepare data for API
      const interpreterData = {
        email: formData.email.toLowerCase(),
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone || undefined,
        languages: languages.filter(lang => lang.languageCode && lang.languageName),
        specializations: selectedSpecializations,
        hourlyRate: formData.hourlyRate ? parseFloat(formData.hourlyRate) : undefined,
        bio: formData.bio || undefined,
        experience: formData.experience ? parseInt(formData.experience) : undefined,
        certifications: certifications.filter(cert => cert.name && cert.issuingOrganization),
        sendCredentials: formData.sendCredentials,
        autoApprove: formData.autoApprove,
      };

      const response = await fetch('/api/admin/interpreters/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(interpreterData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create interpreter');
      }

      setResult(data);
      setShowResult(true);

      // Reset form
      setFormData({
        email: '',
        firstName: '',
        lastName: '',
        phone: '',
        hourlyRate: '',
        bio: '',
        experience: '',
        sendCredentials: true,
        autoApprove: false,
      });
      setLanguages([]);
      setSelectedSpecializations([]);
      setCertifications([]);

    } catch (error: any) {
      console.error('Error creating interpreter:', error);
      alert(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const copyCredentials = () => {
    if (result?.credentials) {
      const text = `Login Credentials for ${result.interpreter.firstName} ${result.interpreter.lastName}

Email: ${result.interpreter.email}
Login URL: ${result.credentials.loginUrl}
Temporary Password: ${result.credentials.tempPassword}
Login Token: ${result.credentials.loginToken}
Token Expires: ${new Date(result.credentials.tokenExpiry).toLocaleString()}

Instructions:
${result.credentials.instructions.map((inst: string, i: number) => `${i + 1}. ${inst}`).join('\n')}`;
      
      navigator.clipboard.writeText(text);
      alert('Credentials copied to clipboard!');
    }
  };

  return (
    <AdminProtected>
      <div className="container mx-auto p-6 max-w-4xl">
      {/* Header */}
      <div className="mb-8">
        <Link href="/admin/dashboard" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Admin Dashboard
        </Link>
        <h1 className="text-3xl font-bold tracking-tight text-foreground mb-2">
          Create New Interpreter
        </h1>
        <p className="text-muted-foreground">
          Add a new interpreter to the platform with their profile and credentials.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Basic Information
            </CardTitle>
            <CardDescription>
              Enter the interpreter's personal and contact information.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  required
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName">First Name *</Label>
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                  required
                />
              </div>
              <div>
                <Label htmlFor="lastName">Last Name *</Label>
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                  required
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Languages */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Languages className="h-5 w-5" />
              Languages
            </CardTitle>
            <CardDescription>
              Add the languages this interpreter can work with.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {languages.map((lang, index) => (
              <div key={index} className="p-4 border rounded-lg space-y-3">
                <div className="flex justify-between items-center">
                  <h4 className="font-medium">Language {index + 1}</h4>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeLanguage(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                  <div>
                    <Label>Language Code</Label>
                    <Input
                      placeholder="e.g., en, es"
                      value={lang.languageCode}
                      onChange={(e) => updateLanguage(index, 'languageCode', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label>Language Name</Label>
                    <Input
                      placeholder="e.g., English, Spanish"
                      value={lang.languageName}
                      onChange={(e) => updateLanguage(index, 'languageName', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label>Proficiency</Label>
                    <Select
                      value={lang.proficiency}
                      onValueChange={(value) => updateLanguage(index, 'proficiency', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {PROFICIENCY_LEVELS.map((level) => (
                          <SelectItem key={level} value={level}>
                            {level}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center space-x-2 pt-6">
                    <Checkbox
                      id={`native-${index}`}
                      checked={lang.isNative}
                      onCheckedChange={(checked) => updateLanguage(index, 'isNative', checked === true)}
                    />
                    <Label htmlFor={`native-${index}`}>Native speaker</Label>
                  </div>
                </div>
              </div>
            ))}
            <Button type="button" variant="outline" onClick={addLanguage}>
              <Plus className="h-4 w-4 mr-2" />
              Add Language
            </Button>
          </CardContent>
        </Card>

        {/* Specializations */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building className="h-5 w-5" />
              Specializations
            </CardTitle>
            <CardDescription>
              Select the areas of expertise for this interpreter.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {SPECIALIZATIONS.map((spec) => (
                <div
                  key={spec}
                  className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                    selectedSpecializations.includes(spec)
                      ? 'border-primary bg-primary/10'
                      : 'border-border hover:border-primary/50'
                  }`}
                  onClick={() => toggleSpecialization(spec)}
                >
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      checked={selectedSpecializations.includes(spec)}
                      onCheckedChange={() => {}} // Handled by div onClick
                    />
                    <Label className="cursor-pointer">{spec}</Label>
                  </div>
                </div>
              ))}
            </div>
            {selectedSpecializations.length > 0 && (
              <div className="mt-4">
                <Label>Selected Specializations:</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {selectedSpecializations.map((spec) => (
                    <Badge key={spec} variant="secondary">
                      {spec}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Professional Information */}
        <Card>
          <CardHeader>
            <CardTitle>Professional Information</CardTitle>
            <CardDescription>
              Optional professional details and experience.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="hourlyRate">Hourly Rate ($)</Label>
                <Input
                  id="hourlyRate"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.hourlyRate}
                  onChange={(e) => setFormData({...formData, hourlyRate: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="experience">Years of Experience</Label>
                <Input
                  id="experience"
                  type="number"
                  min="0"
                  value={formData.experience}
                  onChange={(e) => setFormData({...formData, experience: e.target.value})}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="bio">Bio/Description</Label>
              <Textarea
                id="bio"
                placeholder="Brief professional biography..."
                value={formData.bio}
                onChange={(e) => setFormData({...formData, bio: e.target.value})}
              />
            </div>
          </CardContent>
        </Card>

        {/* Certifications */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5" />
              Certifications
            </CardTitle>
            <CardDescription>
              Add any professional certifications (optional).
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {certifications.map((cert, index) => (
              <div key={index} className="p-4 border rounded-lg space-y-3">
                <div className="flex justify-between items-center">
                  <h4 className="font-medium">Certification {index + 1}</h4>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeCertification(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <Label>Certificate Name</Label>
                    <Input
                      value={cert.name}
                      onChange={(e) => updateCertification(index, 'name', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label>Issuing Organization</Label>
                    <Input
                      value={cert.issuingOrganization}
                      onChange={(e) => updateCertification(index, 'issuingOrganization', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label>Certificate Number</Label>
                    <Input
                      value={cert.certificateNumber}
                      onChange={(e) => updateCertification(index, 'certificateNumber', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label>Issue Date</Label>
                    <Input
                      type="date"
                      value={cert.issueDate}
                      onChange={(e) => updateCertification(index, 'issueDate', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label>Expiry Date</Label>
                    <Input
                      type="date"
                      value={cert.expiryDate}
                      onChange={(e) => updateCertification(index, 'expiryDate', e.target.value)}
                    />
                  </div>
                  <div className="flex items-center space-x-2 pt-6">
                    <Checkbox
                      id={`verified-${index}`}
                      checked={cert.isVerified}
                      onCheckedChange={(checked) => updateCertification(index, 'isVerified', checked === true)}
                    />
                    <Label htmlFor={`verified-${index}`}>Verified</Label>
                  </div>
                </div>
              </div>
            ))}
            <Button type="button" variant="outline" onClick={addCertification}>
              <Plus className="h-4 w-4 mr-2" />
              Add Certification
            </Button>
          </CardContent>
        </Card>

        {/* Options */}
        <Card>
          <CardHeader>
            <CardTitle>Creation Options</CardTitle>
            <CardDescription>
              Configure how the interpreter account will be created.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="sendCredentials"
                checked={formData.sendCredentials}
                onCheckedChange={(checked) => setFormData({...formData, sendCredentials: checked === true})}
              />
              <Label htmlFor="sendCredentials">Include login credentials in response</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="autoApprove"
                checked={formData.autoApprove}
                onCheckedChange={(checked) => setFormData({...formData, autoApprove: checked === true})}
              />
              <Label htmlFor="autoApprove">Auto-approve this interpreter</Label>
            </div>
          </CardContent>
        </Card>

        {/* Submit */}
        <div className="flex gap-4">
          <Button type="submit" disabled={loading} className="flex-1">
            {loading ? "Creating..." : "Create Interpreter"}
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
              Interpreter Created Successfully!
            </DialogTitle>
            <DialogDescription>
              The interpreter account has been created and is ready to use.
            </DialogDescription>
          </DialogHeader>

          {result && (
            <div className="space-y-4">
              <div className="p-4 bg-muted rounded-lg">
                <h4 className="font-semibold mb-2">Account Details</h4>
                <div className="text-sm space-y-1">
                  <p><strong>Name:</strong> {result.interpreter.firstName} {result.interpreter.lastName}</p>
                  <p><strong>Email:</strong> {result.interpreter.email}</p>
                  <p><strong>Status:</strong> {result.interpreter.status}</p>
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
                    <p><strong>Login URL:</strong> {result.credentials.loginUrl}</p>
                    <p><strong>Temporary Password:</strong> {result.credentials.tempPassword}</p>
                    <p><strong>Login Token:</strong> {result.credentials.loginToken}</p>
                    <p><strong>Expires:</strong> {new Date(result.credentials.tokenExpiry).toLocaleString()}</p>
                  </div>
                  <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-950/20 rounded text-sm">
                    <p className="font-medium mb-2">Instructions for the interpreter:</p>
                    <ol className="list-decimal list-inside space-y-1">
                      {result.credentials.instructions.map((instruction: string, i: number) => (
                        <li key={i}>{instruction}</li>
                      ))}
                    </ol>
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
