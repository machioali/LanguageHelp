import { prisma } from '@/lib/prisma';

export interface PrivateAnalyticsData {
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

/**
 * Private Analytics Manager - Each interpreter gets their own isolated analytics storage
 * This ensures complete privacy and prevents data contamination between interpreters
 */
export class PrivateAnalyticsManager {
  private interpreterProfileId: string;

  constructor(interpreterProfileId: string) {
    this.interpreterProfileId = interpreterProfileId;
  }

  /**
   * Generate or retrieve cached private analytics for this specific interpreter
   */
  async generatePrivateAnalytics(timeRange: string = 'last30days'): Promise<PrivateAnalyticsData | null> {
    try {
      console.log(`🔒 Generating PRIVATE analytics for interpreter: ${this.interpreterProfileId}`);
      
      // First, ensure this interpreter has a private analytics record
      await this.ensureAnalyticsRecord();

      // Get the date range for calculations
      const { startDate, endDate } = this.getDateRange(timeRange);

      // Check if we have cached data that's still valid (less than 1 hour old)
      const existingAnalytics = await this.getCachedAnalytics(timeRange);
      if (existingAnalytics && this.isCacheValid(existingAnalytics.lastCalculated)) {
        console.log(`✅ Using cached private analytics for interpreter: ${this.interpreterProfileId}`);
        return this.formatAnalyticsData(existingAnalytics);
      }

      // Calculate fresh analytics from this interpreter's sessions ONLY
      console.log(`🔄 Calculating fresh private analytics for interpreter: ${this.interpreterProfileId}`);
      const freshAnalytics = await this.calculatePrivateAnalytics(startDate, endDate, timeRange);
      
      return freshAnalytics;
    } catch (error) {
      console.error('❌ Error generating private analytics:', error);
      return null;
    }
  }

  /**
   * Ensure this interpreter has a private analytics record
   */
  private async ensureAnalyticsRecord() {
    const existingRecord = await prisma.interpreterAnalytics.findUnique({
      where: { interpreterProfileId: this.interpreterProfileId }
    });

    if (!existingRecord) {
      console.log(`🆕 Creating new private analytics record for interpreter: ${this.interpreterProfileId}`);
      await prisma.interpreterAnalytics.create({
        data: {
          interpreterProfileId: this.interpreterProfileId,
          // All default values will be set automatically
        }
      });
    }
  }

  /**
   * Get cached analytics if available
   */
  private async getCachedAnalytics(timeRange: string) {
    return await prisma.interpreterAnalytics.findUnique({
      where: { interpreterProfileId: this.interpreterProfileId },
      include: {
        languageStats: true,
        weeklyStats: {
          orderBy: { weekStartDate: 'desc' },
          take: 8
        }
      }
    });
  }

  /**
   * Check if cached data is still valid (less than 1 hour old)
   */
  private isCacheValid(lastCalculated: Date): boolean {
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    return lastCalculated > oneHourAgo;
  }

  /**
   * Calculate fresh analytics from this interpreter's sessions ONLY
   */
  private async calculatePrivateAnalytics(startDate: Date, endDate: Date, timeRange: string): Promise<PrivateAnalyticsData> {
    // Get ONLY this interpreter's sessions within the specified time period
    const sessions = await prisma.interpreterSession.findMany({
      where: {
        interpreterProfileId: this.interpreterProfileId,
        scheduledAt: {
          gte: startDate,
          lte: endDate
        }
      },
      orderBy: { scheduledAt: 'desc' }
    });

    // ALSO get all-time sessions for comparison
    const allTimeSessions = await prisma.interpreterSession.findMany({
      where: {
        interpreterProfileId: this.interpreterProfileId
      },
      select: {
        status: true,
        earnings: true,
        duration: true,
        rating: true
      }
    });

    console.log(`📊 Found ${sessions.length} sessions in ${timeRange} and ${allTimeSessions.length} all-time sessions for interpreter: ${this.interpreterProfileId}`);

    // Calculate period-specific metrics (for the selected time range)
    const completedSessions = sessions.filter(s => s.status === 'COMPLETED');
    const cancelledSessions = sessions.filter(s => s.status === 'CANCELLED');
    const noShowSessions = sessions.filter(s => s.status === 'NO_SHOW');
    
    const totalEarnings = completedSessions.reduce((sum, session) => sum + session.earnings, 0);
    const totalSessions = sessions.length;
    const avgRating = completedSessions.length > 0 ? 
      completedSessions.reduce((sum, session) => sum + (session.rating || 0), 0) / completedSessions.length : 0.0;
    const totalHours = completedSessions.reduce((sum, session) => sum + (session.duration || 0), 0) / 60;

    // Calculate ALL-TIME metrics for comparison
    const allTimeCompleted = allTimeSessions.filter(s => s.status === 'COMPLETED');
    const allTimeTotalEarnings = allTimeCompleted.reduce((sum, session) => sum + session.earnings, 0);
    const allTimeTotalSessions = allTimeSessions.length;
    const allTimeAvgRating = allTimeCompleted.length > 0 ? 
      allTimeCompleted.reduce((sum, session) => sum + (session.rating || 0), 0) / allTimeCompleted.length : 0.0;
    const allTimeTotalHours = allTimeCompleted.reduce((sum, session) => sum + (session.duration || 0), 0) / 60;

    // Performance metrics
    const completionRate = totalSessions > 0 ? (completedSessions.length / totalSessions) * 100 : 0.0;
    const avgSessionDuration = completedSessions.length > 0 ? 
      completedSessions.reduce((sum, s) => sum + (s.duration || 0), 0) / completedSessions.length : 0.0;
    const responseTime = totalSessions === 0 ? 0 : 
                        completionRate > 80 ? 12 : 
                        completionRate > 60 ? 18 : 25;

    // Calculate sessions over time
    const sessionsOverTime = this.calculateSessionsOverTime(sessions, startDate, endDate);

    // Calculate top languages
    const topLanguages = this.calculateTopLanguages(sessions);

    // Calculate trends
    const recentTrends = await this.calculateTrends(startDate);

    // Cache the calculated analytics
    await this.cacheAnalytics({
      totalEarnings,
      totalSessions,
      completedSessions: completedSessions.length,
      cancelledSessions: cancelledSessions.length,
      noShowSessions: noShowSessions.length,
      avgRating,
      totalHours,
      avgSessionDuration,
      completionRate,
      responseTime,
      calculationPeriod: timeRange
    }, sessionsOverTime, topLanguages);

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
   * Cache analytics data for future use
   */
  private async cacheAnalytics(
    overview: any,
    sessionsOverTime: any[],
    topLanguages: any[]
  ) {
    // Update the main analytics record
    await prisma.interpreterAnalytics.update({
      where: { interpreterProfileId: this.interpreterProfileId },
      data: {
        totalEarnings: overview.totalEarnings,
        totalSessions: overview.totalSessions,
        completedSessions: overview.completedSessions,
        cancelledSessions: overview.cancelledSessions,
        noShowSessions: overview.noShowSessions,
        totalHours: overview.totalHours,
        avgRating: overview.avgRating,
        avgSessionDuration: overview.avgSessionDuration,
        completionRate: overview.completionRate,
        responseTime: overview.responseTime,
        lastCalculated: new Date(),
        calculationPeriod: overview.calculationPeriod,
        lastPeriodEarnings: overview.totalEarnings, // For trend calculation
        lastPeriodSessions: overview.totalSessions,
        lastPeriodRating: overview.avgRating
      }
    });

    // Cache language stats
    const analyticsRecord = await prisma.interpreterAnalytics.findUnique({
      where: { interpreterProfileId: this.interpreterProfileId }
    });

    if (analyticsRecord) {
      // Clear old language stats
      await prisma.interpreterLanguageStats.deleteMany({
        where: { interpreterAnalyticsId: analyticsRecord.id }
      });

      // Add new language stats
      for (const lang of topLanguages) {
        await prisma.interpreterLanguageStats.create({
          data: {
            interpreterAnalyticsId: analyticsRecord.id,
            language: lang.language,
            totalSessions: lang.sessions,
            completedSessions: lang.sessions, // Simplified for now
            totalEarnings: lang.earnings,
            avgRating: 0, // Would need more detailed calculation
          }
        });
      }

      // Cache weekly stats
      await prisma.interpreterWeeklyStats.deleteMany({
        where: { interpreterAnalyticsId: analyticsRecord.id }
      });

      for (const week of sessionsOverTime) {
        const weekStart = new Date();
        weekStart.setDate(weekStart.getDate() - (parseInt(week.period.split(' ')[1]) * 7));
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekStart.getDate() + 7);

        await prisma.interpreterWeeklyStats.create({
          data: {
            interpreterAnalyticsId: analyticsRecord.id,
            weekStartDate: weekStart,
            weekEndDate: weekEnd,
            vriSessions: week.vriSessions,
            opiSessions: week.opiSessions,
            totalSessions: week.vriSessions + week.opiSessions,
            completedSessions: week.vriSessions + week.opiSessions, // Simplified
            totalEarnings: week.earnings,
            avgRating: 0 // Would need more detailed calculation
          }
        });
      }
    }

    console.log(`💾 Cached private analytics for interpreter: ${this.interpreterProfileId}`);
  }

  /**
   * Format cached analytics data
   */
  private formatAnalyticsData(cachedData: any): PrivateAnalyticsData {
    const sessionsOverTime = cachedData.weeklyStats.map((week: any, index: number) => ({
      period: `Week ${cachedData.weeklyStats.length - index}`,
      vriSessions: week.vriSessions,
      opiSessions: week.opiSessions,
      earnings: week.totalEarnings
    }));

    const topLanguages = cachedData.languageStats.map((lang: any) => ({
      language: lang.language,
      sessions: lang.totalSessions,
      earnings: lang.totalEarnings
    }));

    return {
      overview: {
        totalEarnings: cachedData.totalEarnings,
        totalSessions: cachedData.totalSessions,
        avgRating: cachedData.avgRating,
        totalHours: cachedData.totalHours
      },
      sessionsOverTime,
      performanceMetrics: {
        completionRate: cachedData.completionRate,
        avgSessionDuration: cachedData.avgSessionDuration,
        responseTime: cachedData.responseTime,
        clientSatisfaction: cachedData.avgRating
      },
      topLanguages,
      recentTrends: {
        earningsGrowth: 0, // Would calculate from performance history
        sessionsGrowth: 0,
        ratingChange: 0
      }
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
      
      const weekSessions = sessions.filter(s => 
        s.scheduledAt >= weekStart && s.scheduledAt < weekEnd
      );
      
      const vriSessions = weekSessions.filter(s => s.sessionType === 'VRI').length;
      const opiSessions = weekSessions.filter(s => s.sessionType === 'OPI').length;
      const weekEarnings = weekSessions
        .filter(s => s.status === 'COMPLETED')
        .reduce((sum, s) => sum + s.earnings, 0);
      
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
    
    sessions.forEach(session => {
      const langPair = `${session.languageFrom} → ${session.languageTo}`;
      if (!languageStats[langPair]) {
        languageStats[langPair] = { sessions: 0, earnings: 0 };
      }
      languageStats[langPair].sessions++;
      if (session.status === 'COMPLETED') {
        languageStats[langPair].earnings += session.earnings;
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

    const previousCompleted = previousSessions.filter(s => s.status === 'COMPLETED');
    const currentCompleted = currentSessions.filter(s => s.status === 'COMPLETED');
    
    const previousEarnings = previousCompleted.reduce((sum, s) => sum + s.earnings, 0);
    const currentEarnings = currentCompleted.reduce((sum, s) => sum + s.earnings, 0);
    
    const previousAvgRating = previousCompleted.length > 0 ? 
      previousCompleted.reduce((sum, s) => sum + (s.rating || 0), 0) / previousCompleted.length : 0;
    const currentAvgRating = currentCompleted.length > 0 ? 
      currentCompleted.reduce((sum, s) => sum + (s.rating || 0), 0) / currentCompleted.length : 0;
    
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

  /**
   * Clean up this interpreter's private analytics (for testing/admin use)
   */
  async cleanupPrivateAnalytics() {
    const result = await prisma.interpreterAnalytics.delete({
      where: { interpreterProfileId: this.interpreterProfileId }
    });
    
    console.log(`🧹 Cleaned up private analytics for interpreter: ${this.interpreterProfileId}`);
    return result;
  }
}
