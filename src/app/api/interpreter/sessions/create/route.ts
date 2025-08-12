import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyJWTToken } from '@/lib/utils/credentials';

// POST /api/interpreter/sessions/create - Create a completed session record
export async function POST(request: NextRequest) {
  try {
    // Get token from cookies
    const token = request.cookies.get('auth-token')?.value;
    
    if (!token) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Verify token and get user info
    const decoded = verifyJWTToken(token);
    
    if (!decoded || decoded.role !== 'INTERPRETER') {
      return NextResponse.json(
        { error: 'Invalid token or not an interpreter' },
        { status: 401 }
      );
    }

    // Get the request body
    const body = await request.json();
    const {
      sessionId,
      clientName,
      language,
      sessionType,
      duration, // in seconds, we'll convert to minutes
      startTime,
      endTime
    } = body;

    // Validate required fields
    if (!clientName || !language || !duration || !startTime || !endTime) {
      return NextResponse.json(
        { error: 'Missing required session data' },
        { status: 400 }
      );
    }

    // Get interpreter profile
    const interpreter = await prisma.user.findUnique({
      where: { 
        id: decoded.userId,
        role: 'INTERPRETER'
      },
      include: {
        interpreterProfile: {
          include: {
            languages: true
          }
        }
      }
    });

    if (!interpreter || !interpreter.interpreterProfile) {
      return NextResponse.json(
        { error: 'Interpreter profile not found' },
        { status: 404 }
      );
    }

    // Calculate session metrics
    const durationMinutes = Math.ceil(duration / 60); // Convert seconds to minutes, round up
    const startDateTime = new Date(startTime);
    const endDateTime = new Date(endTime);
    const hourlyRate = interpreter.interpreterProfile.hourlyRate || 85.0; // Default rate
    const earnings = Math.round((durationMinutes / 60) * hourlyRate * 100) / 100; // Calculate earnings

    // Determine language pair
    const languageFrom = 'English'; // Default assumption
    const languageTo = language;

    // Create session record
    const session = await prisma.interpreterSession.create({
      data: {
        interpreterProfileId: interpreter.interpreterProfile.id,
        clientName: clientName,
        sessionType: sessionType || 'VRI', // Video Remote Interpreting by default
        languageFrom: languageFrom,
        languageTo: languageTo,
        status: 'COMPLETED',
        scheduledAt: startDateTime,
        startedAt: startDateTime,
        endedAt: endDateTime,
        duration: durationMinutes,
        hourlyRate: hourlyRate,
        earnings: earnings,
        notes: `Real-time session completed via WebRTC. Session ID: ${sessionId}`,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    });

    // Update interpreter analytics asynchronously (don't wait for it)
    updateInterpreterAnalytics(interpreter.interpreterProfile.id, {
      earnings,
      durationMinutes,
      sessionType: sessionType || 'VRI',
      language: `${languageFrom} → ${languageTo}`,
      completed: true
    }).catch(error => {
      console.error('Error updating interpreter analytics:', error);
    });

    return NextResponse.json({
      success: true,
      data: {
        sessionId: session.id,
        duration: durationMinutes,
        earnings: earnings,
        message: 'Session recorded successfully'
      }
    });

  } catch (error) {
    console.error('Create interpreter session error:', error);
    
    if (error instanceof Error && error.message === 'Invalid or expired token') {
      return NextResponse.json(
        { error: 'Invalid or expired authentication token' },
        { status: 401 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to record session' },
      { status: 500 }
    );
  }
}

// Helper function to update interpreter analytics
async function updateInterpreterAnalytics(
  interpreterProfileId: string, 
  sessionData: {
    earnings: number;
    durationMinutes: number;
    sessionType: string;
    language: string;
    completed: boolean;
  }
) {
  try {
    // Get or create analytics record
    let analytics = await prisma.interpreterAnalytics.findUnique({
      where: { interpreterProfileId }
    });

    if (!analytics) {
      analytics = await prisma.interpreterAnalytics.create({
        data: {
          interpreterProfileId,
          totalEarnings: 0,
          totalSessions: 0,
          completedSessions: 0,
          totalHours: 0,
        }
      });
    }

    // Update analytics
    const newTotalEarnings = analytics.totalEarnings + sessionData.earnings;
    const newTotalSessions = analytics.totalSessions + 1;
    const newCompletedSessions = sessionData.completed ? analytics.completedSessions + 1 : analytics.completedSessions;
    const newTotalHours = analytics.totalHours + (sessionData.durationMinutes / 60);
    const newCompletionRate = newTotalSessions > 0 ? (newCompletedSessions / newTotalSessions) * 100 : 0;

    await prisma.interpreterAnalytics.update({
      where: { interpreterProfileId },
      data: {
        totalEarnings: newTotalEarnings,
        totalSessions: newTotalSessions,
        completedSessions: newCompletedSessions,
        totalHours: newTotalHours,
        completionRate: newCompletionRate,
        lastCalculated: new Date(),
        updatedAt: new Date()
      }
    });

    // Update language-specific stats
    await updateLanguageStats(analytics.id, sessionData.language, sessionData);

    // Update weekly stats
    await updateWeeklyStats(analytics.id, sessionData);

    console.log('✅ Analytics updated for interpreter:', interpreterProfileId);
  } catch (error) {
    console.error('❌ Error updating analytics:', error);
    throw error;
  }
}

// Helper function to update language statistics
async function updateLanguageStats(
  analyticsId: string,
  language: string,
  sessionData: { earnings: number; completed: boolean }
) {
  try {
    const existingStats = await prisma.interpreterLanguageStats.findUnique({
      where: {
        interpreterAnalyticsId_language: {
          interpreterAnalyticsId: analyticsId,
          language: language
        }
      }
    });

    if (existingStats) {
      await prisma.interpreterLanguageStats.update({
        where: { id: existingStats.id },
        data: {
          totalSessions: existingStats.totalSessions + 1,
          completedSessions: sessionData.completed ? existingStats.completedSessions + 1 : existingStats.completedSessions,
          totalEarnings: existingStats.totalEarnings + sessionData.earnings,
          lastSessionDate: new Date(),
          updatedAt: new Date()
        }
      });
    } else {
      await prisma.interpreterLanguageStats.create({
        data: {
          interpreterAnalyticsId: analyticsId,
          language: language,
          totalSessions: 1,
          completedSessions: sessionData.completed ? 1 : 0,
          totalEarnings: sessionData.earnings,
          lastSessionDate: new Date()
        }
      });
    }
  } catch (error) {
    console.error('Error updating language stats:', error);
  }
}

// Helper function to update weekly statistics
async function updateWeeklyStats(
  analyticsId: string,
  sessionData: { earnings: number; sessionType: string; completed: boolean }
) {
  try {
    const now = new Date();
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - now.getDay()); // Start of this week (Sunday)
    weekStart.setHours(0, 0, 0, 0);
    
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6); // End of this week (Saturday)
    weekEnd.setHours(23, 59, 59, 999);

    const existingWeekStats = await prisma.interpreterWeeklyStats.findFirst({
      where: {
        interpreterAnalyticsId: analyticsId,
        weekStartDate: weekStart,
        weekEndDate: weekEnd
      }
    });

    if (existingWeekStats) {
      const vriIncrement = sessionData.sessionType === 'VRI' ? 1 : 0;
      const opiIncrement = sessionData.sessionType === 'OPI' ? 1 : 0;

      await prisma.interpreterWeeklyStats.update({
        where: { id: existingWeekStats.id },
        data: {
          vriSessions: existingWeekStats.vriSessions + vriIncrement,
          opiSessions: existingWeekStats.opiSessions + opiIncrement,
          totalSessions: existingWeekStats.totalSessions + 1,
          completedSessions: sessionData.completed ? existingWeekStats.completedSessions + 1 : existingWeekStats.completedSessions,
          totalEarnings: existingWeekStats.totalEarnings + sessionData.earnings,
          updatedAt: new Date()
        }
      });
    } else {
      const vriSessions = sessionData.sessionType === 'VRI' ? 1 : 0;
      const opiSessions = sessionData.sessionType === 'OPI' ? 1 : 0;

      await prisma.interpreterWeeklyStats.create({
        data: {
          interpreterAnalyticsId: analyticsId,
          weekStartDate: weekStart,
          weekEndDate: weekEnd,
          vriSessions: vriSessions,
          opiSessions: opiSessions,
          totalSessions: 1,
          completedSessions: sessionData.completed ? 1 : 0,
          totalEarnings: sessionData.earnings
        }
      });
    }
  } catch (error) {
    console.error('Error updating weekly stats:', error);
  }
}
