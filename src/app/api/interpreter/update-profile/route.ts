import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyJWTToken } from '@/lib/utils/credentials';

// PUT /api/interpreter/update-profile - Update interpreter's profile
export async function PUT(request: NextRequest) {
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

    const body = await request.json();
    const { firstName, lastName, email, phone, bio, hourlyRate, experience } = body;

    // Validate required fields
    if (!firstName || !lastName) {
      return NextResponse.json(
        { error: 'First name and last name are required' },
        { status: 400 }
      );
    }

    if (email && email !== '') {
      // Check if email is already taken by another user
      const existingUser = await prisma.user.findFirst({
        where: {
          email,
          id: { not: decoded.userId }
        }
      });

      if (existingUser) {
        return NextResponse.json(
          { error: 'Email address is already in use' },
          { status: 409 }
        );
      }
    }

    // Start a transaction to update both user and interpreter profile
    const result = await prisma.$transaction(async (tx) => {
      // Update user table if email is provided
      if (email && email !== '') {
        await tx.user.update({
          where: { id: decoded.userId },
          data: {
            email,
            name: `${firstName} ${lastName}`,
            updatedAt: new Date()
          }
        });
      }

      // Update interpreter profile
      const updatedProfile = await tx.interpreterProfile.update({
        where: {
          userId: decoded.userId
        },
        data: {
          firstName,
          lastName,
          phone: phone || null,
          bio: bio || null,
          hourlyRate: hourlyRate ? parseFloat(hourlyRate.toString()) : null,
          experience: experience ? parseInt(experience.toString()) : null,
          updatedAt: new Date()
        },
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
            }
          }
        }
      });

      return updatedProfile;
    });

    // Get updated user info
    const updatedUser = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
      }
    });

    // Calculate basic stats (same as in profile route)
    const stats = {
      today: { sessions: 0, hours: 0, earnings: 0 },
      thisWeek: { sessions: 0, hours: 0, earnings: 0 },
      thisMonth: { sessions: 0, hours: 0, earnings: 0 },
      rating: 0,
      totalSessions: 0,
      completionRate: 0,
    };

    const responseData = {
      success: true,
      message: 'Profile updated successfully',
      interpreter: updatedUser,
      profile: {
        id: result.id,
        firstName: result.firstName,
        lastName: result.lastName,
        phone: result.phone,
        hourlyRate: result.hourlyRate,
        bio: result.bio,
        experience: result.experience,
        status: result.status,
        isVerified: result.isVerified,
        availability: result.availability,
        languages: result.languages,
        specializations: result.specializations.map(s => s.specialization),
        certifications: result.certifications,
      },
      credentials: {
        isFirstLogin: result.credentials?.isFirstLogin || false,
        lastLoginAt: result.credentials?.lastLoginAt,
      },
      stats,
    };

    return NextResponse.json(responseData);

  } catch (error) {
    console.error('Update interpreter profile error:', error);
    
    if (error instanceof Error && error.message === 'Invalid or expired token') {
      return NextResponse.json(
        { error: 'Invalid or expired authentication token' },
        { status: 401 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to update interpreter profile' },
      { status: 500 }
    );
  }
}
