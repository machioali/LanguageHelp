import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, Book, MessageCircle, Video, Phone, Calendar } from "lucide-react";

export default function HelpPage() {
  return (
    <div className="container mx-auto py-12">
      <div className="max-w-3xl mx-auto text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight text-foreground mb-4">
          Help Center
        </h1>
        <p className="text-lg text-muted-foreground mb-8">
          Find answers to common questions and learn how to make the most of our services
        </p>
        <div className="relative max-w-xl mx-auto">
          <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search help articles..."
            className="w-full pl-10 pr-4 py-2 rounded-md border"
          />
        </div>
      </div>

      <div className="max-w-4xl mx-auto mb-16">
        <h2 className="text-2xl font-bold mb-8">Popular Topics</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Video className="h-5 w-5" />
                Video Interpretation
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                <li>
                  <a href="#" className="text-primary hover:underline">How to start a video session</a>
                </li>
                <li>
                  <a href="#" className="text-primary hover:underline">System requirements</a>
                </li>
                <li>
                  <a href="#" className="text-primary hover:underline">Troubleshooting connection issues</a>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Phone className="h-5 w-5" />
                Phone Interpretation
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                <li>
                  <a href="#" className="text-primary hover:underline">Accessing phone services</a>
                </li>
                <li>
                  <a href="#" className="text-primary hover:underline">International calling</a>
                </li>
                <li>
                  <a href="#" className="text-primary hover:underline">Call quality tips</a>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Scheduling
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                <li>
                  <a href="#" className="text-primary hover:underline">Booking an interpreter</a>
                </li>
                <li>
                  <a href="#" className="text-primary hover:underline">Managing appointments</a>
                </li>
                <li>
                  <a href="#" className="text-primary hover:underline">Cancellation policy</a>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageCircle className="h-5 w-5" />
                Support
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                <li>
                  <a href="#" className="text-primary hover:underline">Contact support team</a>
                </li>
                <li>
                  <a href="#" className="text-primary hover:underline">Emergency support</a>
                </li>
                <li>
                  <a href="#" className="text-primary hover:underline">Feedback and suggestions</a>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="max-w-4xl mx-auto mb-16">
        <h2 className="text-2xl font-bold mb-8">Getting Started</h2>
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Quick Start Guide</CardTitle>
              <CardDescription>Learn the basics of using our interpretation services</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Follow our step-by-step guide to get started with our interpretation services quickly and easily.
              </p>
              <Button variant="outline" className="flex items-center gap-2">
                <Book className="h-4 w-4" />
                Read Guide
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Video Tutorials</CardTitle>
              <CardDescription>Watch helpful tutorials about our services</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Visual guides to help you understand and make the most of our platform.
              </p>
              <Button variant="outline" className="flex items-center gap-2">
                <Video className="h-4 w-4" />
                Watch Tutorials
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="max-w-4xl mx-auto text-center">
        <Card>
          <CardContent className="py-8">
            <h2 className="text-2xl font-bold mb-4">Still Need Help?</h2>
            <p className="text-muted-foreground mb-6">
              Our support team is available 24/7 to assist you with any questions or concerns.
            </p>
            <div className="flex gap-4 justify-center">
              <Button>Contact Support</Button>
              <Button variant="outline">View Documentation</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}