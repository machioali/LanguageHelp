import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyJWTToken } from '@/lib/utils/credentials';

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

// GET /api/interpreter/profile - Get current interpreter's profile data
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

    // Get interpreter profile with all related data
    const interpreter = await prisma.user.findUnique({
      where: { 
        id: decoded.userId,
        role: 'INTERPRETER'
      },
      include: {
        interpreterProfile: {
          include: {
            languages: {
              select: {
                languageCode: true,
                languageName: true,
                proficiency: true,
                isNative: true,
              }
            },
            specializations: {
              select: {
                specialization: true,
              }
            },
            certifications: {
              select: {
                name: true,
                issuingOrganization: true,
                issueDate: true,
                expiryDate: true,
                certificateNumber: true,
                isVerified: true,
              }
            },
            credentials: {
              select: {
                isFirstLogin: true,
                lastLoginAt: true,
                // Don't expose sensitive credentials
              }
            }
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

    const profile = interpreter.interpreterProfile;

    // Calculate real stats from InterpreterSession data
    // NOTE: Using scheduledAt for consistency with Analytics and Session Reports APIs
    // This ensures earnings calculations match across all interpreter dashboards
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay());
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    // Fetch all sessions for this interpreter
    const allSessions = await prisma.interpreterSession.findMany({
      where: {
        interpreterProfileId: profile.id
      },
      select: {
        status: true,
        startedAt: true,
        endedAt: true,
        scheduledAt: true,
        duration: true,
        earnings: true,
        rating: true,
        createdAt: true
      }
    });

    // Calculate today's stats (using scheduledAt for consistency)
    const todaySessions = allSessions.filter(s => 
      s.scheduledAt && s.scheduledAt >= today
    );
    const todayCompleted = todaySessions.filter(s => s.status === 'COMPLETED');
    
    // Calculate this week's stats  
    const thisWeekSessions = allSessions.filter(s => 
      s.scheduledAt && s.scheduledAt >= startOfWeek
    );
    const thisWeekCompleted = thisWeekSessions.filter(s => s.status === 'COMPLETED');
    
    // Calculate this month's stats
    const thisMonthSessions = allSessions.filter(s => 
      s.scheduledAt && s.scheduledAt >= startOfMonth
    );
    const thisMonthCompleted = thisMonthSessions.filter(s => s.status === 'COMPLETED');
    
    // Calculate overall stats
    const completedSessions = allSessions.filter(s => s.status === 'COMPLETED');
    const totalSessions = allSessions.length;
    const completionRate = totalSessions > 0 ? Math.round((completedSessions.length / totalSessions) * 100) : 0;
    
    // Calculate average rating
    const ratedSessions = completedSessions.filter(s => s.rating && s.rating > 0);
    const avgRating = ratedSessions.length > 0 
      ? Math.round((ratedSessions.reduce((sum, s) => sum + (s.rating || 0), 0) / ratedSessions.length) * 10) / 10 
      : 0;
    
    const stats = {
      today: { 
        sessions: todayCompleted.length,
        hours: Math.round((todayCompleted.reduce((sum, s) => sum + (s.duration || 0), 0) / 60) * 10) / 10,
        earnings: Math.round(todayCompleted.reduce((sum, s) => sum + (s.earnings || 0), 0) * 100) / 100
      },
      thisWeek: { 
        sessions: thisWeekCompleted.length,
        hours: Math.round((thisWeekCompleted.reduce((sum, s) => sum + (s.duration || 0), 0) / 60) * 10) / 10,
        earnings: Math.round(thisWeekCompleted.reduce((sum, s) => sum + (s.earnings || 0), 0) * 100) / 100
      },
      thisMonth: { 
        sessions: thisMonthCompleted.length,
        hours: Math.round((thisMonthCompleted.reduce((sum, s) => sum + (s.duration || 0), 0) / 60) * 10) / 10,
        earnings: Math.round(thisMonthCompleted.reduce((sum, s) => sum + (s.earnings || 0), 0) * 100) / 100
      },
      rating: avgRating,
      totalSessions: totalSessions,
      completionRate: completionRate,
    };

    const responseData = {
      success: true,
      interpreter: {
        id: interpreter.id,
        email: interpreter.email,
        name: interpreter.name,
        role: interpreter.role,
      },
      profile: {
        id: profile.id,
        firstName: profile.firstName,
        lastName: profile.lastName,
        phone: profile.phone,
        hourlyRate: profile.hourlyRate,
        bio: profile.bio,
        experience: profile.experience,
        status: profile.status,
        isVerified: profile.isVerified,
        availability: profile.availability,
        languages: profile.languages,
        specializations: profile.specializations.map(s => s.specialization),
        certifications: profile.certifications,
      },
      credentials: {
        isFirstLogin: profile.credentials?.isFirstLogin || false,
        lastLoginAt: profile.credentials?.lastLoginAt,
      },
      stats,
    };

    return NextResponse.json(responseData);

  } catch (error) {
    console.error('Get interpreter profile error:', error);
    
    if (error instanceof Error && error.message === 'Invalid or expired token') {
      return NextResponse.json(
        { error: 'Invalid or expired authentication token' },
        { status: 401 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to get interpreter profile' },
      { status: 500 }
    );
  }
}
