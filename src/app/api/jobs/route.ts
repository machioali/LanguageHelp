import { NextRequest, NextResponse } from "next/server";

// Mock data - in a real app this would be a database
const jobs = [
  {
    id: "1",
    title: "Healthcare Interpreter",
    department: "Medical Services",
    type: "Contract",
    location: "Remote",
    payRange: "$35-65/hr",
    status: "Active",
    description: "Provide professional interpretation services for medical consultations, procedures, and emergency situations. HIPAA compliance required.",
    longDescription: "As a Healthcare Interpreter with LanguageHelp, you'll play a crucial role in facilitating communication between healthcare providers and patients who speak different languages.",
    responsibilities: [
      "Provide consecutive and simultaneous interpretation during medical appointments",
      "Maintain strict patient confidentiality and HIPAA compliance",
      "Facilitate communication during emergency medical situations"
    ],
    requirements: [
      "Medical interpretation certification (CoreCHI, NBCMI, or equivalent)",
      "2+ years of healthcare interpretation experience",
      "HIPAA training certification"
    ],
    benefits: [
      "Competitive hourly rates with performance bonuses",
      "Flexible scheduling to fit your availability",
      "Comprehensive health and dental insurance"
    ],
    questions: [
      {
        id: "medical_certification",
        type: "select",
        question: "What medical interpretation certification do you hold?",
        required: true,
        options: [
          "CoreCHI (Certification Commission for Healthcare Interpreters)",
          "NBCMI (National Board of Certification for Medical Interpreters)",
          "State-specific medical interpretation certification"
        ]
      }
    ],
    applications: 24,
    posted: "2024-01-15",
    deadline: "2024-02-15",
    createdAt: "2024-01-15T10:00:00Z",
    updatedAt: "2024-01-15T10:00:00Z"
  },
  {
    id: "2",
    title: "Legal Interpreter",
    department: "Legal Services",
    type: "Contract",
    location: "Remote",
    payRange: "$45-75/hr",
    status: "Active",
    description: "Interpret for legal proceedings, depositions, and attorney-client meetings with certified accuracy and confidentiality.",
    longDescription: "Join our Legal Services team as a certified court interpreter. You'll work with courts, law firms, and legal institutions to ensure accurate interpretation during critical legal proceedings.",
    responsibilities: [
      "Provide interpretation for court proceedings and depositions",
      "Interpret during attorney-client consultations",
      "Maintain absolute confidentiality of all legal matters"
    ],
    requirements: [
      "Court interpreter certification (state or federal)",
      "Legal terminology expertise across multiple practice areas",
      "3+ years of legal interpretation experience"
    ],
    benefits: [
      "Premium hourly rates for specialized expertise",
      "Access to high-profile legal cases",
      "Professional liability insurance coverage"
    ],
    questions: [
      {
        id: "court_certification",
        type: "select",
        question: "What court interpretation certification do you hold?",
        required: true,
        options: [
          "Federal Court Interpreter Certification",
          "State Court Interpreter Certification",
          "Administrative Office of Courts Certification"
        ]
      }
    ],
    applications: 18,
    posted: "2024-01-12",
    deadline: "2024-02-12",
    createdAt: "2024-01-12T10:00:00Z",
    updatedAt: "2024-01-12T10:00:00Z"
  }
];

// GET /api/jobs - Fetch all jobs or specific job
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const jobId = searchParams.get('id');
    const status = searchParams.get('status');
    const department = searchParams.get('department');
    const search = searchParams.get('search');
    
    if (jobId) {
      // Return specific job
      const job = jobs.find(j => j.id === jobId);
      if (!job) {
        return NextResponse.json(
          { error: 'Job not found' },
          { status: 404 }
        );
      }
      return NextResponse.json({ job });
    }
    
    // Filter jobs based on query parameters
    let filteredJobs = jobs;
    
    if (status) {
      filteredJobs = filteredJobs.filter(job => 
        job.status.toLowerCase() === status.toLowerCase()
      );
    }
    
    if (department) {
      filteredJobs = filteredJobs.filter(job => 
        job.department.toLowerCase().includes(department.toLowerCase())
      );
    }
    
    if (search) {
      const searchTerm = search.toLowerCase();
      filteredJobs = filteredJobs.filter(job => 
        job.title.toLowerCase().includes(searchTerm) ||
        job.description.toLowerCase().includes(searchTerm) ||
        job.department.toLowerCase().includes(searchTerm)
      );
    }
    
    return NextResponse.json({ 
      jobs: filteredJobs,
      total: filteredJobs.length 
    });
    
  } catch (error) {
    console.error('Error fetching jobs:', error);
    return NextResponse.json(
      { error: 'Failed to fetch jobs' },
      { status: 500 }
    );
  }
}

// POST /api/jobs - Create new job
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    
    // Validate required fields
    const requiredFields = ['title', 'department', 'type', 'location', 'payRange', 'description'];
    const missingFields = requiredFields.filter(field => !data[field]);
    
    if (missingFields.length > 0) {
      return NextResponse.json(
        { error: 'Missing required fields', fields: missingFields },
        { status: 400 }
      );
    }
    
    // Create new job
    const newJob = {
      id: Date.now().toString(),
      ...data,
      applications: 0,
      posted: new Date().toISOString().split('T')[0],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    jobs.push(newJob);
    
    return NextResponse.json({
      success: true,
      job: newJob,
      message: 'Job created successfully'
    }, { status: 201 });
    
  } catch (error) {
    console.error('Error creating job:', error);
    return NextResponse.json(
      { error: 'Failed to create job' },
      { status: 500 }
    );
  }
}

// PUT /api/jobs - Update existing job
export async function PUT(request: NextRequest) {
  try {
    const data = await request.json();
    const { id, ...updateData } = data;
    
    if (!id) {
      return NextResponse.json(
        { error: 'Job ID is required' },
        { status: 400 }
      );
    }
    
    const jobIndex = jobs.findIndex(job => job.id === id);
    if (jobIndex === -1) {
      return NextResponse.json(
        { error: 'Job not found' },
        { status: 404 }
      );
    }
    
    // Update job
    jobs[jobIndex] = {
      ...jobs[jobIndex],
      ...updateData,
      updatedAt: new Date().toISOString()
    };
    
    return NextResponse.json({
      success: true,
      job: jobs[jobIndex],
      message: 'Job updated successfully'
    });
    
  } catch (error) {
    console.error('Error updating job:', error);
    return NextResponse.json(
      { error: 'Failed to update job' },
      { status: 500 }
    );
  }
}

// DELETE /api/jobs - Delete job
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const jobId = searchParams.get('id');
    
    if (!jobId) {
      return NextResponse.json(
        { error: 'Job ID is required' },
        { status: 400 }
      );
    }
    
    const jobIndex = jobs.findIndex(job => job.id === jobId);
    if (jobIndex === -1) {
      return NextResponse.json(
        { error: 'Job not found' },
        { status: 404 }
      );
    }
    
    // Remove job
    const deletedJob = jobs.splice(jobIndex, 1)[0];
    
    return NextResponse.json({
      success: true,
      job: deletedJob,
      message: 'Job deleted successfully'
    });
    
  } catch (error) {
    console.error('Error deleting job:', error);
    return NextResponse.json(
      { error: 'Failed to delete job' },
      { status: 500 }
    );
  }
}
