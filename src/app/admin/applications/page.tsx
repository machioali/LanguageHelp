"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  CheckCircle,
  XCircle,
  Clock,
  Search,
  Filter,
  Download,
  Eye,
  Mail,
  Phone,
  MapPin,
  Calendar,
  DollarSign,
  FileText,
  User,
  Briefcase,
  Languages,
  Award,
  AlertCircle,
  CheckCheck,
  X
} from "lucide-react";

interface Application {
  id: string;
  jobTitle: string;
  jobId: string;
  personalInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address?: string;
  };
  languages: {
    primary: string;
    secondary: string[];
  };
  experience: string;
  expectedSalary: string;
  availability: string;
  startDate?: string;
  resume?: {
    name: string;
    size: number;
    type: string;
  };
  coverLetter?: string;
  jobSpecificAnswers?: Record<string, any>;
  additionalInfo?: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: string;
  department: string;
  payRange: string;
  reviewedAt?: string;
  reviewedBy?: string;
  reviewNotes?: string;
}

export default function ApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [filteredApplications, setFilteredApplications] = useState<Application[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  // Load applications from localStorage
  useEffect(() => {
    const storedApplications = localStorage.getItem('jobApplications');
    if (storedApplications) {
      const apps = JSON.parse(storedApplications);
      setApplications(apps);
      setFilteredApplications(apps);
    }
  }, []);

  // Filter applications
  useEffect(() => {
    let filtered = applications;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(app => 
        app.personalInfo.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.personalInfo.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.personalInfo.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.jobTitle.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter(app => app.status === statusFilter);
    }

    // Department filter
    if (departmentFilter !== "all") {
      filtered = filtered.filter(app => app.department === departmentFilter);
    }

    setFilteredApplications(filtered);
  }, [applications, searchTerm, statusFilter, departmentFilter]);

  const updateApplicationStatus = (applicationId: string, newStatus: 'approved' | 'rejected', notes?: string) => {
    const updatedApplications = applications.map(app => {
      if (app.id === applicationId) {
        return {
          ...app,
          status: newStatus,
          reviewedAt: new Date().toISOString(),
          reviewedBy: "Admin User", // In a real app, this would be the current user
          reviewNotes: notes
        };
      }
      return app;
    });

    setApplications(updatedApplications);
    localStorage.setItem('jobApplications', JSON.stringify(updatedApplications));

    // Show confirmation
    alert(`Application ${newStatus === 'approved' ? 'approved' : 'rejected'} successfully!`);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800"><Clock className="w-3 h-3 mr-1" />Pending</Badge>;
      case 'approved':
        return <Badge variant="default" className="bg-green-100 text-green-800"><CheckCircle className="w-3 h-3 mr-1" />Approved</Badge>;
      case 'rejected':
        return <Badge variant="destructive" className="bg-red-100 text-red-800"><XCircle className="w-3 h-3 mr-1" />Rejected</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const departments = [...new Set(applications.map(app => app.department))];
  const stats = {
    total: applications.length,
    pending: applications.filter(app => app.status === 'pending').length,
    approved: applications.filter(app => app.status === 'approved').length,
    rejected: applications.filter(app => app.status === 'rejected').length
  };

  return (
    <section className="px-4 sm:px-6 lg:px-8 py-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold mb-2">Job Applications</h1>
          <p className="text-muted-foreground">
            Review and manage interpreter applications
          </p>
        </div>
        <Button className="flex items-center gap-2">
          <Download className="w-4 h-4" />
          Export Data
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Applications</CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Approved</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.approved}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rejected</CardTitle>
            <XCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.rejected}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search applicants..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
            <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Departments</SelectItem>
                {departments.map(dept => (
                  <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Applications List */}
      {filteredApplications.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <AlertCircle className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Applications Found</h3>
            <p className="text-muted-foreground">
              {applications.length === 0 
                ? "No applications have been submitted yet." 
                : "No applications match your current filters."}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredApplications.map((application) => (
            <Card key={application.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      {application.personalInfo.firstName} {application.personalInfo.lastName}
                    </CardTitle>
                    <CardDescription className="flex items-center gap-4 text-sm">
                      <span className="flex items-center gap-1">
                        <Briefcase className="w-3 h-3" />
                        {application.jobTitle}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(application.submittedAt).toLocaleDateString()}
                      </span>
                      <span className="flex items-center gap-1">
                        <DollarSign className="w-3 h-3" />
                        ${application.expectedSalary}/hr
                      </span>
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusBadge(application.status)}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="w-4 h-4 text-muted-foreground" />
                    {application.personalInfo.email}
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="w-4 h-4 text-muted-foreground" />
                    {application.personalInfo.phone}
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Languages className="w-4 h-4 text-muted-foreground" />
                    {application.languages.primary} + {application.languages.secondary.length} others
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                      setSelectedApplication(application);
                      setShowDetails(true);
                    }}
                    className="flex items-center gap-2"
                  >
                    <Eye className="w-4 h-4" />
                    View Details
                  </Button>
                  
                  {application.status === 'pending' && (
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        className="bg-green-600 hover:bg-green-700"
                        onClick={() => updateApplicationStatus(application.id, 'approved')}
                      >
                        <CheckCheck className="w-4 h-4 mr-1" />
                        Approve
                      </Button>
                      <Button 
                        size="sm" 
                        variant="destructive"
                        onClick={() => {
                          const notes = prompt("Reason for rejection (optional):");
                          updateApplicationStatus(application.id, 'rejected', notes || undefined);
                        }}
                      >
                        <X className="w-4 h-4 mr-1" />
                        Reject
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Application Details Modal */}
      {showDetails && selectedApplication && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-background rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">
                  {selectedApplication.personalInfo.firstName} {selectedApplication.personalInfo.lastName}
                </h2>
                <Button variant="ghost" onClick={() => setShowDetails(false)}>
                  <X className="w-4 h-4" />
                </Button>
              </div>
              <p className="text-muted-foreground">
                Application for {selectedApplication.jobTitle}
              </p>
            </div>
            
            <div className="p-6">
              <Tabs defaultValue="personal" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="personal">Personal Info</TabsTrigger>
                  <TabsTrigger value="professional">Professional</TabsTrigger>
                  <TabsTrigger value="questions">Job-Specific</TabsTrigger>
                  <TabsTrigger value="documents">Documents</TabsTrigger>
                </TabsList>
                
                <TabsContent value="personal" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Contact Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium">First Name</label>
                          <p>{selectedApplication.personalInfo.firstName}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium">Last Name</label>
                          <p>{selectedApplication.personalInfo.lastName}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium">Email</label>
                          <p>{selectedApplication.personalInfo.email}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium">Phone</label>
                          <p>{selectedApplication.personalInfo.phone}</p>
                        </div>
                      </div>
                      {selectedApplication.personalInfo.address && (
                        <div>
                          <label className="text-sm font-medium">Address</label>
                          <p>{selectedApplication.personalInfo.address}</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="professional" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card>
                      <CardHeader>
                        <CardTitle>Languages</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <div>
                            <label className="text-sm font-medium">Primary Language</label>
                            <p>{selectedApplication.languages.primary}</p>
                          </div>
                          <div>
                            <label className="text-sm font-medium">Secondary Languages</label>
                            <ul className="list-disc list-inside">
                              {selectedApplication.languages.secondary.map((lang, idx) => (
                                <li key={idx} className="text-sm">{lang}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader>
                        <CardTitle>Experience & Availability</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div>
                          <label className="text-sm font-medium">Experience Level</label>
                          <p>{selectedApplication.experience}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium">Expected Salary</label>
                          <p>${selectedApplication.expectedSalary}/hr</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium">Availability</label>
                          <p>{selectedApplication.availability}</p>
                        </div>
                        {selectedApplication.startDate && (
                          <div>
                            <label className="text-sm font-medium">Start Date</label>
                            <p>{new Date(selectedApplication.startDate).toLocaleDateString()}</p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
                
                <TabsContent value="questions" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Position-Specific Answers</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {selectedApplication.jobSpecificAnswers ? (
                        <div className="space-y-4">
                          {Object.entries(selectedApplication.jobSpecificAnswers).map(([key, value]) => (
                            <div key={key}>
                              <label className="text-sm font-medium capitalize">
                                {key.replace(/_/g, ' ')}
                              </label>
                              <p className="mt-1">
                                {Array.isArray(value) ? value.join(', ') : value}
                              </p>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-muted-foreground">No job-specific questions were answered.</p>
                      )}
                    </CardContent>
                  </Card>
                  
                  {selectedApplication.coverLetter && (
                    <Card>
                      <CardHeader>
                        <CardTitle>Cover Letter</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="whitespace-pre-wrap">{selectedApplication.coverLetter}</p>
                      </CardContent>
                    </Card>
                  )}
                  
                  {selectedApplication.additionalInfo && (
                    <Card>
                      <CardHeader>
                        <CardTitle>Additional Information</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="whitespace-pre-wrap">{selectedApplication.additionalInfo}</p>
                      </CardContent>
                    </Card>
                  )}
                </TabsContent>
                
                <TabsContent value="documents" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Uploaded Documents</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {selectedApplication.resume ? (
                        <div className="flex items-center justify-between p-3 border rounded">
                          <div className="flex items-center gap-3">
                            <FileText className="w-8 h-8 text-blue-600" />
                            <div>
                              <p className="font-medium">{selectedApplication.resume.name}</p>
                              <p className="text-sm text-muted-foreground">
                                {(selectedApplication.resume.size / 1024 / 1024).toFixed(2)} MB
                              </p>
                            </div>
                          </div>
                          <Button variant="outline" size="sm">
                            <Download className="w-4 h-4 mr-1" />
                            Download
                          </Button>
                        </div>
                      ) : (
                        <p className="text-muted-foreground">No resume uploaded.</p>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
              
              {/* Action buttons at bottom */}
              {selectedApplication.status === 'pending' && (
                <div className="mt-6 pt-6 border-t flex gap-4 justify-end">
                  <Button 
                    className="bg-green-600 hover:bg-green-700"
                    onClick={() => {
                      updateApplicationStatus(selectedApplication.id, 'approved');
                      setShowDetails(false);
                    }}
                  >
                    <CheckCheck className="w-4 h-4 mr-2" />
                    Approve Application
                  </Button>
                  <Button 
                    variant="destructive"
                    onClick={() => {
                      const notes = prompt("Reason for rejection (optional):");
                      updateApplicationStatus(selectedApplication.id, 'rejected', notes || undefined);
                      setShowDetails(false);
                    }}
                  >
                    <X className="w-4 h-4 mr-2" />
                    Reject Application
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
