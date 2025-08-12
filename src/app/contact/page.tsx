'use client';

import Link from "next/link";
import { useState, FormEvent, ChangeEvent } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Building2,
  Users,
  Headphones,
  ArrowRight,
  CheckCircle,
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  MessageSquare,
  Globe,
  Shield,
  Star,
  Video,
  Calendar,
  Award,
  Heart,
  Zap
} from "lucide-react";

// Contact methods
const contactMethods = [
  {
    title: "Email Us",
    description: "Get in touch via email for detailed inquiries and support.",
    icon: Mail,
    contact: "sales@languagehelp.com",
    action: "Send Email",
    color: "text-blue-600",
    bgColor: "bg-blue-50 dark:bg-blue-900/20"
  },
  {
    title: "Call Us",
    description: "Speak directly with our sales team for immediate assistance.",
    icon: Phone,
    contact: "+1 (555) 123-4567",
    action: "Call Now",
    color: "text-green-600",
    bgColor: "bg-green-50 dark:bg-green-900/20"
  },
  {
    title: "Visit Us",
    description: "Meet us at our headquarters for in-person consultations.",
    icon: MapPin,
    contact: "San Francisco, CA",
    action: "Get Directions",
    color: "text-purple-600",
    bgColor: "bg-purple-50 dark:bg-purple-900/20"
  }
];

// Solutions by industry
const solutions = [
  {
    title: "Healthcare Solutions",
    description: "HIPAA-compliant interpretation for medical facilities and healthcare providers.",
    icon: Heart,
    features: ["24/7 Emergency Support", "Medical Terminology", "HIPAA Compliance", "Certified Interpreters"],
    color: "text-red-600",
    bgColor: "bg-red-100 dark:bg-red-900/20"
  },
  {
    title: "Legal & Court Services",
    description: "Certified interpretation for legal proceedings and attorney-client meetings.",
    icon: Building2,
    features: ["Court Certified", "Legal Terminology", "Confidentiality", "Document Translation"],
    color: "text-blue-600",
    bgColor: "bg-blue-100 dark:bg-blue-900/20"
  },
  {
    title: "Enterprise Solutions",
    description: "Scalable interpretation services for large organizations and corporations.",
    icon: Users,
    features: ["Volume Discounts", "Multi-site Support", "Custom Integration", "Dedicated Account Manager"],
    color: "text-green-600",
    bgColor: "bg-green-100 dark:bg-green-900/20"
  },
  {
    title: "Emergency Services",
    description: "Immediate interpretation support for critical and emergency situations.",
    icon: Zap,
    features: ["Instant Connect", "24/7 Availability", "Priority Queue", "Multi-language Support"],
    color: "text-orange-600",
    bgColor: "bg-orange-100 dark:bg-orange-900/20"
  }
];

// FAQ items
const faqs = [
  {
    question: "How quickly can you connect me with an interpreter?",
    answer: "Most connections happen within 30 seconds. For emergency situations, we guarantee connection within 15 seconds."
  },
  {
    question: "Do you offer 24/7 interpretation services?",
    answer: "Yes, we provide round-the-clock interpretation services in over 150 languages, 365 days a year."
  },
  {
    question: "Are your interpreters certified?",
    answer: "All our interpreters undergo rigorous certification and background verification. Many hold specialized certifications for healthcare and legal interpretation."
  },
  {
    question: "What languages do you support?",
    answer: "We support over 150 languages including all major world languages plus regional dialects and sign language interpretation."
  },
  {
    question: "How do you ensure confidentiality?",
    answer: "We maintain strict confidentiality protocols, are HIPAA compliant, and use end-to-end encryption for all communications."
  }
];

export default function ContactPage() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [phone, setPhone] = useState('');
  const [industry, setIndustry] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      // Reset form after 3 seconds
      setTimeout(() => {
        setSubmitted(false);
        setFirstName('');
        setLastName('');
        setEmail('');
        setCompany('');
        setPhone('');
        setIndustry('');
        setMessage('');
      }, 3000);
    }, 1000);
  };

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
                Average response time: under 2 hours.
                <Link href="/book" className="font-semibold text-primary ml-1">
                  <span className="absolute inset-0" aria-hidden="true" />
                  Book directly <span aria-hidden="true">&rarr;</span>
                </Link>
              </div>
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-6xl bg-clip-text">
              Let's Discuss Your
              <span className="bg-gradient-to-r from-primary via-primary/80 to-secondary bg-clip-text text-transparent"> Language Needs</span>
            </h1>
            <p className="mt-6 text-lg leading-8 text-muted-foreground">
              Get personalized solutions for your organization's interpretation requirements. 
              Our sales team is ready to help you choose the perfect plan and setup.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Methods Section */}
      <section className="py-16 sm:py-24 relative overflow-hidden">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl bg-gradient-to-r from-primary via-primary/80 to-secondary bg-clip-text text-transparent inline-block">
              Get In Touch
            </h2>
            <p className="mt-6 text-lg leading-8 text-muted-foreground">
              Choose the best way to reach our team.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
            {contactMethods.map((method, index) => (
              <Card key={method.title} className="group hover:shadow-xl transition-all duration-500 hover:scale-[1.02] border-2 hover:border-primary/20 bg-gradient-to-br from-background to-muted/30 backdrop-blur-sm relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <CardHeader className="pb-4">
                  <div className={`rounded-lg p-3 w-fit ${method.bgColor}`}>
                    <method.icon className={`h-6 w-6 ${method.color} group-hover:scale-110 transition-transform duration-300 flex-shrink-0`} />
                  </div>
                  <CardTitle className="text-xl group-hover:text-primary transition-colors duration-300">{method.title}</CardTitle>
                  <CardDescription className="group-hover:text-muted-foreground/80 transition-colors duration-300">
                    {method.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="font-medium text-foreground">
                      {method.contact}
                    </div>
                    <Button variant="outline" className="w-full group-hover:bg-primary/5 transition-colors duration-300">
                      <span className="text-primary">{method.action}</span>
                      <ArrowRight className="ml-2 h-4 w-4 text-primary group-hover:translate-x-1 transition-transform duration-300" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="bg-gradient-to-b from-muted/50 to-background py-24 sm:py-32 relative overflow-hidden">
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute h-[50rem] w-[50rem] -translate-x-1/2 rounded-full bg-gradient-to-r from-primary/5 to-secondary/5 blur-3xl lg:w-[65rem] -top-40 left-1/2" />
        </div>

        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl bg-gradient-to-r from-primary via-primary/80 to-secondary bg-clip-text text-transparent inline-block">
              Send Us a Message
            </h2>
            <p className="mt-6 text-lg leading-8 text-muted-foreground">
              Fill out the form below and our team will get back to you within 2 hours.
            </p>
          </div>

          <div className="mx-auto max-w-2xl">
            <Card className="border-2 hover:border-primary/20 bg-gradient-to-br from-background to-muted/30 backdrop-blur-sm relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-secondary/5 opacity-50" />
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-primary" />
                  Contact Form
                </CardTitle>
                <CardDescription>
                  Please provide as much detail as possible to help us understand your needs.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {submitted ? (
                  <div className="text-center py-12">
                    <div className="rounded-full bg-green-100 dark:bg-green-900/20 p-3 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                      <CheckCircle className="h-8 w-8 text-green-600" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">Message Sent Successfully!</h3>
                    <p className="text-muted-foreground mb-4">
                      Thank you for contacting us. Our sales team will get back to you within 2 hours.
                    </p>
                    <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                      Expect a response soon
                    </Badge>
                  </div>
                ) : (
                  <form className="space-y-6" onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">First Name *</Label>
                        <Input
                          id="firstName"
                          type="text"
                          value={firstName}
                          onChange={(e: ChangeEvent<HTMLInputElement>) => setFirstName(e.target.value)}
                          required
                          className="transition-all duration-300 focus:ring-2 focus:ring-primary/20"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Last Name *</Label>
                        <Input
                          id="lastName"
                          type="text"
                          value={lastName}
                          onChange={(e: ChangeEvent<HTMLInputElement>) => setLastName(e.target.value)}
                          required
                          className="transition-all duration-300 focus:ring-2 focus:ring-primary/20"
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address *</Label>
                        <Input
                          id="email"
                          type="email"
                          value={email}
                          onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                          required
                          className="transition-all duration-300 focus:ring-2 focus:ring-primary/20"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input
                          id="phone"
                          type="tel"
                          value={phone}
                          onChange={(e: ChangeEvent<HTMLInputElement>) => setPhone(e.target.value)}
                          className="transition-all duration-300 focus:ring-2 focus:ring-primary/20"
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="company">Company/Organization</Label>
                        <Input
                          id="company"
                          type="text"
                          value={company}
                          onChange={(e: ChangeEvent<HTMLInputElement>) => setCompany(e.target.value)}
                          className="transition-all duration-300 focus:ring-2 focus:ring-primary/20"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="industry">Industry</Label>
                        <select
                          id="industry"
                          value={industry}
                          onChange={(e: ChangeEvent<HTMLSelectElement>) => setIndustry(e.target.value)}
                          className="w-full p-2 rounded-md border bg-background transition-all duration-300 focus:ring-2 focus:ring-primary/20"
                        >
                          <option value="">Select Industry</option>
                          <option value="healthcare">Healthcare</option>
                          <option value="legal">Legal</option>
                          <option value="education">Education</option>
                          <option value="government">Government</option>
                          <option value="business">Business/Corporate</option>
                          <option value="non-profit">Non-Profit</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="message">Message *</Label>
                      <Textarea
                        id="message"
                        value={message}
                        onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setMessage(e.target.value)}
                        required
                        rows={4}
                        className="transition-all duration-300 focus:ring-2 focus:ring-primary/20"
                        placeholder="Please describe your interpretation needs, expected volume, and any specific requirements..."
                      />
                    </div>
                    
                    <Button 
                      type="submit" 
                      disabled={isSubmitting}
                      className="w-full bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 transition-all duration-300 group"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                          Sending Message...
                        </>
                      ) : (
                        <>
                          Send Message
                          <Send className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
                        </>
                      )}
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Solutions Section */}
      <section className="py-24 sm:py-32 relative overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-y-0 right-1/2 -z-10 mr-16 w-[200%] origin-bottom-left skew-x-[-30deg] bg-muted/20 shadow-xl shadow-primary/10 ring-1 ring-primary/10 sm:mr-28 lg:mr-0 xl:mr-16 xl:origin-center" />
        </div>

        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl bg-gradient-to-r from-primary via-primary/80 to-secondary bg-clip-text text-transparent inline-block">
              Industry Solutions
            </h2>
            <p className="mt-6 text-lg leading-8 text-muted-foreground">
              Specialized interpretation services tailored to your industry needs.
            </p>
          </div>
          <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-8 sm:mt-20 lg:mx-0 lg:max-w-none lg:grid-cols-2">
            {solutions.map((solution, index) => (
              <Card
                key={solution.title}
                className="group flex flex-col hover:shadow-xl transition-all duration-500 hover:scale-[1.02] border-2 hover:border-primary/20 bg-gradient-to-br from-background to-muted/30 backdrop-blur-sm relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                <CardHeader>
                  <div className="flex items-center gap-x-4">
                    <div className={`rounded-lg p-2.5 ring-1 ring-primary/10 group-hover:ring-primary/30 transition-all duration-300 ${solution.bgColor}`}>
                      <solution.icon className={`h-6 w-6 ${solution.color} group-hover:scale-110 transition-transform duration-300 flex-shrink-0`} />
                    </div>
                  </div>
                  <CardTitle className="text-xl group-hover:text-primary transition-colors duration-300">{solution.title}</CardTitle>
                  <CardDescription className="mt-2 group-hover:text-muted-foreground/80 transition-colors duration-300">
                    {solution.description}
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="flex-1">
                  <ul className="space-y-3">
                    {solution.features.map((feature) => (
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
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="bg-gradient-to-b from-muted/50 to-background py-24 sm:py-32 relative overflow-hidden">
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute h-[45rem] w-[45rem] -translate-x-1/2 rounded-full bg-gradient-to-br from-primary/5 via-secondary/5 to-transparent blur-3xl lg:w-[55rem] top-1/2 left-1/2 transform -translate-y-1/2" />
        </div>

        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl bg-gradient-to-r from-primary via-primary/80 to-secondary bg-clip-text text-transparent inline-block">
              Frequently Asked Questions
            </h2>
            <p className="mt-6 text-lg leading-8 text-muted-foreground">
              Quick answers to common questions about our services.
            </p>
          </div>
          
          <div className="mx-auto mt-16 max-w-4xl">
            <div className="space-y-6">
              {faqs.map((faq, index) => (
                <Card key={index} className="group hover:shadow-lg transition-all duration-300 hover:border-primary/20">
                  <CardContent className="pt-6">
                    <h3 className="font-semibold text-lg mb-3 group-hover:text-primary transition-colors duration-300">
                      {faq.question}
                    </h3>
                    <p className="text-muted-foreground group-hover:text-foreground/90 transition-colors duration-300">
                      {faq.answer}
                    </p>
                  </CardContent>
                </Card>
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
                Need immediate assistance?{' '}
                <Link href="/book" className="font-semibold text-primary">
                  <span className="absolute inset-0" aria-hidden="true" />
                  Book now <span aria-hidden="true">&rarr;</span>
                </Link>
              </div>
            </div>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl bg-gradient-to-r from-primary via-primary/80 to-secondary bg-clip-text text-transparent inline-block">
              Ready to Get Started?
            </h2>
            <p className="mt-6 text-lg leading-8 text-muted-foreground">
              Don't wait for language barriers to slow you down. 
              Get connected with professional interpreters in seconds.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Link href="/book">
                 <Button 
                   size="lg" 
                   className="group rounded-full bg-gradient-to-r from-primary to-secondary hover:shadow-lg hover:shadow-primary/25 transition-all duration-300 flex items-center justify-center"
                 >
                   Book Interpretation
                   <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
                 </Button>
               </Link>
               <Link href="/demo">
                 <Button 
                   size="lg" 
                   variant="outline" 
                   className="group rounded-full hover:bg-primary/5 transition-all duration-300 flex items-center justify-center"
                 >
                   Watch Demo
                   <Video className="ml-2 h-4 w-4 group-hover:scale-110 transition-transform duration-300" />
                 </Button>
               </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
