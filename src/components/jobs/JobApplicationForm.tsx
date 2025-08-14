"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Upload,
  FileText,
  User,
  Languages,
  Award,
  DollarSign,
  CheckCircle,
  AlertCircle
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface JobApplicationFormProps {
  job: {
    title: string;
    department: string;
    type: string;
    payRange: string;
    questions?: Array<{
      id: string;
      type: string;
      question: string;
      required: boolean;
      options?: string[];
    }>;
  };
  onSubmit: (data: any) => Promise<void>;
  isSubmitting?: boolean;
}

const commonLanguages = [
  "Spanish", "French", "German", "Italian", "Portuguese", "Russian", "Chinese (Mandarin)",
  "Chinese (Cantonese)", "Japanese", "Korean", "Arabic", "Hebrew", "Hindi", "Urdu", "Bengali",
  "Vietnamese", "Thai", "Tagalog", "Polish", "Dutch", "Swedish", "Norwegian", "Danish",
  "Greek", "Turkish", "Persian", "Swahili", "Amharic", "Somali", "Other"
];

export function JobApplicationForm({ job, onSubmit, isSubmitting = false }: JobApplicationFormProps) {
  const [formData, setFormData] = useState<any>({});
  const [errors, setErrors] = useState<any>({});

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev: any) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev: any) => ({ ...prev, [field]: null }));
    }
  };

  const validateForm = () => {
    const newErrors: any = {};

    // Basic validation
    if (!formData.firstName) newErrors.firstName = "First name is required";
    if (!formData.lastName) newErrors.lastName = "Last name is required";
    if (!formData.email) newErrors.email = "Email is required";
    if (!formData.phone) newErrors.phone = "Phone number is required";
    if (!formData.primaryLanguage) newErrors.primaryLanguage = "Primary language is required";
    if (!formData.secondaryLanguages?.length) newErrors.secondaryLanguages = "At least one secondary language is required";
    if (!formData.expectedSalary) newErrors.expectedSalary = "Expected salary is required";
    if (!formData.availability) newErrors.availability = "Availability is required";
    if (!formData.resume) newErrors.resume = "Resume is required";

    // Job-specific question validation
    if (job.questions) {
      job.questions.forEach((question) => {
        if (question.required && !formData[question.id]) {
          newErrors[question.id] = "This field is required";
        }
      });
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      await onSubmit(formData);
    } catch (error) {
      console.error('Form submission error:', error);
    }
  };

  const renderQuestion = (question: any) => {
    switch (question.type) {
      case "select":
        return (
          <Select
            value={formData[question.id] || ""}
            onValueChange={(value) => handleInputChange(question.id, value)}
          >
            <SelectTrigger className={`mt-2 ${errors[question.id] ? "border-red-500" : ""}`}>
              <SelectValue placeholder="Select an option" />
            </SelectTrigger>
            <SelectContent>
              {question.options?.map((option: string) => (
                <SelectItem key={option} value={option}>{option}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        );

      case "radio":
        return (
          <RadioGroup
            value={formData[question.id] || ""}
            onValueChange={(value) => handleInputChange(question.id, value)}
            className="mt-2"
          >
            {question.options?.map((option: string) => (
              <div key={option} className="flex items-center space-x-2">
                <RadioGroupItem value={option} id={`${question.id}-${option}`} />
                <Label htmlFor={`${question.id}-${option}`}>{option}</Label>
              </div>
            ))}
          </RadioGroup>
        );

      case "checkbox":
        return (
          <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-2">
            {question.options?.map((option: string) => (
              <div key={option} className="flex items-center space-x-2">
                <Checkbox
                  id={`${question.id}-${option}`}
                  checked={formData[question.id]?.includes(option) || false}
                  onCheckedChange={(checked) => {
                    const current = formData[question.id] || [];
                    if (checked) {
                      handleInputChange(question.id, [...current, option]);
                    } else {
                      handleInputChange(question.id, current.filter((o: string) => o !== option));
                    }
                  }}
                />
                <Label htmlFor={`${question.id}-${option}`} className="text-sm">{option}</Label>
              </div>
            ))}
          </div>
        );

      case "textarea":
        return (
          <Textarea
            value={formData[question.id] || ""}
            onChange={(e) => handleInputChange(question.id, e.target.value)}
            className={`mt-2 ${errors[question.id] ? "border-red-500" : ""}`}
            placeholder="Enter your answer..."
            rows={3}
          />
        );

      default: // text
        return (
          <Input
            value={formData[question.id] || ""}
            onChange={(e) => handleInputChange(question.id, e.target.value)}
            className={`mt-2 ${errors[question.id] ? "border-red-500" : ""}`}
            placeholder="Enter your answer..."
          />
        );
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Personal Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5 text-primary" />
            Personal Information
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="firstName">First Name *</Label>
            <Input
              id="firstName"
              value={formData.firstName || ""}
              onChange={(e) => handleInputChange("firstName", e.target.value)}
              className={errors.firstName ? "border-red-500" : ""}
            />
            {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>}
          </div>

          <div>
            <Label htmlFor="lastName">Last Name *</Label>
            <Input
              id="lastName"
              value={formData.lastName || ""}
              onChange={(e) => handleInputChange("lastName", e.target.value)}
              className={errors.lastName ? "border-red-500" : ""}
            />
            {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>}
          </div>

          <div>
            <Label htmlFor="email">Email Address *</Label>
            <Input
              id="email"
              type="email"
              value={formData.email || ""}
              onChange={(e) => handleInputChange("email", e.target.value)}
              className={errors.email ? "border-red-500" : ""}
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
          </div>

          <div>
            <Label htmlFor="phone">Phone Number *</Label>
            <Input
              id="phone"
              type="tel"
              value={formData.phone || ""}
              onChange={(e) => handleInputChange("phone", e.target.value)}
              className={errors.phone ? "border-red-500" : ""}
            />
            {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
          </div>

          <div className="md:col-span-2">
            <Label htmlFor="address">Address</Label>
            <Input
              id="address"
              value={formData.address || ""}
              onChange={(e) => handleInputChange("address", e.target.value)}
              placeholder="Street address, City, State, ZIP"
            />
          </div>
        </CardContent>
      </Card>

      {/* Language Proficiency */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Languages className="h-5 w-5 text-primary" />
            Language Proficiency
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Label htmlFor="primaryLanguage">Primary/Native Language *</Label>
            <Select
              value={formData.primaryLanguage || ""}
              onValueChange={(value) => handleInputChange("primaryLanguage", value)}
            >
              <SelectTrigger className={errors.primaryLanguage ? "border-red-500" : ""}>
                <SelectValue placeholder="Select your native language" />
              </SelectTrigger>
              <SelectContent>
                {commonLanguages.map((language) => (
                  <SelectItem key={language} value={language}>{language}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.primaryLanguage && <p className="text-red-500 text-sm mt-1">{errors.primaryLanguage}</p>}
          </div>

          <div>
            <Label>Secondary Languages (Professional Proficiency) *</Label>
            <p className="text-sm text-muted-foreground mb-3">Select all languages you can interpret professionally</p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-48 overflow-y-auto border rounded-md p-3">
              {commonLanguages
                .filter(lang => lang !== formData.primaryLanguage)
                .map((language) => (
                  <div key={language} className="flex items-center space-x-2">
                    <Checkbox
                      id={`lang-${language}`}
                      checked={formData.secondaryLanguages?.includes(language) || false}
                      onCheckedChange={(checked) => {
                        const current = formData.secondaryLanguages || [];
                        if (checked) {
                          handleInputChange("secondaryLanguages", [...current, language]);
                        } else {
                          handleInputChange("secondaryLanguages", current.filter((l: string) => l !== language));
                        }
                      }}
                    />
                    <Label htmlFor={`lang-${language}`} className="text-sm">{language}</Label>
                  </div>
                ))}
            </div>
            {errors.secondaryLanguages && <p className="text-red-500 text-sm mt-1">{errors.secondaryLanguages}</p>}
          </div>
        </CardContent>
      </Card>

      {/* Professional Experience */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5 text-primary" />
            Professional Experience
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Label htmlFor="experience">Total Years of Interpretation Experience</Label>
            <Select
              value={formData.experience || ""}
              onValueChange={(value) => handleInputChange("experience", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select experience level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="less-than-1">Less than 1 year</SelectItem>
                <SelectItem value="1-2">1-2 years</SelectItem>
                <SelectItem value="3-5">3-5 years</SelectItem>
                <SelectItem value="6-10">6-10 years</SelectItem>
                <SelectItem value="more-than-10">More than 10 years</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="resume">Resume/CV *</Label>
            <div className="border-2 border-dashed border-muted rounded-lg p-6 text-center hover:border-primary/50 transition-colors cursor-pointer">
              <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground">Click to upload or drag and drop</p>
              <p className="text-xs text-muted-foreground mt-1">PDF, DOC, DOCX up to 10MB</p>
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={(e) => handleInputChange("resume", e.target.files?.[0])}
                className="hidden"
              />
            </div>
            {errors.resume && <p className="text-red-500 text-sm mt-1">{errors.resume}</p>}
          </div>

          <div>
            <Label htmlFor="coverLetter">Cover Letter (Optional)</Label>
            <Textarea
              id="coverLetter"
              value={formData.coverLetter || ""}
              onChange={(e) => handleInputChange("coverLetter", e.target.value)}
              placeholder="Tell us why you're interested in this position and what makes you a great fit..."
              rows={4}
            />
          </div>
        </CardContent>
      </Card>

      {/* Compensation & Availability */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-primary" />
            Compensation & Availability
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Label htmlFor="expectedSalary">Expected Hourly Rate *</Label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="expectedSalary"
                type="number"
                min="0"
                step="0.01"
                value={formData.expectedSalary || ""}
                onChange={(e) => handleInputChange("expectedSalary", e.target.value)}
                className={`pl-10 ${errors.expectedSalary ? "border-red-500" : ""}`}
                placeholder="0.00"
              />
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              Current range for this position: {job.payRange}
            </p>
            {errors.expectedSalary && <p className="text-red-500 text-sm mt-1">{errors.expectedSalary}</p>}
          </div>

          <div>
            <Label htmlFor="availability">Availability *</Label>
            <Select
              value={formData.availability || ""}
              onValueChange={(value) => handleInputChange("availability", value)}
            >
              <SelectTrigger className={errors.availability ? "border-red-500" : ""}>
                <SelectValue placeholder="Select your availability" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="full-time">Full-time (40+ hours/week)</SelectItem>
                <SelectItem value="part-time">Part-time (20-39 hours/week)</SelectItem>
                <SelectItem value="contract">Contract/Project-based</SelectItem>
                <SelectItem value="weekends">Weekends only</SelectItem>
                <SelectItem value="evenings">Evenings only</SelectItem>
                <SelectItem value="flexible">Flexible schedule</SelectItem>
              </SelectContent>
            </Select>
            {errors.availability && <p className="text-red-500 text-sm mt-1">{errors.availability}</p>}
          </div>

          <div>
            <Label htmlFor="startDate">Earliest Start Date</Label>
            <Input
              id="startDate"
              type="date"
              value={formData.startDate || ""}
              onChange={(e) => handleInputChange("startDate", e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Job-Specific Questions */}
      {job.questions && job.questions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              Position-Specific Questions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {job.questions.map((question) => (
              <div key={question.id}>
                <Label className="text-base font-medium">
                  {question.question}
                  {question.required && <span className="text-red-500 ml-1">*</span>}
                </Label>
                
                {renderQuestion(question)}

                {errors[question.id] && (
                  <p className="text-red-500 text-sm mt-1">{errors[question.id]}</p>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Additional Information */}
      <Card>
        <CardHeader>
          <CardTitle>Additional Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Label htmlFor="additionalInfo">Anything else you'd like us to know?</Label>
            <Textarea
              id="additionalInfo"
              value={formData.additionalInfo || ""}
              onChange={(e) => handleInputChange("additionalInfo", e.target.value)}
              placeholder="Share any additional information, achievements, or questions..."
              rows={3}
            />
          </div>

          <div className="flex items-start space-x-2">
            <Checkbox
              id="terms"
              checked={formData.terms || false}
              onCheckedChange={(checked) => handleInputChange("terms", checked)}
            />
            <Label htmlFor="terms" className="text-sm leading-relaxed">
              I agree to the Terms of Service and Privacy Policy. I understand that my information will be used to evaluate my application.
            </Label>
          </div>
        </CardContent>
      </Card>

      {/* Submit Button */}
      <div className="flex justify-end space-x-4">
        <Button type="submit" size="lg" disabled={isSubmitting || !formData.terms}>
          {isSubmitting ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Submitting...
            </>
          ) : (
            <>
              <CheckCircle className="mr-2 h-4 w-4" />
              Submit Application
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
