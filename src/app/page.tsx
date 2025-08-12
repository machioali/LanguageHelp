import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ClientRedirect } from "@/components/client-redirect";
import { InterpreterRedirect } from "@/components/interpreter-redirect";
import {
  Globe,
  MessageSquare,
  Users,
  Zap,
  Shield,
  Clock,
  Star,
  ArrowRight,
  CheckCircle,
  Play,
  Headphones,
  FileText,
  Award,
} from "lucide-react";

const features = [
  {
    name: "Real-time Interpretation",
    description: "Connect with certified interpreters instantly for live conversations in 180+ languages.",
    icon: MessageSquare,
  },
  {
    name: "Professional Translation",
    description: "Expert human translators for document translation with industry-specific accuracy.",
    icon: Award,
  },
  {
    name: "24/7 Availability",
    description: "Round-the-clock access to interpretation services whenever you need them.",
    icon: Clock,
  },
  {
    name: "HIPAA Compliant",
    description: "Secure, encrypted communications meeting healthcare industry standards.",
    icon: Shield,
  },
  {
    name: "Expert Interpreters",
    description: "Certified professionals with specialized knowledge in medical, legal, and business domains.",
    icon: Users,
  },
  {
    name: "Lightning Fast",
    description: "Connect to an interpreter in under 30 seconds with our optimized platform.",
    icon: Zap,
  },
];

const services = [
  {
    title: "Healthcare Interpretation",
    description: "Medical interpreters for patient consultations, procedures, and emergency situations.",
    icon: Headphones,
    features: ["Medical terminology expertise", "HIPAA compliant", "Emergency availability"],
  },
  {
    title: "Document Translation",
    description: "Professional translation of legal documents, contracts, and business materials.",
    icon: FileText,
    features: ["Certified translations", "Legal document expertise", "Fast turnaround"],
  },
  {
    title: "Business Meetings",
    description: "Seamless interpretation for international business meetings and conferences.",
    icon: Users,
    features: ["Multi-party support", "Industry expertise", "Screen sharing"],
  },
];

const testimonials = [
  {
    content: "Professional interpretation services have made our client consultations more effective. The interpreters are knowledgeable and the platform is reliable for our healthcare needs.",
    author: "Healthcare Administrator",
    role: "Regional Medical Center",
    rating: 5,
  },
  {
    content: "The quality of translation work meets our standards for legal documents. Clear communication and timely delivery have been consistent.",
    author: "Legal Professional",
    role: "International Law Practice",
    rating: 5,
  },
  {
    content: "Our multilingual business meetings are handled professionally. The interpretation quality helps us maintain clear communication with our international partners.",
    author: "Business Manager",
    role: "Global Communications",
    rating: 5,
  },
];

export default function HomePage() {
  return (
    <div className="flex flex-col">
      <ClientRedirect />
      <InterpreterRedirect />
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
                Professional language services you can trust.
                <Link href="/about" className="font-semibold text-primary ml-1">
                  <span className="absolute inset-0" aria-hidden="true" />
                  Learn more <span aria-hidden="true">&rarr;</span>
                </Link>
              </div>
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-6xl bg-clip-text">
              Break Language Barriers
              <span className="bg-gradient-to-r from-primary via-primary/80 to-secondary bg-clip-text text-transparent"> Instantly</span>
            </h1>
            <p className="mt-6 text-lg leading-8 text-muted-foreground">
              Connect with certified interpreters and professional translation services in seconds. 
              Making global communication effortless for healthcare, legal, and business needs.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Button size="lg" className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 group" asChild>
                <Link href="/book" className="flex items-center justify-center">
                  Start Interpreting
                  <ArrowRight className="ml-2 h-4 w-4 flex-shrink-0 group-hover:translate-x-1 transition-transform duration-300" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" className="border-2 hover:bg-primary/5 hover:border-primary/50 transition-all duration-300 group" asChild>
                <Link href="/demo" className="flex items-center justify-center">
                  <Play className="mr-2 h-4 w-4 flex-shrink-0 group-hover:scale-110 transition-transform duration-300" />
                  Watch Demo
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 sm:py-32 relative overflow-hidden">
        {/* Decorative background */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-y-0 right-1/2 -z-10 mr-16 w-[200%] origin-bottom-left skew-x-[-30deg] bg-muted/20 shadow-xl shadow-primary/10 ring-1 ring-primary/10 sm:mr-28 lg:mr-0 xl:mr-16 xl:origin-center" />
        </div>

        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl bg-gradient-to-r from-primary via-primary/80 to-secondary bg-clip-text text-transparent inline-block">
              Everything you need for global communication
            </h2>
            <p className="mt-6 text-lg leading-8 text-muted-foreground">
              Our platform combines human expertise with professional services to deliver 
              unparalleled language solutions.
            </p>
          </div>
          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
            <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
              {features.map((feature, index) => (
                <div 
                  key={feature.name} 
                  className="relative flex flex-col group hover:bg-muted/30 p-8 rounded-2xl transition-all duration-300 hover:shadow-lg border border-primary/10 hover:border-primary/30 backdrop-blur-sm"
                  style={{
                    transform: `translateY(${index % 2 === 0 ? '0px' : '20px'})`
                  }}
                >
                  <div className="mb-6">
                    <div className="rounded-lg bg-primary/5 p-2 w-10 h-10 flex items-center justify-center ring-1 ring-primary/10 group-hover:ring-primary/30 transition-all duration-300">
                      <feature.icon className="h-6 w-6 text-primary group-hover:scale-110 transition-transform duration-300 flex-shrink-0" aria-hidden="true" />
                    </div>
                  </div>
                  <dt className="text-lg font-semibold leading-7 text-foreground group-hover:text-primary transition-colors duration-300">
                    {feature.name}
                  </dt>
                  <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-muted-foreground">
                    <p className="flex-auto group-hover:text-foreground/90 transition-colors duration-300">{feature.description}</p>
                  </dd>
                  <div className="mt-4 flex items-center gap-2 text-sm text-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    Learn more
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
                  </div>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="bg-gradient-to-b from-muted/50 to-background py-24 sm:py-32 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute h-[50rem] w-[50rem] -translate-x-1/2 rounded-full bg-gradient-to-r from-primary/5 to-secondary/5 blur-3xl lg:w-[65rem] -top-40 left-1/2" />
        </div>

        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl bg-gradient-to-r from-primary via-primary/80 to-secondary bg-clip-text text-transparent inline-block">
              Specialized Services
            </h2>
            <p className="mt-6 text-lg leading-8 text-muted-foreground">
              Tailored solutions for different industries and use cases.
            </p>
          </div>
          <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-8 sm:mt-20 lg:mx-0 lg:max-w-none lg:grid-cols-3">
            {services.map((service, index) => (
              <Card 
                key={service.title} 
                className="group flex flex-col hover:shadow-xl transition-all duration-500 hover:scale-[1.02] border-2 hover:border-primary/20 bg-gradient-to-br from-background to-muted/30 backdrop-blur-sm relative overflow-hidden"
                style={{
                  transform: `translateY(${index % 2 === 0 ? '0px' : '20px'})`
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                <CardHeader>
                  <div className="flex items-center gap-x-4">
                    <div className="rounded-lg bg-primary/5 p-2.5 ring-1 ring-primary/10 group-hover:ring-primary/30 transition-all duration-300">
                      <service.icon className="h-6 w-6 text-primary group-hover:scale-110 transition-transform duration-300 flex-shrink-0" />
                    </div>
                    <CardTitle className="text-xl group-hover:text-primary transition-colors duration-300">{service.title}</CardTitle>
                  </div>
                  <CardDescription className="mt-4 group-hover:text-muted-foreground/80 transition-colors duration-300">
                    {service.description}
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="flex-1">
                  <ul className="space-y-3">
                    {service.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-x-3 group/item">
                        <div className="rounded-full bg-green-50 p-1 dark:bg-green-900/20">
                          <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0 group-hover/item:scale-110 transition-transform duration-300" />
                        </div>
                        <span className="text-sm text-muted-foreground group-hover/item:text-foreground transition-colors duration-300">
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>
                  <Button variant="ghost" className="w-full mt-6 group-hover:bg-primary/5 transition-colors duration-300">
                    <span className="text-primary">Learn more</span>
                    <ArrowRight className="ml-2 h-4 w-4 text-primary group-hover:translate-x-1 transition-transform duration-300" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 sm:py-32 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute h-[45rem] w-[45rem] -translate-x-1/2 rounded-full bg-gradient-to-br from-primary/5 via-secondary/5 to-transparent blur-3xl lg:w-[55rem] top-1/2 left-1/2 transform -translate-y-1/2" />
        </div>

        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl bg-gradient-to-r from-primary via-primary/80 to-secondary bg-clip-text text-transparent inline-block">
              Trusted by professionals worldwide
            </h2>
          </div>
          <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-8 sm:mt-20 lg:mx-0 lg:max-w-none lg:grid-cols-3">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="group hover:shadow-xl transition-all duration-500 hover:scale-[1.02] border-2 hover:border-primary/20 bg-gradient-to-br from-background to-muted/30 backdrop-blur-sm relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <CardContent className="pt-6">
                  <div className="flex gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400 flex-shrink-0 transition-transform duration-300 group-hover:scale-110" />
                    ))}
                  </div>
                  <blockquote className="text-sm leading-6 text-muted-foreground group-hover:text-foreground/90 transition-colors duration-300">
                    "{testimonial.content}"
                  </blockquote>
                  <div className="mt-4">
                    <div className="font-semibold text-foreground group-hover:text-primary transition-colors duration-300">{testimonial.author}</div>
                    <div className="text-sm text-muted-foreground">{testimonial.role}</div>
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
                Special offer for new interpreters.{' '}
                <a href="#" className="font-semibold text-primary">
                  <span className="absolute inset-0" aria-hidden="true" />
                  Learn more <span aria-hidden="true">&rarr;</span>
                </a>
              </div>
            </div>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl bg-gradient-to-r from-primary via-primary/80 to-secondary bg-clip-text text-transparent inline-block">
              Ready to break language barriers?
            </h2>
            <p className="mt-6 text-lg leading-8 text-muted-foreground">
              Professional interpretation and translation services for your communication needs.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Link href="/book">
                 <Button 
                   size="lg" 
                   className="group rounded-full bg-gradient-to-r from-primary to-secondary hover:shadow-lg hover:shadow-primary/25 transition-all duration-300 flex items-center justify-center"
                 >
                   Get Started Now
                   <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
                 </Button>
               </Link>
               <Link href="/contact">
                 <Button 
                   size="lg" 
                   variant="outline" 
                   className="group rounded-full hover:bg-primary/5 transition-all duration-300 flex items-center justify-center"
                 >
                   Contact Sales
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