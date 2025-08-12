import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Play } from "lucide-react";

export default function DemoPage() {
  return (
    <div className="container mx-auto py-12">
      <div className="max-w-3xl mx-auto text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight text-foreground mb-4">
          See LanguageHelp in Action
        </h1>
        <p className="text-lg text-muted-foreground mb-8">
          Watch how our interpretation services work in real-world scenarios.
        </p>
      </div>

      <div className="grid gap-8 max-w-5xl mx-auto">
        <Card className="overflow-hidden">
          <CardContent className="p-0">
            <div className="aspect-video bg-muted flex items-center justify-center">
              <Button size="lg" className="gap-2">
                <Play className="h-6 w-6" />
                Watch Main Demo
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-2 gap-6">
          <Card className="overflow-hidden">
            <CardContent className="p-0">
              <div className="aspect-video bg-muted flex items-center justify-center">
                <Button size="lg" className="gap-2">
                  <Play className="h-6 w-6" />
                  Healthcare Demo
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="overflow-hidden">
            <CardContent className="p-0">
              <div className="aspect-video bg-muted flex items-center justify-center">
                <Button size="lg" className="gap-2">
                  <Play className="h-6 w-6" />
                  Business Demo
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}