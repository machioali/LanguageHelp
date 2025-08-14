import { NextRequest, NextResponse } from "next/server";

// In a real application, this would interact with a database
const applications: any[] = [];

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    
    // Validate required fields
    const requiredFields = [
      'jobId',
      'firstName', 
      'lastName',
      'email',
      'phone',
      'primaryLanguage',
      'secondaryLanguages',
      'expectedSalary',
      'availability'
    ];
    
    const missingFields = requiredFields.filter(field => !data[field]);
    if (missingFields.length > 0) {
      return NextResponse.json(
        { error: 'Missing required fields', fields: missingFields },
        { status: 400 }
      );
    }
    
    // Create application record
    const application = {
      id: Date.now().toString(),
      ...data,
      status: 'submitted',
      submittedAt: new Date().toISOString(),
      reviewedAt: null,
      reviewedBy: null,
      notes: ''
    };
    
    applications.push(application);
    
    // In a real app, you might:
    // 1. Save to database
    // 2. Send confirmation email
    // 3. Notify hiring team
    // 4. Process file uploads
    
    return NextResponse.json({
      success: true,
      applicationId: application.id,
      message: 'Application submitted successfully'
    }, { status: 201 });
    
  } catch (error) {
    console.error('Application submission error:', error);
    return NextResponse.json(
      { error: 'Failed to submit application' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const jobId = searchParams.get('jobId');
    const status = searchParams.get('status');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    
    let filteredApplications = applications;
    
    // Filter by jobId if provided
    if (jobId) {
      filteredApplications = filteredApplications.filter(app => app.jobId === jobId);
    }
    
    // Filter by status if provided
    if (status) {
      filteredApplications = filteredApplications.filter(app => app.status === status);
    }
    
    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedApplications = filteredApplications.slice(startIndex, endIndex);
    
    return NextResponse.json({
      applications: paginatedApplications,
      pagination: {
        page,
        limit,
        total: filteredApplications.length,
        totalPages: Math.ceil(filteredApplications.length / limit)
      }
    });
    
  } catch (error) {
    console.error('Error fetching applications:', error);
    return NextResponse.json(
      { error: 'Failed to fetch applications' },
      { status: 500 }
    );
  }
}
