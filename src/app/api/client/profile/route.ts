import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET /api/client/profile - Get current client's profile data
export async function GET(request: NextRequest) {
  try {
    // Get session from NextAuth
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user || session.user.role !== 'CLIENT') {
      return NextResponse.json(
        { error: 'Authentication required - must be a client' },
        { status: 401 }
      );
    }

    // Get client user with profile
    const client = await prisma.user.findUnique({
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

    if (!client) {
      return NextResponse.json(
        { error: 'Client not found' },
        { status: 404 }
      );
    }

    // Create client profile if it doesn't exist
    let clientProfile = client.clientProfile;
    if (!clientProfile) {
      clientProfile = await prisma.clientProfile.create({
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
    return NextResponse.json(
      { error: 'Failed to get client profile' },
      { status: 500 }
    );
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
