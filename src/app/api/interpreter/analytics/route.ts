import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyJWTToken } from '@/lib/utils/credentials';
import { PrivateAnalyticsManager } from '@/lib/analytics/private-analytics-manager';
import { InterpreterAnalyticsInitService } from '@/lib/services/interpreter-analytics-init';

// GET /api/interpreter/analytics - Get analytics data for the interpreter dashboard
export async function GET(request: NextRequest) {
  try {
    console.log('🔍 Analytics API called');
    
    // Get token from cookies
    const token = request.cookies.get('auth-token')?.value;
    console.log('🍪 Auth token present:', !!token);
    
    if (!token) {
      console.log('❌ No auth token found');
      return NextResponse.json(
        { error: 'Authentication required - no token found' },
        { status: 401 }
      );
    }

    // Verify token and get user info
    let decoded;
    try {
      decoded = verifyJWTToken(token);
      console.log('✅ Token decoded successfully:', { userId: decoded.userId, role: decoded.role });
    } catch (tokenError) {
      console.log('❌ Token verification failed:', tokenError instanceof Error ? tokenError.message : 'Unknown error');
      return NextResponse.json(
        { error: 'Invalid or expired token' },
        { status: 401 }
      );
    }
    
    if (!decoded || decoded.role !== 'INTERPRETER') {
      console.log('❌ Invalid role:', decoded?.role);
      return NextResponse.json(
        { error: 'Invalid token or not an interpreter' },
        { status: 401 }
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
      console.log('❌ Interpreter profile not found for user:', decoded.userId);
      return NextResponse.json(
        { error: 'Interpreter profile not found' },
        { status: 404 }
      );
    }

    console.log('✅ Found interpreter profile:', interpreter.interpreterProfile.id);

    // Check if this interpreter has analytics initialized
    let isNewInterpreter = false;
    const existingAnalytics = await prisma.interpreterAnalytics.findUnique({
      where: { interpreterProfileId: interpreter.interpreterProfile.id }
    });

    if (!existingAnalytics) {
      console.log('🆕 New interpreter detected, initializing private analytics...');
      await InterpreterAnalyticsInitService.initializeInterpreterAnalytics(interpreter.interpreterProfile.id);
      isNewInterpreter = true;
      console.log('✅ Analytics initialized for new interpreter');
    }

    // Get interpreter's join date and session count for onboarding
    const interpreterJoinDate = interpreter.interpreterProfile.createdAt;
    const totalSessionsEver = await prisma.interpreterSession.count({
      where: { interpreterProfileId: interpreter.interpreterProfile.id }
    });

    const daysSinceJoined = Math.floor((Date.now() - interpreterJoinDate.getTime()) / (1000 * 60 * 60 * 24));

    // Get query parameters for time range filtering
    const { searchParams } = new URL(request.url);
    const timeRange = searchParams.get('timeRange') || 'last30days';
    
    console.log('📊 Generating analytics for timeRange:', timeRange);

    // Use the PRIVATE AnalyticsManager to generate isolated analytics data
    const privateAnalyticsManager = new PrivateAnalyticsManager(interpreter.interpreterProfile.id);
    const analyticsData = await privateAnalyticsManager.generatePrivateAnalytics(timeRange);

    if (!analyticsData) {
      console.log('❌ Failed to generate analytics data');
      return NextResponse.json(
        { error: 'Failed to generate analytics data' },
        { status: 500 }
      );
    }

    console.log('✅ Analytics data generated successfully');
    
    // Determine interpreter status for frontend
    let interpreterStatus = 'experienced';
    if (isNewInterpreter || totalSessionsEver === 0) {
      interpreterStatus = 'new';
    } else if (totalSessionsEver < 5) {
      interpreterStatus = 'beginner';
    } else if (totalSessionsEver < 20) {
      interpreterStatus = 'developing';
    }

    // Generate personalized messages based on status
    let welcomeMessage = '';
    let nextSteps = [];

    if (interpreterStatus === 'new') {
      welcomeMessage = `Welcome to your analytics dashboard! You joined ${daysSinceJoined} ${daysSinceJoined === 1 ? 'day' : 'days'} ago.`;
      nextSteps = [
        'Complete your first interpretation session to start building your analytics',
        'Set up your availability to receive session requests',
        'Complete your language certifications to attract more clients'
      ];
    } else if (interpreterStatus === 'beginner') {
      welcomeMessage = `Great start! You've completed ${totalSessionsEver} session${totalSessionsEver === 1 ? '' : 's'} since joining.`;
      nextSteps = [
        'Continue building your reputation with quality sessions',
        'Expand your language offerings to increase opportunities',
        'Maintain high ratings to attract premium clients'
      ];
    } else if (interpreterStatus === 'developing') {
      welcomeMessage = `You're doing well with ${totalSessionsEver} completed sessions! Keep up the momentum.`;
      nextSteps = [
        'Focus on consistency to build a strong client base',
        'Consider specializing in high-demand language pairs',
        'Maintain excellent response times for better opportunities'
      ];
    } else {
      welcomeMessage = `Welcome back! Your analytics show your professional growth over time.`;
      nextSteps = [
        'Continue delivering exceptional service',
        'Consider mentoring newer interpreters',
        'Explore premium service offerings'
      ];
    }

    return NextResponse.json({
      success: true,
      data: analyticsData,
      metadata: {
        interpreterStatus,
        isNewInterpreter,
        totalSessionsEver,
        daysSinceJoined,
        joinDate: interpreterJoinDate.toISOString(),
        welcomeMessage,
        nextSteps,
        profileCompleteness: {
          hasLanguages: interpreter.interpreterProfile.languages?.length > 0,
          hasBio: !!interpreter.interpreterProfile.bio,
          hasPhone: !!interpreter.interpreterProfile.phone,
          hasHourlyRate: !!interpreter.interpreterProfile.hourlyRate,
          isVerified: interpreter.interpreterProfile.isVerified
        }
      },
      timeRange
    });

  } catch (error) {
    console.error('Get interpreter analytics error:', error);
    
    if (error instanceof Error && error.message === 'Invalid or expired token') {
      return NextResponse.json(
        { error: 'Invalid or expired authentication token' },
        { status: 401 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to get interpreter analytics' },
      { status: 500 }
    );
  }
}
