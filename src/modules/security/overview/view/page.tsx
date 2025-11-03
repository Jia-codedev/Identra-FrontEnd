"use client";

import React from "react";
import { useTranslations } from "@/hooks/use-translations";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, Users, Key, Monitor, Activity, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";

export default function SecuritySettingsPage() {
  const { t } = useTranslations();
  const router = useRouter();

  const dashboardCards = [
    {
      id: "roles",
      title: "Roles Management",
      description: "Manage user roles and permissions assignments",
      icon: Users,
      color: "bg-blue-500",
      path: "/security-settings/roles-management",
      stats: { total: 12, active: 10 }
    },
    {
      id: "permissions",
      title: "Access Permissions",
      description: "Control system access and privilege matrix",
      icon: Key,
      color: "bg-green-500",
      path: "/security-settings/access-permissions",
      stats: { total: 45, active: 42 }
    },
    {
      id: "sessions",
      title: "Session Monitor",
      description: "Monitor active user sessions and activities",
      icon: Monitor,
      color: "bg-orange-500",
      path: "/security-settings/session-monitor",
      stats: { total: 23, active: 15 }
    },
    {
      id: "activity",
      title: "Activity Summary",
      description: "Track and audit system activities",
      icon: Activity,
      color: "bg-purple-500",
      path: "/security-settings/activity-summary",
      stats: { total: 1420, active: 156 }
    },
  ];

  const handleCardClick = (path: string) => {
    router.push(path);
  };

  return (
    <div className="w-full p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center space-x-3">
          <Shield className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold">Security Settings</h1>
            <p className="text-muted-foreground">
              Comprehensive security management and monitoring dashboard
            </p>
          </div>
        </div>
      </div>

      {/* Quick Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
        {dashboardCards.map((card) => {
          const IconComponent = card.icon;
          return (
            <Card
              key={card.id}
              className="cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-105"
              onClick={() => handleCardClick(card.path)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg ${card.color} text-white`}>
                      <IconComponent className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-lg">{card.title}</CardTitle>
                    </div>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground" />
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm mb-3 text-muted-foreground">{card.description}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="text-2xl font-bold">{card.stats.total}</div>
                    <Badge variant="secondary" className="text-xs">
                      {card.stats.active} Active
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Users className="h-5 w-5" />
              <span>Quick Actions</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button 
              className="w-full justify-start" 
              variant="outline"
              onClick={() => router.push("/security-settings/roles-management")}
            >
              <Users className="h-4 w-4 mr-2" />
              Manage Roles
            </Button>
            <Button 
              className="w-full justify-start" 
              variant="outline"
              onClick={() => router.push("/security-settings/access-permissions")}
            >
              <Key className="h-4 w-4 mr-2" />
              Configure Permissions
            </Button>
            <Button 
              className="w-full justify-start" 
              variant="outline"
              onClick={() => router.push("/security-settings/session-monitor")}
            >
              <Monitor className="h-4 w-4 mr-2" />
              View Active Sessions
            </Button>
            <Button 
              className="w-full justify-start" 
              variant="outline"
              onClick={() => router.push("/security-settings/activity-summary")}
            >
              <Activity className="h-4 w-4 mr-2" />
              Audit Logs
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Shield className="h-5 w-5" />
              <span>Security Overview</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Total Users</span>
                <Badge variant="outline">245</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Active Roles</span>
                <Badge variant="outline">10</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Active Sessions</span>
                <Badge variant="outline">15</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Today's Activities</span>
                <Badge variant="outline">156</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}