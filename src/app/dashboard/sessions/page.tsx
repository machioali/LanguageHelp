'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/components/ui/use-toast';
import {
  Calendar,
  Clock,
  Video,
  Phone,
  Star,
  Search,
  Filter,
  Download,
  MessageSquare,
  User,
  MoreHorizontal,
  Plus,
  Play,
  ExternalLink,
  ArrowRight
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface Session {
  id: string;
  language: string;
  interpreter: string;
  type: string;
  status: string;
  date: string;
  time?: string;
  duration?: string;
  rating?: number;
  notes?: string;
  hasRecording?: boolean;
  cost?: number;
  specialization?: string;
}

interface SessionsData {
  upcomingSessions: Session[];
  pastSessions: Session[];
  summary: {
    totalSessions: number;
    completedSessions: number;
    totalMinutesUsed: number;
    averageRating: number;
  };
}

export default function SessionsPage() {
  const { data: session } = useSession();
  const [data, setData] = useState<SessionsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterType, setFilterType] = useState('all');

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const params = new URLSearchParams();
        if (filterStatus !== 'all') params.append('status', filterStatus);
        if (filterType !== 'all') params.append('type', filterType);
        
        const response = await fetch(`/api/client/sessions?${params.toString()}`);
        const result = await response.json();
        
        if (result.success) {
          setData(result.data);
        }
      } catch (error) {
        console.error('Failed to fetch sessions:', error);
        toast({
          title: 'Error',
          description: 'Failed to load sessions data',
          variant: 'destructive'
        });
      } finally {
        setLoading(false);
      }
    };

    if (session) {
      fetchSessions();
    }
  }, [session, filterStatus, filterType]);

  const getStatusBadgeVariant = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'default';
      case 'confirmed':
      case 'matched':
        return 'default';
      case 'cancelled':
        return 'destructive';
      case 'requested':
        return 'secondary';
      default:
        return 'secondary';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'text-green-600';
      case 'confirmed':
      case 'matched':
        return 'text-blue-600';
      case 'cancelled':
        return 'text-red-600';
      case 'requested':
        return 'text-yellow-600';
      default:
        return 'text-gray-600';
    }
  };

  const filteredPastSessions = data?.pastSessions.filter(session =>
    session.language.toLowerCase().includes(searchQuery.toLowerCase()) ||
    session.interpreter.toLowerCase().includes(searchQuery.toLowerCase()) ||
    session.specialization?.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  const filteredUpcomingSessions = data?.upcomingSessions.filter(session =>
    session.language.toLowerCase().includes(searchQuery.toLowerCase()) ||
    session.interpreter.toLowerCase().includes(searchQuery.toLowerCase()) ||
    session.specialization?.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  if (loading) {
    return (
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="animate-pulse space-y-8">
          <div className="h-8 bg-gray-300 rounded w-1/4"></div>
          <div className="grid grid-cols-1 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-300 rounded-lg"></div>
            ))}
          </div>
        </div>
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

      <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto py-8">
        {/* Hero Header */}
        <section className="relative py-8 mb-8">
          <div className="mx-auto max-w-4xl text-center">
            <div className="mb-4 flex justify-center">
              <div className="relative rounded-full px-4 py-2 text-sm leading-6 text-muted-foreground ring-1 ring-primary/10 hover:ring-primary/20 transition-all duration-300">
                Your interpretation sessions
                <Link href="/dashboard" className="font-semibold text-primary ml-1">
                  <span className="absolute inset-0" aria-hidden="true" />
                  Back to dashboard <span aria-hidden="true">→</span>
                </Link>
              </div>
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              My
              <span className="bg-gradient-to-r from-primary via-primary/80 to-secondary bg-clip-text text-transparent"> Sessions</span>
            </h1>
            <p className="mt-4 text-lg leading-8 text-muted-foreground max-w-2xl mx-auto">
              View and manage your interpretation sessions.
            </p>
            <div className="mt-6">
              <Button size="lg" className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 group" asChild>
                <Link href="/dashboard/book-session" className="flex items-center justify-center">
                  <Plus className="mr-2 h-4 w-4 flex-shrink-0 group-hover:scale-110 transition-transform duration-300" />
                  Book New Session
                  <ArrowRight className="ml-2 h-4 w-4 flex-shrink-0 group-hover:translate-x-1 transition-transform duration-300" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

      {/* Summary Stats */}
      {data?.summary && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Sessions</p>
                  <p className="text-2xl font-bold">{data.summary.totalSessions}</p>
                </div>
                <MessageSquare className="h-8 w-8 text-primary/60" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Completed</p>
                  <p className="text-2xl font-bold">{data.summary.completedSessions}</p>
                </div>
                <Calendar className="h-8 w-8 text-primary/60" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Minutes</p>
                  <p className="text-2xl font-bold">{data.summary.totalMinutesUsed}</p>
                </div>
                <Clock className="h-8 w-8 text-primary/60" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Avg Rating</p>
                  <p className="text-2xl font-bold">
                    {data.summary.averageRating > 0 ? data.summary.averageRating.toFixed(1) : 'N/A'}
                  </p>
                </div>
                <Star className="h-8 w-8 text-primary/60" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filters and Search */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search sessions by language, interpreter, or specialization..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="flex gap-2">
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="confirmed">Confirmed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                  <SelectItem value="requested">Requested</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="vri">Video (VRI)</SelectItem>
                  <SelectItem value="opi">Audio (OPI)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Sessions Tabs */}
      <Tabs defaultValue="upcoming" className="space-y-6">
        <TabsList>
          <TabsTrigger value="upcoming">
            Upcoming ({filteredUpcomingSessions.length})
          </TabsTrigger>
          <TabsTrigger value="past">
            Past Sessions ({filteredPastSessions.length})
          </TabsTrigger>
        </TabsList>

        {/* Upcoming Sessions */}
        <TabsContent value="upcoming">
          {filteredUpcomingSessions.length > 0 ? (
            <div className="space-y-4">
              {filteredUpcomingSessions.map((session) => (
                <Card key={session.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-3">
                          <div className="flex items-center space-x-2">
                            {session.type === 'Video' ? (
                              <Video className="h-5 w-5 text-blue-600" />
                            ) : (
                              <Phone className="h-5 w-5 text-green-600" />
                            )}
                            <h3 className="font-semibold text-lg">{session.language}</h3>
                          </div>
                          <Badge variant={getStatusBadgeVariant(session.status)}>
                            {session.status}
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center space-x-2">
                            <User className="h-4 w-4" />
                            <span>with {session.interpreter}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Calendar className="h-4 w-4" />
                            <span>{session.date} {session.time && `at ${session.time}`}</span>
                          </div>
                          {session.duration && (
                            <div className="flex items-center space-x-2">
                              <Clock className="h-4 w-4" />
                              <span>{session.duration}</span>
                            </div>
                          )}
                        </div>
                        
                        {session.specialization && (
                          <div className="mt-2">
                            <Badge variant="outline">{session.specialization}</Badge>
                          </div>
                        )}
                        
                        {session.notes && (
                          <div className="mt-3">
                            <p className="text-sm text-muted-foreground bg-gray-50 dark:bg-gray-800 p-3 rounded-md">
                              {session.notes}
                            </p>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        {session.status === 'Confirmed' && (
                          <Button size="sm">
                            <Play className="h-4 w-4 mr-2" />
                            Join Session
                          </Button>
                        )}
                        <Button variant="outline" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="text-center py-12">
                <Calendar className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                  No upcoming sessions
                </h3>
                <p className="text-muted-foreground mb-6">
                  You don't have any upcoming interpretation sessions scheduled.
                </p>
                <Button asChild>
                  <Link href="/dashboard/book-session">
                    <Plus className="h-4 w-4 mr-2" />
                    Book Your First Session
                  </Link>
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Past Sessions */}
        <TabsContent value="past">
          {filteredPastSessions.length > 0 ? (
            <div className="space-y-4">
              {filteredPastSessions.map((session) => (
                <Card key={session.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-3">
                          <div className="flex items-center space-x-2">
                            {session.type === 'Video' ? (
                              <Video className="h-5 w-5 text-blue-600" />
                            ) : (
                              <Phone className="h-5 w-5 text-green-600" />
                            )}
                            <h3 className="font-semibold text-lg">{session.language}</h3>
                          </div>
                          <Badge variant={getStatusBadgeVariant(session.status)}>
                            {session.status}
                          </Badge>
                          {session.rating && (
                            <div className="flex items-center space-x-1">
                              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                              <span className="text-sm font-medium">{session.rating}</span>
                            </div>
                          )}
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center space-x-2">
                            <User className="h-4 w-4" />
                            <span>{session.interpreter}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Calendar className="h-4 w-4" />
                            <span>{session.date}</span>
                          </div>
                          {session.duration && (
                            <div className="flex items-center space-x-2">
                              <Clock className="h-4 w-4" />
                              <span>{session.duration}</span>
                            </div>
                          )}
                          {session.cost && (
                            <div className="flex items-center space-x-2">
                              <span className="font-medium">${session.cost.toFixed(2)}</span>
                            </div>
                          )}
                        </div>
                        
                        <div className="flex items-center space-x-4 mt-2">
                          {session.specialization && (
                            <Badge variant="outline">{session.specialization}</Badge>
                          )}
                          {session.hasRecording && (
                            <Badge variant="secondary" className="flex items-center space-x-1">
                              <Download className="h-3 w-3" />
                              <span>Recording Available</span>
                            </Badge>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        {session.hasRecording && (
                          <Button variant="outline" size="sm">
                            <Download className="h-4 w-4 mr-2" />
                            Download
                          </Button>
                        )}
                        <Button variant="outline" size="sm">
                          <ExternalLink className="h-4 w-4 mr-2" />
                          View Details
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="text-center py-12">
                <MessageSquare className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                  No past sessions found
                </h3>
                <p className="text-muted-foreground mb-6">
                  {searchQuery
                    ? "No sessions match your search criteria."
                    : "You haven't completed any interpretation sessions yet."}
                </p>
                {!searchQuery && (
                  <Button asChild>
                    <Link href="/dashboard/book-session">
                      <Plus className="h-4 w-4 mr-2" />
                      Book Your First Session
                    </Link>
                  </Button>
                )}
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
      </div>
    </div>
  );
}
