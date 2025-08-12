import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { UserRole, InterpreterStatus } from '@/lib/constants';
import { getToken } from 'next-auth/jwt';

// GET /api/admin/stats - Get system statistics
export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
    
    if (!token || token.role !== UserRole.ADMIN) {
      return NextResponse.json(
        { error: 'Unauthorized. Admin access required.' },
        { status: 401 }
      );
    }
    // Get user counts by role
    const [
      totalUsers,
      adminUsers,
      interpreterUsers,
      clientUsers
    ] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { role: UserRole.ADMIN } }),
      prisma.user.count({ where: { role: UserRole.INTERPRETER } }),
      prisma.user.count({ where: { role: UserRole.CLIENT } })
    ]);

    // Get interpreter statistics
    const [
      totalInterpreters,
      activeInterpreters,
      pendingInterpreters,
      approvedInterpreters,
      rejectedInterpreters
    ] = await Promise.all([
      prisma.interpreterProfile.count(),
      prisma.interpreterProfile.count({ where: { status: InterpreterStatus.ACTIVE } }),
      prisma.interpreterProfile.count({ where: { status: InterpreterStatus.PENDING } }),
      prisma.interpreterProfile.count({ where: { status: InterpreterStatus.APPROVED } }),
      prisma.interpreterProfile.count({ where: { status: InterpreterStatus.REJECTED } })
    ]);

    // Get application statistics
    const [
      totalApplications,
      pendingApplications,
      underReviewApplications,
      approvedApplications,
      rejectedApplications
    ] = await Promise.all([
      prisma.interpreterApplication.count(),
      prisma.interpreterApplication.count({ where: { status: 'PENDING' } }),
      prisma.interpreterApplication.count({ where: { status: 'UNDER_REVIEW' } }),
      prisma.interpreterApplication.count({ where: { status: 'APPROVED' } }),
      prisma.interpreterApplication.count({ where: { status: 'REJECTED' } })
    ]);

    return NextResponse.json({
      users: {
        total: totalUsers,
        admins: adminUsers,
        interpreters: interpreterUsers,
        clients: clientUsers
      },
      interpreters: {
        total: totalInterpreters,
        active: activeInterpreters,
        pending: pendingInterpreters,
        approved: approvedInterpreters,
        rejected: rejectedInterpreters
      },
      applications: {
        total: totalApplications,
        pending: pendingApplications,
        underReview: underReviewApplications,
        approved: approvedApplications,
        rejected: rejectedApplications
      },
      lastUpdated: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error fetching system stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch system statistics' },
      { status: 500 }
    );
  }
}
