import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function StatusPage() {
  return (
    <div className="max-w-3xl mx-auto py-12 px-4">
      <h1 className="text-4xl font-bold mb-6 text-center">System Status</h1>
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>All Systems Operational</CardTitle>
          <CardDescription>
            Our platform is running smoothly. Any known issues or scheduled maintenance will be posted here.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="divide-y divide-gray-200">
            <li className="py-4 flex items-center justify-between">
              <span>Website &amp; Dashboard</span>
              <span className="text-green-600 font-semibold">Operational</span>
            </li>
            <li className="py-4 flex items-center justify-between">
              <span>Video Interpretation</span>
              <span className="text-green-600 font-semibold">Operational</span>
            </li>
            <li className="py-4 flex items-center justify-between">
              <span>Phone Interpretation</span>
              <span className="text-green-600 font-semibold">Operational</span>
            </li>
            <li className="py-4 flex items-center justify-between">
              <span>Translation Services</span>
              <span className="text-green-600 font-semibold">Operational</span>
            </li>
          </ul>
        </CardContent>
      </Card>
      <div className="text-center">
        <p className="mb-4">Experiencing issues? Check our <a href="/help" className="underline text-blue-600">Help Center</a> or <a href="/contact" className="underline text-blue-600">Contact Support</a>.</p>
        <Button asChild>
          <a href="/help">View Help Center</a>
        </Button>
      </div>
    </div>
  );
}