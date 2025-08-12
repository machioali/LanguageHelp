"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { InterpreterUnauthenticatedOnlyProtection } from '@/components/interpreter-protection';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Globe,
  MessageSquare,
  Users,
  Shield,
  Clock,
  Star,
  ArrowRight,
  CheckCircle,
  LogIn,
  Headphones,
  Award,
  DollarSign,
  Video,
  Phone,
  Languages,
  UserCheck,
  Briefcase,
  HelpCircle,
  BookOpen,
  GraduationCap,
  Heart,
  FileText,
  Timer,
  Building,
  Zap,
  TrendingUp,
  MapPin,
  Badge
} from "lucide-react";

// Platform features for interpreters
const platformFeatures = [
  {
    title: "Professional Dashboard",
    description: "Access your personalized dashboard with session history, earnings, and performance analytics.",
    icon: Users,
    color: "text-blue-600",
    bgColor: "bg-blue-50 dark:bg-blue-900/20"
  },
  {
    title: "Flexible Scheduling",
    description: "Set your availability and work when it suits your schedule across 150+ languages.",
    icon: Clock,
    color: "text-green-600",
    bgColor: "bg-green-50 dark:bg-green-900/20"
  },
  {
    title: "Secure Platform",
    description: "HIPAA-compliant platform with encrypted communications and secure payment processing.",
    icon: Shield,
    color: "text-purple-600",
    bgColor: "bg-purple-50 dark:bg-purple-900/20"
  },
  {
    title: "24/7 Support",
    description: "Round-the-clock technical support and assistance whenever you need it.",
    icon: Headphones,
    color: "text-orange-600",
    bgColor: "bg-orange-50 dark:bg-orange-900/20"
  }
];

// Benefits data
const benefits = [
  {
    title: "Flexible Schedule",
    description: "Work on your own terms. Set your availability and work from anywhere in the world.",
    icon: Clock,
    color: "text-blue-600",
    bgColor: "bg-blue-100 dark:bg-blue-900/20"
  },
  {
    title: "Competitive Earnings",
    description: "Earn $25-75+ per hour based on your expertise, language pairs, and specialization.",
    icon: DollarSign,
    color: "text-green-600",
    bgColor: "bg-green-100 dark:bg-green-900/20"
  },
  {
    title: "Professional Growth",
    description: "Access continuous training, certifications, and career development programs.",
    icon: GraduationCap,
    color: "text-purple-600",
    bgColor: "bg-purple-100 dark:bg-purple-900/20"
  },
  {
    title: "Technology Support",
    description: "State-of-the-art platform with 24/7 technical support and training resources.",
    icon: Shield,
    color: "text-orange-600",
    bgColor: "bg-orange-100 dark:bg-orange-900/20"
  },
  {
    title: "Global Impact",
    description: "Help break language barriers in critical situations - healthcare, legal, emergency services.",
    icon: Heart,
    color: "text-red-600",
    bgColor: "bg-red-100 dark:bg-red-900/20"
  },
  {
    title: "Professional Network",
    description: "Join a community of certified interpreters and build lasting professional relationships.",
    icon: UserCheck,
    color: "text-indigo-600",
    bgColor: "bg-indigo-100 dark:bg-indigo-900/20"
  }
];

// Specialization areas
const specializations = [
  {
    title: "Healthcare Interpretation",
    description: "Medical consultations, procedures, and emergency situations requiring HIPAA compliance.",
    icon: Heart,
    payRange: "$35-65/hr",
    demand: "High",
    features: ["Medical terminology", "HIPAA certified", "Emergency priority", "Continuing education"]
  },
  {
    title: "Legal & Court Interpretation",
    description: "Legal proceedings, depositions, and attorney-client meetings with certified accuracy.",
    icon: Building,
    payRange: "$45-75/hr",
    demand: "Very High",
    features: ["Legal terminology", "Court certified", "Confidentiality", "Precise translation"]
  },
  {
    title: "Business & Conference",
    description: "Corporate meetings, international conferences, and business negotiations.",
    icon: Briefcase,
    payRange: "$30-55/hr",
    demand: "High",
    features: ["Business expertise", "Multi-party support", "Cultural nuance", "Industry knowledge"]
  }
];

// Application process steps
const applicationSteps = [
  {
    step: "01",
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
    title: "Start Interpreting",
    description: "Begin accepting sessions and helping clients break language barriers.",
    timeframe: "Immediate",
    icon: Zap
  }
];

// Testimonials from interpreters
const interpreterTestimonials = [
  {
    content: "The platform provides professional interpretation opportunities with flexible scheduling. The training resources are comprehensive and the support team is responsive.",
    author: "Professional Interpreter",
    role: "Healthcare Interpretation Specialist",
    location: "West Coast",
    rating: 5,
    earnings: "Competitive rates"
  },
  {
    content: "Working as a legal interpreter requires precision and reliable technology. The platform meets those requirements with good audio quality and technical support.",
    author: "Certified Interpreter",
    role: "Legal Language Services", 
    location: "East Coast",
    rating: 5,
    earnings: "Professional rates"
  },
  {
    content: "The variety of interpretation assignments and professional development opportunities have been valuable for career growth. The platform is user-friendly.",
    author: "Business Interpreter",
    role: "Multilingual Business Services",
    location: "Central Region",
    rating: 5,
    earnings: "Market rates"
  }
];

export default function InterpreterPortalPage() {
  return (
    <InterpreterUnauthenticatedOnlyProtection>
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
                Welcome back to the interpreter portal.
                <Link href="/careers" className="font-semibold text-primary ml-1">
                  <span className="absolute inset-0" aria-hidden="true" />
                  New to LanguageHelp? <span aria-hidden="true">&rarr;</span>
                </Link>
              </div>
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-6xl bg-clip-text">
              Interpreter
              <span className="bg-gradient-to-r from-primary via-primary/80 to-secondary bg-clip-text text-transparent"> Portal</span>
            </h1>
            <p className="mt-6 text-lg leading-8 text-muted-foreground">
              Sign in to access your dashboard, manage your sessions, update your availability, 
              and connect with clients who need your professional interpretation services.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Button size="lg" className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 group" asChild>
                <Link href="/auth/interpreter-signin" className="flex items-center justify-center">
                  <LogIn className="mr-2 h-4 w-4 flex-shrink-0" />
                  Sign In to Dashboard
                  <ArrowRight className="ml-2 h-4 w-4 flex-shrink-0 group-hover:translate-x-1 transition-transform duration-300" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" className="border-2 hover:bg-primary/5 hover:border-primary/50 transition-all duration-300 group" asChild>
                <Link href="#platform-features" className="flex items-center justify-center">
                  <HelpCircle className="mr-2 h-4 w-4 flex-shrink-0 group-hover:scale-110 transition-transform duration-300" />
                  Need Help?
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Platform Features Section */}
      <section id="platform-features" className="py-16 sm:py-24 relative overflow-hidden">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl bg-gradient-to-r from-primary via-primary/80 to-secondary bg-clip-text text-transparent inline-block">
              What You'll Have Access To
            </h2>
            <p className="mt-6 text-lg leading-8 text-muted-foreground">
              Everything you need to manage your interpretation career in one professional platform.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {platformFeatures.map((feature, index) => (
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

      {/* Quick Access Section */}
      <section className="bg-gradient-to-b from-muted/50 to-background py-24 sm:py-32 relative overflow-hidden">
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute h-[50rem] w-[50rem] -translate-x-1/2 rounded-full bg-gradient-to-r from-primary/5 to-secondary/5 blur-3xl lg:w-[65rem] -top-40 left-1/2" />
        </div>

        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl bg-gradient-to-r from-primary via-primary/80 to-secondary bg-clip-text text-transparent inline-block">
              Quick Links
            </h2>
            <p className="mt-6 text-lg leading-8 text-muted-foreground">
              Access commonly used features and get help when you need it.
            </p>
          </div>
          <div className="mx-auto mt-16 grid max-w-4xl grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <Card className="group hover:shadow-xl transition-all duration-500 hover:scale-[1.02] border-2 hover:border-primary/20 bg-gradient-to-br from-background to-muted/30 backdrop-blur-sm relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <CardHeader>
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3 w-fit">
                  <BookOpen className="h-6 w-6 text-blue-600 group-hover:scale-110 transition-transform duration-300 flex-shrink-0" />
                </div>
                <CardTitle className="text-lg group-hover:text-primary transition-colors duration-300">
                  Platform Guide
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="group-hover:text-muted-foreground/80 transition-colors duration-300">
                  Learn how to use the platform effectively with our comprehensive guides and tutorials.
                </CardDescription>
                <Button variant="ghost" className="w-full mt-6 group-hover:bg-primary/5 transition-colors duration-300">
                  <span className="text-primary">View Guide</span>
                  <ArrowRight className="ml-2 h-4 w-4 text-primary group-hover:translate-x-1 transition-transform duration-300" />
                </Button>
              </CardContent>
            </Card>
            
            <Card className="group hover:shadow-xl transition-all duration-500 hover:scale-[1.02] border-2 hover:border-primary/20 bg-gradient-to-br from-background to-muted/30 backdrop-blur-sm relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <CardHeader>
                <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-3 w-fit">
                  <MessageSquare className="h-6 w-6 text-green-600 group-hover:scale-110 transition-transform duration-300 flex-shrink-0" />
                </div>
                <CardTitle className="text-lg group-hover:text-primary transition-colors duration-300">
                  Support Center
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="group-hover:text-muted-foreground/80 transition-colors duration-300">
                  Get help from our support team or browse our FAQ for common questions and solutions.
                </CardDescription>
                <Button variant="ghost" className="w-full mt-6 group-hover:bg-primary/5 transition-colors duration-300">
                  <span className="text-primary">Get Support</span>
                  <ArrowRight className="ml-2 h-4 w-4 text-primary group-hover:translate-x-1 transition-transform duration-300" />
                </Button>
              </CardContent>
            </Card>
            
            <Card className="group hover:shadow-xl transition-all duration-500 hover:scale-[1.02] border-2 hover:border-primary/20 bg-gradient-to-br from-background to-muted/30 backdrop-blur-sm relative overflow-hidden sm:col-span-2 lg:col-span-1">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <CardHeader>
                <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-3 w-fit">
                  <Briefcase className="h-6 w-6 text-purple-600 group-hover:scale-110 transition-transform duration-300 flex-shrink-0" />
                </div>
                <CardTitle className="text-lg group-hover:text-primary transition-colors duration-300">
                  Interested in Joining?
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="group-hover:text-muted-foreground/80 transition-colors duration-300">
                  Learn about career opportunities and our application process for new interpreters.
                </CardDescription>
                <Button variant="ghost" className="w-full mt-6 group-hover:bg-primary/5 transition-colors duration-300" asChild>
                  <Link href="/careers">
                    <span className="text-primary">View Careers</span>
                    <ArrowRight className="ml-2 h-4 w-4 text-primary group-hover:translate-x-1 transition-transform duration-300" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
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
                Ready to continue your interpretation work?{' '}
                <Link href="/help" className="font-semibold text-primary">
                  <span className="absolute inset-0" aria-hidden="true" />
                  Get Help <span aria-hidden="true">&rarr;</span>
                </Link>
              </div>
            </div>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl bg-gradient-to-r from-primary via-primary/80 to-secondary bg-clip-text text-transparent inline-block">
              Access Your Dashboard
            </h2>
            <p className="mt-6 text-lg leading-8 text-muted-foreground">
              Sign in to your interpreter dashboard to manage sessions, update availability, 
              view earnings, and connect with clients who need your language expertise.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Link href="/auth/interpreter-signin">
                 <Button 
                   size="lg" 
                   className="group rounded-full bg-gradient-to-r from-primary to-secondary hover:shadow-lg hover:shadow-primary/25 transition-all duration-300 flex items-center justify-center"
                 >
                   Sign In Here
                   <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
                 </Button>
               </Link>
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
              <div className="font-semibold text-foreground">Active</div>
                <div>Interpreter Community</div>
              </div>
              <div className="flex flex-col items-center">
              <div className="font-semibold text-foreground">Competitive</div>
                <div>Professional Rates</div>
              </div>
              <div className="flex flex-col items-center">
                <div className="font-semibold text-foreground">24/7</div>
                <div>Platform Support</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
    </InterpreterUnauthenticatedOnlyProtection>
  );
}
