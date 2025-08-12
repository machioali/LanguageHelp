import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ClientProtection } from "@/components/client-protection";
import { DebugSession } from "@/components/debug-session";
import { User, Globe, Bell, Shield, CreditCard, Languages, Award, FileText, Clock } from 'lucide-react';

export default function DocsPage() {
  return (
    <ClientProtection allowedForClients={false}>
      <div className="max-w-4xl mx-auto py-12 px-4">
      <h1 className="text-4xl font-bold mb-8 text-center">Documentation</h1>

      <section className="mb-10">
        <h2 className="text-3xl font-semibold mb-4">Getting Started</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5 text-primary" />
                Quick Start Guide
              </CardTitle>
              <CardDescription>Learn how to set up your account and make your first booking.</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild>
                <a href="#quick-start">Read Guide</a>
              </Button>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5 text-primary" />
                Video Tutorials
              </CardTitle>
              <CardDescription>Watch step-by-step videos on using our platform features.</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild>
                <a href="#video-tutorials">Watch Videos</a>
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-3xl font-semibold mb-4">API Reference</h2>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              Developer API
            </CardTitle>
            <CardDescription>Integrate our services directly into your applications.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4">Access our comprehensive API documentation for seamless integration.</p>
            <Button asChild>
              <a href="#api-reference">Explore API</a>
            </Button>
          </CardContent>
        </Card>
      </section>

      <section className="mb-10">
        <h2 className="text-3xl font-semibold mb-4">User Guides</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5 text-primary" />
                Interpretation Services
              </CardTitle>
              <CardDescription>Detailed guides on video, phone, and on-site interpretation.</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild>
                <a href="#interpretation-guides">Learn More</a>
              </Button>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Languages className="h-5 w-5 text-primary" />
                Translation Services
              </CardTitle>
              <CardDescription>How to utilize our document and website localization services.</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild>
                <a href="#translation-guides">Learn More</a>
              </Button>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5 text-primary" />
                Account Management
              </CardTitle>
              <CardDescription>Manage your profile, billing, and team settings.</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild>
                <a href="#account-management">Learn More</a>
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-3xl font-semibold mb-4">Interpreter Resources</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5 text-primary" />
                Interpreter Profile
              </CardTitle>
              <CardDescription>Complete guide to setting up your professional interpreter profile.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 mb-4">
                <p className="text-sm">Learn how to:</p>
                <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
                  <li>Showcase your language expertise and specializations</li>
                  <li>Set your availability and working hours</li>
                  <li>Manage payment information and preferences</li>
                  <li>Update your professional certifications</li>
                </ul>
              </div>
              <Button asChild>
                <a href="#interpreter-profile">View Guide</a>
              </Button>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary" />
                Session Management
              </CardTitle>
              <CardDescription>How to manage interpretation sessions and track performance.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 mb-4">
                <p className="text-sm">Learn how to:</p>
                <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
                  <li>Accept and schedule interpretation sessions</li>
                  <li>Prepare for upcoming assignments</li>
                  <li>Track your earnings and performance metrics</li>
                  <li>Manage client feedback and ratings</li>
                </ul>
              </div>
              <Button asChild>
                <a href="#session-management">View Guide</a>
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="text-center">
        <h2 className="text-3xl font-semibold mb-4">Still Can't Find What You're Looking For?</h2>
        <p className="mb-6">Our support team is ready to assist you.</p>
        <Button asChild>
          <a href="/contact">Contact Support</a>
        </Button>
      </section>
    </div>
      <DebugSession />
    </ClientProtection>
  );
}
