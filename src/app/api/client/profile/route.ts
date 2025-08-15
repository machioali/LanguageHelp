import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma, executeWithRetry } from '@/lib/prisma';

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

// GET /api/client/profile - Get current client's profile data
export async function GET(request: NextRequest) {
  // Get session from NextAuth
  const session = await getServerSession(authOptions);
  
  if (!session || !session.user || session.user.role !== 'CLIENT') {
    return NextResponse.json(
      { error: 'Authentication required - must be a client' },
      { status: 401 }
    );
  }

  try {

    // Get client user with profile using retry mechanism
    const client = await executeWithRetry(async () => {
      return await prisma.user.findUnique({
        where: { 
          id: session.user.id,
          role: 'CLIENT'
        },
        include: {
          clientProfile: {
            include: {
              subscriptions: {
                where: { status: 'ACTIVE' },
                orderBy: { createdAt: 'desc' },
                take: 1
              },
              usage: true
            }
          }
        }
      });
    });

    if (!client) {
      return NextResponse.json(
        { error: 'Client not found' },
        { status: 404 }
      );
    }

    // Create client profile if it doesn't exist
    let clientProfile = client.clientProfile;
    if (!clientProfile) {
      clientProfile = await executeWithRetry(async () => {
        return await prisma.clientProfile.create({
          data: {
            userId: client.id,
            firstName: client.name?.split(' ')[0] || '',
            lastName: client.name?.split(' ').slice(1).join(' ') || ''
          },
          include: {
            subscriptions: {
              where: { status: 'ACTIVE' },
              orderBy: { createdAt: 'desc' },
              take: 1
            },
            usage: true
          }
        });
      });
    }

    // Calculate basic stats
    const activeSubscription = clientProfile.subscriptions[0] || null;
    const usage = clientProfile.usage;

    const stats = {
      totalSessions: usage?.totalSessionsAllTime || 0,
      minutesUsed: usage?.minutesUsed || 0,
      minutesRemaining: activeSubscription 
        ? (activeSubscription.minutesIncluded - (usage?.minutesUsed || 0))
        : 0,
      averageRating: 0, // Will be calculated from sessions later
      planName: activeSubscription?.planName || 'No Plan',
      planStatus: activeSubscription?.status?.toLowerCase() || 'inactive'
    };

    const responseData = {
      success: true,
      client: {
        id: client.id,
        email: client.email,
        name: client.name,
        role: client.role,
        emailVerified: client.emailVerified
      },
      profile: {
        id: clientProfile.id,
        firstName: clientProfile.firstName,
        lastName: clientProfile.lastName,
        phone: clientProfile.phone,
        phoneVerified: clientProfile.phoneVerified,
        company: clientProfile.company,
        jobTitle: clientProfile.jobTitle,
        country: clientProfile.country,
        timezone: clientProfile.timezone,
        primaryLanguage: clientProfile.primaryLanguage,
        frequentLanguages: clientProfile.frequentLanguages 
          ? JSON.parse(clientProfile.frequentLanguages) 
          : [],
        preferredInterpreterGender: clientProfile.preferredInterpreterGender,
        preferredInterpreterRegion: clientProfile.preferredInterpreterRegion,
        emailNotifications: clientProfile.emailNotifications,
        smsNotifications: clientProfile.smsNotifications,
        sessionReminders: clientProfile.sessionReminders,
        marketingEmails: clientProfile.marketingEmails
      },
      subscription: activeSubscription ? {
        id: activeSubscription.id,
        planName: activeSubscription.planName,
        status: activeSubscription.status,
        monthlyPrice: activeSubscription.monthlyPrice,
        minutesIncluded: activeSubscription.minutesIncluded,
        minutesUsed: usage?.minutesUsed || 0,
        minutesRemaining: activeSubscription.minutesIncluded - (usage?.minutesUsed || 0),
        currentPeriodStart: activeSubscription.currentPeriodStart,
        currentPeriodEnd: activeSubscription.currentPeriodEnd,
        nextBillingDate: activeSubscription.nextBillingDate
      } : null,
      usage,
      stats
    };

    return NextResponse.json(responseData);

  } catch (error) {
    console.error('Get client profile error:', error);
    
    // Return default profile data when database fails
    const fallbackData = {
      success: true,
      client: {
        id: session?.user?.id || 'demo-user',
        email: session?.user?.email || 'user@example.com',
        name: session?.user?.name || 'User',
        role: session?.user?.role || 'CLIENT',
        emailVerified: null
      },
      profile: {
        id: 'fallback',
        firstName: session?.user?.name?.split(' ')[0] || 'User',
        lastName: session?.user?.name?.split(' ').slice(1).join(' ') || '',
        phone: null,
        phoneVerified: false,
        company: null,
        jobTitle: null,
        country: null,
        timezone: null,
        primaryLanguage: 'English',
        frequentLanguages: [],
        preferredInterpreterGender: null,
        preferredInterpreterRegion: null,
        emailNotifications: true,
        smsNotifications: false,
        sessionReminders: true,
        marketingEmails: false
      },
      subscription: {
        id: 'free-trial',
        planName: 'Free Trial',
        status: 'TRIAL',
        monthlyPrice: 0,
        minutesIncluded: 100,
        minutesUsed: 0,
        minutesRemaining: 100,
        currentPeriodStart: new Date(),
        currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        nextBillingDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      },
      usage: {
        minutesUsed: 0,
        totalSessionsAllTime: 0
      },
      stats: {
        totalSessions: 0,
        completedSessions: 0,
        totalMinutesUsed: 0,
        averageRating: 0,
        planName: 'Free Trial',
        planStatus: 'trial'
      }
    };
    
    return NextResponse.json(fallbackData);
  }
}

// PUT /api/client/profile - Update client profile
export async function PUT(request: NextRequest) {
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
      firstName,
      lastName,
      phone,
      company,
      jobTitle,
      country,
      timezone,
      primaryLanguage,
      frequentLanguages,
      preferredInterpreterGender,
      preferredInterpreterRegion,
      emailNotifications,
      smsNotifications,
      sessionReminders,
      marketingEmails
    } = body;

    // Update or create client profile
    const clientProfile = await prisma.clientProfile.upsert({
      where: { userId: session.user.id },
      update: {
        firstName,
        lastName,
        phone,
        company,
        jobTitle,
        country,
        timezone,
        primaryLanguage,
        frequentLanguages: frequentLanguages ? JSON.stringify(frequentLanguages) : null,
        preferredInterpreterGender,
        preferredInterpreterRegion,
        emailNotifications: emailNotifications ?? true,
        smsNotifications: smsNotifications ?? false,
        sessionReminders: sessionReminders ?? true,
        marketingEmails: marketingEmails ?? false,
        lastLoginAt: new Date()
      },
      create: {
        userId: session.user.id,
        firstName: firstName || '',
        lastName: lastName || '',
        phone,
        company,
        jobTitle,
        country,
        timezone,
        primaryLanguage: primaryLanguage || 'English',
        frequentLanguages: frequentLanguages ? JSON.stringify(frequentLanguages) : null,
        preferredInterpreterGender,
        preferredInterpreterRegion,
        emailNotifications: emailNotifications ?? true,
        smsNotifications: smsNotifications ?? false,
        sessionReminders: sessionReminders ?? true,
        marketingEmails: marketingEmails ?? false,
        lastLoginAt: new Date()
      }
    });

    // Also update user's name if provided
    if (firstName && lastName) {
      await prisma.user.update({
        where: { id: session.user.id },
        data: { name: `${firstName} ${lastName}` }
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Profile updated successfully',
      profile: {
        ...clientProfile,
        frequentLanguages: clientProfile.frequentLanguages 
          ? JSON.parse(clientProfile.frequentLanguages) 
          : []
      }
    });

  } catch (error) {
    console.error('Update client profile error:', error);
    return NextResponse.json(
      { error: 'Failed to update profile' },
      { status: 500 }
    );
  }
}
