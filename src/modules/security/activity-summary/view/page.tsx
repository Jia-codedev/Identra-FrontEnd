"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useTranslations } from "@/hooks/use-translations";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Activity, Shield, User, AlertTriangle, Clock, Eye, Download, Search, Filter, Calendar } from "lucide-react";
import { GenericTable } from "@/components/common/GenericTable";
import { toast } from "sonner";

interface SecurityActivity {
  id: string;
  timestamp: string;
  user: string;
  userId: string;
  action: string;
  resource: string;
  category: 'authentication' | 'authorization' | 'data-access' | 'system' | 'security';
  status: 'success' | 'failed' | 'warning';
  ipAddress: string;
  userAgent: string;
  location: string;
  details: string;
  risk: 'low' | 'medium' | 'high' | 'critical';
}

interface ActivitySummary {
  totalActivities: number;
  successfulActions: number;
  failedActions: number;
  warningActions: number;
  criticalActivities: number;
  uniqueUsers: number;
}

const MOCK_ACTIVITIES: SecurityActivity[] = [
  {
    id: "1",
    timestamp: "2024-01-20 14:30:15",
    user: "John Doe",
    userId: "user1",
    action: "Login",
    resource: "Application",
    category: "authentication",
    status: "success",
    ipAddress: "192.168.1.100",
    userAgent: "Chrome 121.0",
    location: "New York, USA",
    details: "Successful login from trusted device",
    risk: "low"
  },
  {
    id: "2", 
    timestamp: "2024-01-20 14:25:30",
    user: "Jane Smith",
    userId: "user2",
    action: "Failed Login Attempt",
    resource: "Application",
    category: "authentication",
    status: "failed",
    ipAddress: "192.168.1.105",
    userAgent: "Safari 17.0",
    location: "London, UK",
    details: "Multiple failed login attempts detected",
    risk: "high"
  },
  {
    id: "3",
    timestamp: "2024-01-20 14:20:45",
    user: "Mike Johnson",
    userId: "user3",
    action: "Access User Data",
    resource: "Employee Records",
    category: "data-access",
    status: "success",
    ipAddress: "192.168.1.110",
    userAgent: "Firefox 122.0",
    location: "Toronto, Canada",
    details: "Accessed sensitive employee information",
    risk: "medium"
  },
  {
    id: "4",
    timestamp: "2024-01-20 14:15:00",
    user: "Sarah Wilson",
    userId: "user4",
    action: "Permission Change",
    resource: "User Roles",
    category: "authorization",
    status: "warning",
    ipAddress: "192.168.1.115",
    userAgent: "Edge 120.0",
    location: "Sydney, Australia",
    details: "Elevated permissions granted without approval",
    risk: "critical"
  },
  {
    id: "5",
    timestamp: "2024-01-20 14:10:30",
    user: "Admin User",
    userId: "admin1",
    action: "System Configuration",
    resource: "Security Settings",
    category: "system",
    status: "success",
    ipAddress: "192.168.1.1",
    userAgent: "Chrome 121.0",
    location: "Server Room",
    details: "Updated firewall rules and access policies",
    risk: "low"
  }
];

export default function ActivitySummaryPage() {
  const { t } = useTranslations();
  
  const [activities, setActivities] = useState<SecurityActivity[]>(MOCK_ACTIVITIES);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [riskFilter, setRiskFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("today");
  const [selectedActivity, setSelectedActivity] = useState<SecurityActivity | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedActivities, setSelectedActivities] = useState<number[]>([]);
  const [allChecked, setAllChecked] = useState(false);

  const activitySummary: ActivitySummary = {
    totalActivities: activities.length,
    successfulActions: activities.filter(a => a.status === 'success').length,
    failedActions: activities.filter(a => a.status === 'failed').length,
    warningActions: activities.filter(a => a.status === 'warning').length,
    criticalActivities: activities.filter(a => a.risk === 'critical').length,
    uniqueUsers: new Set(activities.map(a => a.userId)).size,
  };

  const filteredActivities = activities.filter(activity => {
    const matchesSearch = 
      activity.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
      activity.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      activity.resource.toLowerCase().includes(searchTerm.toLowerCase()) ||
      activity.details.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === "all" || activity.category === categoryFilter;
    const matchesStatus = statusFilter === "all" || activity.status === statusFilter;
    const matchesRisk = riskFilter === "all" || activity.risk === riskFilter;
    
    return matchesSearch && matchesCategory && matchesStatus && matchesRisk;
  });

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'critical': return 'text-red-600 bg-red-100';
      case 'high': return 'text-orange-600 bg-orange-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-green-600 bg-green-100';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'default';
      case 'failed': return 'destructive';
      case 'warning': return 'secondary';
      default: return 'outline';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'authentication': return <User className="h-4 w-4" />;
      case 'authorization': return <Shield className="h-4 w-4" />;
      case 'data-access': return <Eye className="h-4 w-4" />;
      case 'system': return <Activity className="h-4 w-4" />;
      case 'security': return <AlertTriangle className="h-4 w-4" />;
      default: return <Activity className="h-4 w-4" />;
    }
  };

  const handleExportData = () => {
    // TODO: Implement export functionality
    toast.success("Export functionality will be implemented");
  };

  const tableColumns = [
    {
      key: "timestamp",
      header: "Time",
      accessor: (item: unknown) => {
        const activity = item as SecurityActivity;
        return (
          <div className="text-sm">
            <div className="font-medium">{new Date(activity.timestamp).toLocaleDateString()}</div>
            <div className="text-gray-500">{new Date(activity.timestamp).toLocaleTimeString()}</div>
          </div>
        );
      }
    },
    {
      key: "user",
      header: "User",
      accessor: (item: unknown) => {
        const activity = item as SecurityActivity;
        return (
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
              <User className="h-4 w-4 text-primary" />
            </div>
            <div>
              <div className="font-medium">{activity.user}</div>
              <div className="text-sm text-gray-500">{activity.location}</div>
            </div>
          </div>
        );
      }
    },
    {
      key: "action",
      header: "Action",
      accessor: (item: unknown) => {
        const activity = item as SecurityActivity;
        return (
          <div className="flex items-center space-x-2">
            {getCategoryIcon(activity.category)}
            <div>
              <div className="font-medium">{activity.action}</div>
              <div className="text-sm text-gray-500">{activity.resource}</div>
            </div>
          </div>
        );
      }
    },
    {
      key: "category",
      header: "Category",
      accessor: (item: unknown) => {
        const activity = item as SecurityActivity;
        return (
          <Badge variant="outline" className="capitalize">
            {activity.category.replace('-', ' ')}
          </Badge>
        );
      }
    },
    {
      key: "status",
      header: "Status",
      accessor: (item: unknown) => {
        const activity = item as SecurityActivity;
        return (
          <Badge variant={getStatusColor(activity.status) as any}>
            {activity.status.charAt(0).toUpperCase() + activity.status.slice(1)}
          </Badge>
        );
      }
    },
    {
      key: "risk",
      header: "Risk Level",
      accessor: (item: unknown) => {
        const activity = item as SecurityActivity;
        return (
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRiskColor(activity.risk)}`}>
            {activity.risk.charAt(0).toUpperCase() + activity.risk.slice(1)}
          </span>
        );
      }
    }
  ];

  const getActivityId = useCallback((activity: SecurityActivity): number => {
    return parseInt(activity.id);
  }, []);
  
  const getActivityDisplayName = useCallback((activity: SecurityActivity, isRTL: boolean): string => {
    return activity.action;
  }, []);

  const handleSelectActivity = (id: number) => {
    setSelectedActivities(prev => 
      prev.includes(id) ? prev.filter(aid => aid !== id) : [...prev, id]
    );
  };

  const handleSelectAllActivities = () => {
    if (allChecked) {
      setSelectedActivities([]);
      setAllChecked(false);
    } else {
      setSelectedActivities(filteredActivities.map(a => parseInt(a.id)));
      setAllChecked(true);
    }
  };

  return (
    <div className="w-full p-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-3">
          <Activity className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold">Security Activity Summary</h1>
            <p className="text-muted-foreground">Monitor and analyze security activities and events</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={handleExportData}>
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
          <Button>
            <Eye className="h-4 w-4 mr-2" />
            Live Monitor
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <Activity className="h-8 w-8 text-blue-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-muted-foreground">Total Activities</p>
                <p className="text-2xl font-bold">{activitySummary.totalActivities}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                <div className="h-4 w-4 rounded-full bg-green-600"></div>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-muted-foreground">Successful</p>
                <p className="text-2xl font-bold text-green-600">{activitySummary.successfulActions}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <div className="h-8 w-8 rounded-full bg-red-100 flex items-center justify-center">
                <div className="h-4 w-4 rounded-full bg-red-600"></div>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-muted-foreground">Failed</p>
                <p className="text-2xl font-bold text-red-600">{activitySummary.failedActions}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <div className="h-8 w-8 rounded-full bg-yellow-100 flex items-center justify-center">
                <div className="h-4 w-4 rounded-full bg-yellow-600"></div>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-muted-foreground">Warnings</p>
                <p className="text-2xl font-bold text-yellow-600">{activitySummary.warningActions}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <AlertTriangle className="h-8 w-8 text-red-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-muted-foreground">Critical</p>
                <p className="text-2xl font-bold text-red-600">{activitySummary.criticalActivities}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <User className="h-8 w-8 text-purple-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-muted-foreground">Unique Users</p>
                <p className="text-2xl font-bold">{activitySummary.uniqueUsers}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <input
                  placeholder="Search activities, users, or resources..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 p-2 border rounded-md"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-[150px]">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="authentication">Authentication</SelectItem>
                  <SelectItem value="authorization">Authorization</SelectItem>
                  <SelectItem value="data-access">Data Access</SelectItem>
                  <SelectItem value="system">System</SelectItem>
                  <SelectItem value="security">Security</SelectItem>
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="success">Success</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                  <SelectItem value="warning">Warning</SelectItem>
                </SelectContent>
              </Select>
              <Select value={riskFilter} onValueChange={setRiskFilter}>
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="Risk" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Risk</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                </SelectContent>
              </Select>
              <Select value={dateFilter} onValueChange={setDateFilter}>
                <SelectTrigger className="w-[120px]">
                  <Calendar className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Date" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="yesterday">Yesterday</SelectItem>
                  <SelectItem value="week">This Week</SelectItem>
                  <SelectItem value="month">This Month</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Activities Table */}
      <GenericTable
        data={filteredActivities}
        columns={tableColumns}
        selected={selectedActivities}
        page={currentPage}
        pageSize={pageSize}
        allChecked={allChecked}
        getItemId={getActivityId}
        getItemDisplayName={getActivityDisplayName}
        onSelectItem={handleSelectActivity}
        onSelectAll={handleSelectAllActivities}
        onEditItem={(activity: SecurityActivity) => {
          setSelectedActivity(activity);
          setIsViewModalOpen(true);
        }}
        noDataMessage="No security activities found"
        isLoading={isLoading}
        onPageChange={setCurrentPage}
        onPageSizeChange={setPageSize}
        showActions={false}
      />

      {/* Activity Details Modal */}
      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Security Activity Details</DialogTitle>
          </DialogHeader>
          {selectedActivity && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="font-medium">Timestamp</Label>
                  <p className="text-sm text-muted-foreground">
                    {new Date(selectedActivity.timestamp).toLocaleString()}
                  </p>
                </div>
                <div>
                  <Label className="font-medium">User</Label>
                  <p className="text-sm text-muted-foreground">{selectedActivity.user}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="font-medium">Action</Label>
                  <p className="text-sm text-muted-foreground">{selectedActivity.action}</p>
                </div>
                <div>
                  <Label className="font-medium">Resource</Label>
                  <p className="text-sm text-muted-foreground">{selectedActivity.resource}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="font-medium">Category</Label>
                  <Badge variant="outline" className="capitalize">
                    {selectedActivity.category.replace('-', ' ')}
                  </Badge>
                </div>
                <div>
                  <Label className="font-medium">Status</Label>
                  <Badge variant={getStatusColor(selectedActivity.status) as any}>
                    {selectedActivity.status.charAt(0).toUpperCase() + selectedActivity.status.slice(1)}
                  </Badge>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="font-medium">IP Address</Label>
                  <p className="text-sm text-muted-foreground">{selectedActivity.ipAddress}</p>
                </div>
                <div>
                  <Label className="font-medium">Location</Label>
                  <p className="text-sm text-muted-foreground">{selectedActivity.location}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="font-medium">User Agent</Label>
                  <p className="text-sm text-muted-foreground">{selectedActivity.userAgent}</p>
                </div>
                <div>
                  <Label className="font-medium">Risk Level</Label>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRiskColor(selectedActivity.risk)}`}>
                    {selectedActivity.risk.charAt(0).toUpperCase() + selectedActivity.risk.slice(1)}
                  </span>
                </div>
              </div>
              <div>
                <Label className="font-medium">Details</Label>
                <p className="text-sm text-muted-foreground mt-2">{selectedActivity.details}</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}