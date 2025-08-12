import { prisma } from '@/lib/prisma';

/**
 * TESTING UTILITY ONLY - DO NOT USE IN PRODUCTION
 * This creates realistic sample sessions for testing the analytics system
 */
export class AnalyticsTestUtils {
  static async createSampleSessionsForInterpreter(interpreterProfileId: string, count: number = 5) {
    console.log(`🧪 Creating ${count} sample sessions for testing...`);
    
    const languages = ['Spanish', 'French', 'Arabic', 'Mandarin', 'Portuguese'];
    const sessionTypes = ['VRI', 'OPI'];
    const statuses = ['COMPLETED', 'COMPLETED', 'COMPLETED', 'CANCELLED'];
    
    const sessions = [];
    const today = new Date();
    
    for (let i = 0; i < count; i++) {
      const daysAgo = Math.floor(Math.random() * 30);
      const scheduledAt = new Date(today);
      scheduledAt.setDate(today.getDate() - daysAgo);
      scheduledAt.setHours(Math.floor(Math.random() * 12) + 8);
      
      const duration = Math.floor(Math.random() * 90) + 30; // 30-120 minutes
      const hourlyRate = 85.0;
      const status = statuses[Math.floor(Math.random() * statuses.length)];
      const earnings = status === 'COMPLETED' ? (duration / 60) * hourlyRate : 0;
      
      sessions.push({
        interpreterProfileId,
        clientName: `Test Client ${i + 1}`,
        sessionType: sessionTypes[Math.floor(Math.random() * sessionTypes.length)],
        languageFrom: 'English',
        languageTo: languages[Math.floor(Math.random() * languages.length)],
        specialization: 'GENERAL',
        status,
        scheduledAt,
        startedAt: status === 'COMPLETED' ? new Date(scheduledAt.getTime() + 5 * 60000) : null,
        endedAt: status === 'COMPLETED' ? new Date(scheduledAt.getTime() + (duration + 5) * 60000) : null,
        duration: status === 'COMPLETED' ? duration : null,
        hourlyRate,
        earnings: Math.round(earnings * 100) / 100,
        rating: status === 'COMPLETED' ? Math.floor(Math.random() * 2) + 4 : null,
        notes: 'Sample session for testing analytics'
      });
    }
    
    // Create sessions
    for (const session of sessions) {
      await prisma.interpreterSession.create({ data: session });
    }
    
    console.log(`✅ Created ${sessions.length} sample sessions for testing`);
    return sessions;
  }
  
  /**
   * Clean up all test sessions (for cleanup)
   */
  static async cleanupTestSessions() {
    const result = await prisma.interpreterSession.deleteMany({
      where: {
        notes: 'Sample session for testing analytics'
      }
    });
    
    console.log(`🧹 Cleaned up ${result.count} test sessions`);
    return result.count;
  }
}
