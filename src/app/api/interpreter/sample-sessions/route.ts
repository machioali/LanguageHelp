import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyJWTToken } from '@/lib/utils/credentials';

// POST /api/interpreter/sample-sessions - Create sample session data for testing
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

    // Get interpreter profile
    const interpreter = await prisma.user.findUnique({
      where: { 
        id: decoded.userId,
        role: 'INTERPRETER'
      },
      include: {
        interpreterProfile: true
      }
    });

    if (!interpreter || !interpreter.interpreterProfile) {
      return NextResponse.json(
        { error: 'Interpreter profile not found' },
        { status: 404 }
      );
    }

    const profile = interpreter.interpreterProfile;

    // Create sample sessions with different dates and statuses
    const now = new Date();
    const sampleSessions = [
      // Today's sessions
      {
        interpreterProfileId: profile.id,
        clientId: 'sample-client-1',
        clientName: 'John Smith',
        sessionType: 'VRI',
        languageFrom: 'English',
        languageTo: 'Spanish',
        status: 'COMPLETED',
        scheduledAt: new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours() - 2), // Today, 2 hours ago
        startedAt: new Date(now.getTime() - 2 * 60 * 60 * 1000),
        endedAt: new Date(now.getTime() - 1 * 60 * 60 * 1000), // 1 hour ago
        duration: 60,
        hourlyRate: profile.hourlyRate || 45,
        earnings: profile.hourlyRate || 45,
        rating: 5,
        feedback: 'Excellent interpretation services!',
      },
      {
        interpreterProfileId: profile.id,
        clientId: 'sample-client-2',
        clientName: 'Maria Garcia',
        sessionType: 'OPI',
        languageFrom: 'English',
        languageTo: 'French',
        status: 'COMPLETED',
        scheduledAt: new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours() - 4), // Today, 4 hours ago
        startedAt: new Date(now.getTime() - 4 * 60 * 60 * 1000),
        endedAt: new Date(now.getTime() - 3.5 * 60 * 60 * 1000), // 3.5 hours ago
        duration: 30,
        hourlyRate: profile.hourlyRate || 45,
        earnings: (profile.hourlyRate || 45) * 0.5,
        rating: 4,
        feedback: 'Very professional and clear communication.',
      },

      // Yesterday's sessions
      {
        interpreterProfileId: profile.id,
        clientId: 'sample-client-3',
        clientName: 'David Wilson',
        sessionType: 'VRI',
        languageFrom: 'English',
        languageTo: 'German',
        status: 'COMPLETED',
        scheduledAt: new Date(now.getTime() - 24 * 60 * 60 * 1000), // 1 day ago
        startedAt: new Date(now.getTime() - 24 * 60 * 60 * 1000),
        endedAt: new Date(now.getTime() - 23 * 60 * 60 * 1000),
        duration: 45,
        hourlyRate: profile.hourlyRate || 45,
        earnings: (profile.hourlyRate || 45) * 0.75,
        rating: 5,
        feedback: 'Outstanding work, very satisfied with the service.',
      },

      // This week's sessions
      {
        interpreterProfileId: profile.id,
        clientId: 'sample-client-4',
        clientName: 'Lisa Johnson',
        sessionType: 'OPI',
        languageFrom: 'English',
        languageTo: 'Italian',
        status: 'COMPLETED',
        scheduledAt: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
        startedAt: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000),
        endedAt: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000 + 90 * 60 * 1000),
        duration: 90,
        hourlyRate: profile.hourlyRate || 45,
        earnings: (profile.hourlyRate || 45) * 1.5,
        rating: 4,
        feedback: 'Great experience, will use again.',
      },

      // This month's sessions
      {
        interpreterProfileId: profile.id,
        clientId: 'sample-client-5',
        clientName: 'Robert Brown',
        sessionType: 'VRI',
        languageFrom: 'English',
        languageTo: 'Portuguese',
        status: 'COMPLETED',
        scheduledAt: new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000), // 10 days ago
        startedAt: new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000),
        endedAt: new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000 + 75 * 60 * 1000),
        duration: 75,
        hourlyRate: profile.hourlyRate || 45,
        earnings: (profile.hourlyRate || 45) * 1.25,
        rating: 5,
      },

      // Cancelled session (to test completion rate)
      {
        interpreterProfileId: profile.id,
        clientId: 'sample-client-6',
        clientName: 'Sarah Davis',
        sessionType: 'VRI',
        languageFrom: 'English',
        languageTo: 'Japanese',
        status: 'CANCELLED',
        scheduledAt: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000),
        startedAt: null,
        endedAt: null,
        duration: null,
        hourlyRate: profile.hourlyRate || 45,
        earnings: 0,
        cancellationReason: 'Client cancelled due to schedule conflict',
      },

      // No-show session
      {
        interpreterProfileId: profile.id,
        clientId: 'sample-client-7',
        clientName: 'Michael Lee',
        sessionType: 'OPI',
        languageFrom: 'English',
        languageTo: 'Mandarin',
        status: 'NO_SHOW',
        scheduledAt: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000),
        startedAt: null,
        endedAt: null,
        duration: null,
        hourlyRate: profile.hourlyRate || 45,
        earnings: (profile.hourlyRate || 45) * 0.5, // Partial payment for no-show
      },
    ];

    // Delete existing sample sessions to avoid duplicates
    await prisma.interpreterSession.deleteMany({
      where: {
        interpreterProfileId: profile.id,
        clientId: {
          startsWith: 'sample-client-'
        }
      }
    });

    // Create the sample sessions
    const createdSessions = await prisma.interpreterSession.createMany({
      data: sampleSessions
    });

    return NextResponse.json({
      success: true,
      message: `Created ${createdSessions.count} sample sessions`,
      data: {
        created: createdSessions.count,
        interpreterProfileId: profile.id
      }
    });

  } catch (error) {
    console.error('Create sample sessions error:', error);
    
    return NextResponse.json(
      { error: 'Failed to create sample sessions' },
      { status: 500 }
    );
  }
}

// DELETE /api/interpreter/sample-sessions - Remove sample session data
export async function DELETE(request: NextRequest) {
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
        interpreterProfile: true
      }
    });

    if (!interpreter || !interpreter.interpreterProfile) {
      return NextResponse.json(
        { error: 'Interpreter profile not found' },
        { status: 404 }
      );
    }

    const profile = interpreter.interpreterProfile;

    // Delete sample sessions
    const deletedSessions = await prisma.interpreterSession.deleteMany({
      where: {
        interpreterProfileId: profile.id,
        clientId: {
          startsWith: 'sample-client-'
        }
      }
    });

    return NextResponse.json({
      success: true,
      message: `Deleted ${deletedSessions.count} sample sessions`,
      data: {
        deleted: deletedSessions.count
      }
    });

  } catch (error) {
    console.error('Delete sample sessions error:', error);
    
    return NextResponse.json(
      { error: 'Failed to delete sample sessions' },
      { status: 500 }
    );
  }
}
