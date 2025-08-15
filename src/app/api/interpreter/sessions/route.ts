import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyJWTToken } from '@/lib/utils/credentials';

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

// GET /api/interpreter/sessions - Get session reports for the interpreter
export async function GET(request: NextRequest) {
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

    // Get query parameters for filtering
    const { searchParams } = new URL(request.url);
    const dateRange = searchParams.get('dateRange') || 'last30days';
    const status = searchParams.get('status') || 'all';
    const type = searchParams.get('type') || 'all';
    const search = searchParams.get('search') || '';
    
    // Calculate date range based on dateRange parameter
    const today = new Date();
    const startDate = new Date();
    
    switch (dateRange) {
      case 'last7days':
        startDate.setDate(today.getDate() - 7);
        break;
      case 'last30days':
        startDate.setDate(today.getDate() - 30);
        break;
      case 'last3months':
        startDate.setMonth(today.getMonth() - 3);
        break;
      case 'lastyear':
        startDate.setFullYear(today.getFullYear() - 1);
        break;
      default:
        startDate.setDate(today.getDate() - 30); // default to 30 days
    }

    // Get real session data from database
    const interpreterProfileId = interpreter.interpreterProfile.id;
    
    // Fetch sessions from database within the date range
    const sessions = await prisma.interpreterSession.findMany({
      where: {
        interpreterProfileId,
        scheduledAt: {
          gte: startDate,
          lte: today
        }
      },
      orderBy: {
        scheduledAt: 'desc'
      }
    });

    // Convert database sessions to the format expected by the frontend
    const reports = sessions.map((session: any) => {
      // Format dates and times
      const sessionDate = new Date(session.scheduledAt);
      const startTime = sessionDate.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });
      
      let endTime = '-';
      if (session.endedAt) {
        const endDate = new Date(session.endedAt);
        endTime = endDate.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: true
        });
      }
      
      // Map database status to frontend status
      const statusMap: Record<string, string> = {
        'COMPLETED': 'Completed',
        'CANCELLED': 'Cancelled',
        'NO_SHOW': 'No-Show',
        'SCHEDULED': 'Scheduled',
        'IN_PROGRESS': 'In Progress'
      };
      
      return {
        id: session.id,
        date: sessionDate.toISOString().split('T')[0],
        startTime,
        endTime,
        duration: session.duration ? `${session.duration} min` : '-',
        type: session.sessionType, // VRI or OPI
        language: `${session.languageFrom} → ${session.languageTo}`,
        client: session.clientName,
        status: statusMap[session.status] || session.status,
        rating: session.rating,
        earnings: '$' + session.earnings.toFixed(2),
        notes: session.notes,
        cancellationReason: session.cancellationReason
      };
    });

    // Apply filters
    let filteredReports = reports;

    // Status filter
    if (status !== 'all') {
      filteredReports = filteredReports.filter((report: any) => report.status === status);
    }

    // Type filter
    if (type !== 'all') {
      filteredReports = filteredReports.filter((report: any) => report.type === type);
    }

    // Search filter
    if (search) {
      const searchLower = search.toLowerCase();
      filteredReports = filteredReports.filter((report: any) =>
        report.client.toLowerCase().includes(searchLower) ||
        report.language.toLowerCase().includes(searchLower)
      );
    }

    // Calculate summary statistics
    const totalSessions = reports.length;
    const completedSessions = reports.filter((r: any) => r.status === 'Completed').length;
    const totalEarnings = reports
      .filter((r: any) => r.status === 'Completed')
      .reduce((sum: number, r: any) => sum + parseFloat(r.earnings.replace('$', '')), 0);
    const avgRating = reports
      .filter((r: any) => r.rating !== null)
      .reduce((sum: number, r: any, _: any, arr: any[]) => sum + (r.rating || 0) / arr.length, 0);
    const totalHours = reports
      .filter((r: any) => r.status === 'Completed')
      .reduce((sum: number, r: any) => {
        const duration = parseInt(r.duration.replace(' min', ''));
        return sum + (duration / 60);
      }, 0);
    const completionRate = totalSessions > 0 ? (completedSessions / totalSessions) * 100 : 0;

    const summary = {
      totalSessions,
      completedSessions,
      totalEarnings: Math.round(totalEarnings * 100) / 100,
      avgRating: Math.round(avgRating * 10) / 10,
      totalHours: Math.round(totalHours * 10) / 10,
      completionRate: Math.round(completionRate)
    };

    return NextResponse.json({
      success: true,
      data: {
        reports: filteredReports,
        summary,
        totalCount: reports.length,
        filteredCount: filteredReports.length
      },
      filters: {
        dateRange,
        status,
        type,
        search
      }
    });

  } catch (error) {
    console.error('Get interpreter session reports error:', error);
    
    if (error instanceof Error && error.message === 'Invalid or expired token') {
      return NextResponse.json(
        { error: 'Invalid or expired authentication token' },
        { status: 401 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to get session reports' },
      { status: 500 }
    );
  }
}
