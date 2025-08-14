"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Briefcase,
  Globe,
  Users,
  Laptop,
  ArrowRight,
  CheckCircle,
  Clock,
  DollarSign,
  Shield,
  Heart,
  GraduationCap,
  Award,
  Star,
  Languages,
  MessageSquare,
  Video,
  Phone,
  UserCheck,
  Building,
  MapPin,
  Zap,
  TrendingUp,
  FileText,
  Timer,
  HelpCircle
} from "lucide-react";

// Why join us features
const whyJoinFeatures = [
  {
    title: "Global Impact",
    description: "Break down language barriers in healthcare, legal, and emergency situations worldwide.",
    icon: Globe,
    color: "text-blue-600",
    bgColor: "bg-blue-50 dark:bg-blue-900/20"
  },
  {
    title: "Diverse Community",
    description: "Join a network of 2,500+ certified interpreters from around the world.",
    icon: Users,
    color: "text-green-600",
    bgColor: "bg-green-50 dark:bg-green-900/20"
  },
  {
    title: "Flexible Work",
    description: "Set your own schedule and work from anywhere with our remote-first culture.",
    icon: Clock,
    color: "text-purple-600",
    bgColor: "bg-purple-50 dark:bg-purple-900/20"
  },
  {
    title: "Competitive Pay",
    description: "Earn $25-75+ per hour based on specialization and language pairs.",
    icon: DollarSign,
    color: "text-orange-600",
    bgColor: "bg-orange-50 dark:bg-orange-900/20"
  }
];

// Benefits data
const benefits = [
  {
    title: "Professional Growth",
    description: "Access to continuous training, certifications, and career development programs.",
    icon: GraduationCap,
    color: "text-blue-600",
    bgColor: "bg-blue-100 dark:bg-blue-900/20"
  },
  {
    title: "Health & Wellness",
    description: "Comprehensive health insurance coverage and wellness programs.",
    icon: Heart,
    color: "text-red-600",
    bgColor: "bg-red-100 dark:bg-red-900/20"
  },
  {
    title: "Technology Support",
    description: "State-of-the-art platform with 24/7 technical support and training.",
    icon: Shield,
    color: "text-green-600",
    bgColor: "bg-green-100 dark:bg-green-900/20"
  },
  {
    title: "Recognition & Rewards",
    description: "Performance bonuses, referral rewards, and public recognition programs.",
    icon: Award,
    color: "text-purple-600",
    bgColor: "bg-purple-100 dark:bg-purple-900/20"
  },
  {
    title: "Flexible Time Off",
    description: "Generous PTO policy and holiday schedules that respect cultural diversity.",
    icon: Clock,
    color: "text-orange-600",
    bgColor: "bg-orange-100 dark:bg-orange-900/20"
  },
  {
    title: "Professional Network",
    description: "Connect with industry experts and build lasting professional relationships.",
    icon: UserCheck,
    color: "text-indigo-600",
    bgColor: "bg-indigo-100 dark:bg-indigo-900/20"
  }
];

// Open positions
const openPositions = [
  {
    title: "Healthcare Interpreter",
    department: "Medical Services",
    type: "Contract",
    location: "Remote",
    payRange: "$35-65/hr",
    description: "Provide professional interpretation services for medical consultations, procedures, and emergency situations. HIPAA compliance required.",
    requirements: ["Medical interpretation certification", "2+ years experience", "HIPAA training", "Native-level fluency"]
  },
  {
    title: "Legal Interpreter", 
    department: "Legal Services",
    type: "Contract",
    location: "Remote",
    payRange: "$45-75/hr",
    description: "Interpret for legal proceedings, depositions, and attorney-client meetings with certified accuracy and confidentiality.",
    requirements: ["Court interpreter certification", "Legal terminology expertise", "3+ years experience", "Confidentiality clearance"]
  },
  {
    title: "Business Conference Interpreter",
    department: "Corporate Services", 
    type: "Contract",
    location: "Remote/Hybrid",
    payRange: "$30-55/hr",
    description: "Support international business meetings, conferences, and corporate negotiations with cultural sensitivity.",
    requirements: ["Business interpretation experience", "Multi-party session skills", "Industry knowledge", "Cultural competency"]
  },
  {
    title: "Quality Assurance Manager",
    department: "Operations",
    type: "Full-time",
    location: "Remote",
    payRange: "$70-90k/year",
    description: "Lead quality assurance efforts, maintain interpretation standards, and mentor new interpreters.",
    requirements: ["Management experience", "QA certification", "Multiple languages", "Training expertise"]
  },
  {
    title: "Customer Success Specialist",
    department: "Client Relations",
    type: "Full-time", 
    location: "Remote",
    payRange: "$55-75k/year",
    description: "Help clients maximize their use of interpretation services and ensure exceptional customer experience.",
    requirements: ["Customer success experience", "Multilingual preferred", "Problem-solving skills", "Communication expertise"]
  }
];

// Application process steps
const applicationSteps = [
  {
    step: "1",
    title: "Submit Application",
    description: "Complete our comprehensive application with your qualifications and experience.",
    timeframe: "5 minutes",
    icon: FileText
  },
  {
    step: "02", 
    title: "Skills Assessment",
    description: "Take our language proficiency test and demonstrate your interpretation skills.",
    timeframe: "45 minutes",
    icon: GraduationCap
  },
  {
    step: "03",
    title: "Background Check",
    description: "We conduct thorough background verification for security and compliance.",
    timeframe: "3-5 days",
    icon: Shield
  },
  {
    step: "04",
    title: "Virtual Interview", 
    description: "Meet with our team to discuss your experience and answer any questions.",
    timeframe: "30 minutes",
    icon: Video
  },
  {
    step: "05",
    title: "Platform Training",
    description: "Complete our comprehensive platform training and certification program.",
    timeframe: "2-4 hours",
    icon: Award
  },
  {
    step: "06",
    title: "Start Working",
    description: "Begin accepting assignments and helping clients break language barriers.",
    timeframe: "Immediate",
    icon: Zap
  }
];

export default function CareersPage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-background to-secondary/10 py-20 sm:py-32">
        {/* Decorative elements */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute left-[calc(50%-18rem)] top-10 -z-10 transform-gpu blur-3xl sm:left-[calc(50%-30rem)]" aria-hidden="true">
            <div className="aspect-[1108/632] w-[69.25rem] bg-gradient-to-r from-primary/20 to-secondary/20 opacity-20" style={{ clipPath: 'polygon(73.6% 51.7%, 91.7% 11.8%, 100% 46.4%, 97.4% 82.2%, 92.5% 84.9%, 75.7% 64%, 55.3% 47.5%, 46.5% 49.4%, 45% 62.9%, 50.3% 87.2%, 21.3% 64.1%, 0.1% 100%, 5.4% 51.1%, 21.4% 63.9%, 58.9% 0.2%, 73.6% 51.7%)' }} />
          </div>
          <div className="absolute left-[calc(50%+18rem)] top-10 -z-10 transform-gpu blur-3xl sm:left-[calc(50%+15rem)]" aria-hidden="true">
            <div className="aspect-[1108/632] w-[69.25rem] bg-gradient-to-r from-secondary/20 to-primary/20 opacity-20" style={{ clipPath: 'polygon(73.6% 51.7%, 91.7% 11.8%, 100% 46.4%, 97.4% 82.2%, 92.5% 84.9%, 75.7% 64%, 55.3% 47.5%, 46.5% 49.4%, 45% 62.9%, 50.3% 87.2%, 21.3% 64.1%, 0.1% 100%, 5.4% 51.1%, 21.4% 63.9%, 58.9% 0.2%, 73.6% 51.7%)' }} />
          </div>
        </div>

        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <div className="mb-8 flex justify-center">
              <div className="relative rounded-full px-3 py-1 text-sm leading-6 text-muted-foreground ring-1 ring-primary/10 hover:ring-primary/20 transition-all duration-300">
                Now hiring interpreters in 150+ languages.
                <Link href="/interpreter-portal" className="font-semibold text-primary ml-1">
                  <span className="absolute inset-0" aria-hidden="true" />
                  Existing interpreter? <span aria-hidden="true">&rarr;</span>
                </Link>
              </div>
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-6xl bg-clip-text">
              Join Our
              <span className="bg-gradient-to-r from-primary via-primary/80 to-secondary bg-clip-text text-transparent"> Team</span>
            </h1>
            <p className="mt-6 text-lg leading-8 text-muted-foreground">
              Break down language barriers and make a global impact. Join thousands of professional interpreters 
              helping people communicate in critical healthcare, legal, and business situations.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Button size="lg" className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 group" asChild>
                <Link href="#application-process" className="flex items-center justify-center">
                  <Briefcase className="mr-2 h-4 w-4 flex-shrink-0" />
                  Start Application
                  <ArrowRight className="ml-2 h-4 w-4 flex-shrink-0 group-hover:translate-x-1 transition-transform duration-300" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" className="border-2 hover:bg-primary/5 hover:border-primary/50 transition-all duration-300 group" asChild>
                <Link href="#open-positions" className="flex items-center justify-center">
                  <Star className="mr-2 h-4 w-4 flex-shrink-0 group-hover:scale-110 transition-transform duration-300" />
                  View Positions
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Why Join Us Section */}
      <section className="py-16 sm:py-24 relative overflow-hidden">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl bg-gradient-to-r from-primary via-primary/80 to-secondary bg-clip-text text-transparent inline-block">
              Why Join LanguageHelp?
            </h2>
            <p className="mt-6 text-lg leading-8 text-muted-foreground">
              Be part of a mission-driven company that's transforming how the world communicates.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {whyJoinFeatures.map((feature, index) => (
              <Card key={feature.title} className="relative group hover:shadow-xl transition-all duration-500 hover:scale-[1.02] border-2 hover:border-primary/20 bg-gradient-to-br from-background to-muted/30 backdrop-blur-sm overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <CardHeader>
                  <div className={`rounded-lg p-3 ${feature.bgColor} w-fit`}>
                    <feature.icon className={`h-6 w-6 ${feature.color} group-hover:scale-110 transition-transform duration-300 flex-shrink-0`} />
                  </div>
                  <CardTitle className="text-lg group-hover:text-primary transition-colors duration-300">
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="group-hover:text-muted-foreground/80 transition-colors duration-300">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="bg-gradient-to-b from-muted/50 to-background py-24 sm:py-32 relative overflow-hidden">
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute h-[50rem] w-[50rem] -translate-x-1/2 rounded-full bg-gradient-to-r from-primary/5 to-secondary/5 blur-3xl lg:w-[65rem] -top-40 left-1/2" />
        </div>

        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl bg-gradient-to-r from-primary via-primary/80 to-secondary bg-clip-text text-transparent inline-block">
              Benefits & Perks
            </h2>
            <p className="mt-6 text-lg leading-8 text-muted-foreground">
              We invest in our interpreters with comprehensive benefits and growth opportunities.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {benefits.map((benefit, index) => (
              <Card key={benefit.title} className="group hover:shadow-xl transition-all duration-500 hover:scale-[1.02] border-2 hover:border-primary/20 bg-gradient-to-br from-background to-muted/30 backdrop-blur-sm relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <CardHeader>
                  <div className={`rounded-lg p-3 ${benefit.bgColor} w-fit`}>
                    <benefit.icon className={`h-6 w-6 ${benefit.color} group-hover:scale-110 transition-transform duration-300 flex-shrink-0`} />
                  </div>
                  <CardTitle className="text-lg group-hover:text-primary transition-colors duration-300">
                    {benefit.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="group-hover:text-muted-foreground/80 transition-colors duration-300">
                    {benefit.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Open Positions Section */}
      <section id="open-positions" className="py-16 sm:py-24 relative overflow-hidden">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl bg-gradient-to-r from-primary via-primary/80 to-secondary bg-clip-text text-transparent inline-block">
              Open Positions
            </h2>
            <p className="mt-6 text-lg leading-8 text-muted-foreground">
              Find the perfect role to launch or advance your interpretation career.
            </p>
          </div>
          <div className="space-y-6 max-w-4xl mx-auto">
            {openPositions.map((position, index) => (
              <Card key={position.title} className="group hover:shadow-xl transition-all duration-500 hover:scale-[1.01] border-2 hover:border-primary/20 bg-gradient-to-br from-background to-muted/30 backdrop-blur-sm relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <CardTitle className="text-xl group-hover:text-primary transition-colors duration-300 flex items-center gap-2">
                        <Briefcase className="h-5 w-5 flex-shrink-0" />
                        {position.title}
                      </CardTitle>
                      <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Building className="h-3 w-3" />
                          {position.department}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {position.type}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {position.location}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-semibold text-primary">{position.payRange}</div>
                      <div className="text-xs text-muted-foreground">Competitive Rate</div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground">{position.description}</p>
                  <div>
                    <h4 className="font-semibold mb-2 text-sm">Key Requirements:</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {position.requirements.map((req, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-sm text-muted-foreground">
                          <CheckCircle className="h-3 w-3 text-green-600 flex-shrink-0" />
                          {req}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="pt-2 flex gap-2 relative z-10">
                    <Link href={`/careers/${position.title.toLowerCase().replace(/\s+/g, '-')}`} className="flex-1">
                      <Button className="w-full group-hover:bg-primary/90 transition-colors duration-300">
                        View Details
                        <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
                      </Button>
                    </Link>
                    <Link href={`/careers/${position.title.toLowerCase().replace(/\s+/g, '-')}/apply`}>
                      <Button variant="outline" className="group-hover:border-primary/50 transition-colors duration-300">
                        Apply Now
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Application Process Section */}
      <section id="application-process" className="bg-gradient-to-b from-muted/50 to-background py-24 sm:py-32 relative overflow-hidden">
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute h-[50rem] w-[50rem] -translate-x-1/2 rounded-full bg-gradient-to-r from-primary/5 to-secondary/5 blur-3xl lg:w-[65rem] -top-40 right-1/2" />
        </div>

        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl bg-gradient-to-r from-primary via-primary/80 to-secondary bg-clip-text text-transparent inline-block">
              Application Process
            </h2>
            <p className="mt-6 text-lg leading-8 text-muted-foreground">
              Our streamlined process gets qualified interpreters working quickly while maintaining high standards.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {applicationSteps.map((step, index) => (
              <Card key={step.step} className="group hover:shadow-xl transition-all duration-500 hover:scale-[1.02] border-2 hover:border-primary/20 bg-gradient-to-br from-background to-muted/30 backdrop-blur-sm relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <CardHeader>
                  <div className="flex items-center gap-4 mb-2">
                    <div className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
                      {step.step}
                    </div>
                    <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-2 w-fit">
                      <step.icon className="h-5 w-5 text-blue-600 group-hover:scale-110 transition-transform duration-300 flex-shrink-0" />
                    </div>
                  </div>
                  <CardTitle className="text-lg group-hover:text-primary transition-colors duration-300">
                    {step.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="group-hover:text-muted-foreground/80 transition-colors duration-300 mb-3">
                    {step.description}
                  </CardDescription>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Timer className="h-3 w-3" />
                    <span>{step.timeframe}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative isolate overflow-hidden bg-gradient-to-b from-background via-muted/50 to-background">
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute inset-x-0 top-0 h-[800px] xl:h-[1000px] transform-gpu overflow-hidden bg-background">
            <div
              className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-secondary/5"
              style={{
                clipPath:
                  'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)'
              }}
            />
          </div>
        </div>

        <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <div className="mb-8 flex justify-center">
              <div className="relative rounded-full px-3 py-1 text-sm leading-6 text-muted-foreground ring-1 ring-primary/10 hover:ring-primary/20">
                Ready to make a global impact?{' '}
                <Link href="/help" className="font-semibold text-primary">
                  <span className="absolute inset-0" aria-hidden="true" />
                  Get Help <span aria-hidden="true">&rarr;</span>
                </Link>
              </div>
            </div>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl bg-gradient-to-r from-primary via-primary/80 to-secondary bg-clip-text text-transparent inline-block">
              Start Your Interpretation Career
            </h2>
            <p className="mt-6 text-lg leading-8 text-muted-foreground">
              Join thousands of interpreters making a difference in healthcare, legal, and business communications. 
              Apply today and start helping people break down language barriers.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Button 
                size="lg" 
                className="group rounded-full bg-gradient-to-r from-primary to-secondary hover:shadow-lg hover:shadow-primary/25 transition-all duration-300 flex items-center justify-center"
              >
                Apply Now
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
              </Button>
              <Link href="/contact">
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="group rounded-full hover:bg-primary/5 transition-all duration-300 flex items-center justify-center"
                >
                  Questions? Contact Us
                  <MessageSquare className="ml-2 h-4 w-4 group-hover:scale-110 transition-transform duration-300" />
                </Button>
              </Link>
            </div>
            <div className="mt-8 grid grid-cols-3 gap-4 text-center text-sm text-muted-foreground">
              <div className="flex flex-col items-center">
                <div className="font-semibold text-foreground">2,500+</div>
                <div>Active Interpreters</div>
              </div>
              <div className="flex flex-col items-center">
                <div className="font-semibold text-foreground">150+</div>
                <div>Languages Supported</div>
              </div>
              <div className="flex flex-col items-center">
                <div className="font-semibold text-foreground">98%</div>
                <div>Satisfaction Rate</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Don't see a match section */}
      <section className="py-16 bg-muted/30">
        <div className="mx-auto max-w-4xl px-6 lg:px-8">
          <Card className="group hover:shadow-xl transition-all duration-500 hover:scale-[1.01] border-2 hover:border-primary/20 bg-gradient-to-br from-background to-muted/30 backdrop-blur-sm relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <CardContent className="py-12 text-center">
              <div className="bg-primary/10 rounded-full p-4 w-fit mx-auto mb-6">
                <HelpCircle className="h-8 w-8 text-primary" />
              </div>
              <h2 className="text-2xl font-bold mb-4 group-hover:text-primary transition-colors duration-300">Don't see a perfect match?</h2>
              <p className="text-muted-foreground mb-8 text-lg max-w-2xl mx-auto">
                We're always looking for talented interpreters to join our growing team. 
                Send us your resume and let's discuss how you can make an impact with LanguageHelp.
              </p>
              <Button size="lg" variant="outline" className="group-hover:bg-primary/5 hover:border-primary/50 transition-all duration-300">
                <FileText className="mr-2 h-4 w-4" />
                Send General Application
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
