"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Plus,
  Edit,
  Trash2,
  Eye,
  MoreHorizontal,
  Briefcase,
  Users,
  Clock,
  Building,
  MapPin,
  DollarSign,
  FileText,
  Settings,
  Search,
  Filter,
  Calendar,
  Target,
  CheckCircle,
  AlertCircle,
  X,
  Save
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

// Mock data for jobs
const mockJobs = [
  {
    id: "1",
    title: "Healthcare Interpreter",
    department: "Medical Services",
    type: "Contract",
    location: "Remote",
    payRange: "$35-65/hr",
    status: "Active",
    applications: 24,
    posted: "2024-01-15",
    deadline: "2024-02-15",
    description: "Provide professional interpretation services for medical consultations..."
  },
  {
    id: "2", 
    title: "Legal Interpreter",
    department: "Legal Services", 
    type: "Contract",
    location: "Remote",
    payRange: "$45-75/hr",
    status: "Active",
    applications: 18,
    posted: "2024-01-12",
    deadline: "2024-02-12",
    description: "Interpret for legal proceedings, depositions, and attorney-client meetings..."
  },
  {
    id: "3",
    title: "Business Conference Interpreter",
    department: "Corporate Services",
    type: "Contract", 
    location: "Remote/Hybrid",
    payRange: "$30-55/hr",
    status: "Draft",
    applications: 0,
    posted: "2024-01-20",
    deadline: "2024-02-20",
    description: "Support international business meetings and corporate negotiations..."
  }
];

// Question types for job application forms
const questionTypes = [
  { value: "text", label: "Text Input" },
  { value: "textarea", label: "Long Text" },
  { value: "select", label: "Dropdown" },
  { value: "radio", label: "Radio Buttons" },
  { value: "checkbox", label: "Checkboxes" }
];

interface Job {
  id?: string;
  title: string;
  department: string;
  type: string;
  location: string;
  payRange: string;
  status: string;
  applications?: number;
  posted?: string;
  description: string;
  longDescription?: string;
  responsibilities?: string[];
  requirements?: string[];
  benefits?: string[];
  deadline: string;
  questions?: ApplicationQuestion[];
}

interface ApplicationQuestion {
  id: string;
  type: string;
  question: string;
  required: boolean;
  options: string[];
}

export default function AdminJobsPage() {
  const [jobs, setJobs] = useState(mockJobs);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentJob, setCurrentJob] = useState<Job>({
    title: "",
    department: "",
    type: "",
    location: "",
    payRange: "",
    status: "Draft",
    description: "",
    longDescription: "",
    responsibilities: [""],
    requirements: [""],
    benefits: [""],
    deadline: "",
    questions: []
  });

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.department.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || job.status.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  const handleCreateJob = () => {
    // In a real app, this would call an API
    const newJob = {
      ...currentJob,
      id: Date.now().toString(),
      applications: 0,
      posted: new Date().toISOString().split('T')[0]
    };
    setJobs([...jobs, newJob]);
    setIsCreateDialogOpen(false);
    resetForm();
  };

  const handleUpdateJob = () => {
    if (selectedJob) {
      setJobs(jobs.map(job => job.id === selectedJob.id ? { 
        ...currentJob, 
        id: selectedJob.id,
        applications: job.applications,
        posted: job.posted
      } : job));
      setIsEditDialogOpen(false);
      resetForm();
    }
  };

  const handleDeleteJob = (jobId: string) => {
    if (confirm("Are you sure you want to delete this job posting?")) {
      setJobs(jobs.filter(job => job.id !== jobId));
    }
  };

  const handleEditJob = (job: any) => {
    setSelectedJob(job);
    setCurrentJob({
      title: job.title,
      department: job.department,
      type: job.type,
      location: job.location,
      payRange: job.payRange,
      status: job.status,
      description: job.description,
      longDescription: job.description, // Mock data doesn't have longDescription
      responsibilities: [""], // Mock data doesn't have these fields
      requirements: [""],
      benefits: [""],
      deadline: job.deadline,
      questions: []
    });
    setIsEditDialogOpen(true);
  };

  const resetForm = () => {
    setCurrentJob({
      title: "",
      department: "",
      type: "",
      location: "",
      payRange: "",
      status: "Draft",
      description: "",
      longDescription: "",
      responsibilities: [""],
      requirements: [""],
      benefits: [""],
      deadline: "",
      questions: []
    });
    setSelectedJob(null);
  };

  const addArrayField = (field: keyof Job, value: string = "") => {
    setCurrentJob(prev => ({
      ...prev,
      [field]: [...(prev[field] as string[] || []), value]
    }));
  };

  const updateArrayField = (field: keyof Job, index: number, value: string) => {
    setCurrentJob(prev => ({
      ...prev,
      [field]: (prev[field] as string[] || []).map((item, i) => i === index ? value : item)
    }));
  };

  const removeArrayField = (field: keyof Job, index: number) => {
    setCurrentJob(prev => ({
      ...prev,
      [field]: (prev[field] as string[] || []).filter((_, i) => i !== index)
    }));
  };

  const addQuestion = () => {
    const newQuestion: ApplicationQuestion = {
      id: Date.now().toString(),
      type: "text",
      question: "",
      required: false,
      options: []
    };
    setCurrentJob(prev => ({
      ...prev,
      questions: [...(prev.questions || []), newQuestion]
    }));
  };

  const updateQuestion = (questionId: string, updates: Partial<ApplicationQuestion>) => {
    setCurrentJob(prev => ({
      ...prev,
      questions: (prev.questions || []).map(q => 
        q.id === questionId ? { ...q, ...updates } : q
      )
    }));
  };

  const removeQuestion = (questionId: string) => {
    setCurrentJob(prev => ({
      ...prev,
      questions: (prev.questions || []).filter(q => q.id !== questionId)
    }));
  };

  const addQuestionOption = (questionId: string) => {
    setCurrentJob(prev => ({
      ...prev,
      questions: (prev.questions || []).map(q => 
        q.id === questionId ? { ...q, options: [...q.options, ""] } : q
      )
    }));
  };

  const updateQuestionOption = (questionId: string, optionIndex: number, value: string) => {
    setCurrentJob(prev => ({
      ...prev,
      questions: (prev.questions || []).map(q => 
        q.id === questionId ? {
          ...q,
          options: q.options.map((opt, i) => i === optionIndex ? value : opt)
        } : q
      )
    }));
  };

  const removeQuestionOption = (questionId: string, optionIndex: number) => {
    setCurrentJob(prev => ({
      ...prev,
      questions: (prev.questions || []).map(q => 
        q.id === questionId ? {
          ...q,
          options: q.options.filter((_, i) => i !== optionIndex)
        } : q
      )
    }));
  };

  const JobFormContent = () => (
    <div className="space-y-6 max-h-[70vh] overflow-y-auto">
      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Basic Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="title">Job Title *</Label>
              <Input
                id="title"
                value={currentJob.title}
                onChange={(e) => setCurrentJob({...currentJob, title: e.target.value})}
                placeholder="e.g., Healthcare Interpreter"
              />
            </div>
            <div>
              <Label htmlFor="department">Department *</Label>
              <Select
                value={currentJob.department}
                onValueChange={(value) => setCurrentJob({...currentJob, department: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Medical Services">Medical Services</SelectItem>
                  <SelectItem value="Legal Services">Legal Services</SelectItem>
                  <SelectItem value="Corporate Services">Corporate Services</SelectItem>
                  <SelectItem value="Operations">Operations</SelectItem>
                  <SelectItem value="Client Relations">Client Relations</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="type">Employment Type *</Label>
              <Select
                value={currentJob.type}
                onValueChange={(value) => setCurrentJob({...currentJob, type: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Full-time">Full-time</SelectItem>
                  <SelectItem value="Part-time">Part-time</SelectItem>
                  <SelectItem value="Contract">Contract</SelectItem>
                  <SelectItem value="Freelance">Freelance</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="location">Location *</Label>
              <Input
                id="location"
                value={currentJob.location}
                onChange={(e) => setCurrentJob({...currentJob, location: e.target.value})}
                placeholder="e.g., Remote, New York, Hybrid"
              />
            </div>
            <div>
              <Label htmlFor="payRange">Pay Range *</Label>
              <Input
                id="payRange"
                value={currentJob.payRange}
                onChange={(e) => setCurrentJob({...currentJob, payRange: e.target.value})}
                placeholder="e.g., $35-65/hr or $70-90k/year"
              />
            </div>
            <div>
              <Label htmlFor="status">Status *</Label>
              <Select
                value={currentJob.status}
                onValueChange={(value) => setCurrentJob({...currentJob, status: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Draft">Draft</SelectItem>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Paused">Paused</SelectItem>
                  <SelectItem value="Closed">Closed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div>
            <Label htmlFor="deadline">Application Deadline</Label>
            <Input
              id="deadline"
              type="date"
              value={currentJob.deadline}
              onChange={(e) => setCurrentJob({...currentJob, deadline: e.target.value})}
            />
          </div>
        </CardContent>
      </Card>

      {/* Job Description */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Job Description</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="description">Short Description *</Label>
            <Textarea
              id="description"
              value={currentJob.description}
              onChange={(e) => setCurrentJob({...currentJob, description: e.target.value})}
              placeholder="Brief description that appears in job listings"
              rows={2}
            />
          </div>
          <div>
            <Label htmlFor="longDescription">Detailed Description</Label>
            <Textarea
              id="longDescription"
              value={currentJob.longDescription}
              onChange={(e) => setCurrentJob({...currentJob, longDescription: e.target.value})}
              placeholder="Detailed job description for the job details page"
              rows={4}
            />
          </div>
        </CardContent>
      </Card>

      {/* Responsibilities */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Key Responsibilities</CardTitle>
        </CardHeader>
        <CardContent>
          {(currentJob.responsibilities || []).map((responsibility, index) => (
            <div key={index} className="flex gap-2 mb-2">
              <Input
                value={responsibility}
                onChange={(e) => updateArrayField('responsibilities', index, e.target.value)}
                placeholder="Enter a key responsibility"
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => removeArrayField('responsibilities', index)}
                disabled={(currentJob.responsibilities || []).length === 1}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => addArrayField('responsibilities')}
            className="mt-2"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Responsibility
          </Button>
        </CardContent>
      </Card>

      {/* Requirements */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Requirements</CardTitle>
        </CardHeader>
        <CardContent>
          {(currentJob.requirements || []).map((requirement, index) => (
            <div key={index} className="flex gap-2 mb-2">
              <Input
                value={requirement}
                onChange={(e) => updateArrayField('requirements', index, e.target.value)}
                placeholder="Enter a requirement"
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => removeArrayField('requirements', index)}
                disabled={(currentJob.requirements || []).length === 1}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => addArrayField('requirements')}
            className="mt-2"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Requirement
          </Button>
        </CardContent>
      </Card>

      {/* Benefits */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Benefits & Perks</CardTitle>
        </CardHeader>
        <CardContent>
          {(currentJob.benefits || []).map((benefit, index) => (
            <div key={index} className="flex gap-2 mb-2">
              <Input
                value={benefit}
                onChange={(e) => updateArrayField('benefits', index, e.target.value)}
                placeholder="Enter a benefit"
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => removeArrayField('benefits', index)}
                disabled={(currentJob.benefits || []).length === 1}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => addArrayField('benefits')}
            className="mt-2"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Benefit
          </Button>
        </CardContent>
      </Card>

      {/* Application Questions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Application Questions</CardTitle>
          <CardDescription>
            Create custom questions for job applicants beyond the standard application form.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {(currentJob.questions || []).map((question, index) => (
            <Card key={question.id} className="mb-4">
              <CardContent className="pt-4">
                <div className="space-y-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1 space-y-4">
                      <div>
                        <Label>Question Type</Label>
                        <Select
                          value={question.type}
                          onValueChange={(value) => updateQuestion(question.id, { type: value })}
                        >
                          <SelectTrigger className="w-48">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {questionTypes.map(type => (
                              <SelectItem key={type.value} value={type.value}>
                                {type.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>Question Text</Label>
                        <Input
                          value={question.question}
                          onChange={(e) => updateQuestion(question.id, { question: e.target.value })}
                          placeholder="Enter your question"
                        />
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id={`required-${question.id}`}
                          checked={question.required}
                          onCheckedChange={(checked) => updateQuestion(question.id, { required: !!checked })}
                        />
                        <Label htmlFor={`required-${question.id}`}>Required field</Label>
                      </div>
                      
                      {(question.type === 'select' || question.type === 'radio' || question.type === 'checkbox') && (
                        <div>
                          <Label>Options</Label>
                          {question.options.map((option, optionIndex) => (
                            <div key={optionIndex} className="flex gap-2 mb-2">
                              <Input
                                value={option}
                                onChange={(e) => updateQuestionOption(question.id, optionIndex, e.target.value)}
                                placeholder={`Option ${optionIndex + 1}`}
                              />
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => removeQuestionOption(question.id, optionIndex)}
                                disabled={question.options.length === 1}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          ))}
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => addQuestionOption(question.id)}
                          >
                            <Plus className="h-4 w-4 mr-2" />
                            Add Option
                          </Button>
                        </div>
                      )}
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeQuestion(question.id)}
                      className="ml-4"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          <Button
            type="button"
            variant="outline"
            onClick={addQuestion}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Question
          </Button>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Job Management</h1>
          <p className="text-muted-foreground">Create and manage job postings and application forms</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => resetForm()}>
              <Plus className="mr-2 h-4 w-4" />
              Create Job Posting
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>Create New Job Posting</DialogTitle>
              <DialogDescription>
                Fill in the job details and create custom application questions.
              </DialogDescription>
            </DialogHeader>
            <JobFormContent />
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateJob}>
                <Save className="mr-2 h-4 w-4" />
                Create Job
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Jobs</p>
                <p className="text-2xl font-bold">{jobs.length}</p>
              </div>
              <Briefcase className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Jobs</p>
                <p className="text-2xl font-bold">{jobs.filter(j => j.status === 'Active').length}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Applications</p>
                <p className="text-2xl font-bold">{jobs.reduce((sum, job) => sum + job.applications, 0)}</p>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Draft Jobs</p>
                <p className="text-2xl font-bold">{jobs.filter(j => j.status === 'Draft').length}</p>
              </div>
              <FileText className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search jobs by title or department..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="paused">Paused</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Jobs Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Job Title</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Pay Range</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Applications</TableHead>
                <TableHead>Posted</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredJobs.map((job) => (
                <TableRow key={job.id}>
                  <TableCell className="font-medium">
                    <div>
                      <div className="font-semibold">{job.title}</div>
                      <div className="text-sm text-muted-foreground flex items-center gap-2">
                        <MapPin className="h-3 w-3" />
                        {job.location}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Building className="h-4 w-4 text-muted-foreground" />
                      {job.department}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {job.type}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                      {job.payRange}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        job.status === 'Active' ? 'default' :
                        job.status === 'Draft' ? 'secondary' :
                        job.status === 'Paused' ? 'outline' : 'destructive'
                      }
                    >
                      {job.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      {job.applications}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      {new Date(job.posted).toLocaleDateString()}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => window.open(`/careers/${job.title.toLowerCase().replace(/\s+/g, '-')}`, '_blank')}>
                          <Eye className="mr-2 h-4 w-4" />
                          View Job Page
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleEditJob(job)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit Job
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => handleDeleteJob(job.id)}
                          className="text-red-600"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete Job
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          
          {filteredJobs.length === 0 && (
            <div className="text-center py-12">
              <Briefcase className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No jobs found</h3>
              <p className="text-muted-foreground mb-4">
                {searchTerm || statusFilter !== 'all' 
                  ? 'Try adjusting your search or filters'
                  : 'Create your first job posting to get started'
                }
              </p>
              {!searchTerm && statusFilter === 'all' && (
                <Button onClick={() => setIsCreateDialogOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Create Job Posting
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Job Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Edit Job Posting</DialogTitle>
            <DialogDescription>
              Update job details and application questions.
            </DialogDescription>
          </DialogHeader>
          <JobFormContent />
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateJob}>
              <Save className="mr-2 h-4 w-4" />
              Update Job
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
