'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { InterpreterDashboardProtection } from '@/components/interpreter-protection';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Link from 'next/link';
import { 
  BarChart3, 
  TrendingUp, 
  Clock, 
  DollarSign,
  Calendar,
  Star,
  Users,
  ChevronLeft,
  Download,
  Filter,
  Activity,
  Target,
  Award,
  Phone,
  Video,
  RefreshCw
} from 'lucide-react';

interface AnalyticsData {
  overview: {
    totalEarnings: number;
    totalSessions: number;
    avgRating: number;
    totalHours: number;
  };
  sessionsOverTime: Array<{
    period: string;
    vriSessions: number;
    opiSessions: number;
    earnings: number;
  }>;
  performanceMetrics: {
    completionRate: number;
    avgSessionDuration: number;
    responseTime: number;
    clientSatisfaction: number;
  };
  topLanguages: Array<{
    language: string;
    sessions: number;
    earnings: number;
  }>;
  recentTrends: {
    earningsGrowth: number;
    sessionsGrowth: number;
    ratingChange: number;
  };
}

interface AnalyticsMetadata {
  interpreterStatus: 'new' | 'beginner' | 'developing' | 'experienced';
  isNewInterpreter: boolean;
  totalSessionsEver: number;
  daysSinceJoined: number;
  joinDate: string;
  welcomeMessage: string;
  nextSteps: string[];
  profileCompleteness: {
    hasLanguages: boolean;
    hasBio: boolean;
    hasPhone: boolean;
    hasHourlyRate: boolean;
    isVerified: boolean;
  };
}

export default function AnalyticsPage() {
  return (
    <InterpreterDashboardProtection>
      <AnalyticsContent />
    </InterpreterDashboardProtection>
  );
}

function AnalyticsContent() {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [metadata, setMetadata] = useState<AnalyticsMetadata | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('last30days');
  const [sessionType, setSessionType] = useState('all');

  useEffect(() => {
    // Fetch real-time analytics data from API
    const fetchAnalytics = async () => {
      setLoading(true);
      
      try {
        // First check authentication
        console.log('🍪 Current cookies:', document.cookie);
        const authToken = document.cookie.split('; ').find(row => row.startsWith('auth-token='));
        console.log('🔐 Auth token found:', !!authToken);
        
        const queryParams = new URLSearchParams({
          timeRange,
          sessionType
        });
        
        console.log('🔍 Fetching analytics data...', { timeRange, sessionType });
        
        const response = await fetch(`/api/interpreter/analytics?${queryParams}`, {
          credentials: 'include', // Include cookies for authentication
        });
        
        console.log('📡 Response status:', response.status);
        
        if (!response.ok) {
          const errorText = await response.text();
          console.error('❌ HTTP error:', response.status, errorText);
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const result = await response.json();
        console.log('📊 Analytics result:', result);
        console.log('📊 Full response structure:', JSON.stringify(result, null, 2));
        
        if (result.success && result.data) {
          setAnalyticsData(result.data);
          setMetadata(result.metadata || null);
          console.log('✅ Analytics data loaded successfully', { 
            data: result.data,
            metadata: result.metadata,
            dataKeys: Object.keys(result.data),
            hasOverview: !!result.data.overview,
            overviewValues: result.data.overview
          });
        } else {
          console.error('❌ Failed to fetch analytics:', result.error);
          console.error('❌ Full error response:', result);
          setAnalyticsData(null);
          setMetadata(null);
        }
      } catch (error) {
        console.error('💥 Error fetching analytics:', error);
        setAnalyticsData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [timeRange, sessionType]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background p-4 md:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center py-20">
            <div className="text-center space-y-4">
              <div className="h-8 w-8 border-4 border-primary border-r-transparent rounded-full animate-spin mx-auto"></div>
              <p className="text-muted-foreground">Loading analytics...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!analyticsData) {
    return (
      <div className="min-h-screen bg-background p-4 md:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-20 space-y-6">
            <div className="mx-auto w-20 h-20 bg-muted rounded-full flex items-center justify-center">
              <BarChart3 className="h-10 w-10 text-muted-foreground" />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-semibold">No Analytics Data Available</h2>
              <p className="text-muted-foreground max-w-md mx-auto">
                This could be due to authentication issues or API connection problems.
              </p>
            </div>
            <div className="pt-4">
              <Button 
                onClick={() => window.location.reload()} 
                variant="outline"
                className="mr-4"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh Page
              </Button>
              <Button 
                onClick={() => {
                  console.log('🍪 Cookies:', document.cookie);
                  console.log('🔐 User Agent:', navigator.userAgent);
                }}
                variant="ghost"
                size="sm"
              >
                Debug Info
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Check if this is a new interpreter with zero data
  const isNewInterpreter = analyticsData.overview.totalSessions === 0 && 
                          analyticsData.overview.totalEarnings === 0;

  if (isNewInterpreter) {
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
                <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
                <p className="text-muted-foreground">Performance insights and session analytics</p>
              </div>
            </div>
          </div>

          {/* Welcome Message for New Interpreters */}
          <Card>
            <CardContent className="py-12">
              <div className="text-center space-y-6">
                <div className="mx-auto w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center">
                  <Target className="h-10 w-10 text-blue-600" />
                </div>
                <div className="space-y-2">
                  <h2 className="text-2xl font-semibold">Welcome to Your Analytics Dashboard!</h2>
                  <p className="text-muted-foreground max-w-2xl mx-auto">
                    You're all set up! Once you start completing interpretation sessions, 
                    you'll see detailed analytics here including your earnings, session statistics, 
                    performance metrics, and trends over time.
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto pt-6">
                  <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                    <DollarSign className="h-8 w-8 text-green-600 mx-auto mb-2" />
                    <h3 className="font-medium text-green-900">Track Earnings</h3>
                    <p className="text-sm text-green-700">Monitor your income from completed sessions</p>
                  </div>
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <BarChart3 className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                    <h3 className="font-medium text-blue-900">Session Analytics</h3>
                    <p className="text-sm text-blue-700">View detailed statistics about your sessions</p>
                  </div>
                  <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                    <TrendingUp className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                    <h3 className="font-medium text-purple-900">Performance Insights</h3>
                    <p className="text-sm text-purple-700">Get insights to improve your service</p>
                  </div>
                </div>
                <div className="pt-6">
                  <Button asChild>
                    <Link href="/interpreter-portal/interpreter">
                      Start Your First Session
                    </Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Zero State Analytics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="bg-green-100 p-3 rounded-full">
                    <DollarSign className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-3xl font-bold">$0.00</p>
                    <p className="text-sm text-muted-foreground">Total Earnings</p>
                    <Badge variant="secondary" className="mt-1 bg-gray-100 text-gray-800">
                      Getting started
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="bg-blue-100 p-3 rounded-full">
                    <Activity className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-3xl font-bold">0</p>
                    <p className="text-sm text-muted-foreground">Total Sessions</p>
                    <Badge variant="secondary" className="mt-1 bg-gray-100 text-gray-800">
                      Ready to start
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="bg-yellow-100 p-3 rounded-full">
                    <Star className="h-6 w-6 text-yellow-600" />
                  </div>
                  <div>
                    <p className="text-3xl font-bold">--</p>
                    <p className="text-sm text-muted-foreground">Avg Rating</p>
                    <Badge variant="secondary" className="mt-1 bg-gray-100 text-gray-800">
                      Awaiting feedback
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="bg-purple-100 p-3 rounded-full">
                    <Clock className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-3xl font-bold">0</p>
                    <p className="text-sm text-muted-foreground">Total Hours</p>
                    <Badge variant="secondary" className="mt-1 bg-gray-100 text-gray-800">
                      Begin your journey
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
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
              <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
              <p className="text-muted-foreground">Performance insights and session analytics</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Select value={timeRange} onValueChange={setTimeRange}>
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
              Export
            </Button>
          </div>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="bg-green-100 p-3 rounded-full">
                  <DollarSign className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-3xl font-bold">${analyticsData.overview.totalEarnings.toFixed(2)}</p>
                  <p className="text-sm text-muted-foreground">Earnings ({timeRange === 'last7days' ? 'Last 7 days' : timeRange === 'last30days' ? 'Last 30 days' : timeRange === 'last3months' ? 'Last 3 months' : 'Last year'})</p>
                  <Badge variant="secondary" className="mt-1 bg-green-100 text-green-800">
                    +{analyticsData.recentTrends.earningsGrowth.toFixed(2)}%
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="bg-blue-100 p-3 rounded-full">
                  <Activity className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-3xl font-bold">{analyticsData.overview.totalSessions}</p>
                  <p className="text-sm text-muted-foreground">Sessions ({timeRange === 'last7days' ? 'Last 7 days' : timeRange === 'last30days' ? 'Last 30 days' : timeRange === 'last3months' ? 'Last 3 months' : 'Last year'})</p>
                  <Badge variant="secondary" className="mt-1 bg-blue-100 text-blue-800">
                    +{analyticsData.recentTrends.sessionsGrowth.toFixed(2)}%
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="bg-yellow-100 p-3 rounded-full">
                  <Star className="h-6 w-6 text-yellow-600" />
                </div>
                <div>
                  <p className="text-3xl font-bold">{analyticsData.overview.avgRating.toFixed(2)}</p>
                  <p className="text-sm text-muted-foreground">Avg Rating</p>
                  <Badge variant="secondary" className="mt-1 bg-yellow-100 text-yellow-800">
                    +{analyticsData.recentTrends.ratingChange.toFixed(2)}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="bg-purple-100 p-3 rounded-full">
                  <Clock className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-3xl font-bold">{analyticsData.overview.totalHours.toFixed(2)}</p>
                  <p className="text-sm text-muted-foreground">Hours ({timeRange === 'last7days' ? 'Last 7 days' : timeRange === 'last30days' ? 'Last 30 days' : timeRange === 'last3months' ? 'Last 3 months' : 'Last year'})</p>
                  <Badge variant="secondary" className="mt-1 bg-purple-100 text-purple-800">
                    This period
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Sessions Over Time Chart */}
          <Card className="xl:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Sessions Over Time
              </CardTitle>
              <CardDescription>Weekly breakdown of VRI and OPI sessions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analyticsData.sessionsOverTime.map((data, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="text-sm font-medium min-w-16">{data.period}</div>
                      <div className="flex gap-4">
                        <div className="flex items-center gap-2">
                          <Video className="h-4 w-4 text-blue-600" />
                          <span className="text-sm text-muted-foreground">VRI: {data.vriSessions}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4 text-green-600" />
                          <span className="text-sm text-muted-foreground">OPI: {data.opiSessions}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-sm font-medium text-green-600">
                      ${data.earnings.toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Performance Metrics */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Performance
              </CardTitle>
              <CardDescription>Key performance indicators</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Completion Rate</span>
                  <span className="font-medium">{analyticsData.performanceMetrics.completionRate.toFixed(2)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-green-600 h-2 rounded-full" 
                    style={{ width: `${analyticsData.performanceMetrics.completionRate}%` }}
                  ></div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Avg Session Duration</span>
                  <span className="font-medium">{analyticsData.performanceMetrics.avgSessionDuration.toFixed(2)}min</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full" style={{ width: '87%' }}></div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Response Time</span>
                  <span className="font-medium">{analyticsData.performanceMetrics.responseTime.toFixed(2)}s</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-600 h-2 rounded-full" style={{ width: '95%' }}></div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Client Satisfaction</span>
                  <span className="font-medium">{analyticsData.performanceMetrics.clientSatisfaction.toFixed(2)}/5</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-yellow-600 h-2 rounded-full" style={{ width: '96%' }}></div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Top Languages */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Top Languages
            </CardTitle>
            <CardDescription>Most requested language pairs this period</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
              {analyticsData.topLanguages.map((lang, index) => (
                <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <p className="font-medium">{lang.language}</p>
                    <p className="text-sm text-muted-foreground">{lang.sessions} sessions</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-green-600">${lang.earnings.toFixed(2)}</p>
                    <Badge variant="secondary" className="text-xs">
                      #{index + 1}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Additional Insights */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5" />
              Insights & Recommendations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h4 className="font-medium text-blue-900 mb-2">Peak Performance</h4>
                <p className="text-sm text-blue-700">
                  Your completion rate is excellent at {analyticsData.performanceMetrics.completionRate.toFixed(2)}%.
                  Keep up the great work!
                </p>
              </div>
              
              <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                <h4 className="font-medium text-green-900 mb-2">Growing Demand</h4>
                <p className="text-sm text-green-700">
                  Spanish and Arabic sessions are your top earners. 
                  Consider expanding availability during peak hours.
                </p>
              </div>

              <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                <h4 className="font-medium text-yellow-900 mb-2">Quick Response</h4>
                <p className="text-sm text-yellow-700">
                  Your {analyticsData.performanceMetrics.responseTime.toFixed(2)}s response time is exceptional.
                  This contributes to high client satisfaction.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
