"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useTranslations } from "@/hooks/use-translations";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import {
  Monitor,
  Users,
  Clock,
  MapPin,
  Smartphone,
  Laptop,
  Tablet,
  MoreHorizontal,
  LogOut,
  Ban,
  Search,
  Filter,
  RefreshCw,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { GenericTable } from "@/components/common/GenericTable";
import { toast } from "sonner";

interface UserSession {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  deviceType: "desktop" | "mobile" | "tablet";
  deviceName: string;
  ipAddress: string;
  location: string;
  browser: string;
  loginTime: string;
  lastActivity: string;
  status: "active" | "idle" | "expired";
  duration: string;
}

interface SessionSummary {
  totalSessions: number;
  activeSessions: number;
  idleSessions: number;
  expiredSessions: number;
  uniqueUsers: number;
  averageDuration: string;
}

export default function SessionMonitorPage() {
  const { t } = useTranslations();

  const [sessions, setSessions] = useState<UserSession[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [deviceFilter, setDeviceFilter] = useState("all");
  const [refreshInterval, setRefreshInterval] = useState(30);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedSession, setSelectedSession] = useState<UserSession | null>(
    null
  );
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedSessions, setSelectedSessions] = useState<number[]>([]);
  const [allChecked, setAllChecked] = useState(false);

  const mockSessions: UserSession[] = [
    {
      id: "1",
      userId: "user1",
      userName: "John Doe",
      userEmail: "john.doe@company.com",
      deviceType: "desktop",
      deviceName: "Windows PC",
      ipAddress: "192.168.1.100",
      location: "New York, USA",
      browser: "Chrome 121.0",
      loginTime: "2024-01-20 09:15:00",
      lastActivity: "2024-01-20 14:30:00",
      status: "active",
      duration: "5h 15m",
    },
    {
      id: "2",
      userId: "user2",
      userName: "Jane Smith",
      userEmail: "jane.smith@company.com",
      deviceType: "mobile",
      deviceName: "iPhone 15",
      ipAddress: "192.168.1.105",
      location: "London, UK",
      browser: "Safari 17.0",
      loginTime: "2024-01-20 08:30:00",
      lastActivity: "2024-01-20 14:25:00",
      status: "active",
      duration: "5h 55m",
    },
    {
      id: "3",
      userId: "user3",
      userName: "Mike Johnson",
      userEmail: "mike.johnson@company.com",
      deviceType: "tablet",
      deviceName: "iPad Pro",
      ipAddress: "192.168.1.110",
      location: "Toronto, Canada",
      browser: "Safari 17.0",
      loginTime: "2024-01-20 10:00:00",
      lastActivity: "2024-01-20 13:45:00",
      status: "idle",
      duration: "4h 45m",
    },
    {
      id: "4",
      userId: "user4",
      userName: "Sarah Wilson",
      userEmail: "sarah.wilson@company.com",
      deviceType: "desktop",
      deviceName: "MacBook Pro",
      ipAddress: "192.168.1.115",
      location: "Sydney, Australia",
      browser: "Chrome 121.0",
      loginTime: "2024-01-20 07:00:00",
      lastActivity: "2024-01-20 12:00:00",
      status: "expired",
      duration: "5h 00m",
    },
  ];

  const sessionSummary: SessionSummary = {
    totalSessions: 23,
    activeSessions: 15,
    idleSessions: 5,
    expiredSessions: 3,
    uniqueUsers: 20,
    averageDuration: "4h 32m",
  };

  useEffect(() => {
    setSessions(mockSessions);
  }, []);

  const filteredSessions = sessions.filter((session) => {
    const matchesSearch =
      session.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      session.userEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      session.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || session.status === statusFilter;
    const matchesDevice =
      deviceFilter === "all" || session.deviceType === deviceFilter;
    return matchesSearch && matchesStatus && matchesDevice;
  });

  const getDeviceIcon = (deviceType: string) => {
    switch (deviceType) {
      case "mobile":
        return <Smartphone className="h-4 w-4" />;
      case "tablet":
        return <Tablet className="h-4 w-4" />;
      default:
        return <Laptop className="h-4 w-4" />;
    }
  };

  const handleTerminateSession = async (sessionId: string | number) => {
    try {
      setSessions(sessions.filter((s) => s.id !== sessionId.toString()));
      toast.success("Session terminated successfully");
    } catch (error) {
      toast.error("Failed to terminate session");
    }
  };

  const handleBanUser = async (userId: string) => {
    try {
      toast.success("User banned successfully");
    } catch (error) {
      toast.error("Failed to ban user");
    }
  };

  const handleRefresh = () => {
    setIsLoading(true);
    setTimeout(() => {
      setSessions(mockSessions);
      setIsLoading(false);
      toast.success("Session data refreshed");
    }, 1000);
  };

  useEffect(() => {
    if (refreshInterval > 0) {
      const interval = setInterval(() => {
        handleRefresh();
      }, refreshInterval * 1000);

      return () => clearInterval(interval);
    }
  }, [refreshInterval]);

  const tableColumns = [
    {
      key: "user",
      header: "User",
      accessor: (item: unknown) => {
        const session = item as UserSession;
        return (
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
              <Users className="h-4 w-4 text-primary" />
            </div>
            <div>
              <div className="font-medium">{session.userName}</div>
              <div className="text-sm text-gray-500">{session.userEmail}</div>
            </div>
          </div>
        );
      },
    },
    {
      key: "device",
      header: "Device",
      accessor: (item: unknown) => {
        const session = item as UserSession;
        return (
          <div className="flex items-center space-x-2">
            {getDeviceIcon(session.deviceType)}
            <div>
              <div className="font-medium">{session.deviceName}</div>
              <div className="text-sm text-gray-500">{session.browser}</div>
            </div>
          </div>
        );
      },
    },
    {
      key: "location",
      header: "Location",
      accessor: (item: unknown) => {
        const session = item as UserSession;
        return (
          <div className="flex items-center space-x-2">
            <MapPin className="h-4 w-4 text-gray-500" />
            <div>
              <div className="font-medium">{session.location}</div>
              <div className="text-sm text-gray-500">{session.ipAddress}</div>
            </div>
          </div>
        );
      },
    },
    {
      key: "status",
      header: "Status",
      accessor: (item: unknown) => {
        const session = item as UserSession;
        return (
          <Badge
            variant={
              session.status === "active"
                ? "default"
                : session.status === "idle"
                ? "secondary"
                : "destructive"
            }
          >
            {session.status.charAt(0).toUpperCase() + session.status.slice(1)}
          </Badge>
        );
      },
    },
    {
      key: "duration",
      header: "Duration",
      accessor: (item: unknown) => {
        const session = item as UserSession;
        return (
          <div className="text-center">
            <div className="font-medium">{session.duration}</div>
            <div className="text-sm text-gray-500">Active time</div>
          </div>
        );
      },
    },
    {
      key: "lastActivity",
      header: "Last Activity",
      accessor: (item: unknown) => {
        const session = item as UserSession;
        return (
          <div className="text-sm text-gray-500">
            {new Date(session.lastActivity).toLocaleString()}
          </div>
        );
      },
    },
  ];

  const getSessionId = useCallback((session: UserSession): number => {
    return parseInt(session.id);
  }, []);

  const getSessionDisplayName = useCallback(
    (session: UserSession, isRTL: boolean): string => {
      return session.userName;
    },
    []
  );

  const handleSelectSession = (id: string | number) => {
    const numericId = typeof id === "string" ? parseInt(id) : id;
    setSelectedSessions((prev) =>
      prev.includes(numericId)
        ? prev.filter((sid) => sid !== numericId)
        : [...prev, numericId]
    );
  };

  const handleSelectAllSessions = () => {
    if (allChecked) {
      setSelectedSessions([]);
      setAllChecked(false);
    } else {
      setSelectedSessions(filteredSessions.map((s) => parseInt(s.id)));
      setAllChecked(true);
    }
  };

  return (
    <div className="w-full p-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-3">
          <Monitor className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold">Session Monitor</h1>
            <p className="text-muted-foreground">
              Monitor active user sessions and security activities
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Select
            value={refreshInterval.toString()}
            onValueChange={(value) => setRefreshInterval(Number(value))}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Auto refresh" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0">Manual Refresh</SelectItem>
              <SelectItem value="10">10 seconds</SelectItem>
              <SelectItem value="30">30 seconds</SelectItem>
              <SelectItem value="60">1 minute</SelectItem>
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            onClick={handleRefresh}
            disabled={isLoading}
          >
            <RefreshCw
              className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`}
            />
            Refresh Now
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-blue-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-muted-foreground">
                  Total Sessions
                </p>
                <p className="text-2xl font-bold">
                  {sessionSummary.totalSessions}
                </p>
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
                <p className="text-sm font-medium text-muted-foreground">
                  Active
                </p>
                <p className="text-2xl font-bold text-green-600">
                  {sessionSummary.activeSessions}
                </p>
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
                <p className="text-sm font-medium text-muted-foreground">
                  Idle
                </p>
                <p className="text-2xl font-bold text-yellow-600">
                  {sessionSummary.idleSessions}
                </p>
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
                <p className="text-sm font-medium text-muted-foreground">
                  Expired
                </p>
                <p className="text-2xl font-bold text-red-600">
                  {sessionSummary.expiredSessions}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <Monitor className="h-8 w-8 text-purple-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-muted-foreground">
                  Unique Users
                </p>
                <p className="text-2xl font-bold">
                  {sessionSummary.uniqueUsers}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-indigo-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-muted-foreground">
                  Avg Duration
                </p>
                <p className="text-2xl font-bold">
                  {sessionSummary.averageDuration}
                </p>
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
                  placeholder="Search users, emails, or locations..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 p-2-md"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[150px]">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="idle">Idle</SelectItem>
                  <SelectItem value="expired">Expired</SelectItem>
                </SelectContent>
              </Select>
              <Select value={deviceFilter} onValueChange={setDeviceFilter}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Device" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Devices</SelectItem>
                  <SelectItem value="desktop">Desktop</SelectItem>
                  <SelectItem value="mobile">Mobile</SelectItem>
                  <SelectItem value="tablet">Tablet</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Sessions Table */}
      <GenericTable
        data={filteredSessions}
        columns={tableColumns}
        selected={selectedSessions}
        page={currentPage}
        pageSize={pageSize}
        allChecked={allChecked}
        getItemId={getSessionId}
        getItemDisplayName={getSessionDisplayName}
        onSelectItem={handleSelectSession}
        onSelectAll={handleSelectAllSessions}
        onEditItem={(session: UserSession) => {
          setSelectedSession(session);
          setIsViewModalOpen(true);
        }}
        onDeleteItem={(id: string | number) => handleTerminateSession(id)}
        noDataMessage="No sessions found"
        isLoading={isLoading}
        onPageChange={setCurrentPage}
        onPageSizeChange={setPageSize}
        actions={(session: UserSession) => (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() => handleTerminateSession(session.id)}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Terminate Session
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleBanUser(session.userId)}>
                <Ban className="mr-2 h-4 w-4" />
                Ban User
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      />

      {/* Session Details Modal */}
      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Session Details</DialogTitle>
          </DialogHeader>
          {selectedSession && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="font-medium">User Name</Label>
                  <p className="text-sm text-muted-foreground">
                    {selectedSession.userName}
                  </p>
                </div>
                <div>
                  <Label className="font-medium">Email</Label>
                  <p className="text-sm text-muted-foreground">
                    {selectedSession.userEmail}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="font-medium">Device</Label>
                  <p className="text-sm text-muted-foreground">
                    {selectedSession.deviceName}
                  </p>
                </div>
                <div>
                  <Label className="font-medium">Browser</Label>
                  <p className="text-sm text-muted-foreground">
                    {selectedSession.browser}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="font-medium">IP Address</Label>
                  <p className="text-sm text-muted-foreground">
                    {selectedSession.ipAddress}
                  </p>
                </div>
                <div>
                  <Label className="font-medium">Location</Label>
                  <p className="text-sm text-muted-foreground">
                    {selectedSession.location}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="font-medium">Login Time</Label>
                  <p className="text-sm text-muted-foreground">
                    {new Date(selectedSession.loginTime).toLocaleString()}
                  </p>
                </div>
                <div>
                  <Label className="font-medium">Last Activity</Label>
                  <p className="text-sm text-muted-foreground">
                    {new Date(selectedSession.lastActivity).toLocaleString()}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="font-medium">Status</Label>
                  <Badge
                    variant={
                      selectedSession.status === "active"
                        ? "default"
                        : selectedSession.status === "idle"
                        ? "secondary"
                        : "destructive"
                    }
                  >
                    {selectedSession.status.charAt(0).toUpperCase() +
                      selectedSession.status.slice(1)}
                  </Badge>
                </div>
                <div>
                  <Label className="font-medium">Duration</Label>
                  <p className="text-sm text-muted-foreground">
                    {selectedSession.duration}
                  </p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
