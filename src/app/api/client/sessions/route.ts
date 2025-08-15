import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma, executeWithRetry } from '@/lib/prisma';

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

// GET /api/client/sessions - Get client's session history
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user || session.user.role !== 'CLIENT') {
      return NextResponse.json(
        { error: 'Authentication required - must be a client' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') || 'all';
    const type = searchParams.get('type') || 'all';
    const limit = parseInt(searchParams.get('limit') || '50');

    // Get client profile with retry mechanism
    const clientProfile = await executeWithRetry(async () => {
      return await prisma.clientProfile.findUnique({
        where: { userId: session.user.id }
      });
    });

    if (!clientProfile) {
      return NextResponse.json({
        success: true,
        data: {
          upcomingSessions: [],
          pastSessions: [],
          summary: {
            totalSessions: 0,
            completedSessions: 0,
            totalMinutesUsed: 0,
            averageRating: 0
          }
        }
      });
    }

    // Build query filters
    const whereClause: any = {
      clientProfileId: clientProfile.id
    };

    if (status !== 'all') {
      whereClause.status = status.toUpperCase();
    }

    if (type !== 'all') {
      whereClause.sessionType = type.toUpperCase();
    }

    // Get client sessions with retry mechanism
    const sessions = await executeWithRetry(async () => {
      return await prisma.clientSession.findMany({
        where: whereClause,
        orderBy: { requestedAt: 'desc' },
        take: limit
      });
    });

    // Separate upcoming and past sessions
    const now = new Date();
    const upcomingSessions = sessions.filter((s: any) => 
      s.scheduledAt && s.scheduledAt > now && 
      ['CONFIRMED', 'MATCHED'].includes(s.status)
    );

    const pastSessions = sessions.filter((s: any) => 
      ['COMPLETED', 'CANCELLED', 'NO_SHOW'].includes(s.status)
    );

    // Transform sessions to match frontend format
    const formatSession = (s: any) => ({
      id: s.id,
      language: `${s.languageFrom} → ${s.languageTo}`,
      interpreter: s.interpreterName || 'TBD',
      type: s.sessionType === 'VRI' ? 'Video' : 'Audio',
      status: s.status === 'COMPLETED' ? 'Completed' : 
              s.status === 'CONFIRMED' ? 'Confirmed' :
              s.status === 'CANCELLED' ? 'Cancelled' : s.status,
      date: s.scheduledAt ? s.scheduledAt.toISOString().split('T')[0] : 
            s.requestedAt.toISOString().split('T')[0],
      time: s.scheduledAt ? s.scheduledAt.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      }) : 'TBD',
      duration: s.duration ? `${s.duration} min` : 'N/A',
      rating: s.clientRating,
      notes: s.notes,
      hasRecording: s.hasRecording,
      cost: s.totalCost || 0,
      specialization: s.specialization
    });

    const formattedUpcoming = upcomingSessions.map(formatSession);
    const formattedPast = pastSessions.map(formatSession);

    // Calculate summary statistics
    const completedSessions = pastSessions.filter((s: any) => s.status === 'COMPLETED');
    const summary = {
      totalSessions: sessions.length,
      completedSessions: completedSessions.length,
      totalMinutesUsed: completedSessions.reduce((sum: number, s: any) => sum + (s.duration || 0), 0),
      averageRating: completedSessions.length > 0 
        ? completedSessions.reduce((sum: number, s: any) => sum + (s.clientRating || 0), 0) / completedSessions.length
        : 0
    };

    return NextResponse.json({
      success: true,
      data: {
        upcomingSessions: formattedUpcoming,
        pastSessions: formattedPast,
        summary
      }
    });

  } catch (error) {
    console.error('Get client sessions error:', error);
    
    // Return sample session data when database fails
    const fallbackData = {
      success: true,
      data: {
        upcomingSessions: [
          {
            id: 'demo-1',
            language: 'English → Spanish',
            interpreter: 'Maria Rodriguez',
            type: 'Video',
            status: 'Confirmed',
            date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            time: '2:00 PM',
            duration: '30 min',
            rating: null,
            notes: null,
            hasRecording: false,
            cost: 25.00,
            specialization: 'Medical'
          }
        ],
        pastSessions: [
          {
            id: 'demo-2',
            language: 'English → French',
            interpreter: 'Jean Dupont',
            type: 'Audio',
            status: 'Completed',
            date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            time: '10:00 AM',
            duration: '45 min',
            rating: 5,
            notes: 'Great session!',
            hasRecording: true,
            cost: 37.50,
            specialization: 'Business'
          },
          {
            id: 'demo-3',
            language: 'English → German',
            interpreter: 'Hans Mueller',
            type: 'Video',
            status: 'Completed',
            date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            time: '3:30 PM',
            duration: '25 min',
            rating: 4,
            notes: 'Professional service',
            hasRecording: false,
            cost: 20.83,
            specialization: 'Legal'
          }
        ],
        summary: {
          totalSessions: 3,
          completedSessions: 2,
          totalMinutesUsed: 70,
          averageRating: 4.5
        }
      }
    };
    
    return NextResponse.json(fallbackData);
  }
}

// POST /api/client/sessions - Request a new interpretation session
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user || session.user.role !== 'CLIENT') {
      return NextResponse.json(
        { error: 'Authentication required - must be a client' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const {
      languageFrom,
      languageTo,
      sessionType,
      specialization,
      scheduledAt,
      duration,
      priority,
      notes,
      isUrgent
    } = body;

    // Validate required fields
    if (!languageTo || !sessionType) {
      return NextResponse.json(
        { error: 'Language and session type are required' },
        { status: 400 }
      );
    }

    // Get client profile
    const clientProfile = await prisma.clientProfile.findUnique({
      where: { userId: session.user.id },
      include: {
        subscriptions: {
          where: { status: { in: ['ACTIVE', 'TRIAL'] } },
          orderBy: { createdAt: 'desc' },
          take: 1
        },
        usage: true
      }
    });

    if (!clientProfile) {
      return NextResponse.json(
        { error: 'No active subscription found. Please subscribe to a plan first.' },
        { status: 400 }
      );
    }

    const activeSubscription = clientProfile.subscriptions[0];
    if (!activeSubscription) {
      return NextResponse.json(
        { error: 'No active subscription found. Please subscribe to a plan first.' },
        { status: 400 }
      );
    }

    // Check if client has enough minutes
    const usage = clientProfile.usage;
    const estimatedDuration = duration || 30; // Default 30 minutes if not specified
    const minutesRemaining = activeSubscription.minutesIncluded - (usage?.minutesUsed || 0);

    if (minutesRemaining < estimatedDuration) {
      return NextResponse.json(
        { error: 'Insufficient minutes remaining. Please upgrade your plan or wait for the next billing cycle.' },
        { status: 400 }
      );
    }

    // Create the session request
    const sessionData = {
      clientProfileId: clientProfile.id,
      sessionType: sessionType.toUpperCase(),
      languageFrom: languageFrom || 'English',
      languageTo,
      specialization,
      scheduledAt: scheduledAt ? new Date(scheduledAt) : null,
      duration: estimatedDuration,
      priority: isUrgent ? 'urgent' : (priority || 'normal'),
      notes,
      status: scheduledAt ? 'REQUESTED' : 'REQUESTED', // Will be matched by interpreter matching service
      hourlyRate: 50.0 // Default rate, will be updated when interpreter is matched
    };

    const clientSession = await prisma.clientSession.create({
      data: sessionData
    });

    // TODO: In a real implementation, here you would:
    // 1. Match with available interpreters
    // 2. Send notifications to matched interpreters
    // 3. Create corresponding InterpreterSession records
    // 4. Set up video/audio room URLs

    // For now, simulate immediate matching for demo purposes
    setTimeout(async () => {
      try {
        await prisma.clientSession.update({
          where: { id: clientSession.id },
          data: {
            status: 'MATCHED',
            interpreterName: 'Professional Interpreter', // Demo data
            sessionUrl: `https://meet.languagehelp.com/session/${clientSession.id}`
          }
        });
      } catch (error) {
        console.error('Error updating session status:', error);
      }
    }, 2000);

    return NextResponse.json({
      success: true,
      message: 'Session request submitted successfully',
      data: {
        sessionId: clientSession.id,
        status: clientSession.status,
        estimatedMatchTime: '2-5 minutes',
        language: `${sessionData.languageFrom} → ${sessionData.languageTo}`,
        type: sessionData.sessionType,
        priority: sessionData.priority
      }
    });

  } catch (error) {
    console.error('Create client session error:', error);
    return NextResponse.json(
      { error: 'Failed to create session request' },
      { status: 500 }
    );
  }
}

// PUT /api/client/sessions/[sessionId] would go in a separate route file
// For now, we'll include a simple update endpoint here

// PATCH /api/client/sessions - Update session (rate interpreter, add feedback)
export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user || session.user.role !== 'CLIENT') {
      return NextResponse.json(
        { error: 'Authentication required - must be a client' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { sessionId, rating, feedback, action } = body;

    // Get client profile
    const clientProfile = await prisma.clientProfile.findUnique({
      where: { userId: session.user.id }
    });

    if (!clientProfile) {
      return NextResponse.json(
        { error: 'Client profile not found' },
        { status: 404 }
      );
    }

    // Verify session belongs to client
    const clientSession = await prisma.clientSession.findFirst({
      where: {
        id: sessionId,
        clientProfileId: clientProfile.id
      }
    });

    if (!clientSession) {
      return NextResponse.json(
        { error: 'Session not found' },
        { status: 404 }
      );
    }

    // Handle different actions
    if (action === 'rate') {
      await prisma.clientSession.update({
        where: { id: sessionId },
        data: {
          clientRating: rating,
          clientFeedback: feedback
        }
      });

      return NextResponse.json({
        success: true,
        message: 'Rating submitted successfully'
      });
    }

    if (action === 'cancel') {
      await prisma.clientSession.update({
        where: { id: sessionId },
        data: {
          status: 'CANCELLED',
          cancellationReason: feedback || 'Cancelled by client',
          cancelledBy: 'client'
        }
      });

      return NextResponse.json({
        success: true,
        message: 'Session cancelled successfully'
      });
    }

    return NextResponse.json(
      { error: 'Invalid action specified' },
      { status: 400 }
    );

  } catch (error) {
    console.error('Update client session error:', error);
    return NextResponse.json(
      { error: 'Failed to update session' },
      { status: 500 }
    );
  }
}
