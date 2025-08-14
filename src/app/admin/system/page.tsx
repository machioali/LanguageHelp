"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Activity, Database, Server, Wifi, CheckCircle, AlertTriangle, XCircle } from "lucide-react";

export default function SystemHealthPage() {
  const services = [
    { name: "API Gateway", status: "healthy", uptime: "99.9%", icon: Server },
    { name: "Database", status: "healthy", uptime: "99.8%", icon: Database },
    { name: "Redis Cache", status: "warning", uptime: "98.5%", icon: Activity },
    { name: "CDN", status: "healthy", uptime: "99.9%", icon: Wifi },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'error':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'error':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Activity className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">System Health</h1>
        <p className="text-muted-foreground mt-2">
          Monitor the health and performance of platform services.
        </p>
      </div>

      {/* Overall Status */}
      <div className="mb-8">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  System Status: Operational
                </CardTitle>
                <CardDescription>All systems are running normally</CardDescription>
              </div>
              <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                Healthy
              </Badge>
            </div>
          </CardHeader>
        </Card>
      </div>

      {/* Service Status Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {services.map((service) => {
          const IconComponent = service.icon;
          return (
            <Card key={service.name}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{service.name}</CardTitle>
                <IconComponent className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between mb-2">
                  {getStatusIcon(service.status)}
                  <Badge className={getStatusColor(service.status)}>
                    {service.status}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">
                  Uptime: {service.uptime}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Response Times</CardTitle>
            <CardDescription>Average response times over the last 24 hours</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-48 flex items-center justify-center border rounded-lg bg-muted/50">
              <p className="text-muted-foreground">Response time chart will go here</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Error Rates</CardTitle>
            <CardDescription>Error rates by service over the last 24 hours</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-48 flex items-center justify-center border rounded-lg bg-muted/50">
              <p className="text-muted-foreground">Error rate chart will go here</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
