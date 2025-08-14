import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
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

    // Find the user
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: {
        subscriptions: {
          where: { status: 'ACTIVE' },
          orderBy: { createdAt: 'desc' },
          take: 1
        }
      }
    });

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    const currentSubscription = user.subscriptions[0];
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

    // Find or retrieve the user's old free trial subscription to get remaining minutes
    let freeTrialMinutesRemaining = 60; // Default free trial minutes
    
    const oldFreeTrial = await prisma.subscription.findFirst({
      where: {
        userId: user.id,
        planId: 'free_trial'
      },
      orderBy: { createdAt: 'asc' }
    });

    if (oldFreeTrial) {
      // Calculate remaining minutes from the original free trial
      // This would require tracking usage against the original free trial
      // For now, let's assume some remaining minutes or reset to full free trial
      const freeTrialPlan = await prisma.plan.findUnique({
        where: { id: 'free_trial' }
      });
      freeTrialMinutesRemaining = freeTrialPlan?.minutes || 60;
    }

    // Cancel current subscription
    await prisma.subscription.update({
      where: { id: currentSubscription.id },
      data: { 
        status: 'CANCELLED',
        endedAt: new Date()
      }
    });

    // Create new free trial subscription
    const freeTrialPlan = await prisma.plan.findUnique({
      where: { id: 'free_trial' }
    });

    if (!freeTrialPlan) {
      return NextResponse.json(
        { success: false, error: 'Free trial plan not found' },
        { status: 404 }
      );
    }

    const newFreeTrial = await prisma.subscription.create({
      data: {
        userId: user.id,
        planId: 'free_trial',
        status: 'ACTIVE',
        currentPeriodStart: new Date(),
        currentPeriodEnd: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year from now
        minutesUsed: Math.max(0, freeTrialPlan.minutes - freeTrialMinutesRemaining),
        minutesRemaining: freeTrialMinutesRemaining
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
