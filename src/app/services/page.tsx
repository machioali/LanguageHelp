import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ClientProtection } from "@/components/client-protection";
import { Globe, MessageSquare, Building2, Clock } from "lucide-react";

export default function ServicesPage() {
  return (
    <ClientProtection allowedForClients={false}>
      <div className="container mx-auto py-12">
      <div className="max-w-3xl mx-auto text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight text-foreground mb-4">
          Our Services
        </h1>
        <p className="text-lg text-muted-foreground">
          Professional language services tailored to your needs
        </p>
      </div>

      <div className="grid gap-8">
        {/* Interpretation Section */}
        <section id="interpretation" className="scroll-mt-16">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-6 w-6" />
                Interpretation Services
              </CardTitle>
              <CardDescription>
                Real-time interpretation for all your communication needs
              </CardDescription>
            </CardHeader>
            <CardContent className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold mb-2">Video Interpretation</h3>
                <p className="text-muted-foreground mb-4">
                  Connect with professional interpreters via high-quality video calls
                </p>
                <Button variant="outline" asChild>
                  <a href="/book">Book Now</a>
                </Button>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Phone Interpretation</h3>
                <p className="text-muted-foreground mb-4">
                  Access interpreters instantly via phone
                </p>
                <Button variant="outline" asChild>
                  <a href="/book">Book Now</a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Translation Section */}
        <section id="translation" className="scroll-mt-16">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-6 w-6" />
                Translation Services
              </CardTitle>
              <CardDescription>
                Professional document translation services
              </CardDescription>
            </CardHeader>
            <CardContent className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold mb-2">Document Translation</h3>
                <p className="text-muted-foreground mb-4">
                  High-quality translation for all types of documents
                </p>
                <Button variant="outline">Request Quote</Button>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Website Localization</h3>
                <p className="text-muted-foreground mb-4">
                  Make your content accessible to a global audience
                </p>
                <Button variant="outline">Learn More</Button>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Industries Section */}
        <section id="industries" className="scroll-mt-16">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-6 w-6" />
                Industries We Serve
              </CardTitle>
              <CardDescription>
                Specialized language solutions for various sectors
              </CardDescription>
            </CardHeader>
            <CardContent className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <h3 className="font-semibold mb-2">Healthcare</h3>
                <p className="text-sm text-muted-foreground">
                  Medical interpretation and translation
                </p>
              </div>
              <div className="text-center">
                <h3 className="font-semibold mb-2">Legal</h3>
                <p className="text-sm text-muted-foreground">
                  Court interpretation and legal document translation
                </p>
              </div>
              <div className="text-center">
                <h3 className="font-semibold mb-2">Business</h3>
                <p className="text-sm text-muted-foreground">
                  Corporate communication solutions
                </p>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Schedule Section */}
        <Card className="mt-8">
          <CardContent className="py-8 text-center">
            <Clock className="h-12 w-12 mx-auto text-primary mb-4" />
            <h2 className="text-2xl font-bold mb-2">Ready to Get Started?</h2>
            <p className="text-muted-foreground mb-4">
              Book your first interpretation session or request a translation quote
            </p>
            <div className="flex gap-4 justify-center">
              <Button asChild>
                <a href="/book">Book Now</a>
              </Button>
              <Button variant="outline" asChild>
                <a href="/contact">Contact Sales</a>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
    </ClientProtection>
  );
}
