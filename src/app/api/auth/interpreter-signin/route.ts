import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyPassword, createJWTToken, hashPassword } from '@/lib/utils/credentials';
import { UserRole } from '@/lib/constants';

// POST /api/auth/interpreter-signin - Sign in interpreter
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, token, newPassword } = body;

    // Find user with interpreter role
    const user = await prisma.user.findFirst({
      where: {
        email,
        role: UserRole.INTERPRETER,
      },
      include: {
        interpreterProfile: {
          include: {
            credentials: true,
          },
        },
      },
    });

    if (!user || !user.interpreterProfile) {
      return NextResponse.json(
        { error: 'Invalid email or not an interpreter account' },
        { status: 401 }
      );
    }

    const interpreterProfile = user.interpreterProfile;
    const credentials = interpreterProfile.credentials;

    if (!credentials) {
      return NextResponse.json(
        { error: 'Account credentials not found. Please contact support.' },
        { status: 401 }
      );
    }

    let isValidAuth = false;

    // Check if signing in with token (first time login)
    if (token) {
      if (!credentials.loginToken || credentials.loginToken !== token) {
        return NextResponse.json(
          { error: 'Invalid or expired login token' },
          { status: 401 }
        );
      }

      // Check if token is expired
      if (credentials.tokenExpiry && new Date() > credentials.tokenExpiry) {
        return NextResponse.json(
          { error: 'Login token has expired. Please contact support for a new one.' },
          { status: 401 }
        );
      }

      isValidAuth = true;
    }
    // Check if signing in with password
    else if (password) {
      // Check against temp password or regular password
      if (credentials.tempPassword) {
        isValidAuth = await verifyPassword(password, credentials.tempPassword);
      } else if (user.password) {
        isValidAuth = await verifyPassword(password, user.password);
      }
    }

    if (!isValidAuth) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // If it's first login and they provided a new password, update it
    if (credentials.isFirstLogin && newPassword) {
      const hashedNewPassword = await hashPassword(newPassword);
      
      // Update user password and clear temp credentials
      await prisma.user.update({
        where: { id: user.id },
        data: { password: hashedNewPassword },
      });

      await prisma.interpreterCredential.update({
        where: { id: credentials.id },
        data: {
          tempPassword: null,
          loginToken: null,
          tokenExpiry: null,
          isFirstLogin: false,
          lastLoginAt: new Date(),
        },
      });
    } else {
      // Update last login
      await prisma.interpreterCredential.update({
        where: { id: credentials.id },
        data: { lastLoginAt: new Date() },
      });
    }

    // Create JWT token
    const jwtToken = createJWTToken({
      userId: user.id,
      email: user.email,
      role: user.role,
      interpreterProfileId: interpreterProfile.id,
    });

    // Prepare response data
    const responseData = {
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
      interpreter: {
        id: interpreterProfile.id,
        firstName: interpreterProfile.firstName,
        lastName: interpreterProfile.lastName,
        status: interpreterProfile.status,
        isVerified: interpreterProfile.isVerified,
      },
      token: jwtToken,
      requirePasswordChange: credentials.isFirstLogin && !newPassword,
      // For NextAuth integration - return the password that was used
      authPassword: newPassword || password,
    };

    const response = NextResponse.json(responseData);

    // Set JWT as httpOnly cookie
    response.cookies.set('auth-token', jwtToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;

  } catch (error) {
    console.error('Interpreter sign-in error:', error);
    return NextResponse.json(
      { error: 'An error occurred during sign-in' },
      { status: 500 }
    );
  }
}
