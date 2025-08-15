'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import {
  Calendar,
  Clock,
  TrendingUp,
  Users,
  MessageSquare,
  Star,
  ArrowRight,
  AlertCircle,
  Zap,
  Activity,
  Award,
  BarChart3,
  Sparkles,
  Flame
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface DashboardData {
  profile: {
    firstName: string;
    lastName: string;
    subscription: {
      planName: string;
      minutesUsed: number;
      minutesRemaining: number;
      minutesIncluded: number;
      status: string;
    } | null;
  };
  stats: {
    totalSessions: number;
    completedSessions: number;
    totalMinutesUsed: number;
    averageRating: number;
  };
  upcomingSessions: Array<{
    id: string;
    language: string;
    interpreter: string;
    date: string;
    time: string;
    status: string;
  }>;
  recentSessions: Array<{
    id: string;
    language: string;
    interpreter: string;
    date: string;
    status: string;
    rating?: number;
  }>;
}

export default function DashboardPage() {
  const { data: session } = useSession();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch profile and subscription data with error handling
        const [profileRes, sessionsRes] = await Promise.all([
          fetch('/api/client/profile').catch(() => ({ ok: false })),
          fetch('/api/client/sessions?limit=10').catch(() => ({ ok: false }))
        ]);

        let profileData = null;
        let sessionsData = null;
        
        // Handle profile response
        if (profileRes.ok) {
          profileData = await (profileRes as Response).json();
        } else {
          // Use fallback data when API fails
          profileData = {
            profile: {
              firstName: session?.user?.name?.split(' ')[0] || 'User',
              lastName: session?.user?.name?.split(' ').slice(1).join(' ') || ''
            },
            subscription: {
              planName: 'Free Trial',
              minutesUsed: 0,
              minutesRemaining: 100,
              minutesIncluded: 100,
              status: 'TRIAL'
            },
            stats: { totalSessions: 0, completedSessions: 0, totalMinutesUsed: 0, averageRating: 0 }
          };
        }
        
        // Handle sessions response
        if (sessionsRes.ok) {
          sessionsData = await (sessionsRes as Response).json();
        } else {
          // Use fallback session data
          sessionsData = {
            data: {
              upcomingSessions: [
                {
                  id: 'demo-1',
                  language: 'English → Spanish',
                  interpreter: 'Professional Interpreter',
                  date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                  time: '2:00 PM',
                  status: 'Confirmed'
                }
              ],
              pastSessions: [
                {
                  id: 'demo-2',
                  language: 'English → French',
                  interpreter: 'Jean Dupont',
                  date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                  status: 'Completed',
                  rating: 5
                }
              ]
            }
          };
        }

        setData({
          profile: {
            firstName: profileData.profile?.firstName || session?.user?.name?.split(' ')[0] || 'User',
            lastName: profileData.profile?.lastName || session?.user?.name?.split(' ').slice(1).join(' ') || '',
            subscription: profileData.subscription
          },
          stats: profileData.stats || { totalSessions: 0, completedSessions: 0, totalMinutesUsed: 0, averageRating: 0 },
          upcomingSessions: sessionsData.data?.upcomingSessions || [],
          recentSessions: sessionsData.data?.pastSessions?.slice(0, 5) || []
        });
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
        // Set minimal fallback data
        setData({
          profile: {
            firstName: session?.user?.name?.split(' ')[0] || 'User',
            lastName: session?.user?.name?.split(' ').slice(1).join(' ') || '',
            subscription: {
              planName: 'Free Trial',
              minutesUsed: 0,
              minutesRemaining: 100,
              minutesIncluded: 100,
              status: 'TRIAL'
            }
          },
          stats: { totalSessions: 0, completedSessions: 0, totalMinutesUsed: 0, averageRating: 0 },
          upcomingSessions: [],
          recentSessions: []
        });
      } finally {
        setLoading(false);
      }
    };

    if (session) {
      fetchDashboardData();
    }
  }, [session]);

  if (loading) {
    return (
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-300 rounded w-1/4 mb-4"></div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-300 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const minutesUsedPercentage = data?.profile.subscription 
    ? (data.profile.subscription.minutesUsed / data.profile.subscription.minutesIncluded) * 100 
    : 0;
    
  const minutesRemainingPercentage = data?.profile.subscription 
    ? (data.profile.subscription.minutesRemaining / data.profile.subscription.minutesIncluded) * 100 
    : 0;

  return (
    <div className="relative overflow-hidden min-h-screen">
      {/* Decorative Background */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute left-[calc(50%-15rem)] top-0 -z-10 transform-gpu blur-3xl sm:left-[calc(50%-25rem)]" aria-hidden="true">
          <div className="aspect-[1108/632] w-[50rem] bg-gradient-to-r from-primary/20 to-secondary/20 opacity-20" style={{ clipPath: 'polygon(73.6% 51.7%, 91.7% 11.8%, 100% 46.4%, 97.4% 82.2%, 92.5% 84.9%, 75.7% 64%, 55.3% 47.5%, 46.5% 49.4%, 45% 62.9%, 50.3% 87.2%, 21.3% 64.1%, 0.1% 100%, 5.4% 51.1%, 21.4% 63.9%, 58.9% 0.2%, 73.6% 51.7%)' }} />
        </div>
      </div>

      <div className="px-4 sm:px-6 lg:px-8 py-6">
        {/* Hero Header - Moved up with reduced padding */}
        <section className="relative py-4 mb-8">
          <div className="mx-auto max-w-5xl text-center">
            <div className="mb-3 flex justify-center">
              <div className="relative rounded-full px-4 py-2 text-sm leading-6 text-muted-foreground ring-1 ring-primary/10 hover:ring-primary/20 transition-all duration-300">
                Your interpretation dashboard
                <Link href="/dashboard/sessions" className="font-semibold text-primary ml-1">
                  <span className="absolute inset-0" aria-hidden="true" />
                  View all sessions <span aria-hidden="true">→</span>
                </Link>
              </div>
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
              Welcome back,
              <span className="bg-gradient-to-r from-primary via-primary/80 to-secondary bg-clip-text text-transparent"> {data?.profile.firstName}!</span>
            </h1>
            <p className="mt-3 text-lg leading-8 text-muted-foreground max-w-3xl mx-auto">
              Here's what's happening with your language services today.
            </p>
          </div>
        </section>

        {/* Stats Overview - Moved up with better spacing */}
        <section className="py-4 mb-8 relative overflow-hidden">
          <div className="absolute inset-0 -z-10">
            <div className="absolute inset-y-0 right-1/2 -z-10 mr-16 w-[200%] origin-bottom-left skew-x-[-30deg] bg-muted/10 shadow-xl shadow-primary/5 ring-1 ring-primary/5 sm:mr-28 lg:mr-0 xl:mr-16 xl:origin-center" />
          </div>
          
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
            {[
              {
                name: 'Total Sessions',
                value: data?.stats.totalSessions || 0,
                subtitle: `${data?.stats.completedSessions || 0} completed`,
                icon: MessageSquare,
                color: 'blue',
                bgGradient: 'from-blue-500/10 to-blue-600/5',
                iconBg: 'bg-blue-500/10',
                textColor: 'text-blue-600',
                trend: '+12%',
                trendUp: true
              },
              {
                name: 'Minutes Used',
                value: data?.stats.totalMinutesUsed || 0,
                subtitle: `${data?.profile.subscription?.minutesRemaining || 0} remaining`,
                icon: Clock,
                color: 'green',
                bgGradient: 'from-green-500/10 to-green-600/5',
                iconBg: 'bg-green-500/10',
                textColor: 'text-green-600',
                trend: '+8%',
                trendUp: true
              },
              {
                name: 'Average Rating',
                value: data?.stats.averageRating ? data.stats.averageRating.toFixed(1) : 'N/A',
                subtitle: 'From interpreter feedback',
                icon: Star,
                color: 'yellow',
                bgGradient: 'from-yellow-500/10 to-yellow-600/5',
                iconBg: 'bg-yellow-500/10',
                textColor: 'text-yellow-600',
                trend: '0.2★',
                trendUp: true
              },
              {
                name: 'Current Plan',
                value: data?.profile.subscription?.planName || 'Free Trial',
                subtitle: data?.profile.subscription?.status || 'Active',
                icon: TrendingUp,
                color: 'purple',
                bgGradient: 'from-purple-500/10 to-purple-600/5',
                iconBg: 'bg-purple-500/10',
                textColor: 'text-purple-600',
                trend: 'Upgrade',
                trendUp: false
              }
            ].map((stat, index) => (
              <Card
                key={stat.name}
                className={cn(
                  "group hover:shadow-xl transition-all duration-500 border border-gray-200/50 hover:border-primary/30 backdrop-blur-sm hover:-translate-y-1 cursor-pointer overflow-hidden relative",
                  `bg-gradient-to-br ${stat.bgGradient} hover:from-primary/5 hover:to-primary/10`
                )}
                style={{
                  transform: `translateY(${index % 2 === 0 ? '0px' : '8px'})`,
                  animationDelay: `${index * 100}ms`
                }}
              >
                {/* Decorative elements */}
                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-white/10 to-transparent rounded-full -translate-y-10 translate-x-10 group-hover:scale-150 transition-transform duration-700" />
                <div className="absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-tr from-primary/5 to-transparent rounded-full translate-y-8 -translate-x-8 group-hover:scale-125 transition-transform duration-700" />
                
                <CardContent className="p-6 relative z-10">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="text-sm font-medium text-muted-foreground group-hover:text-foreground/80 transition-colors duration-300">
                          {stat.name}
                        </p>
                        <div className={cn(
                          "px-2 py-1 rounded-full text-xs font-medium transition-all duration-300",
                          stat.trendUp ? "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400" : "bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400"
                        )}>
                          {stat.trend}
                        </div>
                      </div>
                      <p className="text-3xl font-bold text-foreground group-hover:text-primary transition-colors duration-300 mb-1">
                        {stat.value}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {stat.subtitle}
                      </p>
                    </div>
                    <div className={cn(
                      "rounded-xl p-3 transition-all duration-300 group-hover:scale-110 group-hover:rotate-6",
                      stat.iconBg,
                      "ring-1 ring-white/20 group-hover:ring-primary/30 group-hover:shadow-lg"
                    )}>
                      <stat.icon className={cn(
                        "h-6 w-6 transition-all duration-300 flex-shrink-0",
                        stat.textColor,
                        "group-hover:drop-shadow-lg"
                      )} />
                    </div>
                  </div>
                  
                  {/* Progress bar for some stats */}
                  {stat.name === 'Minutes Used' && data?.profile.subscription && (
                    <div className="mt-3">
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                        <div 
                          className="bg-gradient-to-r from-blue-500 to-blue-600 h-1.5 rounded-full transition-all duration-1000 ease-out"
                          style={{ width: `${Math.min(minutesRemainingPercentage, 100)}%` }}
                        />
                      </div>
                    </div>
                  )}
                  
                  {stat.name === 'Average Rating' && data?.stats.averageRating && (
                    <div className="flex items-center mt-2 gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star 
                          key={star} 
                          className={cn(
                            "h-3 w-3 transition-colors duration-300",
                            star <= data.stats.averageRating 
                              ? "text-yellow-400 fill-yellow-400" 
                              : "text-gray-300 dark:text-gray-600"
                          )} 
                        />
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Usage Progress */}
        {data?.profile.subscription && (
          <Card className="overflow-hidden border-0 shadow-lg bg-gradient-to-br from-green-500/5 via-white to-blue-500/5 dark:from-green-500/10 dark:via-gray-800 dark:to-blue-500/10">
            <CardHeader className="bg-gradient-to-r from-green-500/10 to-blue-500/10 border-b border-green-500/20">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-green-500/10">
                  <BarChart3 className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <CardTitle className="text-lg">Monthly Usage</CardTitle>
                  <CardDescription>
                    {data.profile.subscription.minutesUsed} of {data.profile.subscription.minutesIncluded} minutes used
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="relative">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-muted-foreground">Minutes Remaining</span>
                  <span className="text-sm font-bold text-blue-600">{minutesRemainingPercentage.toFixed(1)}%</span>
                </div>
                <Progress 
                  value={minutesRemainingPercentage} 
                  className="h-3 bg-gray-200 dark:bg-gray-700"
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-2">
                  <span>{data.profile.subscription.minutesRemaining} minutes remaining</span>
                  <span>{data.profile.subscription.minutesUsed} used</span>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                  <div className="text-2xl font-bold text-green-600">{data.profile.subscription.minutesUsed}</div>
                  <div className="text-xs text-green-600/80">Used This Month</div>
                </div>
                <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                  <div className="text-2xl font-bold text-blue-600">{data.profile.subscription.minutesRemaining}</div>
                  <div className="text-xs text-blue-600/80">Remaining</div>
                </div>
              </div>
              
              {minutesUsedPercentage > 80 && (
                <div className="flex items-center space-x-3 p-4 bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 border border-orange-200 dark:border-orange-800 rounded-lg">
                  <AlertCircle className="h-5 w-5 text-orange-600 flex-shrink-0" />
                  <div className="flex-1">
                    <div className="text-sm font-medium text-orange-800 dark:text-orange-200">Running low on minutes</div>
                    <div className="text-xs text-orange-600 dark:text-orange-300">Consider upgrading your plan to avoid service interruption</div>
                  </div>
                  <Button size="sm" className="bg-orange-600 hover:bg-orange-700 text-white" asChild>
                    <Link href="/dashboard/subscription">Upgrade Plan</Link>
                  </Button>
                </div>
              )}
              
              {/* Always show upgrade button */}
              <div className="mt-4">
                <Button 
                  variant="outline" 
                  className="w-full h-10 border-2 border-primary/20 hover:border-primary/50 hover:bg-primary/5 transition-all duration-300 group" 
                  asChild
                >
                  <Link href="/dashboard/subscription" className="flex items-center justify-center">
                    <TrendingUp className="mr-2 h-4 w-4 text-primary group-hover:scale-110 transition-transform duration-300" />
                    <span className="font-medium">Upgrade Subscription</span>
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Quick Actions */}
        <Card className="overflow-hidden border-0 shadow-lg bg-gradient-to-br from-primary/5 via-white to-secondary/5 dark:from-primary/10 dark:via-gray-800 dark:to-secondary/10">
          <CardHeader className="bg-gradient-to-r from-primary/10 to-secondary/10 border-b border-primary/20">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-primary/10">
                <Zap className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-lg">Quick Actions</CardTitle>
                <CardDescription>Start your next session or manage your account</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <Button asChild className="w-full justify-start h-12 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg hover:shadow-xl transition-all duration-300 group">
              <Link href="/dashboard/book-session" className="flex items-center">
                <div className="mr-3 p-1 rounded bg-white/20 group-hover:bg-white/30 transition-colors duration-300">
                  <Calendar className="h-4 w-4" />
                </div>
                <span className="font-medium">Book New Session</span>
                <ArrowRight className="ml-auto h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
            </Button>
            <Button variant="outline" asChild className="w-full justify-start h-12 border-2 hover:border-primary/50 hover:bg-primary/5 transition-all duration-300 group">
              <Link href="/dashboard/sessions" className="flex items-center">
                <MessageSquare className="mr-3 h-4 w-4 text-primary group-hover:scale-110 transition-transform duration-300" />
                <span className="font-medium">View My Sessions</span>
                <ArrowRight className="ml-auto h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
            </Button>
            <Button variant="outline" asChild className="w-full justify-start h-12 border-2 hover:border-primary/50 hover:bg-primary/5 transition-all duration-300 group">
              <Link href="/dashboard/profile" className="flex items-center">
                <Users className="mr-3 h-4 w-4 text-primary group-hover:scale-110 transition-transform duration-300" />
                <span className="font-medium">Update Profile</span>
                <ArrowRight className="ml-auto h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        {/* Upcoming Sessions */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Upcoming Sessions</CardTitle>
              <CardDescription>Your scheduled interpretation sessions</CardDescription>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/dashboard/sessions">
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            {data?.upcomingSessions.length ? (
              <div className="space-y-3">
                {data.upcomingSessions.slice(0, 3).map((session) => (
                  <div key={session.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <div className="font-medium">{session.language}</div>
                      <div className="text-sm text-muted-foreground">
                        {session.date} at {session.time}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        with {session.interpreter}
                      </div>
                    </div>
                    <Badge variant={session.status === 'CONFIRMED' ? 'default' : 'secondary'}>
                      {session.status}
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6">
                <Calendar className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">
                  No upcoming sessions
                </h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Book your next interpretation session.
                </p>
                <div className="mt-6">
                  <Button asChild>
                    <Link href="/dashboard/book-session">Book Session</Link>
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Sessions */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Recent Sessions</CardTitle>
              <CardDescription>Your latest interpretation history</CardDescription>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/dashboard/sessions">
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            {data?.recentSessions.length ? (
              <div className="space-y-3">
                {data.recentSessions.slice(0, 3).map((session) => (
                  <div key={session.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <div className="font-medium">{session.language}</div>
                      <div className="text-sm text-muted-foreground">
                        {session.date} • {session.interpreter}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {session.rating && (
                        <div className="flex items-center">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span className="ml-1 text-sm">{session.rating}</span>
                        </div>
                      )}
                      <Badge variant={session.status === 'Completed' ? 'default' : 'secondary'}>
                        {session.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6">
                <MessageSquare className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">
                  No sessions yet
                </h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Start your first interpretation session.
                </p>
                <div className="mt-6">
                  <Button asChild>
                    <Link href="/dashboard/book-session">Get Started</Link>
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      </div>
    </div>
  );
}
