import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { hashPassword, generateInterpreterCredentials } from '@/lib/utils/credentials';
import { UserRole } from '@/lib/constants';
import type { UserRoleType } from '@/lib/constants';

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

// Validation schema for creating interpreters
const createInterpreterSchema = z.object({
  email: z.string().email('Invalid email address'),
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  phone: z.string().optional(),
  languages: z.array(z.object({
    languageCode: z.string().min(1),
    languageName: z.string().min(1),
    proficiency: z.enum(['NATIVE', 'FLUENT', 'ADVANCED', 'INTERMEDIATE', 'BASIC']),
    isNative: z.boolean().optional().default(false)
  })).min(1, 'At least one language is required'),
  specializations: z.array(z.enum([
    'HEALTHCARE', 'LEGAL', 'BUSINESS', 'EDUCATION', 'GOVERNMENT', 
    'TECHNICAL', 'CONFERENCE', 'EMERGENCY', 'GENERAL'
  ])).min(1, 'At least one specialization is required'),
  certifications: z.array(z.object({
    name: z.string().min(1),
    issuingOrganization: z.string().min(1),
    issueDate: z.string().optional(),
    expiryDate: z.string().optional(),
    certificateNumber: z.string().optional(),
    isVerified: z.boolean().optional().default(false)
  })).optional().default([]),
  hourlyRate: z.number().positive().optional(),
  bio: z.string().optional(),
  experience: z.number().min(0).optional(),
  availability: z.string().optional(), // JSON string for availability schedule
  sendCredentials: z.boolean().optional().default(true), // Whether to send login credentials
  autoApprove: z.boolean().optional().default(false), // Whether to auto-approve the interpreter
});

// POST /api/admin/interpreters/create - Create new interpreter account
export async function POST(request: NextRequest) {
  try {
    // Check if user is admin
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
    
    if (!token) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }
    
    if ((token.role as UserRoleType) !== UserRole.ADMIN && (token.role as UserRoleType) !== UserRole.SUPER_ADMIN) {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      );
    }
    
    // Additional security: Only allow specific admin email
    const AUTHORIZED_ADMIN_EMAIL = 'machio2024@hotmail.com';
    if (token.email !== AUTHORIZED_ADMIN_EMAIL) {
      console.log(`[SECURITY ALERT] Unauthorized admin API access attempt: ${token.email}`);
      return NextResponse.json(
        { error: 'Unauthorized admin access' },
        { status: 403 }
      );
    }
    
    const body = await request.json();
    
    // Validate input
    const validatedData = createInterpreterSchema.parse(body);
    
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: validatedData.email.toLowerCase() }
    });
    
    if (existingUser) {
      return NextResponse.json(
        { error: 'An account with this email already exists' },
        { status: 409 }
      );
    }
    
    // Generate credentials for the interpreter
    const credentials = generateInterpreterCredentials();
    const hashedTempPassword = await hashPassword(credentials.tempPassword);
    
    // Create user and interpreter profile in a transaction
    const result = await prisma.$transaction(async (tx: any) => {
      // Create the user
      const user = await tx.user.create({
        data: {
          email: validatedData.email.toLowerCase(),
          name: `${validatedData.firstName} ${validatedData.lastName}`,
          role: UserRole.INTERPRETER,
        }
      });
      
      // Create interpreter profile
      const interpreterProfile = await tx.interpreterProfile.create({
        data: {
          userId: user.id,
          firstName: validatedData.firstName,
          lastName: validatedData.lastName,
          phone: validatedData.phone,
          hourlyRate: validatedData.hourlyRate,
          bio: validatedData.bio,
          experience: validatedData.experience,
          availability: validatedData.availability,
          status: validatedData.autoApprove ? 'APPROVED' : 'PENDING',
          isVerified: validatedData.autoApprove,
        }
      });
      
      // Create interpreter credentials
      const interpreterCredentials = await tx.interpreterCredential.create({
        data: {
          interpreterProfileId: interpreterProfile.id,
          tempPassword: hashedTempPassword,
          loginToken: credentials.loginToken,
          tokenExpiry: credentials.tokenExpiry,
          isFirstLogin: true,
        }
      });
      
      // Create languages
      const languages = await Promise.all(
        validatedData.languages.map(lang => 
          tx.interpreterLanguage.create({
            data: {
              interpreterProfileId: interpreterProfile.id,
              languageCode: lang.languageCode,
              languageName: lang.languageName,
              proficiency: lang.proficiency,
              isNative: lang.isNative || false,
            }
          })
        )
      );
      
      // Create specializations
      const specializations = await Promise.all(
        validatedData.specializations.map(spec => 
          tx.interpreterSpecialization.create({
            data: {
              interpreterProfileId: interpreterProfile.id,
              specialization: spec,
            }
          })
        )
      );
      
      // Create certifications if provided
      const certifications = validatedData.certifications.length > 0 
        ? await Promise.all(
            validatedData.certifications.map(cert => 
              tx.interpreterCertification.create({
                data: {
                  interpreterProfileId: interpreterProfile.id,
                  name: cert.name,
                  issuingOrganization: cert.issuingOrganization,
                  issueDate: cert.issueDate ? new Date(cert.issueDate) : null,
                  expiryDate: cert.expiryDate ? new Date(cert.expiryDate) : null,
                  certificateNumber: cert.certificateNumber,
                  isVerified: cert.isVerified || false,
                }
              })
            )
          )
        : [];
      
      return {
        user,
        interpreterProfile,
        interpreterCredentials,
        languages,
        specializations,
        certifications,
      };
    });
    
    // Prepare response data (exclude sensitive information)
    const responseData = {
      success: true,
      message: 'Interpreter account created successfully',
      interpreter: {
        id: result.interpreterProfile.id,
        email: result.user.email,
        firstName: result.interpreterProfile.firstName,
        lastName: result.interpreterProfile.lastName,
        status: result.interpreterProfile.status,
        languages: result.languages,
        specializations: result.specializations,
        certifications: result.certifications,
      },
      credentials: validatedData.sendCredentials ? {
        tempPassword: credentials.tempPassword,
        loginToken: credentials.loginToken,
        tokenExpiry: credentials.tokenExpiry,
        loginUrl: `${process.env.NEXTAUTH_URL}/auth/interpreter-signin`,
        instructions: [
          "1. Go to the interpreter sign-in page",
          "2. Enter your email address",
          "3. Use either the temporary password or login token to sign in",
          "4. You'll be prompted to set a new password on first login",
          "5. After setting your password, you'll have access to your dashboard"
        ]
      } : null,
    };
    
    return NextResponse.json(responseData, { status: 201 });
    
  } catch (error) {
    console.error('Create interpreter error:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { 
          error: 'Invalid input data', 
          details: error.errors.map(err => ({
            path: err.path.join('.'),
            message: err.message
          }))
        },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to create interpreter account' },
      { status: 500 }
    );
  }
}

// GET /api/admin/interpreters/create - Get form structure for creating interpreters
export async function GET() {
  try {
    const formStructure = {
      fields: {
        personal: {
          email: { type: 'email', required: true, label: 'Email Address' },
          firstName: { type: 'text', required: true, label: 'First Name' },
          lastName: { type: 'text', required: true, label: 'Last Name' },
          phone: { type: 'tel', required: false, label: 'Phone Number' },
        },
        professional: {
          hourlyRate: { type: 'number', required: false, label: 'Hourly Rate ($)', min: 0 },
          bio: { type: 'textarea', required: false, label: 'Bio/Description' },
          experience: { type: 'number', required: false, label: 'Years of Experience', min: 0 },
          availability: { type: 'json', required: false, label: 'Availability Schedule' },
        },
        languages: {
          type: 'array',
          required: true,
          minItems: 1,
          label: 'Languages',
          itemSchema: {
            languageCode: { type: 'text', required: true, label: 'Language Code (e.g., en, es)' },
            languageName: { type: 'text', required: true, label: 'Language Name' },
            proficiency: { 
              type: 'select', 
              required: true, 
              label: 'Proficiency Level',
              options: ['NATIVE', 'FLUENT', 'ADVANCED', 'INTERMEDIATE', 'BASIC']
            },
            isNative: { type: 'boolean', required: false, label: 'Native Speaker' }
          }
        },
        specializations: {
          type: 'multiselect',
          required: true,
          minItems: 1,
          label: 'Specializations',
          options: [
            'HEALTHCARE', 'LEGAL', 'BUSINESS', 'EDUCATION', 'GOVERNMENT',
            'TECHNICAL', 'CONFERENCE', 'EMERGENCY', 'GENERAL'
          ]
        },
        certifications: {
          type: 'array',
          required: false,
          label: 'Certifications',
          itemSchema: {
            name: { type: 'text', required: true, label: 'Certificate Name' },
            issuingOrganization: { type: 'text', required: true, label: 'Issuing Organization' },
            issueDate: { type: 'date', required: false, label: 'Issue Date' },
            expiryDate: { type: 'date', required: false, label: 'Expiry Date' },
            certificateNumber: { type: 'text', required: false, label: 'Certificate Number' },
            isVerified: { type: 'boolean', required: false, label: 'Verified' }
          }
        },
        options: {
          sendCredentials: { 
            type: 'boolean', 
            required: false, 
            default: true,
            label: 'Send Login Credentials in Response' 
          },
          autoApprove: { 
            type: 'boolean', 
            required: false, 
            default: false,
            label: 'Auto-approve Interpreter' 
          },
        }
      },
      examples: {
        basic: {
          email: "jane.doe@example.com",
          firstName: "Jane",
          lastName: "Doe",
          phone: "+1-555-0123",
          languages: [
            {
              languageCode: "en",
              languageName: "English",
              proficiency: "NATIVE",
              isNative: true
            },
            {
              languageCode: "es",
              languageName: "Spanish",
              proficiency: "FLUENT",
              isNative: false
            }
          ],
          specializations: ["HEALTHCARE", "LEGAL"],
          hourlyRate: 85.00,
          bio: "Experienced medical and legal interpreter with 10+ years in the field.",
          experience: 10,
          certifications: [
            {
              name: "Certified Healthcare Interpreter",
              issuingOrganization: "National Board of Certification for Medical Interpreters",
              issueDate: "2020-06-15",
              expiryDate: "2025-06-15",
              certificateNumber: "CHI-12345",
              isVerified: true
            }
          ],
          sendCredentials: true,
          autoApprove: false
        }
      }
    };
    
    return NextResponse.json(formStructure);
    
  } catch (error) {
    console.error('Get form structure error:', error);
    return NextResponse.json(
      { error: 'Failed to get form structure' },
      { status: 500 }
    );
  }
}
