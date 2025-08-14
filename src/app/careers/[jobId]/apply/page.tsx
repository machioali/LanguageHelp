"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  ArrowLeft,
  Upload,
  FileText,
  User,
  Mail,
  Phone,
  MapPin,
  GraduationCap,
  Briefcase,
  DollarSign,
  Clock,
  Languages,
  Award,
  CheckCircle,
  AlertCircle,
  Calendar,
  Building
} from "lucide-react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";

// Mock job data - would come from API in real app
const jobData = {
  "healthcare-interpreter": {
    title: "Healthcare Interpreter",
    department: "Medical Services",
    type: "Contract",
    location: "Remote",
    payRange: "$35-65/hr",
    questions: [
      {
        id: "medical_certification",
        type: "select",
        question: "What medical interpretation certification do you hold?",
        required: true,
        options: [
          "CoreCHI (Certification Commission for Healthcare Interpreters)",
          "NBCMI (National Board of Certification for Medical Interpreters)",
          "State-specific medical interpretation certification",
          "Other healthcare interpretation certification",
          "Currently pursuing certification",
          "No certification yet"
        ]
      },
      {
        id: "hipaa_training",
        type: "radio",
        question: "Have you completed HIPAA training?",
        required: true,
        options: ["Yes, current certification", "Yes, but expired", "No, but willing to complete", "No"]
      },
      {
        id: "medical_experience",
        type: "select",
        question: "How many years of healthcare interpretation experience do you have?",
        required: true,
        options: ["Less than 1 year", "1-2 years", "3-5 years", "6-10 years", "More than 10 years"]
      },
      {
        id: "medical_specialties",
        type: "checkbox",
        question: "Which medical specialties have you worked with? (Select all that apply)",
        required: false,
        options: [
          "Emergency Medicine",
          "Cardiology",
          "Oncology",
          "Pediatrics",
          "Surgery",
          "Mental Health",
          "Obstetrics/Gynecology",
          "Neurology",
          "Orthopedics",
          "Primary Care"
        ]
      }
    ]
  },
  "legal-interpreter": {
    title: "Legal Interpreter",
    department: "Legal Services",
    type: "Contract",
    location: "Remote",
    payRange: "$45-75/hr",
    questions: [
      {
        id: "court_certification",
        type: "select",
        question: "What court interpretation certification do you hold?",
        required: true,
        options: [
          "Federal Court Interpreter Certification",
          "State Court Interpreter Certification",
          "Administrative Office of Courts Certification",
          "Other professional legal interpretation certification",
          "Currently pursuing certification",
          "No certification yet"
        ]
      },
      {
        id: "legal_experience",
        type: "select",
        question: "How many years of legal interpretation experience do you have?",
        required: true,
        options: ["Less than 1 year", "1-2 years", "3-5 years", "6-10 years", "More than 10 years"]
      },
      {
        id: "legal_areas",
        type: "checkbox",
        question: "Which areas of law have you worked with? (Select all that apply)",
        required: false,
        options: [
          "Criminal Law",
          "Civil Law",
          "Immigration Law",
          "Family Law",
          "Personal Injury",
          "Contract Law",
          "Employment Law",
          "Real Estate Law",
          "Bankruptcy",
          "Appeals"
        ]
      },
      {
        id: "security_clearance",
        type: "radio",
        question: "Do you have any security clearance?",
        required: true,
        options: ["Yes, active clearance", "Yes, expired clearance", "No, but willing to obtain", "No"]
      }
    ]
  },
  "business-conference-interpreter": {
    title: "Business Conference Interpreter",
    department: "Corporate Services",
    type: "Contract",
    location: "Remote/Hybrid",
    payRange: "$30-55/hr",
    questions: [
      {
        id: "business_experience",
        type: "select",
        question: "How many years of business interpretation experience do you have?",
        required: true,
        options: ["Less than 1 year", "1-2 years", "3-5 years", "6-10 years", "More than 10 years"]
      },
      {
        id: "industry_experience",
        type: "checkbox",
        question: "Which industries have you worked with? (Select all that apply)",
        required: false,
        options: [
          "Technology",
          "Finance/Banking",
          "Manufacturing",
          "Healthcare",
          "Energy",
          "Consulting",
          "Real Estate",
          "Retail",
          "Automotive",
          "Telecommunications"
        ]
      },
      {
        id: "meeting_types",
        type: "checkbox",
        question: "What types of business meetings have you interpreted? (Select all that apply)",
        required: false,
        options: [
          "Board meetings",
          "Negotiations",
          "Training sessions",
          "Conferences",
          "Sales presentations",
          "Technical discussions",
          "M&A meetings",
          "Contract discussions"
        ]
      }
    ]
  },
  "quality-assurance-manager": {
    title: "Quality Assurance Manager",
    department: "Operations",
    type: "Full-time",
    location: "Remote",
    payRange: "$70-90k/year",
    questions: [
      {
        id: "management_experience",
        type: "select",
        question: "How many years of management experience do you have?",
        required: true,
        options: ["1-2 years", "3-5 years", "6-10 years", "More than 10 years"]
      },
      {
        id: "qa_experience",
        type: "select",
        question: "Do you have quality assurance experience in language services?",
        required: true,
        options: ["Yes, extensive experience", "Yes, some experience", "No, but transferable QA experience", "No QA experience"]
      },
      {
        id: "team_size",
        type: "select",
        question: "What's the largest team you've managed?",
        required: true,
        options: ["1-5 people", "6-15 people", "16-50 people", "50+ people"]
      },
      {
        id: "languages_spoken",
        type: "select",
        question: "How many languages do you speak fluently?",
        required: true,
        options: ["2 languages", "3 languages", "4-5 languages", "6+ languages"]
      }
    ]
  },
  "customer-success-specialist": {
    title: "Customer Success Specialist",
    department: "Client Relations",
    type: "Full-time",
    location: "Remote",
    payRange: "$55-75k/year",
    questions: [
      {
        id: "customer_success_experience",
        type: "select",
        question: "How many years of customer success experience do you have?",
        required: true,
        options: ["Less than 1 year", "1-2 years", "3-5 years", "6-10 years", "More than 10 years"]
      },
      {
        id: "industry_background",
        type: "checkbox",
        question: "Which industries have you worked in? (Select all that apply)",
        required: false,
        options: [
          "SaaS/Technology",
          "Healthcare",
          "Legal Services",
          "Language Services",
          "Financial Services",
          "Education",
          "Consulting",
          "Other"
        ]
      },
      {
        id: "language_skills",
        type: "radio",
        question: "Do you speak any languages other than English?",
        required: true,
        options: ["Yes, fluently (3+ languages)", "Yes, conversationally (2-3 languages)", "Yes, basic level", "No, English only"]
      },
      {
        id: "crm_experience",
        type: "checkbox",
        question: "Which CRM/support tools have you used? (Select all that apply)",
        required: false,
        options: [
          "Salesforce",
          "HubSpot",
          "Zendesk",
          "Intercom",
          "Freshworks",
          "Microsoft Dynamics",
          "Other",
          "No CRM experience"
        ]
      }
    ]
  }
};

const commonLanguages = [
  "Spanish", "French", "German", "Italian", "Portuguese", "Russian", "Chinese (Mandarin)",
  "Chinese (Cantonese)", "Japanese", "Korean", "Arabic", "Hebrew", "Hindi", "Urdu", "Bengali",
  "Vietnamese", "Thai", "Tagalog", "Polish", "Dutch", "Swedish", "Norwegian", "Danish",
  "Greek", "Turkish", "Persian", "Swahili", "Amharic", "Somali", "Other"
];

export default function JobApplicationPage() {
  const params = useParams() as { jobId?: string };
  const jobId = params?.jobId;
  const [job, setJob] = useState<any>(null);
  const [formData, setFormData] = useState<any>({});
  const [errors, setErrors] = useState<any>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!jobId) return;
    const jobKey = jobId.toLowerCase().replace(/\s+/g, '-');
    setJob(jobData[jobKey as keyof typeof jobData]);
  }, [jobId]);

  if (!jobId) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev: any) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev: any) => ({ ...prev, [field]: null }));
    }
  };

  const validateForm = () => {
    const newErrors: any = {};

    // Basic validation
    if (!formData.firstName?.trim()) newErrors.firstName = "First name is required";
    if (!formData.lastName?.trim()) newErrors.lastName = "Last name is required";
    
    // Email validation
    if (!formData.email?.trim()) {
      newErrors.email = "Email is required";
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        newErrors.email = "Please enter a valid email address";
      }
    }
    
    // Phone validation
    if (!formData.phone?.trim()) {
      newErrors.phone = "Phone number is required";
    } else {
      const phoneRegex = /^[\+]?[1-9][\d\s\-\(\)]{7,15}$/;
      if (!phoneRegex.test(formData.phone.replace(/\s/g, ''))) {
        newErrors.phone = "Please enter a valid phone number";
      }
    }
    
    if (!formData.primaryLanguage) newErrors.primaryLanguage = "Primary language is required";
    if (!formData.secondaryLanguages?.length) newErrors.secondaryLanguages = "At least one secondary language is required";
    
    // Salary validation
    if (!formData.expectedSalary) {
      newErrors.expectedSalary = "Expected salary is required";
    } else {
      const salary = parseFloat(formData.expectedSalary);
      if (isNaN(salary) || salary <= 0) {
        newErrors.expectedSalary = "Please enter a valid salary amount";
      } else if (salary > 200) {
        newErrors.expectedSalary = "Salary seems too high. Please verify the amount";
      }
    }
    
    if (!formData.availability) newErrors.availability = "Availability is required";
    if (!formData.resume) newErrors.resume = "Resume is required";
    if (!formData.terms) newErrors.terms = "You must agree to the terms and conditions";

    // Job-specific question validation
    if (job?.questions) {
      job.questions.forEach((question: any) => {
        if (question.required && !formData[question.id]) {
          newErrors[question.id] = "This field is required";
        }
      });
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Calculate form completion percentage
  const calculateProgress = () => {
    const requiredFields = [
      'firstName', 'lastName', 'email', 'phone', 'primaryLanguage', 
      'secondaryLanguages', 'expectedSalary', 'availability', 'resume', 'terms'
    ];
    
    // Add job-specific required questions
    if (job?.questions) {
      job.questions.forEach((question: any) => {
        if (question.required) {
          requiredFields.push(question.id);
        }
      });
    }
    
    const completedFields = requiredFields.filter(field => {
      if (field === 'secondaryLanguages') {
        return formData[field]?.length > 0;
      }
      return formData[field];
    });
    
    return Math.round((completedFields.length / requiredFields.length) * 100);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Create application data
      const applicationData = {
        id: Date.now().toString(),
        jobTitle: job.title,
        jobId: jobId,
        personalInfo: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          address: formData.address
        },
        languages: {
          primary: formData.primaryLanguage,
          secondary: formData.secondaryLanguages
        },
        experience: formData.experience,
        expectedSalary: formData.expectedSalary,
        availability: formData.availability,
        startDate: formData.startDate,
        resume: formData.resume ? {
          name: formData.resume.name,
          size: formData.resume.size,
          type: formData.resume.type
        } : null,
        coverLetter: formData.coverLetter,
        jobSpecificAnswers: job.questions?.reduce((acc: any, question: any) => {
          acc[question.id] = formData[question.id];
          return acc;
        }, {}),
        additionalInfo: formData.additionalInfo,
        status: 'pending',
        submittedAt: new Date().toISOString(),
        department: job.department,
        payRange: job.payRange
      };

      // Store in localStorage (in a real app, this would be an API call)
      const existingApplications = JSON.parse(localStorage.getItem('jobApplications') || '[]');
      existingApplications.push(applicationData);
      localStorage.setItem('jobApplications', JSON.stringify(existingApplications));

      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Show success message
      if (window.confirm("🎉 Application submitted successfully!\n\nWe'll review your application and get back to you within 2-3 business days.\n\nClick OK to return to the homepage.")) {
        window.location.href = '/';
      } else {
        window.location.href = '/';
      }
      
    } catch (error) {
      alert("There was an error submitting your application. Please try again.");
      setIsSubmitting(false);
    }
  };

  if (!job) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Job Not Found</h2>
          <p className="text-muted-foreground mb-6">The job posting you're trying to apply for doesn't exist.</p>
          <Button asChild>
            <Link href="/careers">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Careers
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary/5 via-transparent to-secondary/5 border-b">
        <div className="mx-auto max-w-4xl px-6 py-8">
          <Button variant="ghost" asChild className="mb-6">
            <Link href={`/careers/${jobId}`}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Job Details
            </Link>
          </Button>

          <div className="flex items-center gap-4 mb-6">
            <div className="bg-primary/10 rounded-lg p-3">
              <Briefcase className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Apply for {job.title}</h1>
              <p className="text-muted-foreground">{job.department} • {job.type} • {job.payRange}</p>
            </div>
          </div>

          <Alert className="bg-blue-50 border-blue-200">
            <AlertCircle className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-blue-700">
              Please complete all required fields. Your application will be reviewed within 2-3 business days.
            </AlertDescription>
          </Alert>
          
          {/* Progress Indicator */}
          <div className="mt-6">
            <div className="flex justify-between text-sm text-muted-foreground mb-2">
              <span>Application Progress</span>
              <span>{calculateProgress()}% Complete</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-primary to-primary/80 h-2 rounded-full transition-all duration-300" 
                style={{ width: `${calculateProgress()}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Application Form */}
      <div className="mx-auto max-w-4xl px-6 py-12">
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
                            if (checked === true) {
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
                <div 
                  className={`border-2 border-dashed rounded-lg p-6 text-center hover:border-primary/50 transition-colors cursor-pointer ${
                    errors.resume ? "border-red-500" : "border-muted"
                  } ${
                    formData.resume ? "bg-green-50 border-green-300 dark:bg-green-900/20" : ""
                  }`}
                  onClick={() => document.getElementById('resume-upload')?.click()}
                >
                  <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                  {formData.resume ? (
                    <>
                      <p className="text-sm font-medium text-green-700 dark:text-green-300">
                        ✓ {formData.resume.name}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {(formData.resume.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                      <p className="text-xs text-primary mt-1 cursor-pointer hover:underline">
                        Click to change file
                      </p>
                    </>
                  ) : (
                    <>
                      <p className="text-sm text-muted-foreground">Click to upload or drag and drop</p>
                      <p className="text-xs text-muted-foreground mt-1">PDF, DOC, DOCX up to 10MB</p>
                    </>
                  )}
                  <input
                    id="resume-upload"
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        // Check file size (10MB limit)
                        if (file.size > 10 * 1024 * 1024) {
                          alert('File size must be less than 10MB');
                          return;
                        }
                        // Check file type
                        const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
                        if (!allowedTypes.includes(file.type)) {
                          alert('Please upload a PDF, DOC, or DOCX file');
                          return;
                        }
                        handleInputChange("resume", file);
                      }
                    }}
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
          {job.questions && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  Position-Specific Questions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {job.questions.map((question: any) => (
                  <div key={question.id}>
                    <Label className="text-base font-medium">
                      {question.question}
                      {question.required && <span className="text-red-500 ml-1">*</span>}
                    </Label>

                    {question.type === "select" && (
                      <Select
                        value={formData[question.id] || ""}
                        onValueChange={(value) => handleInputChange(question.id, value)}
                      >
                        <SelectTrigger className={`mt-2 ${errors[question.id] ? "border-red-500" : ""}`}>
                          <SelectValue placeholder="Select an option" />
                        </SelectTrigger>
                        <SelectContent>
                          {question.options.map((option: string) => (
                            <SelectItem key={option} value={option}>{option}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}

                    {question.type === "radio" && (
                      <RadioGroup
                        value={formData[question.id] || ""}
                        onValueChange={(value) => handleInputChange(question.id, value)}
                        className="mt-2"
                      >
                        {question.options.map((option: string) => (
                          <div key={option} className="flex items-center space-x-2">
                            <RadioGroupItem value={option} id={`${question.id}-${option}`} />
                            <Label htmlFor={`${question.id}-${option}`}>{option}</Label>
                          </div>
                        ))}
                      </RadioGroup>
                    )}

                    {question.type === "checkbox" && (
                      <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-2">
                        {question.options.map((option: string) => (
                          <div key={option} className="flex items-center space-x-2">
                            <Checkbox
                              id={`${question.id}-${option}`}
                              checked={formData[question.id]?.includes(option) || false}
onCheckedChange={(checked) => {
                                const current = formData[question.id] || [];
                                if (checked === true) {
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
                    )}

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

              <div className="space-y-2">
                <div className="flex items-start space-x-2">
                  <Checkbox
                    id="terms"
                    checked={formData.terms || false}
onCheckedChange={(checked) => handleInputChange("terms", checked === true)}
                    className={errors.terms ? "border-red-500" : ""}
                  />
                  <Label htmlFor="terms" className="text-sm leading-relaxed cursor-pointer">
                    I agree to the{" "}
                    <Link href="/terms" className="text-primary hover:underline">
                      Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link href="/privacy" className="text-primary hover:underline">
                      Privacy Policy
                    </Link>
                    . I understand that my information will be used to evaluate my application.
                  </Label>
                </div>
                {errors.terms && <p className="text-red-500 text-sm">{errors.terms}</p>}
              </div>
            </CardContent>
          </Card>

          {/* Submit Button */}
          <div className="flex justify-end space-x-4">
            <Button variant="outline" size="lg" asChild>
              <Link href={`/careers/${jobId}`}>Cancel</Link>
            </Button>
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
      </div>
    </div>
  );
}
