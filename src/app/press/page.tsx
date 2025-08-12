import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Newspaper, Download, ExternalLink } from "lucide-react";

export default function PressPage() {
  return (
    <div className="container mx-auto py-12">
      <div className="max-w-3xl mx-auto text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight text-foreground mb-4">
          Press & Media
        </h1>
        <p className="text-lg text-muted-foreground">
          Latest news, press releases, and media resources
        </p>
      </div>

      <div className="max-w-4xl mx-auto mb-16">
        <h2 className="text-2xl font-bold mb-8">Latest News</h2>
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>LanguageHelp Expands Global Reach with New Language Support</CardTitle>
              <CardDescription>March 15, 2024</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                LanguageHelp announces support for 20 new languages, expanding its interpretation services to cover over 100 languages worldwide.
              </p>
              <Button variant="outline" className="flex items-center gap-2">
                <ExternalLink className="h-4 w-4" />
                Read Full Story
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>New Partnership Enhances Healthcare Interpretation Services</CardTitle>
              <CardDescription>February 28, 2024</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Strategic partnership with leading healthcare providers improves medical interpretation accessibility.
              </p>
              <Button variant="outline" className="flex items-center gap-2">
                <ExternalLink className="h-4 w-4" />
                Read Full Story
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="max-w-4xl mx-auto mb-16">
        <h2 className="text-2xl font-bold mb-8">Press Kit</h2>
        <div className="grid md:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Download className="h-5 w-5" />
                Brand Assets
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Download our logo, brand guidelines, and other visual assets.
              </p>
              <Button>Download Assets</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Newspaper className="h-5 w-5" />
                Fact Sheet
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Get key information about LanguageHelp, our mission, and impact.
              </p>
              <Button>Download PDF</Button>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Media Inquiries</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-6">
              For press and media inquiries, please contact our communications team. We typically respond within 24 hours.
            </p>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-1">Press Contact</h3>
                <p className="text-muted-foreground">press@languagehelp.com</p>
              </div>
              <div>
                <h3 className="font-semibold mb-1">Media Relations</h3>
                <p className="text-muted-foreground">media@languagehelp.com</p>
              </div>
              <Button className="mt-4">Contact Press Team</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}