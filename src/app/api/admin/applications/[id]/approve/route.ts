import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { ApplicationStatus, InterpreterStatus, UserRole } from '@/lib/constants';
import { generateInterpreterCredentials, hashPassword } from '@/lib/utils/credentials';
import { sendWelcomeEmail, sendApplicationStatusEmail } from '@/lib/utils/email';

// POST /api/admin/applications/[id]/approve - Approve an interpreter application
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();
    const { action, notes, adminId } = body; // action: 'APPROVE' | 'REJECT'

    // Get the application
    const application = await prisma.interpreterApplication.findUnique({
      where: { id },
    });

    if (!application) {
      return NextResponse.json(
        { error: 'Application not found' },
        { status: 404 }
      );
    }

    if (application.status !== ApplicationStatus.PENDING) {
      return NextResponse.json(
        { error: 'Application has already been processed' },
        { status: 400 }
      );
    }

    // Update application status
    const updatedApplication = await prisma.interpreterApplication.update({
      where: { id },
      data: {
        status: action === 'APPROVE' ? ApplicationStatus.APPROVED : ApplicationStatus.REJECTED,
        notes,
        reviewedBy: adminId,
        reviewedAt: new Date(),
      },
    });

    if (action === 'APPROVE') {
      // Create user account and interpreter profile
      const { tempPassword, loginToken, tokenExpiry } = generateInterpreterCredentials();
      const hashedTempPassword = await hashPassword(tempPassword);

      // Parse application data
      const languages = JSON.parse(application.languages || '[]');
      const specializations = JSON.parse(application.specializations || '[]');
      const certifications = JSON.parse(application.certifications || '[]');

      // Create user account
      const user = await prisma.user.create({
        data: {
          email: application.email,
          name: `${application.firstName} ${application.lastName}`,
          role: UserRole.INTERPRETER,
          emailVerified: new Date(), // Auto-verify since admin approved
        },
      });

      // Create interpreter profile
      const interpreterProfile = await prisma.interpreterProfile.create({
        data: {
          userId: user.id,
          firstName: application.firstName,
          lastName: application.lastName,
          phone: application.phone,
          bio: application.bio,
          experience: application.experience,
          status: InterpreterStatus.APPROVED,
        },
      });

      // Create credentials
      await prisma.interpreterCredential.create({
        data: {
          interpreterProfileId: interpreterProfile.id,
          tempPassword: hashedTempPassword,
          loginToken,
          tokenExpiry,
          isFirstLogin: true,
        },
      });

      // Create language records
      if (languages.length > 0) {
        await prisma.interpreterLanguage.createMany({
          data: languages.map((lang: any) => ({
            interpreterProfileId: interpreterProfile.id,
            languageCode: lang.code,
            languageName: lang.name,
            proficiency: lang.proficiency,
            isNative: lang.isNative || false,
          })),
        });
      }

      // Create specialization records
      if (specializations.length > 0) {
        await prisma.interpreterSpecialization.createMany({
          data: specializations.map((spec: string) => ({
            interpreterProfileId: interpreterProfile.id,
            specialization: spec,
          })),
        });
      }

      // Create certification records
      if (certifications.length > 0) {
        await prisma.interpreterCertification.createMany({
          data: certifications.map((cert: any) => ({
            interpreterProfileId: interpreterProfile.id,
            name: cert.name,
            issuingOrganization: cert.organization,
            issueDate: cert.issueDate ? new Date(cert.issueDate) : null,
            expiryDate: cert.expiryDate ? new Date(cert.expiryDate) : null,
            certificateNumber: cert.number,
            isVerified: false, // Admin can verify later
          })),
        });
      }

      // Send welcome email with credentials
      try {
        await sendWelcomeEmail({
          firstName: application.firstName,
          lastName: application.lastName,
          email: application.email,
          tempPassword,
          loginToken,
        });
      } catch (emailError) {
        console.error('Failed to send welcome email:', emailError);
        // Don't fail the approval if email fails
      }

      return NextResponse.json({
        message: 'Application approved successfully',
        interpreter: {
          id: interpreterProfile.id,
          userId: user.id,
          email: user.email,
          firstName: application.firstName,
          lastName: application.lastName,
        },
      });

    } else {
      // Send rejection email
      try {
        await sendApplicationStatusEmail({
          firstName: application.firstName,
          lastName: application.lastName,
          email: application.email,
          status: 'REJECTED',
          notes,
        });
      } catch (emailError) {
        console.error('Failed to send rejection email:', emailError);
        // Don't fail the rejection if email fails
      }

      return NextResponse.json({
        message: 'Application rejected successfully',
      });
    }

  } catch (error) {
    console.error('Error processing application:', error);
    return NextResponse.json(
      { error: 'Failed to process application' },
      { status: 500 }
    );
  }
}
