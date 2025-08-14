"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { FileText, Download, Calendar, Users, TrendingUp, BarChart3 } from "lucide-react";

export default function ReportsPage() {
  const [selectedPeriod, setSelectedPeriod] = useState("30days");

  const reports = [
    {
      name: "User Activity Report",
      description: "Detailed user engagement and activity metrics",
      type: "Activity",
      lastGenerated: "2 hours ago",
      status: "Ready",
      icon: Users
    },
    {
      name: "Revenue Report",
      description: "Financial performance and revenue breakdown",
      type: "Financial",
      lastGenerated: "1 day ago",
      status: "Ready",
      icon: TrendingUp
    },
    {
      name: "Platform Analytics",
      description: "Comprehensive platform usage statistics",
      type: "Analytics",
      lastGenerated: "6 hours ago",
      status: "Ready",
      icon: BarChart3
    },
    {
      name: "Interpreter Performance",
      description: "Individual interpreter metrics and ratings",
      type: "Performance",
      lastGenerated: "Processing...",
      status: "Processing",
      icon: FileText
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Ready':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'Processing':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
    }
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Reports</h1>
        <p className="text-muted-foreground mt-2">
          Generate and download comprehensive platform reports.
        </p>
      </div>

      {/* Report Generation Controls */}
      <div className="mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Generate New Report</CardTitle>
            <CardDescription>Create custom reports for specific time periods</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Select time period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7days">Last 7 days</SelectItem>
                  <SelectItem value="30days">Last 30 days</SelectItem>
                  <SelectItem value="90days">Last 90 days</SelectItem>
                  <SelectItem value="1year">Last year</SelectItem>
                  <SelectItem value="custom">Custom range</SelectItem>
                </SelectContent>
              </Select>
              <Button>
                <Calendar className="h-4 w-4 mr-2" />
                Generate Report
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Available Reports */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Available Reports</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {reports.map((report) => {
            const IconComponent = report.icon;
            return (
              <Card key={report.name}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <IconComponent className="h-5 w-5 text-primary" />
                      <div>
                        <CardTitle className="text-lg">{report.name}</CardTitle>
                        <CardDescription>{report.description}</CardDescription>
                      </div>
                    </div>
                    <Badge className={getStatusColor(report.status)}>
                      {report.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-muted-foreground">
                      <p>Type: {report.type}</p>
                      <p>Last generated: {report.lastGenerated}</p>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      disabled={report.status !== 'Ready'}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Report History */}
      <div className="mt-12">
        <Card>
          <CardHeader>
            <CardTitle>Recent Report History</CardTitle>
            <CardDescription>Previously generated reports and downloads</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3].map((item) => (
                <div key={item} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Monthly Analytics Report - December 2024</p>
                      <p className="text-sm text-muted-foreground">Generated on Dec 1, 2024 at 9:30 AM</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
