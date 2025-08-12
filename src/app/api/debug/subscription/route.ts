import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 Debug: Testing subscription API authentication...');
    
    const session = await getServerSession(authOptions);
    console.log('📋 Debug: Session data:', {
      hasSession: !!session,
      userId: session?.user?.id,
      userEmail: session?.user?.email,
      userRole: session?.user?.role,
      userName: session?.user?.name
    });

    if (!session) {
      return NextResponse.json({
        success: false,
        error: 'No session found',
        debug: {
          step: 'session_check',
          message: 'User not authenticated'
        }
      }, { status: 401 });
    }

    if (!session.user) {
      return NextResponse.json({
        success: false,
        error: 'No user in session',
        debug: {
          step: 'user_check',
          message: 'Session exists but no user data'
        }
      }, { status: 401 });
    }

    if (session.user.role !== 'CLIENT') {
      return NextResponse.json({
        success: false,
        error: `Invalid role: ${session.user.role}`,
        debug: {
          step: 'role_check',
          message: 'User role is not CLIENT',
          currentRole: session.user.role
        }
      }, { status: 403 });
    }

    // Test database connection
    console.log('🗄️ Debug: Testing database connection...');
    
    try {
      // Try to find the user in the database
      const dbUser = await prisma.user.findUnique({
        where: { id: session.user.id },
        include: {
          clientProfile: {
            include: {
              subscriptions: {
                where: { status: { in: ['ACTIVE', 'TRIAL'] } },
                orderBy: { createdAt: 'desc' },
                take: 1
              },
              usage: true
            }
          }
        }
      });

      console.log('👤 Debug: Database user lookup:', {
        found: !!dbUser,
        hasClientProfile: !!dbUser?.clientProfile,
        activeSubscriptions: dbUser?.clientProfile?.subscriptions.length || 0
      });

      return NextResponse.json({
        success: true,
        debug: {
          step: 'complete',
          session: {
            userId: session.user.id,
            userEmail: session.user.email,
            userRole: session.user.role,
            userName: session.user.name
          },
          database: {
            userFound: !!dbUser,
            hasClientProfile: !!dbUser?.clientProfile,
            activeSubscriptions: dbUser?.clientProfile?.subscriptions.length || 0,
            hasUsage: !!dbUser?.clientProfile?.usage
          }
        },
        message: 'Authentication and database checks passed'
      });

    } catch (dbError) {
      console.error('💥 Debug: Database error:', dbError);
      return NextResponse.json({
        success: false,
        error: 'Database connection failed',
        debug: {
          step: 'database_check',
          message: dbError instanceof Error ? dbError.message : 'Unknown database error',
          details: dbError
        }
      }, { status: 500 });
    }

  } catch (error) {
    console.error('💥 Debug: General error:', error);
    return NextResponse.json({
      success: false,
      error: 'Debug API failed',
      debug: {
        step: 'general_error',
        message: error instanceof Error ? error.message : 'Unknown error',
        details: error
      }
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log('🧪 Debug: Testing subscription POST endpoint...');
    
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user || session.user.role !== 'CLIENT') {
      return NextResponse.json({
        success: false,
        error: 'Authentication failed',
        debug: {
          hasSession: !!session,
          hasUser: !!session?.user,
          userRole: session?.user?.role
        }
      }, { status: 401 });
    }

    const body = await request.json();
    const { planId } = body;

    console.log('📦 Debug: Request body:', { planId });

    // Available test plans
    const availablePlans = {
      'free_trial': { name: 'Free Trial', price: 0, minutes: 60 },
      'basic_plan': { name: 'Basic Plan', price: 29.99, minutes: 300 },
      'premium_plan': { name: 'Premium Plan', price: 79.99, minutes: 1000 },
      'enterprise_plan': { name: 'Enterprise Plan', price: 199.99, minutes: 9999 }
    };

    const selectedPlan = availablePlans[planId as keyof typeof availablePlans];
    if (!selectedPlan) {
      return NextResponse.json({
        success: false,
        error: 'Invalid plan ID',
        debug: {
          receivedPlanId: planId,
          availablePlans: Object.keys(availablePlans)
        }
      }, { status: 400 });
    }

    // Test database write
    try {
      console.log('💾 Debug: Testing database write...');
      
      // Check if user exists and create client profile if needed
      let clientProfile = await prisma.clientProfile.findUnique({
        where: { userId: session.user.id }
      });

      if (!clientProfile) {
        console.log('👤 Debug: Creating client profile...');
        clientProfile = await prisma.clientProfile.create({
          data: {
            userId: session.user.id,
            firstName: session.user.name?.split(' ')[0] || '',
            lastName: session.user.name?.split(' ').slice(1).join(' ') || ''
          }
        });
        console.log('✅ Debug: Client profile created:', clientProfile.id);
      }

      return NextResponse.json({
        success: true,
        debug: {
          step: 'write_test_passed',
          message: 'Database write test successful',
          planId,
          selectedPlan,
          clientProfile: {
            id: clientProfile.id,
            created: !clientProfile
          }
        },
        message: `Subscription test for ${selectedPlan.name} would succeed`
      });

    } catch (dbError) {
      console.error('💥 Debug: Database write error:', dbError);
      return NextResponse.json({
        success: false,
        error: 'Database write failed',
        debug: {
          step: 'database_write',
          message: dbError instanceof Error ? dbError.message : 'Unknown database error',
          details: dbError
        }
      }, { status: 500 });
    }

  } catch (error) {
    console.error('💥 Debug: POST error:', error);
    return NextResponse.json({
      success: false,
      error: 'Debug POST failed',
      debug: {
        step: 'general_post_error',
        message: error instanceof Error ? error.message : 'Unknown error',
        details: error
      }
    }, { status: 500 });
  }
}
