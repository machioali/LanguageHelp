import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { UserRole } from '@/lib/constants';
import { getToken } from 'next-auth/jwt';

// GET /api/admin/users - Get all registered users
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

    const { searchParams } = new URL(request.url);
    const roleFilter = searchParams.get('role');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const skip = (page - 1) * limit;

    // Build where clause
    const where = roleFilter && roleFilter !== 'ALL' ? { role: roleFilter } : {};

    // Get users with their interpreter profile if they have one
    const [users, totalCount] = await Promise.all([
      prisma.user.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          createdAt: true,
          companyName: true,
          phoneNumber: true,
          interpreterProfile: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              status: true,
              phone: true,
              isVerified: true,
            }
          }
        }
      }),
      prisma.user.count({ where }),
    ]);

    return NextResponse.json({
      users,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages: Math.ceil(totalCount / limit),
      },
    });

  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
}
