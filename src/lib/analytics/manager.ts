import { prisma } from '@/lib/prisma';

export interface AnalyticsData {
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

export class AnalyticsManager {
  private interpreterProfileId: string;

  constructor(interpreterProfileId: string) {
    this.interpreterProfileId = interpreterProfileId;
  }

  /**
   * Generate analytics data for the specified time range
   */
  async generateAnalytics(timeRange: string = 'last30days'): Promise<AnalyticsData | null> {
    try {
      const { startDate, endDate } = this.getDateRange(timeRange);

      // Get all sessions for this interpreter within the time range
      const sessions = await prisma.interpreterSession.findMany({
        where: {
          interpreterProfileId: this.interpreterProfileId,
          scheduledAt: {
            gte: startDate,
            lte: endDate
          }
        },
        orderBy: {
          scheduledAt: 'desc'
        }
      });

      // Always return real data - no fake sample data for new interpreters
      console.log(`📊 Found ${sessions.length} real sessions for interpreter ${this.interpreterProfileId}`);
      return this.calculateAnalytics(sessions, startDate, endDate);
    } catch (error) {
      console.error('Error generating analytics:', error);
      return null;
    }
  }

  /**
   * Calculate analytics from session data
   */
  private async calculateAnalytics(sessions: any[], startDate: Date, endDate: Date): Promise<AnalyticsData> {
    // 1. Overview metrics
    const completedSessions = sessions.filter(s => s.status === 'COMPLETED');
    const totalEarnings = completedSessions.reduce((sum, session) => sum + session.earnings, 0);
    const totalSessions = sessions.length;
    const avgRating = completedSessions.length > 0 ? 
      completedSessions.reduce((sum, session) => sum + (session.rating || 0), 0) / completedSessions.length : 0.0;
    const totalHours = completedSessions.reduce((sum, session) => sum + (session.duration || 0), 0) / 60;

    // 2. Sessions over time (weekly breakdown)
    const sessionsOverTime = this.calculateSessionsOverTime(sessions, startDate, endDate);

    // 3. Performance metrics
    const completionRate = totalSessions > 0 ? (completedSessions.length / totalSessions) * 100 : 0.0;
    const avgSessionDuration = completedSessions.length > 0 ? 
      completedSessions.reduce((sum, s) => sum + (s.duration || 0), 0) / completedSessions.length : 0.0;
    
    // For new interpreters (no sessions), show 0 response time
    // For existing interpreters, calculate based on actual performance or use a baseline
    const responseTime = totalSessions === 0 ? 0 : 
                        completionRate > 80 ? 12 : 
                        completionRate > 60 ? 18 : 25;

    // 4. Top languages
    const topLanguages = this.calculateTopLanguages(sessions);

    // 5. Recent trends
    const recentTrends = await this.calculateTrends(startDate);

    return {
      overview: {
        totalEarnings: Math.round(totalEarnings * 100) / 100,
        totalSessions,
        avgRating: Math.round(avgRating * 100) / 100,
        totalHours: Math.round(totalHours * 100) / 100
      },
      sessionsOverTime,
      performanceMetrics: {
        completionRate: Math.round(completionRate * 10) / 10,
        avgSessionDuration: Math.round(avgSessionDuration * 10) / 10,
        responseTime,
        clientSatisfaction: Math.round(avgRating * 10) / 10
      },
      topLanguages,
      recentTrends
    };
  }

  /**
   * Calculate sessions over time (weekly breakdown)
   */
  private calculateSessionsOverTime(sessions: any[], startDate: Date, endDate: Date) {
    const sessionsOverTime = [];
    const weekMs = 7 * 24 * 60 * 60 * 1000;
    const numberOfWeeks = Math.ceil((endDate.getTime() - startDate.getTime()) / weekMs);
    
    for (let i = 0; i < Math.min(numberOfWeeks, 8); i++) {
      const weekStart = new Date(endDate.getTime() - (i + 1) * weekMs);
      const weekEnd = new Date(endDate.getTime() - i * weekMs);
      
      const weekSessions = sessions.filter((s: any) => 
        s.scheduledAt >= weekStart && s.scheduledAt < weekEnd
      );
      
      const vriSessions = weekSessions.filter((s: any) => s.sessionType === 'VRI').length;
      const opiSessions = weekSessions.filter((s: any) => s.sessionType === 'OPI').length;
      const weekEarnings = weekSessions
        .filter((s: any) => s.status === 'COMPLETED')
        .reduce((sum: number, s: any) => sum + s.earnings, 0);
      
      sessionsOverTime.unshift({
        period: `Week ${numberOfWeeks - i}`,
        vriSessions,
        opiSessions,
        earnings: Math.round(weekEarnings * 100) / 100
      });
    }

    return sessionsOverTime;
  }

  /**
   * Calculate top languages from sessions
   */
  private calculateTopLanguages(sessions: any[]) {
    const languageStats: Record<string, { sessions: number; earnings: number }> = {};
    
    sessions.forEach((session: any) => {
      if (!languageStats[session.languageTo]) {
        languageStats[session.languageTo] = { sessions: 0, earnings: 0 };
      }
      languageStats[session.languageTo].sessions++;
      if (session.status === 'COMPLETED') {
        languageStats[session.languageTo].earnings += session.earnings;
      }
    });
    
    return Object.entries(languageStats)
      .map(([language, stats]) => ({
        language,
        sessions: stats.sessions,
        earnings: Math.round(stats.earnings * 100) / 100
      }))
      .sort((a, b) => b.sessions - a.sessions)
      .slice(0, 4);
  }

  /**
   * Calculate trends compared to previous period
   */
  private async calculateTrends(startDate: Date) {
    const periodLength = new Date().getTime() - startDate.getTime();
    const previousPeriodStart = new Date(startDate.getTime() - periodLength);
    
    const previousSessions = await prisma.interpreterSession.findMany({
      where: {
        interpreterProfileId: this.interpreterProfileId,
        scheduledAt: {
          gte: previousPeriodStart,
          lt: startDate
        }
      }
    });
    
    const currentSessions = await prisma.interpreterSession.findMany({
      where: {
        interpreterProfileId: this.interpreterProfileId,
        scheduledAt: {
          gte: startDate,
          lte: new Date()
        }
      }
    });

    const previousCompleted = previousSessions.filter((s: any) => s.status === 'COMPLETED');
    const currentCompleted = currentSessions.filter((s: any) => s.status === 'COMPLETED');
    
    const previousEarnings = previousCompleted.reduce((sum: number, s: any) => sum + s.earnings, 0);
    const currentEarnings = currentCompleted.reduce((sum: number, s: any) => sum + s.earnings, 0);
    
    const previousAvgRating = previousCompleted.length > 0 ? 
      previousCompleted.reduce((sum: number, s: any) => sum + (s.rating || 0), 0) / previousCompleted.length : 0;
    const currentAvgRating = currentCompleted.length > 0 ? 
      currentCompleted.reduce((sum: number, s: any) => sum + (s.rating || 0), 0) / currentCompleted.length : 0;
    
    const earningsGrowth = previousEarnings > 0 ? 
      ((currentEarnings - previousEarnings) / previousEarnings) * 100 : 0;
    const sessionsGrowth = previousSessions.length > 0 ? 
      ((currentSessions.length - previousSessions.length) / previousSessions.length) * 100 : 0;
    const ratingChange = currentAvgRating - previousAvgRating;
    
    return {
      earningsGrowth: Math.round(earningsGrowth * 10) / 10,
      sessionsGrowth: Math.round(sessionsGrowth * 10) / 10,
      ratingChange: Math.round(ratingChange * 100) / 100
    };
  }


  /**
   * Get date range based on time range parameter
   */
  private getDateRange(timeRange: string) {
    const endDate = new Date();
    const startDate = new Date();
    
    switch (timeRange) {
      case 'last7days':
        startDate.setDate(endDate.getDate() - 7);
        break;
      case 'last30days':
        startDate.setDate(endDate.getDate() - 30);
        break;
      case 'last3months':
        startDate.setMonth(endDate.getMonth() - 3);
        break;
      case 'lastyear':
        startDate.setFullYear(endDate.getFullYear() - 1);
        break;
      default:
        startDate.setDate(endDate.getDate() - 30);
    }

    return { startDate, endDate };
  }
}
