import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET /api/client/subscription - Get client's subscription data
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user || session.user.role !== 'CLIENT') {
      return NextResponse.json(
        { error: 'Authentication required - must be a client' },
        { status: 401 }
      );
    }

    // Get or create client profile
    let clientProfile = await prisma.clientProfile.findUnique({
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
      clientProfile = await prisma.clientProfile.create({
        data: {
          userId: session.user.id,
          firstName: session.user.name?.split(' ')[0] || '',
          lastName: session.user.name?.split(' ').slice(1).join(' ') || ''
        },
        include: {
          subscriptions: {
            where: { status: { in: ['ACTIVE', 'TRIAL'] } },
            orderBy: { createdAt: 'desc' },
            take: 1
          },
          usage: true
        }
      });
    }

    const activeSubscription = clientProfile.subscriptions[0] || null;
    const usage = clientProfile.usage;

    // Create usage record if it doesn't exist and there's an active subscription
    if (activeSubscription && !usage) {
      await prisma.clientUsage.create({
        data: {
          clientProfileId: clientProfile.id,
          currentPeriodStart: activeSubscription.currentPeriodStart,
          currentPeriodEnd: activeSubscription.currentPeriodEnd,
          minutesRemaining: activeSubscription.minutesIncluded
        }
      });
    }

    const subscriptionData = {
      hasSubscription: !!activeSubscription,
      plan: activeSubscription ? {
        id: activeSubscription.planId,
        name: activeSubscription.planName,
        price: activeSubscription.monthlyPrice,
        minutes: activeSubscription.minutesIncluded,
        status: activeSubscription.status
      } : null,
      usage: activeSubscription && usage ? {
        minutesUsed: usage.minutesUsed,
        minutesRemaining: Math.max(0, activeSubscription.minutesIncluded - usage.minutesUsed),
        currentPeriodStart: usage.currentPeriodStart,
        currentPeriodEnd: usage.currentPeriodEnd,
        sessionsThisPeriod: usage.sessionsThisPeriod
      } : null,
      status: activeSubscription?.status || null
    };

    return NextResponse.json({
      success: true,
      data: subscriptionData
    });

  } catch (error) {
    console.error('Get client subscription error:', error);
    return NextResponse.json(
      { error: 'Failed to get subscription data' },
      { status: 500 }
    );
  }
}

// POST /api/client/subscription - Subscribe to a plan
export async function POST(request: NextRequest) {
  try {
    console.log('POST /api/client/subscription - Starting subscription process');
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user || session.user.role !== 'CLIENT') {
      console.log('Authentication failed:', { session: !!session, role: session?.user?.role });
      return NextResponse.json(
        { error: 'Authentication required - must be a client' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { planId } = body;
    console.log('Received planId:', planId);

    // Define available plans
    const availablePlans = {
      'free_trial': {
        id: 'free_trial',
        name: 'Free Trial',
        price: 0,
        minutes: 60,
        status: 'TRIAL'
      },
      'basic_plan': {
        id: 'basic_plan',
        name: 'Basic Plan',
        price: 29.99,
        minutes: 300,
        status: 'ACTIVE'
      },
      'premium_plan': {
        id: 'premium_plan',
        name: 'Premium Plan',
        price: 79.99,
        minutes: 1000,
        status: 'ACTIVE'
      },
      'enterprise_plan': {
        id: 'enterprise_plan',
        name: 'Enterprise Plan',
        price: 199.99,
        minutes: 9999, // Unlimited represented as high number
        status: 'ACTIVE'
      }
    };

    const selectedPlan = availablePlans[planId as keyof typeof availablePlans];
    if (!selectedPlan) {
      return NextResponse.json(
        { error: 'Invalid plan selected' },
        { status: 400 }
      );
    }

    // Get or create client profile
    let clientProfile = await prisma.clientProfile.findUnique({
      where: { userId: session.user.id }
    });

    if (!clientProfile) {
      clientProfile = await prisma.clientProfile.create({
        data: {
          userId: session.user.id,
          firstName: session.user.name?.split(' ')[0] || '',
          lastName: session.user.name?.split(' ').slice(1).join(' ') || ''
        }
      });
    }

    // Cancel any existing active subscriptions
    await prisma.clientSubscription.updateMany({
      where: {
        clientProfileId: clientProfile.id,
        status: { in: ['ACTIVE', 'TRIAL'] }
      },
      data: {
        status: 'CANCELLED',
        cancelledAt: new Date()
      }
    });

    // Create new subscription
    const currentPeriodStart = new Date();
    const currentPeriodEnd = new Date();
    currentPeriodEnd.setMonth(currentPeriodEnd.getMonth() + 1);

    const subscription = await prisma.clientSubscription.create({
      data: {
        clientProfileId: clientProfile.id,
        planId: selectedPlan.id,
        planName: selectedPlan.name,
        status: selectedPlan.status,
        monthlyPrice: selectedPlan.price,
        minutesIncluded: selectedPlan.minutes,
        minutesRemaining: selectedPlan.minutes,
        currentPeriodStart,
        currentPeriodEnd,
        nextBillingDate: selectedPlan.status === 'ACTIVE' ? currentPeriodEnd : null
      }
    });

    // Create or update usage record
    await prisma.clientUsage.upsert({
      where: { clientProfileId: clientProfile.id },
      update: {
        currentPeriodStart,
        currentPeriodEnd,
        minutesUsed: 0,
        minutesRemaining: selectedPlan.minutes,
        sessionsThisPeriod: 0
      },
      create: {
        clientProfileId: clientProfile.id,
        currentPeriodStart,
        currentPeriodEnd,
        minutesUsed: 0,
        minutesRemaining: selectedPlan.minutes,
        sessionsThisPeriod: 0
      }
    });

    return NextResponse.json({
      success: true,
      message: `Successfully subscribed to ${selectedPlan.name}`,
      subscription: {
        id: subscription.id,
        planName: subscription.planName,
        status: subscription.status,
        minutesIncluded: subscription.minutesIncluded,
        currentPeriodStart: subscription.currentPeriodStart,
        currentPeriodEnd: subscription.currentPeriodEnd
      }
    });

  } catch (error) {
    console.error('Subscribe to plan error:', error);
    return NextResponse.json(
      { error: 'Failed to subscribe to plan' },
      { status: 500 }
    );
  }
}

// DELETE /api/client/subscription - Cancel subscription
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user || session.user.role !== 'CLIENT') {
      return NextResponse.json(
        { error: 'Authentication required - must be a client' },
        { status: 401 }
      );
    }

    const clientProfile = await prisma.clientProfile.findUnique({
      where: { userId: session.user.id }
    });

    if (!clientProfile) {
      return NextResponse.json(
        { error: 'Client profile not found' },
        { status: 404 }
      );
    }

    // Cancel active subscriptions
    await prisma.clientSubscription.updateMany({
      where: {
        clientProfileId: clientProfile.id,
        status: { in: ['ACTIVE', 'TRIAL'] }
      },
      data: {
        status: 'CANCELLED',
        cancelledAt: new Date(),
        cancellationReason: 'User requested cancellation'
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Subscription cancelled successfully'
    });

  } catch (error) {
    console.error('Cancel subscription error:', error);
    return NextResponse.json(
      { error: 'Failed to cancel subscription' },
      { status: 500 }
    );
  }
}
