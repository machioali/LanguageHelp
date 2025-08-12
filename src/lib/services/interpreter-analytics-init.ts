import { prisma } from '@/lib/prisma';

/**
 * Service to initialize private analytics storage for interpreters
 * This ensures each interpreter gets their own isolated analytics record
 */
export class InterpreterAnalyticsInitService {
  
  /**
   * Initialize private analytics for a new interpreter
   * This should be called when an interpreter first signs up or is approved
   */
  static async initializeInterpreterAnalytics(interpreterProfileId: string) {
    try {
      console.log(`🆕 Initializing private analytics for interpreter: ${interpreterProfileId}`);
      
      // Check if analytics record already exists
      const existingAnalytics = await prisma.interpreterAnalytics.findUnique({
        where: { interpreterProfileId }
      });

      if (existingAnalytics) {
        console.log(`✅ Analytics already exists for interpreter: ${interpreterProfileId}`);
        return existingAnalytics;
      }

      // Create new private analytics record with default values
      const newAnalytics = await prisma.interpreterAnalytics.create({
        data: {
          interpreterProfileId,
          // All other fields will use default values from schema:
          // totalEarnings: 0.0
          // totalSessions: 0
          // completedSessions: 0
          // cancelledSessions: 0
          // noShowSessions: 0
          // totalHours: 0.0
          // avgRating: 0.0
          // avgSessionDuration: 0.0
          // completionRate: 0.0
          // responseTime: 0.0
          // lastPeriodEarnings: 0.0
          // lastPeriodSessions: 0
          // lastPeriodRating: 0.0
          // calculationPeriod: "last30days"
          // lastCalculated: now()
        }
      });

      console.log(`✅ Created private analytics record for interpreter: ${interpreterProfileId}`);
      return newAnalytics;
      
    } catch (error) {
      console.error(`❌ Failed to initialize analytics for interpreter ${interpreterProfileId}:`, error);
      throw error;
    }
  }

  /**
   * Initialize analytics for all existing interpreters who don't have it yet
   * This is useful for migrating existing interpreters to the new private analytics system
   */
  static async initializeAllInterpreterAnalytics() {
    try {
      console.log('🔄 Initializing analytics for all existing interpreters...');
      
      // Get all interpreter profiles that don't have analytics yet
      const interpretersWithoutAnalytics = await prisma.interpreterProfile.findMany({
        where: {
          analytics: null
        },
        select: {
          id: true,
          firstName: true,
          lastName: true
        }
      });

      console.log(`📊 Found ${interpretersWithoutAnalytics.length} interpreters without private analytics`);

      let successCount = 0;
      let failureCount = 0;

      // Initialize analytics for each interpreter
      for (const interpreter of interpretersWithoutAnalytics) {
        try {
          await this.initializeInterpreterAnalytics(interpreter.id);
          successCount++;
          console.log(`✅ Initialized analytics for ${interpreter.firstName} ${interpreter.lastName} (${interpreter.id})`);
        } catch (error) {
          failureCount++;
          console.error(`❌ Failed to initialize analytics for ${interpreter.firstName} ${interpreter.lastName} (${interpreter.id}):`, error);
        }
      }

      console.log(`🎯 Analytics initialization complete: ${successCount} success, ${failureCount} failures`);
      
      return {
        total: interpretersWithoutAnalytics.length,
        success: successCount,
        failures: failureCount
      };
      
    } catch (error) {
      console.error('❌ Failed to initialize analytics for all interpreters:', error);
      throw error;
    }
  }

  /**
   * Refresh analytics for a specific interpreter
   * This forces recalculation of all analytics data
   */
  static async refreshInterpreterAnalytics(interpreterProfileId: string) {
    try {
      console.log(`🔄 Refreshing analytics for interpreter: ${interpreterProfileId}`);
      
      // Update the lastCalculated timestamp to force recalculation
      const updated = await prisma.interpreterAnalytics.update({
        where: { interpreterProfileId },
        data: {
          lastCalculated: new Date(0), // Set to epoch to force refresh
          updatedAt: new Date()
        }
      });

      console.log(`✅ Marked analytics for refresh: ${interpreterProfileId}`);
      return updated;
      
    } catch (error) {
      console.error(`❌ Failed to refresh analytics for interpreter ${interpreterProfileId}:`, error);
      throw error;
    }
  }

  /**
   * Get analytics summary for all interpreters (admin use)
   */
  static async getAnalyticsSummary() {
    try {
      const summary = await prisma.interpreterAnalytics.aggregate({
        _count: {
          id: true
        },
        _sum: {
          totalEarnings: true,
          totalSessions: true,
          completedSessions: true
        },
        _avg: {
          avgRating: true,
          completionRate: true
        }
      });

      const totalInterpreters = await prisma.interpreterProfile.count();
      const interpretersWithAnalytics = summary._count.id;
      const interpretersWithoutAnalytics = totalInterpreters - interpretersWithAnalytics;

      return {
        totalInterpreters,
        interpretersWithAnalytics,
        interpretersWithoutAnalytics,
        totalEarningsAcrossAll: summary._sum.totalEarnings || 0,
        totalSessionsAcrossAll: summary._sum.totalSessions || 0,
        totalCompletedSessionsAcrossAll: summary._sum.completedSessions || 0,
        avgRatingAcrossAll: summary._avg.avgRating || 0,
        avgCompletionRateAcrossAll: summary._avg.completionRate || 0
      };
      
    } catch (error) {
      console.error('❌ Failed to get analytics summary:', error);
      throw error;
    }
  }
}
