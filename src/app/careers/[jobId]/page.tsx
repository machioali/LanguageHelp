"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  ArrowRight,
  Briefcase,
  Building,
  Clock,
  DollarSign,
  MapPin,
  CheckCircle,
  Users,
  Calendar,
  Globe,
  Award,
  Target,
  Heart,
  Zap,
  Shield,
  GraduationCap
} from "lucide-react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

// Mock data - in a real app, this would come from an API
const jobData = {
  "healthcare-interpreter": {
    title: "Healthcare Interpreter",
    department: "Medical Services",
    type: "Contract",
    location: "Remote",
    payRange: "$35-65/hr",
    postedDate: "2024-01-15",
    description: "Provide professional interpretation services for medical consultations, procedures, and emergency situations. HIPAA compliance required.",
    longDescription: "As a Healthcare Interpreter with LanguageHelp, you'll play a crucial role in facilitating communication between healthcare providers and patients who speak different languages. You'll work in various medical settings including hospitals, clinics, and emergency rooms, ensuring accurate and culturally sensitive interpretation.",
    responsibilities: [
      "Provide consecutive and simultaneous interpretation during medical appointments",
      "Maintain strict patient confidentiality and HIPAA compliance",
      "Facilitate communication during emergency medical situations",
      "Translate medical documents when required",
      "Work with diverse medical specialties including cardiology, oncology, and pediatrics",
      "Participate in ongoing medical terminology training"
    ],
    requirements: [
      "Medical interpretation certification (CoreCHI, NBCMI, or equivalent)",
      "2+ years of healthcare interpretation experience",
      "HIPAA training certification",
      "Native-level fluency in source and target languages",
      "Strong understanding of medical terminology",
      "Excellent verbal communication skills"
    ],
    benefits: [
      "Competitive hourly rates with performance bonuses",
      "Flexible scheduling to fit your availability",
      "Comprehensive health and dental insurance",
      "Professional development and continuing education",
      "Access to cutting-edge interpretation technology",
      "24/7 technical and professional support"
    ],
    idealCandidate: [
      "Passionate about healthcare and helping others",
      "Detail-oriented with strong ethical standards",
      "Able to work under pressure in emergency situations",
      "Comfortable with medical technology and software",
      "Committed to ongoing professional development"
    ]
  },
  "legal-interpreter": {
    title: "Legal Interpreter",
    department: "Legal Services",
    type: "Contract",
    location: "Remote",
    payRange: "$45-75/hr",
    postedDate: "2024-01-12",
    description: "Interpret for legal proceedings, depositions, and attorney-client meetings with certified accuracy and confidentiality.",
    longDescription: "Join our Legal Services team as a certified court interpreter. You'll work with courts, law firms, and legal institutions to ensure accurate interpretation during critical legal proceedings. This role requires the highest level of accuracy and professional ethics.",
    responsibilities: [
      "Provide interpretation for court proceedings and depositions",
      "Interpret during attorney-client consultations",
      "Maintain absolute confidentiality of all legal matters",
      "Prepare for cases by reviewing relevant legal terminology",
      "Work with various areas of law including criminal, civil, and immigration",
      "Provide sight translation of legal documents when needed"
    ],
    requirements: [
      "Court interpreter certification (state or federal)",
      "Legal terminology expertise across multiple practice areas",
      "3+ years of legal interpretation experience",
      "Security clearance for confidential matters",
      "Perfect command of legal procedures and etiquette",
      "Ability to work under high-stress conditions"
    ],
    benefits: [
      "Premium hourly rates for specialized expertise",
      "Access to high-profile legal cases",
      "Professional liability insurance coverage",
      "Continuing legal education opportunities",
      "Network with top legal professionals",
      "Priority scheduling for premium assignments"
    ],
    idealCandidate: [
      "Strong interest in legal systems and procedures",
      "Exceptional memory and concentration abilities",
      "Professional demeanor suitable for court settings",
      "Ability to remain neutral and impartial",
      "Commitment to absolute confidentiality"
    ]
  },
  "business-conference-interpreter": {
    title: "Business Conference Interpreter",
    department: "Corporate Services",
    type: "Contract",
    location: "Remote/Hybrid",
    payRange: "$30-55/hr",
    postedDate: "2024-01-10",
    description: "Support international business meetings, conferences, and corporate negotiations with cultural sensitivity.",
    longDescription: "Join our Corporate Services team to facilitate high-level business communications across languages and cultures. You'll support multinational corporations, startups, and organizations in their global expansion efforts through professional interpretation services.",
    responsibilities: [
      "Provide simultaneous interpretation for business conferences and meetings",
      "Support multi-party negotiations and discussions",
      "Interpret during corporate presentations and training sessions",
      "Facilitate cross-cultural communication with cultural awareness",
      "Work with various industries including tech, finance, and manufacturing",
      "Maintain confidentiality of business-sensitive information"
    ],
    requirements: [
      "Business interpretation experience (2+ years preferred)",
      "Multi-party session interpretation skills",
      "Industry knowledge in business and finance",
      "Cultural competency and cross-cultural awareness",
      "Professional presentation and communication skills",
      "Ability to work in fast-paced business environments"
    ],
    benefits: [
      "Competitive hourly rates with project bonuses",
      "Exposure to diverse industries and business practices",
      "Flexible remote and hybrid work opportunities",
      "Professional development in business contexts",
      "Network with international business professionals",
      "Access to cutting-edge business interpretation technology"
    ],
    idealCandidate: [
      "Interest in international business and global markets",
      "Strong business acumen and commercial awareness",
      "Ability to adapt quickly to different corporate cultures",
      "Excellent interpersonal and networking skills",
      "Professional demeanor suitable for C-suite environments"
    ]
  },
  "quality-assurance-manager": {
    title: "Quality Assurance Manager",
    department: "Operations",
    type: "Full-time",
    location: "Remote",
    payRange: "$70-90k/year",
    postedDate: "2024-01-08",
    description: "Lead quality assurance efforts, maintain interpretation standards, and mentor new interpreters.",
    longDescription: "Take the lead in ensuring our interpretation services meet the highest quality standards. You'll work with our global team of interpreters to establish best practices, conduct quality reviews, and drive continuous improvement in our service delivery.",
    responsibilities: [
      "Develop and implement quality assurance protocols",
      "Conduct regular quality reviews and assessments of interpretation sessions",
      "Mentor and train new interpreters on best practices",
      "Analyze performance metrics and identify improvement opportunities",
      "Collaborate with different departments to maintain service standards",
      "Create training materials and certification programs"
    ],
    requirements: [
      "Management experience in language services or related field",
      "Quality assurance certification or equivalent experience",
      "Fluency in multiple languages (3+ preferred)",
      "Training and mentorship expertise",
      "Strong analytical and problem-solving skills",
      "Experience with quality management systems"
    ],
    benefits: [
      "Competitive annual salary with performance bonuses",
      "Comprehensive health, dental, and vision insurance",
      "Generous PTO and flexible work arrangements",
      "Professional development budget for training and conferences",
      "Leadership development opportunities",
      "Stock options and equity participation"
    ],
    idealCandidate: [
      "Passion for quality and continuous improvement",
      "Strong leadership and team management skills",
      "Detail-oriented with systematic approach to problem-solving",
      "Excellent communication and feedback delivery skills",
      "Experience in building and scaling quality processes"
    ]
  },
  "customer-success-specialist": {
    title: "Customer Success Specialist",
    department: "Client Relations",
    type: "Full-time",
    location: "Remote",
    payRange: "$55-75k/year",
    postedDate: "2024-01-05",
    description: "Help clients maximize their use of interpretation services and ensure exceptional customer experience.",
    longDescription: "Be the bridge between our clients and our interpretation services. You'll work directly with healthcare facilities, law firms, and businesses to ensure they get maximum value from our platform while maintaining the highest levels of customer satisfaction.",
    responsibilities: [
      "Onboard new clients and provide platform training",
      "Serve as primary point of contact for client questions and issues",
      "Analyze client usage patterns and recommend optimization strategies",
      "Coordinate with interpreters to ensure seamless service delivery",
      "Handle escalations and resolve complex client issues",
      "Contribute to product improvement based on client feedback"
    ],
    requirements: [
      "Customer success or account management experience (2+ years)",
      "Multilingual abilities preferred (not required)",
      "Strong problem-solving and analytical skills",
      "Excellent verbal and written communication skills",
      "Experience with CRM systems and customer support tools",
      "Ability to work in a fast-paced, client-focused environment"
    ],
    benefits: [
      "Competitive annual salary with quarterly bonuses",
      "Full health and wellness benefits package",
      "Professional development and training opportunities",
      "Flexible work arrangements and generous PTO",
      "Career advancement paths within the organization",
      "Access to language learning programs"
    ],
    idealCandidate: [
      "Genuine passion for helping others succeed",
      "Empathetic and patient communication style",
      "Proactive approach to identifying and solving problems",
      "Interest in language services and cross-cultural communication",
      "Ability to build strong relationships with diverse stakeholders"
    ]
  }
};

const companyHighlights = [
  {
    icon: Users,
    title: "2,500+ Interpreters",
    description: "Join our global community of certified professionals"
  },
  {
    icon: Globe,
    title: "150+ Languages",
    description: "Work with diverse language pairs and specializations"
  },
  {
    icon: Award,
    title: "98% Satisfaction",
    description: "Industry-leading client and interpreter satisfaction rates"
  },
  {
    icon: Zap,
    title: "24/7 Support",
    description: "Round-the-clock technical and professional assistance"
  }
];

export default function JobDetailsPage() {
  const params = useParams() as { jobId?: string };
  const jobId = params?.jobId;
  const [job, setJob] = useState<any>(null);

  useEffect(() => {
    if (!jobId) return;
    // In a real app, fetch job data from API
    const jobKey = jobId.toLowerCase().replace(/\s+/g, '-');
    setJob(jobData[jobKey as keyof typeof jobData]);
  }, [jobId]);

  if (!jobId) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Job Not Found</h2>
          <p className="text-muted-foreground mb-6">The job posting you're looking for doesn't exist.</p>
          <Button asChild>
            <Link href="/careers">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Careers
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary/5 via-transparent to-secondary/5 border-b">
        <div className="mx-auto max-w-7xl px-6 py-8">
          <div className="mb-6">
            <Button variant="ghost" asChild className="mb-4">
              <Link href="/careers">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Careers
              </Link>
            </Button>
          </div>
          
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-primary/10 rounded-lg p-3">
                  <Briefcase className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-foreground">{job.title}</h1>
                  <p className="text-muted-foreground">{job.department}</p>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-6">
                <span className="flex items-center gap-1">
                  <Building className="h-4 w-4" />
                  {job.department}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {job.type}
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  {job.location}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  Posted {new Date(job.postedDate).toLocaleDateString()}
                </span>
              </div>
              
              <p className="text-lg text-muted-foreground">{job.description}</p>
            </div>
            
            <div className="lg:w-80">
              <Card className="bg-gradient-to-br from-primary/5 to-secondary/5 border-2 border-primary/20">
                <CardContent className="p-6 text-center">
                  <div className="text-3xl font-bold text-primary mb-2">{job.payRange}</div>
                  <p className="text-muted-foreground mb-6">Competitive compensation</p>
                  <Button size="lg" className="w-full mb-4 group" asChild>
                    <Link href={`/careers/${jobId}/apply`}>
                      Apply Now
                      <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </Button>
                  <Button variant="outline" size="lg" className="w-full">
                    Save Job
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Job Description */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-primary" />
                  About the Role
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">{job.longDescription}</p>
              </CardContent>
            </Card>

            {/* Key Responsibilities */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-primary" />
                  Key Responsibilities
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {job.responsibilities.map((responsibility: string, index: number) => (
                    <li key={index} className="flex items-start gap-3">
                      <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span className="text-muted-foreground">{responsibility}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Requirements */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <GraduationCap className="h-5 w-5 text-primary" />
                  Requirements
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {job.requirements.map((requirement: string, index: number) => (
                    <li key={index} className="flex items-start gap-3">
                      <CheckCircle className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                      <span className="text-muted-foreground">{requirement}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Benefits */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="h-5 w-5 text-primary" />
                  Benefits & Perks
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {job.benefits.map((benefit: string, index: number) => (
                    <li key={index} className="flex items-start gap-3">
                      <CheckCircle className="h-4 w-4 text-purple-600 mt-0.5 flex-shrink-0" />
                      <span className="text-muted-foreground">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Ideal Candidate */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Ideal Candidate</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {job.idealCandidate.map((trait: string, index: number) => (
                    <li key={index} className="flex items-start gap-2 text-sm">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                      <span className="text-muted-foreground">{trait}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Company Highlights */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Why LanguageHelp?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {companyHighlights.map((highlight, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="bg-primary/10 rounded-lg p-2">
                      <highlight.icon className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <div className="font-semibold text-sm">{highlight.title}</div>
                      <div className="text-xs text-muted-foreground">{highlight.description}</div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Share Job */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Share this Job</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col gap-2">
                  <Button variant="outline" size="sm" className="justify-start">
                    Copy Link
                  </Button>
                  <Button variant="outline" size="sm" className="justify-start">
                    Share via Email
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="mt-12">
          <Card className="bg-gradient-to-r from-primary/5 via-transparent to-secondary/5 border-2 border-primary/20">
            <CardContent className="p-8 text-center">
              <h3 className="text-2xl font-bold mb-4">Ready to Apply?</h3>
              <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                Join thousands of interpreters making a difference in {job.department.toLowerCase()}. 
                Start your application today and help break down language barriers.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="group" asChild>
                  <Link href={`/careers/${jobId}/apply`}>
                    Apply for this Position
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
                <Button variant="outline" size="lg" asChild>
                  <Link href="/careers">
                    View Other Positions
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
