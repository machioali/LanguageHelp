"use client";

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Button } from "@/components/ui/button";
import { AdminProtected } from "@/components/auth/AdminProtected";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  User, 
  Mail, 
  Phone, 
  Languages, 
  Building,
  FileText,
  Calendar,
  Award,
  ArrowRight,
  Plus,
  Shield,
  Users,
  UserCheck,
  UserX,
  Database,
  MoreVertical,
  Trash2,
  Ban,
  Play,
  Pause,
  AlertTriangle,
  Search,
  X
} from "lucide-react";

interface Application {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
  languages: { code: string; name: string; proficiency: string }[];
  specializations: string[];
  certifications: { name: string; organization: string }[];
  experience: number | null;
  bio: string | null;
  status: string;
  createdAt: string;
}

interface SystemStats {
  users: {
    total: number;
    admins: number;
    interpreters: number;
    clients: number;
  };
  interpreters: {
    total: number;
    active: number;
    pending: number;
    approved: number;
    rejected: number;
  };
}

interface UserData {
  id: string;
  email: string;
  name: string | null;
  role: string;
  createdAt: string;
  companyName?: string | null;
  phoneNumber?: string | null;
  interpreterProfile?: {
    status: string;
    firstName: string;
    lastName: string;
  };
}

const statusColors = {
  PENDING: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
  UNDER_REVIEW: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
  APPROVED: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  REJECTED: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
};

export default function AdminDashboard() {
  const { data: session } = useSession();
  const [applications, setApplications] = useState<Application[]>([]);
  const [systemStats, setSystemStats] = useState<SystemStats | null>(null);
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [roleFilter, setRoleFilter] = useState<string>("ALL");
  const [activeTab, setActiveTab] = useState<'applications' | 'users'>('applications');
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [userActionDialogOpen, setUserActionDialogOpen] = useState(false);
  const [userActionType, setUserActionType] = useState<'SUSPEND' | 'ACTIVATE' | 'DEACTIVATE' | 'DELETE' | null>(null);
  const [actionReason, setActionReason] = useState("");
  const [notes, setNotes] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<{
    applications: Application[];
    users: UserData[];
  }>({ applications: [], users: [] });

  // Fetch applications and system statistics
  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Prepare parameters
      const appParams = new URLSearchParams();
      if (statusFilter && statusFilter !== "ALL") {
        appParams.append("status", statusFilter);
      }
      
      const userParams = new URLSearchParams();
      if (roleFilter && roleFilter !== "ALL") {
        userParams.append("role", roleFilter);
      }
      
      // Fetch data concurrently
      const [applicationsResponse, statsResponse, usersResponse] = await Promise.all([
        fetch(`/api/admin/applications?${appParams}`),
        fetch('/api/admin/stats'),
        fetch(`/api/admin/users?${userParams}`)
      ]);
      
      const [applicationsData, statsData, usersData] = await Promise.all([
        applicationsResponse.json(),
        statsResponse.json(),
        usersResponse.json()
      ]);
      
      if (applicationsResponse.ok) {
        setApplications(applicationsData.applications || []);
      } else {
        console.error("Failed to fetch applications:", applicationsData.error);
      }
      
      if (statsResponse.ok) {
        setSystemStats(statsData);
      } else {
        console.error("Failed to fetch system stats:", statsData.error);
      }
      
      if (usersResponse.ok) {
        setUsers(usersData.users || []);
      } else {
        console.error("Failed to fetch users:", usersData.error);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [statusFilter, roleFilter]);

  // Handle application approval/rejection
  const handleProcessApplication = async (applicationId: string, action: 'APPROVE' | 'REJECT') => {
    setProcessingId(applicationId);
    
    try {
      const response = await fetch(`/api/admin/applications/${applicationId}/approve`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action,
          notes: notes.trim() || undefined,
          adminId: session?.user?.id || 'unknown',
        }),
      });

      const data = await response.json();

      if (response.ok) {
      // Refresh data
        await fetchData();
        setSelectedApplication(null);
        setNotes("");
        alert(`Application ${action.toLowerCase()}d successfully!`);
      } else {
        alert(`Failed to ${action.toLowerCase()} application: ${data.error}`);
      }
    } catch (error) {
      console.error(`Error ${action.toLowerCase()}ing application:`, error);
      alert(`Error ${action.toLowerCase()}ing application. Please try again.`);
    } finally {
      setProcessingId(null);
    }
  };

  // Handle user management actions
  const handleUserAction = async (userId: string, action: 'SUSPEND' | 'ACTIVATE' | 'DEACTIVATE' | 'DELETE') => {
    if (!selectedUser || !userActionType) return;
    
    setProcessingId(userId);
    
    try {
      const endpoint = action === 'DELETE' 
        ? `/api/admin/users/${userId}`
        : `/api/admin/users/${userId}`;
      
      const method = action === 'DELETE' ? 'DELETE' : 'PUT';
      
      const response = await fetch(endpoint, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: action === 'DELETE' ? undefined : action,
          reason: actionReason.trim() || undefined,
          adminId: session?.user?.id || 'unknown',
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Refresh data
        await fetchData();
        setUserActionDialogOpen(false);
        setSelectedUser(null);
        setUserActionType(null);
        setActionReason("");
        
        const actionPast = {
          'SUSPEND': 'suspended',
          'ACTIVATE': 'activated',
          'DEACTIVATE': 'deactivated',
          'DELETE': 'deleted'
        };
        
        alert(`User ${actionPast[action]} successfully!`);
      } else {
        alert(`Failed to ${action.toLowerCase()} user: ${data.error}`);
      }
    } catch (error) {
      console.error(`Error ${action.toLowerCase()}ing user:`, error);
      alert(`Error ${action.toLowerCase()}ing user. Please try again.`);
    } finally {
      setProcessingId(null);
    }
  };
  
  const openUserActionDialog = (user: UserData, action: 'SUSPEND' | 'ACTIVATE' | 'DEACTIVATE' | 'DELETE') => {
    setSelectedUser(user);
    setUserActionType(action);
    setUserActionDialogOpen(true);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Search functionality
  const performSearch = (term: string) => {
    const searchTerm = term.toLowerCase().trim();
    
    if (!searchTerm) {
      setSearchResults({ applications: [], users: [] });
      return;
    }

    // Search applications
    const filteredApplications = applications.filter(app => {
      const fullName = `${app.firstName} ${app.lastName}`.toLowerCase();
      const email = app.email.toLowerCase();
      const phone = app.phone?.toLowerCase() || '';
      const languages = app.languages.map(lang => lang.name.toLowerCase()).join(' ');
      const specializations = app.specializations.join(' ').toLowerCase();
      const bio = app.bio?.toLowerCase() || '';
      
      return fullName.includes(searchTerm) ||
             email.includes(searchTerm) ||
             phone.includes(searchTerm) ||
             languages.includes(searchTerm) ||
             specializations.includes(searchTerm) ||
             bio.includes(searchTerm) ||
             app.status.toLowerCase().includes(searchTerm);
    });

    // Search users
    const filteredUsers = users.filter(user => {
      const displayName = user.interpreterProfile 
        ? `${user.interpreterProfile.firstName} ${user.interpreterProfile.lastName}`.toLowerCase()
        : (user.name || '').toLowerCase();
      const email = user.email.toLowerCase();
      const phone = user.phoneNumber?.toLowerCase() || '';
      const company = user.companyName?.toLowerCase() || '';
      const role = user.role.toLowerCase();
      const status = user.interpreterProfile?.status?.toLowerCase() || '';
      
      return displayName.includes(searchTerm) ||
             email.includes(searchTerm) ||
             phone.includes(searchTerm) ||
             company.includes(searchTerm) ||
             role.includes(searchTerm) ||
             status.includes(searchTerm);
    });

    setSearchResults({
      applications: filteredApplications,
      users: filteredUsers
    });
  };

  // Handle search input change
  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    performSearch(value);
  };

  // Clear search
  const clearSearch = () => {
    setSearchTerm('');
    setSearchResults({ applications: [], users: [] });
  };

  // Get data to display (search results or all data)
  const getDisplayData = () => {
    const hasSearchTerm = searchTerm.trim().length > 0;
    
    if (hasSearchTerm) {
      return {
        applications: searchResults.applications,
        users: searchResults.users,
        isSearching: true
      };
    }
    
    return {
      applications: applications,
      users: users,
      isSearching: false
    };
  };

  const displayData = getDisplayData();

  return (
    <AdminProtected>
      {loading ? (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <Clock className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p>Loading admin dashboard...</p>
          </div>
        </div>
      ) : (
      <div className="container mx-auto p-6">
      {/* Header */}
      <div className="mb-8 flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground mb-2">
            Admin Dashboard
          </h1>
          <p className="text-muted-foreground">
            Manage interpreter applications and approvals
          </p>
        </div>
        <div className="flex gap-3">
          <Link href="/admin/create-interpreter">
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              Create Interpreter
            </Button>
          </Link>
          <Link href="/admin/create-admin">
            <Button variant="outline" className="border-green-600 text-green-600 hover:bg-green-50 dark:hover:bg-green-950">
              <Shield className="h-4 w-4 mr-2" />
              Create Admin User
            </Button>
          </Link>
        </div>
      </div>

      {/* Users Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium">Users Overview</CardTitle>
            <CardDescription>All platform users</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{systemStats?.users.total || 0}</div>
            <div className="flex items-center text-sm text-muted-foreground gap-2 mt-1">
              <Users className="h-4 w-4" />
              <span>Total registered users</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium">Interpreters</CardTitle>
            <CardDescription>Active interpreters</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{systemStats?.interpreters.active || 0}</div>
            <div className="flex items-center text-sm text-muted-foreground gap-2 mt-1">
              <UserCheck className="h-4 w-4 text-green-500" />
              <span>Of {systemStats?.interpreters.total || 0} total interpreters</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium">Admins</CardTitle>
            <CardDescription>Platform administrators</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{systemStats?.users.admins || 0}</div>
            <div className="flex items-center text-sm text-muted-foreground gap-2 mt-1">
              <Shield className="h-4 w-4 text-blue-500" />
              <span>With administrative access</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium">Clients</CardTitle>
            <CardDescription>Service users</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{systemStats?.users.clients || 0}</div>
            <div className="flex items-center text-sm text-muted-foreground gap-2 mt-1">
              <User className="h-4 w-4 text-indigo-500" />
              <span>Registered clients</span>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Tab Navigation */}
      <div className="mb-8">
        <div className="flex space-x-1 bg-muted p-1 rounded-lg w-fit">
          <Button
            variant={activeTab === 'applications' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setActiveTab('applications')}
            className="rounded-md"
          >
            <FileText className="h-4 w-4 mr-2" />
            Applications ({displayData.applications.length})
          </Button>
          <Button
            variant={activeTab === 'users' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setActiveTab('users')}
            className="rounded-md"
          >
            <Users className="h-4 w-4 mr-2" />
            All Users ({displayData.users.length})
          </Button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder={`Search ${activeTab === 'applications' ? 'applications' : 'users'}...`}
            value={searchTerm}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-10 pr-10"
          />
          {searchTerm && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearSearch}
              className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0 hover:bg-transparent"
            >
              <X className="h-4 w-4 text-muted-foreground hover:text-foreground" />
            </Button>
          )}
        </div>
        {searchTerm && (
          <div className="mt-2 text-sm text-muted-foreground">
            {displayData.isSearching && (
              <span>
                Found {activeTab === 'applications' ? displayData.applications.length : displayData.users.length} 
                {' '}{activeTab === 'applications' ? 'application' : 'user'}{(activeTab === 'applications' ? displayData.applications.length : displayData.users.length) !== 1 ? 's' : ''} 
                matching "{searchTerm}"
              </span>
            )}
          </div>
        )}
      </div>

      {activeTab === 'applications' ? (
        <>
          {/* Applications Stats Cards */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-4">Application Status</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              {Object.entries({
                PENDING: applications.filter(app => app.status === 'PENDING').length,
                UNDER_REVIEW: applications.filter(app => app.status === 'UNDER_REVIEW').length,
                APPROVED: applications.filter(app => app.status === 'APPROVED').length,
                REJECTED: applications.filter(app => app.status === 'REJECTED').length,
              }).map(([status, count]) => (
                <Card key={status}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">
                          {status.replace('_', ' ')}
                        </p>
                        <p className="text-2xl font-bold">{count}</p>
                      </div>
                      <div className={`p-2 rounded-lg ${statusColors[status as keyof typeof statusColors]}`}>
                        {status === 'PENDING' && <Clock className="h-4 w-4" />}
                        {status === 'UNDER_REVIEW' && <FileText className="h-4 w-4" />}
                        {status === 'APPROVED' && <CheckCircle className="h-4 w-4" />}
                        {status === 'REJECTED' && <XCircle className="h-4 w-4" />}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

      {/* Filters */}
      <div className="mb-6">
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Applications</SelectItem>
            <SelectItem value="PENDING">Pending</SelectItem>
            <SelectItem value="UNDER_REVIEW">Under Review</SelectItem>
            <SelectItem value="APPROVED">Approved</SelectItem>
            <SelectItem value="REJECTED">Rejected</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Applications List */}
      <div className="space-y-4">
        {displayData.applications.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">No applications found</h3>
              <p className="text-muted-foreground">
                {displayData.isSearching && searchTerm 
                  ? `No applications match your search "${searchTerm}".`
                  : statusFilter === "ALL" 
                    ? "There are no interpreter applications yet." 
                    : `No applications with status "${statusFilter}".`
                }
              </p>
            </CardContent>
          </Card>
        ) : (
          displayData.applications.map((application) => (
            <Card key={application.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                      <User className="h-4 w-4" />
                      {application.firstName} {application.lastName}
                    </h3>
                    <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Mail className="h-3 w-3" />
                        {application.email}
                      </span>
                      {application.phone && (
                        <span className="flex items-center gap-1">
                          <Phone className="h-3 w-3" />
                          {application.phone}
                        </span>
                      )}
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {formatDate(application.createdAt)}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge className={statusColors[application.status as keyof typeof statusColors]}>
                      {application.status.replace('_', ' ')}
                    </Badge>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => setSelectedApplication(application)}
                        >
                          Review <ArrowRight className="h-3 w-3 ml-1" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle>
                            Application Review - {application.firstName} {application.lastName}
                          </DialogTitle>
                          <DialogDescription>
                            Review the interpreter application details and take action.
                          </DialogDescription>
                        </DialogHeader>

                        {selectedApplication && (
                          <div className="space-y-6">
                            {/* Personal Information */}
                            <div>
                              <h4 className="font-semibold mb-3 flex items-center gap-2">
                                <User className="h-4 w-4" />
                                Personal Information
                              </h4>
                              <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                  <span className="font-medium">Name:</span> {selectedApplication.firstName} {selectedApplication.lastName}
                                </div>
                                <div>
                                  <span className="font-medium">Email:</span> {selectedApplication.email}
                                </div>
                                <div>
                                  <span className="font-medium">Phone:</span> {selectedApplication.phone || 'N/A'}
                                </div>
                                <div>
                                  <span className="font-medium">Experience:</span> {selectedApplication.experience ? `${selectedApplication.experience} years` : 'N/A'}
                                </div>
                              </div>
                            </div>

                            {/* Languages */}
                            <div>
                              <h4 className="font-semibold mb-3 flex items-center gap-2">
                                <Languages className="h-4 w-4" />
                                Languages ({selectedApplication.languages.length})
                              </h4>
                              <div className="flex flex-wrap gap-2">
                                {selectedApplication.languages.map((lang, index) => (
                                  <Badge key={index} variant="secondary">
                                    {lang.name} ({lang.proficiency})
                                  </Badge>
                                ))}
                              </div>
                            </div>

                            {/* Specializations */}
                            <div>
                              <h4 className="font-semibold mb-3 flex items-center gap-2">
                                <Building className="h-4 w-4" />
                                Specializations ({selectedApplication.specializations.length})
                              </h4>
                              <div className="flex flex-wrap gap-2">
                                {selectedApplication.specializations.map((spec, index) => (
                                  <Badge key={index} variant="outline">
                                    {spec}
                                  </Badge>
                                ))}
                              </div>
                            </div>

                            {/* Certifications */}
                            {selectedApplication.certifications.length > 0 && (
                              <div>
                                <h4 className="font-semibold mb-3 flex items-center gap-2">
                                  <Award className="h-4 w-4" />
                                  Certifications ({selectedApplication.certifications.length})
                                </h4>
                                <div className="space-y-2">
                                  {selectedApplication.certifications.map((cert, index) => (
                                    <div key={index} className="p-3 border rounded-lg">
                                      <div className="font-medium">{cert.name}</div>
                                      <div className="text-sm text-muted-foreground">
                                        Issued by: {cert.organization}
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* Bio */}
                            {selectedApplication.bio && (
                              <div>
                                <h4 className="font-semibold mb-3">Bio</h4>
                                <p className="text-sm bg-muted p-3 rounded-lg">
                                  {selectedApplication.bio}
                                </p>
                              </div>
                            )}

                            {/* Admin Notes */}
                            <div>
                              <h4 className="font-semibold mb-3">Admin Notes (Optional)</h4>
                              <Textarea
                                placeholder="Add notes for this application (will be included in rejection emails)..."
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                className="min-h-[80px]"
                              />
                            </div>
                          </div>
                        )}

                        <DialogFooter className="gap-2">
                          {selectedApplication?.status === 'PENDING' && (
                            <>
                              <Button
                                variant="destructive"
                                onClick={() => handleProcessApplication(selectedApplication.id, 'REJECT')}
                                disabled={processingId === selectedApplication.id}
                              >
                                <XCircle className="h-4 w-4 mr-2" />
                                Reject
                              </Button>
                              <Button
                                onClick={() => handleProcessApplication(selectedApplication.id, 'APPROVE')}
                                disabled={processingId === selectedApplication.id}
                                className="bg-green-600 hover:bg-green-700"
                              >
                                <CheckCircle className="h-4 w-4 mr-2" />
                                Approve & Send Credentials
                              </Button>
                            </>
                          )}
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>

                {/* Quick Preview */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Languages:</span>
                    <div className="mt-1 flex flex-wrap gap-1">
                      {application.languages.slice(0, 3).map((lang, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {lang.name}
                        </Badge>
                      ))}
                      {application.languages.length > 3 && (
                        <Badge variant="secondary" className="text-xs">
                          +{application.languages.length - 3} more
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div>
                    <span className="font-medium">Specializations:</span>
                    <div className="mt-1 flex flex-wrap gap-1">
                      {application.specializations.slice(0, 2).map((spec, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {spec}
                        </Badge>
                      ))}
                      {application.specializations.length > 2 && (
                        <Badge variant="outline" className="text-xs">
                          +{application.specializations.length - 2} more
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div>
                    <span className="font-medium">Experience:</span>
                    <div className="mt-1">
                      {application.experience ? `${application.experience} years` : 'Not specified'}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
        </>
      ) : (
        <>
          {/* Users Management Section */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-4">User Management</h2>
            
            {/* Role Filter */}
            <div className="mb-6">
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Filter by role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All Users</SelectItem>
                  <SelectItem value="CLIENT">Clients</SelectItem>
                  <SelectItem value="INTERPRETER">Interpreters</SelectItem>
                  <SelectItem value="ADMIN">Administrators</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Users List */}
            <div className="space-y-4">
              {displayData.users.length === 0 ? (
                <Card>
                  <CardContent className="p-12 text-center">
                    <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <h3 className="text-lg font-semibold mb-2">No users found</h3>
                    <p className="text-muted-foreground">
                      {displayData.isSearching && searchTerm 
                        ? `No users match your search "${searchTerm}".`
                        : roleFilter === "ALL" 
                          ? "There are no registered users yet." 
                          : `No users with role "${roleFilter}".`
                      }
                    </p>
                  </CardContent>
                </Card>
              ) : (
                displayData.users.map((user) => {
                  const getRoleIcon = (role: string) => {
                    switch (role) {
                      case 'ADMIN':
                        return <Shield className="h-4 w-4 text-blue-500" />;
                      case 'INTERPRETER':
                        return <Languages className="h-4 w-4 text-green-500" />;
                      case 'CLIENT':
                        return <User className="h-4 w-4 text-indigo-500" />;
                      default:
                        return <User className="h-4 w-4" />;
                    }
                  };

                  const getRoleBadgeColor = (role: string) => {
                    switch (role) {
                      case 'ADMIN':
                        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
                      case 'INTERPRETER':
                        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
                      case 'CLIENT':
                        return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400';
                      default:
                        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
                    }
                  };

                  const displayName = user.interpreterProfile 
                    ? `${user.interpreterProfile.firstName} ${user.interpreterProfile.lastName}`
                    : user.name || 'No name set';

                  return (
                    <Card key={user.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              {getRoleIcon(user.role)}
                              <h3 className="text-lg font-semibold">
                                {displayName}
                              </h3>
                              <Badge className={getRoleBadgeColor(user.role)}>
                                {user.role}
                              </Badge>
                              {user.interpreterProfile && (
                                <Badge 
                                  className={statusColors[user.interpreterProfile.status as keyof typeof statusColors] || 'bg-gray-100 text-gray-800'}
                                >
                                  {user.interpreterProfile.status}
                                </Badge>
                              )}
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm text-muted-foreground">
                              <div className="flex items-center gap-2">
                                <Mail className="h-3 w-3" />
                                <span>{user.email}</span>
                              </div>
                              
                              {user.phoneNumber && (
                                <div className="flex items-center gap-2">
                                  <Phone className="h-3 w-3" />
                                  <span>{user.phoneNumber}</span>
                                </div>
                              )}
                              
                              {user.companyName && (
                                <div className="flex items-center gap-2">
                                  <Building className="h-3 w-3" />
                                  <span>{user.companyName}</span>
                                </div>
                              )}
                              
                              <div className="flex items-center gap-2">
                                <Calendar className="h-3 w-3" />
                                <span>Registered {formatDate(user.createdAt)}</span>
                              </div>
                            </div>
                          </div>
                          
                          {/* User Actions Dropdown */}
                          {user.id !== session?.user?.id && (
                            <div className="ml-4">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="outline" size="sm">
                                    <MoreVertical className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  {user.interpreterProfile && (
                                    <>
                                      {user.interpreterProfile.status === 'SUSPENDED' ? (
                                        <DropdownMenuItem onClick={() => openUserActionDialog(user, 'ACTIVATE')}>
                                          <Play className="h-4 w-4 mr-2" />
                                          Activate User
                                        </DropdownMenuItem>
                                      ) : user.interpreterProfile.status === 'ACTIVE' ? (
                                        <>
                                          <DropdownMenuItem onClick={() => openUserActionDialog(user, 'SUSPEND')}>
                                            <Ban className="h-4 w-4 mr-2" />
                                            Suspend User
                                          </DropdownMenuItem>
                                          <DropdownMenuItem onClick={() => openUserActionDialog(user, 'DEACTIVATE')}>
                                            <Pause className="h-4 w-4 mr-2" />
                                            Deactivate User
                                          </DropdownMenuItem>
                                        </>
                                      ) : (
                                        <DropdownMenuItem onClick={() => openUserActionDialog(user, 'ACTIVATE')}>
                                          <Play className="h-4 w-4 mr-2" />
                                          Activate User
                                        </DropdownMenuItem>
                                      )}
                                      <DropdownMenuSeparator />
                                    </>
                                  )}
                                  <DropdownMenuItem 
                                    onClick={() => openUserActionDialog(user, 'DELETE')}
                                    className="text-red-600 focus:text-red-600"
                                  >
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    Delete User
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          )}
                        </div>
                        
                        {/* User Type Specific Info */}
                        {user.role === 'INTERPRETER' && user.interpreterProfile && (
                          <div className="mt-4 p-4 bg-muted rounded-lg">
                            <h4 className="font-medium mb-2 flex items-center gap-2">
                              <Languages className="h-4 w-4" />
                              Interpreter Profile
                            </h4>
                            <div className="text-sm text-muted-foreground space-y-1">
                              <div>Status: <span className="font-medium">{user.interpreterProfile.status}</span></div>
                            </div>
                          </div>
                        )}
                        
                        {user.role === 'CLIENT' && user.companyName && (
                          <div className="mt-4 p-4 bg-muted rounded-lg">
                            <h4 className="font-medium mb-2 flex items-center gap-2">
                              <Building className="h-4 w-4" />
                              Client Information
                            </h4>
                            <div className="text-sm text-muted-foreground">
                              <div>Company: <span className="font-medium">{user.companyName}</span></div>
                            </div>
                          </div>
                        )}
                        
                        {user.role === 'ADMIN' && (
                          <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                            <h4 className="font-medium mb-2 flex items-center gap-2 text-blue-700 dark:text-blue-300">
                              <Shield className="h-4 w-4" />
                              Administrator Account
                            </h4>
                            <div className="text-sm text-blue-600 dark:text-blue-400">
                              Full platform administration access
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  );
                })
              )}
            </div>
          </div>
        </>
      )}
      
      {/* User Action Confirmation Dialog */}
      <Dialog open={userActionDialogOpen} onOpenChange={setUserActionDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {userActionType === 'DELETE' ? (
                <AlertTriangle className="h-5 w-5 text-red-500" />
              ) : userActionType === 'SUSPEND' ? (
                <Ban className="h-5 w-5 text-orange-500" />
              ) : (
                <CheckCircle className="h-5 w-5 text-green-500" />
              )}
              {userActionType === 'DELETE' && 'Delete User Account'}
              {userActionType === 'SUSPEND' && 'Suspend User'}
              {userActionType === 'ACTIVATE' && 'Activate User'}
              {userActionType === 'DEACTIVATE' && 'Deactivate User'}
            </DialogTitle>
            <DialogDescription>
              {selectedUser && (
                <>
                  You are about to {userActionType?.toLowerCase()} the account for{" "}
                  <strong>
                    {selectedUser.interpreterProfile 
                      ? `${selectedUser.interpreterProfile.firstName} ${selectedUser.interpreterProfile.lastName}`
                      : selectedUser.name || selectedUser.email
                    }
                  </strong>
                  .
                  {userActionType === 'DELETE' && (
                    <span className="text-red-600 font-medium">
                      {" "}This action cannot be undone and will permanently remove all user data.
                    </span>
                  )}
                </>
              )}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Reason (Optional)</label>
              <Textarea
                placeholder="Provide a reason for this action..."
                value={actionReason}
                onChange={(e) => setActionReason(e.target.value)}
                className="mt-2"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setUserActionDialogOpen(false);
                setSelectedUser(null);
                setUserActionType(null);
                setActionReason("");
              }}
            >
              Cancel
            </Button>
            <Button
              variant={userActionType === 'DELETE' ? 'destructive' : 'default'}
              onClick={() => selectedUser && userActionType && handleUserAction(selectedUser.id, userActionType)}
              disabled={processingId === selectedUser?.id}
            >
              {processingId === selectedUser?.id ? (
                <Clock className="h-4 w-4 mr-2 animate-spin" />
              ) : userActionType === 'DELETE' ? (
                <Trash2 className="h-4 w-4 mr-2" />
              ) : userActionType === 'SUSPEND' ? (
                <Ban className="h-4 w-4 mr-2" />
              ) : (
                <CheckCircle className="h-4 w-4 mr-2" />
              )}
              {userActionType === 'DELETE' && 'Delete User'}
              {userActionType === 'SUSPEND' && 'Suspend User'}
              {userActionType === 'ACTIVATE' && 'Activate User'}
              {userActionType === 'DEACTIVATE' && 'Deactivate User'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
      )}
    </AdminProtected>
  );
}
