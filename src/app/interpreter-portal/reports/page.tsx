'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { InterpreterDashboardProtection } from '@/components/interpreter-protection';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import Link from 'next/link';
import { 
  FileText,
  Search,
  Filter,
  Download,
  ChevronLeft,
  Calendar,
  Clock,
  DollarSign,
  Star,
  Video,
  Phone,
  CheckCircle,
  XCircle,
  Eye,
  MoreHorizontal,
  TrendingUp,
  Users,
  BarChart3
} from 'lucide-react';

interface SessionReport {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  duration: string;
  type: 'VRI' | 'OPI';
  language: string;
  client: string;
  status: 'Completed' | 'Cancelled' | 'No-Show';
  rating?: number;
  earnings: string;
  notes?: string;
  cancellationReason?: string;
}

interface SessionSummary {
  totalSessions: number;
  completedSessions: number;
  totalEarnings: number;
  avgRating: number;
  totalHours: number;
  completionRate: number;
}

export default function SessionReportsPage() {
  return (
    <InterpreterDashboardProtection>
      <SessionReportsContent />
    </InterpreterDashboardProtection>
  );
}

function SessionReportsContent() {
  const [reports, setReports] = useState<SessionReport[]>([]);
  const [filteredReports, setFilteredReports] = useState<SessionReport[]>([]);
  const [summary, setSummary] = useState<SessionSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [dateRange, setDateRange] = useState('last30days');

  useEffect(() => {
    // Fetch real-time session reports data from API
    const fetchReports = async () => {
      setLoading(true);
      
      try {
        const queryParams = new URLSearchParams({
          dateRange,
          status: statusFilter,
          type: typeFilter,
          search: searchTerm
        });
        
        const response = await fetch(`/api/interpreter/sessions?${queryParams}`, {
          credentials: 'include', // Include cookies for authentication
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const result = await response.json();
        
        if (result.success && result.data) {
          const { reports, summary } = result.data;
          setReports(reports);
          setFilteredReports(reports);
          setSummary(summary);
        } else {
          console.error('Failed to fetch session reports:', result.error);
          setReports([]);
          setFilteredReports([]);
          setSummary(null);
        }
      } catch (error) {
        console.error('Error fetching session reports:', error);
        setReports([]);
        setFilteredReports([]);
        setSummary(null);
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, [dateRange, statusFilter, typeFilter, searchTerm]);

  // Note: Filtering is now handled server-side in the API

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed': return 'bg-green-100 text-green-800';
      case 'Cancelled': return 'bg-red-100 text-red-800';
      case 'No-Show': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Completed': return <CheckCircle className="h-4 w-4" />;
      case 'Cancelled': return <XCircle className="h-4 w-4" />;
      case 'No-Show': return <Clock className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background p-4 md:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center py-20">
            <div className="text-center space-y-4">
              <div className="h-8 w-8 border-4 border-primary border-r-transparent rounded-full animate-spin mx-auto"></div>
              <p className="text-muted-foreground">Loading session reports...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm" asChild>
              <Link href="/interpreter-portal/interpreter" className="flex items-center">
                <ChevronLeft className="h-4 w-4 mr-2 flex-shrink-0" />
                Back to Dashboard
              </Link>
            </Button>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Session Reports</h1>
              <p className="text-muted-foreground">Detailed history of all your interpretation sessions</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Select value={dateRange} onValueChange={setDateRange}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="last7days">Last 7 days</SelectItem>
                <SelectItem value="last30days">Last 30 days</SelectItem>
                <SelectItem value="last3months">Last 3 months</SelectItem>
                <SelectItem value="lastyear">Last year</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </Button>
          </div>
        </div>

        {/* Summary Cards */}
        {summary && (
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="bg-blue-100 p-2 rounded-full">
                    <BarChart3 className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-xl font-bold">{summary.totalSessions}</p>
                    <p className="text-xs text-muted-foreground">Total Sessions</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="bg-green-100 p-2 rounded-full">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <p className="text-xl font-bold">{summary.completedSessions}</p>
                    <p className="text-xs text-muted-foreground">Completed</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="bg-purple-100 p-2 rounded-full">
                    <DollarSign className="h-4 w-4 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-xl font-bold">${summary.totalEarnings}</p>
                    <p className="text-xs text-muted-foreground">Earnings</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="bg-yellow-100 p-2 rounded-full">
                    <Star className="h-4 w-4 text-yellow-600" />
                  </div>
                  <div>
                    <p className="text-xl font-bold">{summary.avgRating}</p>
                    <p className="text-xs text-muted-foreground">Avg Rating</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="bg-indigo-100 p-2 rounded-full">
                    <Clock className="h-4 w-4 text-indigo-600" />
                  </div>
                  <div>
                    <p className="text-xl font-bold">{summary.totalHours}h</p>
                    <p className="text-xs text-muted-foreground">Total Hours</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="bg-orange-100 p-2 rounded-full">
                    <TrendingUp className="h-4 w-4 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-xl font-bold">{summary.completionRate}%</p>
                    <p className="text-xs text-muted-foreground">Completion</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filters & Search
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by client or language..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9"
                  />
                </div>
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                  <SelectItem value="Cancelled">Cancelled</SelectItem>
                  <SelectItem value="No-Show">No-Show</SelectItem>
                </SelectContent>
              </Select>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="VRI">VRI</SelectItem>
                  <SelectItem value="OPI">OPI</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Reports Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Session History
            </CardTitle>
            <CardDescription>
              Showing {filteredReports.length} of {reports.length} sessions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Time</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Language</TableHead>
                    <TableHead>Client</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Rating</TableHead>
                    <TableHead>Earnings</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredReports.map((report) => (
                    <TableRow key={report.id}>
                      <TableCell className="font-medium">{report.date}</TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div>{report.startTime}</div>
                          {report.endTime !== '-' && (
                            <div className="text-muted-foreground text-xs">to {report.endTime}</div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {report.type === 'VRI' ? (
                            <Video className="h-4 w-4 text-blue-600" />
                          ) : (
                            <Phone className="h-4 w-4 text-green-600" />
                          )}
                          <span className="text-sm font-medium">{report.type}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">{report.language}</div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm font-medium">{report.client}</div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">{report.duration}</div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className={getStatusColor(report.status)}>
                          <span className="flex items-center gap-1">
                            {getStatusIcon(report.status)}
                            {report.status}
                          </span>
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {report.rating ? (
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            <span className="text-sm">{report.rating}</span>
                          </div>
                        ) : (
                          <span className="text-sm text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <span className={`text-sm font-medium ${
                          report.status === 'Completed' ? 'text-green-600' : 'text-muted-foreground'
                        }`}>
                          {report.earnings}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {filteredReports.length === 0 && (
              <div className="text-center py-8">
                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No sessions found matching your filters</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
