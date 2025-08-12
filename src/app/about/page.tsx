import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Globe,
  Users,
  Award,
  Clock,
  Shield,
  Star,
  ArrowRight,
  CheckCircle,
  Heart,
  Target,
  TrendingUp,
  Building,
  Headphones,
  MessageSquare,
  Video,
  Phone,
  Zap,
  FileText,
  BarChart3,
  Eye
} from "lucide-react";

// Company stats
const companyStats = [
  {
    title: "Languages Supported",
    value: "150+",
    change: "+15 this year",
    icon: Globe,
    color: "text-blue-600",
    bgColor: "bg-blue-50 dark:bg-blue-900/20"
  },
  {
    title: "Certified Interpreters",
    value: "2,500+",
    change: "+300 this quarter",
    icon: Users,
    color: "text-green-600",
    bgColor: "bg-green-50 dark:bg-green-900/20"
  },
  {
    title: "Sessions Completed",
    value: "1M+",
    change: "+25% growth",
    icon: Video,
    color: "text-purple-600",
    bgColor: "bg-purple-50 dark:bg-purple-900/20"
  },
  {
    title: "Client Satisfaction",
    value: "98.7%",
    change: "+2.1% improved",
    icon: Star,
    color: "text-yellow-600",
    bgColor: "bg-yellow-50 dark:bg-yellow-900/20"
  }
];

// Core values
const coreValues = [
  {
    title: "Excellence",
    description: "We maintain the highest standards of quality in every interpretation session, ensuring accurate and professional communication.",
    icon: Award,
    color: "text-blue-600",
    bgColor: "bg-blue-100 dark:bg-blue-900/20"
  },
  {
    title: "Accessibility",
    description: "Making language interpretation services available 24/7 to break down communication barriers whenever they arise.",
    icon: Clock,
    color: "text-green-600",
    bgColor: "bg-green-100 dark:bg-green-900/20"
  },
  {
    title: "Security",
    description: "HIPAA-compliant platform with end-to-end encryption, protecting sensitive information in healthcare and legal settings.",
    icon: Shield,
    color: "text-purple-600",
    bgColor: "bg-purple-100 dark:bg-purple-900/20"
  },
  {
    title: "Innovation",
    description: "Leveraging cutting-edge technology to provide seamless, high-quality interpretation experiences for all users.",
    icon: Zap,
    color: "text-orange-600",
    bgColor: "bg-orange-100 dark:bg-orange-900/20"
  },
  {
    title: "Compassion",
    description: "Understanding that every conversation matters, especially in critical healthcare and legal situations.",
    icon: Heart,
    color: "text-red-600",
    bgColor: "bg-red-100 dark:bg-red-900/20"
  },
  {
    title: "Integrity",
    description: "Maintaining the highest ethical standards and confidentiality in all our interpretation services.",
    icon: Eye,
    color: "text-indigo-600",
    bgColor: "bg-indigo-100 dark:bg-indigo-900/20"
  }
];

// Team highlights
const teamHighlights = [
  {
    title: "Certified Professionals",
    description: "Every interpreter undergoes rigorous certification and background verification processes.",
    icon: Award,
    stats: "100% Certified"
  },
  {
    title: "Industry Expertise",
    description: "Specialized knowledge across healthcare, legal, business, and emergency services sectors.",
    icon: Building,
    stats: "15+ Industries"
  },
  {
    title: "Continuous Training",
    description: "Ongoing professional development and training programs to maintain excellence.",
    icon: TrendingUp,
    stats: "40+ Hours/Year"
  }
];

// Timeline milestones
const milestones = [
  {
    year: "2018",
    title: "Founded",
    description: "LanguageHelp was founded with a mission to make professional interpretation accessible to everyone."
  },
  {
    year: "2019",
    title: "HIPAA Compliance",
    description: "Achieved HIPAA compliance to serve healthcare providers with secure interpretation services."
  },
  {
    year: "2020",
    title: "100 Languages",
    description: "Expanded our network to support over 100 languages with certified interpreters."
  },
  {
    year: "2021",
    title: "1000+ Interpreters",
    description: "Built a network of over 1000 certified interpreters serving clients worldwide."
  },
  {
    year: "2022",
    title: "24/7 Services",
    description: "Launched round-the-clock interpretation services for emergency and critical situations."
  },
  {
    year: "2023",
    title: "1M+ Sessions",
    description: "Reached the milestone of 1 million successful interpretation sessions completed."
  },
  {
    year: "2024",
    title: "Global Expansion",
    description: "Expanded operations globally with 2500+ interpreters supporting 150+ languages."
  }
];

export default function AboutPage() {
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
                Trusted by healthcare, legal, and business professionals worldwide.
                <Link href="/contact" className="font-semibold text-primary ml-1">
                  <span className="absolute inset-0" aria-hidden="true" />
                  Contact us <span aria-hidden="true">&rarr;</span>
                </Link>
              </div>
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-6xl bg-clip-text">
              Breaking Language Barriers
              <span className="bg-gradient-to-r from-primary via-primary/80 to-secondary bg-clip-text text-transparent"> Since 2018</span>
            </h1>
            <p className="mt-6 text-lg leading-8 text-muted-foreground">
              We're dedicated to facilitating clear communication across cultures through professional interpretation services. 
              Our platform connects you with certified interpreters who make every conversation count.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Button size="lg" className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 group" asChild>
                <Link href="/contact" className="flex items-center justify-center">
                  Get in Touch
                  <ArrowRight className="ml-2 h-4 w-4 flex-shrink-0 group-hover:translate-x-1 transition-transform duration-300" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" className="border-2 hover:bg-primary/5 hover:border-primary/50 transition-all duration-300 group" asChild>
                <Link href="/careers" className="flex items-center justify-center">
                  <Users className="mr-2 h-4 w-4 flex-shrink-0 group-hover:scale-110 transition-transform duration-300" />
                  Join Our Team
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 sm:py-24 relative overflow-hidden">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl bg-gradient-to-r from-primary via-primary/80 to-secondary bg-clip-text text-transparent inline-block">
              Our Impact by Numbers
            </h2>
            <p className="mt-6 text-lg leading-8 text-muted-foreground">
              See how we're making a difference in global communication.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {companyStats.map((stat, index) => (
              <Card key={stat.title} className="relative group hover:shadow-xl transition-all duration-500 hover:scale-[1.02] border-2 hover:border-primary/20 bg-gradient-to-br from-background to-muted/30 backdrop-blur-sm overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <div className={`rounded-lg p-2 ${stat.bgColor}`}>
                      <stat.icon className={`h-5 w-5 ${stat.color} group-hover:scale-110 transition-transform duration-300 flex-shrink-0`} />
                    </div>
                    <div className="flex items-center gap-1 text-xs text-green-600">
                      <TrendingUp className="h-3 w-3" />
                      {stat.change}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold group-hover:text-primary transition-colors duration-300">
                    {stat.value}
                  </div>
                  <p className="text-sm text-muted-foreground mt-1 group-hover:text-muted-foreground/80 transition-colors duration-300">
                    {stat.title}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Mission & Values Section */}
      <section className="bg-gradient-to-b from-muted/50 to-background py-24 sm:py-32 relative overflow-hidden">
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute h-[50rem] w-[50rem] -translate-x-1/2 rounded-full bg-gradient-to-r from-primary/5 to-secondary/5 blur-3xl lg:w-[65rem] -top-40 left-1/2" />
        </div>

        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl bg-gradient-to-r from-primary via-primary/80 to-secondary bg-clip-text text-transparent inline-block">
              Our Mission & Values
            </h2>
            <p className="mt-6 text-lg leading-8 text-muted-foreground">
              The principles that guide everything we do.
            </p>
          </div>
          <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-8 sm:mt-20 lg:mx-0 lg:max-w-none lg:grid-cols-3">
            {coreValues.map((value, index) => (
              <Card
                key={value.title}
                className="group flex flex-col hover:shadow-xl transition-all duration-500 hover:scale-[1.02] border-2 hover:border-primary/20 bg-gradient-to-br from-background to-muted/30 backdrop-blur-sm relative overflow-hidden"
                style={{
                  transform: `translateY(${index % 2 === 0 ? '0px' : '20px'})`
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                <CardHeader>
                  <div className="flex items-center gap-x-4">
                    <div className={`rounded-lg p-2.5 ring-1 ring-primary/10 group-hover:ring-primary/30 transition-all duration-300 ${value.bgColor}`}>
                      <value.icon className={`h-6 w-6 ${value.color} group-hover:scale-110 transition-transform duration-300 flex-shrink-0`} />
                    </div>
                  </div>
                  <CardTitle className="text-xl group-hover:text-primary transition-colors duration-300">{value.title}</CardTitle>
                  <CardDescription className="mt-2 group-hover:text-muted-foreground/80 transition-colors duration-300">
                    {value.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-24 sm:py-32 relative overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-y-0 right-1/2 -z-10 mr-16 w-[200%] origin-bottom-left skew-x-[-30deg] bg-muted/20 shadow-xl shadow-primary/10 ring-1 ring-primary/10 sm:mr-28 lg:mr-0 xl:mr-16 xl:origin-center" />
        </div>

        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl bg-gradient-to-r from-primary via-primary/80 to-secondary bg-clip-text text-transparent inline-block">
              Our Professional Network
            </h2>
            <p className="mt-6 text-lg leading-8 text-muted-foreground">
              Meet the certified interpreters who make seamless communication possible.
            </p>
          </div>
          <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-8 sm:mt-20 lg:mx-0 lg:max-w-none lg:grid-cols-3">
            {teamHighlights.map((highlight, index) => (
              <Card 
                key={highlight.title} 
                className="group flex flex-col hover:shadow-xl transition-all duration-500 hover:scale-[1.02] border-2 hover:border-primary/20 bg-gradient-to-br from-background to-muted/30 backdrop-blur-sm relative overflow-hidden"
                style={{
                  transform: `translateY(${index % 2 === 0 ? '0px' : '20px'})`
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                <CardHeader>
                  <div className="flex items-center justify-between mb-4">
                    <div className="rounded-lg bg-primary/5 p-2.5 ring-1 ring-primary/10 group-hover:ring-primary/30 transition-all duration-300">
                      <highlight.icon className="h-6 w-6 text-primary group-hover:scale-110 transition-transform duration-300 flex-shrink-0" />
                    </div>
                    <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                      {highlight.stats}
                    </Badge>
                  </div>
                  <CardTitle className="text-xl group-hover:text-primary transition-colors duration-300">{highlight.title}</CardTitle>
                  <CardDescription className="group-hover:text-muted-foreground/80 transition-colors duration-300">
                    {highlight.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="bg-gradient-to-b from-muted/50 to-background py-24 sm:py-32 relative overflow-hidden">
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute h-[45rem] w-[45rem] -translate-x-1/2 rounded-full bg-gradient-to-br from-primary/5 via-secondary/5 to-transparent blur-3xl lg:w-[55rem] top-1/2 left-1/2 transform -translate-y-1/2" />
        </div>

        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl bg-gradient-to-r from-primary via-primary/80 to-secondary bg-clip-text text-transparent inline-block">
              Our Journey
            </h2>
            <p className="mt-6 text-lg leading-8 text-muted-foreground">
              Key milestones in our mission to break language barriers worldwide.
            </p>
          </div>
          
          <div className="mx-auto mt-16 max-w-4xl">
            <div className="space-y-8">
              {milestones.map((milestone, index) => (
                <div key={milestone.year} className="relative flex items-start group">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center w-12 h-12 bg-primary text-primary-foreground rounded-full text-sm font-bold group-hover:scale-110 transition-transform duration-300">
                      {milestone.year.slice(-2)}
                    </div>
                  </div>
                  <div className="ml-6 flex-1">
                    <Card className="group-hover:shadow-lg transition-all duration-300 group-hover:border-primary/20">
                      <CardContent className="pt-4">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-semibold text-lg group-hover:text-primary transition-colors duration-300">
                            {milestone.title}
                          </h3>
                          <span className="text-sm font-medium text-muted-foreground">
                            {milestone.year}
                          </span>
                        </div>
                        <p className="text-muted-foreground group-hover:text-foreground/90 transition-colors duration-300">
                          {milestone.description}
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                  {index < milestones.length - 1 && (
                    <div className="absolute left-6 top-12 w-0.5 h-8 bg-border" />
                  )}
                </div>
              ))}
            </div>
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
                Ready to join our mission?{' '}
                <Link href="/interpreter-portal" className="font-semibold text-primary">
                  <span className="absolute inset-0" aria-hidden="true" />
                  Become an interpreter <span aria-hidden="true">&rarr;</span>
                </Link>
              </div>
            </div>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl bg-gradient-to-r from-primary via-primary/80 to-secondary bg-clip-text text-transparent inline-block">
              Ready to Experience Seamless Communication?
            </h2>
            <p className="mt-6 text-lg leading-8 text-muted-foreground">
              Whether you need interpretation services or want to join our team of certified interpreters, 
              we're here to help break down language barriers.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Link href="/book">
                 <Button 
                   size="lg" 
                   className="group rounded-full bg-gradient-to-r from-primary to-secondary hover:shadow-lg hover:shadow-primary/25 transition-all duration-300 flex items-center justify-center"
                 >
                   Book a Session
                   <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
                 </Button>
               </Link>
               <Link href="/contact">
                 <Button 
                   size="lg" 
                   variant="outline" 
                   className="group rounded-full hover:bg-primary/5 transition-all duration-300 flex items-center justify-center"
                 >
                   Contact Us
                   <MessageSquare className="ml-2 h-4 w-4 group-hover:scale-110 transition-transform duration-300" />
                 </Button>
               </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
