import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get the client's profile
    const clientProfile = await prisma.clientProfile.findUnique({
      where: { userId: session.user.id }
    });

    if (!clientProfile) {
      return NextResponse.json(
        { success: false, error: 'Client profile not found' },
        { status: 404 }
      );
    }

    // Find the client's current active subscription
    const currentSubscription = await prisma.clientSubscription.findFirst({
      where: { clientProfileId: clientProfile.id, status: 'ACTIVE' },
      orderBy: { createdAt: 'desc' }
    });
    if (!currentSubscription) {
      return NextResponse.json(
        { success: false, error: 'No active subscription found' },
        { status: 404 }
      );
    }

    // Don't allow cancelling free trial
    if (currentSubscription.planId === 'free_trial') {
      return NextResponse.json(
        { success: false, error: 'Cannot cancel free trial' },
        { status: 400 }
      );
    }

    // Determine free trial minutes
    const FREE_TRIAL_MINUTES = 60;
    let freeTrialMinutesRemaining = FREE_TRIAL_MINUTES;

    const oldFreeTrial = await prisma.clientSubscription.findFirst({
      where: {
        clientProfileId: clientProfile.id,
        planId: 'free_trial'
      },
      orderBy: { createdAt: 'asc' }
    });

    if (oldFreeTrial) {
      // If previous trial existed, you could derive remaining differently; for now, reset to full trial
      freeTrialMinutesRemaining = FREE_TRIAL_MINUTES;
    }

    // Cancel current subscription
    await prisma.clientSubscription.update({
      where: { id: currentSubscription.id },
      data: { 
        status: 'CANCELLED',
        cancelledAt: new Date(),
        endDate: new Date()
      }
    });

    // Create new free trial subscription (1 month period)
    const currentPeriodStart = new Date();
    const currentPeriodEnd = new Date();
    currentPeriodEnd.setMonth(currentPeriodEnd.getMonth() + 1);

    const newFreeTrial = await prisma.clientSubscription.create({
      data: {
        clientProfileId: clientProfile.id,
        planId: 'free_trial',
        planName: 'Free Trial',
        status: 'TRIAL',
        monthlyPrice: 0,
        minutesIncluded: FREE_TRIAL_MINUTES,
        minutesUsed: 0,
        minutesRemaining: freeTrialMinutesRemaining,
        currentPeriodStart,
        currentPeriodEnd
      }
    });

    return NextResponse.json({
      success: true,
      data: {
        message: 'Subscription cancelled successfully',
        newSubscription: newFreeTrial
      }
    });

  } catch (error) {
    console.error('Cancel subscription error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to cancel subscription' 
      },
      { status: 500 }
    );
  }
}
