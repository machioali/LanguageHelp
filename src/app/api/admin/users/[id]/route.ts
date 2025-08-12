import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { UserRole, InterpreterStatus } from '@/lib/constants';
import { getToken } from 'next-auth/jwt';

// PUT /api/admin/users/[id] - Update user status (suspend, activate, etc.)
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check authentication
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
    
    if (!token || token.role !== UserRole.ADMIN) {
      return NextResponse.json(
        { error: 'Unauthorized. Admin access required.' },
        { status: 401 }
      );
    }

    const { id } = params;
    const body = await request.json();
    const { action, reason, adminId } = body;

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        interpreterProfile: true
      }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Prevent self-suspension
    if (user.id === token.sub) {
      return NextResponse.json(
        { error: 'Cannot perform actions on your own account' },
        { status: 400 }
      );
    }

    let updatedUser;
    let statusMessage = '';

    switch (action) {
      case 'SUSPEND':
        if (user.interpreterProfile) {
          // Suspend interpreter profile
          await prisma.interpreterProfile.update({
            where: { userId: id },
            data: {
              status: InterpreterStatus.SUSPENDED,
            }
          });
        }
        statusMessage = 'User suspended successfully';
        break;

      case 'ACTIVATE':
        if (user.interpreterProfile) {
          // Reactivate interpreter profile
          await prisma.interpreterProfile.update({
            where: { userId: id },
            data: {
              status: InterpreterStatus.ACTIVE,
            }
          });
        }
        statusMessage = 'User activated successfully';
        break;

      case 'DEACTIVATE':
        if (user.interpreterProfile) {
          // Deactivate interpreter profile
          await prisma.interpreterProfile.update({
            where: { userId: id },
            data: {
              status: InterpreterStatus.INACTIVE,
            }
          });
        }
        statusMessage = 'User deactivated successfully';
        break;

      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        );
    }

    // Get updated user data
    updatedUser = await prisma.user.findUnique({
      where: { id },
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
    });

    // Log the action (you can create an audit log table for this)
    console.log(`Admin ${adminId} performed ${action} on user ${user.email} (${user.id}). Reason: ${reason || 'No reason provided'}`);

    return NextResponse.json({
      message: statusMessage,
      user: updatedUser
    });

  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json(
      { error: 'Failed to update user' },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/users/[id] - Delete user account
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check authentication
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
    
    if (!token || token.role !== UserRole.ADMIN) {
      return NextResponse.json(
        { error: 'Unauthorized. Admin access required.' },
        { status: 401 }
      );
    }

    const { id } = params;
    const body = await request.json();
    const { reason, adminId } = body;

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        role: true
      }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Prevent self-deletion
    if (user.id === token.sub) {
      return NextResponse.json(
        { error: 'Cannot delete your own account' },
        { status: 400 }
      );
    }

    // Log the action before deletion
    console.log(`Admin ${adminId} deleted user ${user.email} (${user.id}). Reason: ${reason || 'No reason provided'}`);

    // Delete user (this will cascade to related records due to foreign key constraints)
    await prisma.user.delete({
      where: { id }
    });

    return NextResponse.json({
      message: 'User deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting user:', error);
    return NextResponse.json(
      { error: 'Failed to delete user' },
      { status: 500 }
    );
  }
}
