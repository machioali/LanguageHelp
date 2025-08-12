import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { ApplicationStatus } from '@/lib/constants';

// GET /api/admin/applications - Get all interpreter applications
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;

    // Build where clause
    const where = status && status !== 'ALL' ? { status } : {};

    // Get applications with pagination
    const [applications, totalCount] = await Promise.all([
      prisma.interpreterApplication.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.interpreterApplication.count({ where }),
    ]);

    // Parse JSON fields
    const parsedApplications = applications.map(app => ({
      ...app,
      languages: JSON.parse(app.languages || '[]'),
      specializations: JSON.parse(app.specializations || '[]'),
      certifications: JSON.parse(app.certifications || '[]'),
    }));

    return NextResponse.json({
      applications: parsedApplications,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages: Math.ceil(totalCount / limit),
      },
    });

  } catch (error) {
    console.error('Error fetching applications:', error);
    return NextResponse.json(
      { error: 'Failed to fetch applications' },
      { status: 500 }
    );
  }
}

// POST /api/admin/applications - Create new interpreter application (for testing)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      email,
      firstName,
      lastName,
      phone,
      languages,
      specializations,
      experience,
      certifications,
      bio,
    } = body;

    // Check if application already exists
    const existingApplication = await prisma.interpreterApplication.findUnique({
      where: { email },
    });

    if (existingApplication) {
      return NextResponse.json(
        { error: 'Application with this email already exists' },
        { status: 400 }
      );
    }

    // Create application
    const application = await prisma.interpreterApplication.create({
      data: {
        email,
        firstName,
        lastName,
        phone,
        languages: JSON.stringify(languages || []),
        specializations: JSON.stringify(specializations || []),
        experience: experience ? parseInt(experience) : null,
        certifications: JSON.stringify(certifications || []),
        bio,
        status: ApplicationStatus.PENDING,
      },
    });

    return NextResponse.json({
      message: 'Application created successfully',
      application: {
        ...application,
        languages: JSON.parse(application.languages),
        specializations: JSON.parse(application.specializations),
        certifications: JSON.parse(application.certifications || '[]'),
      },
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating application:', error);
    return NextResponse.json(
      { error: 'Failed to create application' },
      { status: 500 }
    );
  }
}
