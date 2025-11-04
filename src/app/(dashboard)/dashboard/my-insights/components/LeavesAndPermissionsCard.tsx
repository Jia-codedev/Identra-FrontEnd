import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Briefcase, Calendar, CheckCircle, Clock, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface LeavesData {
  workingDays: number | null;
  totalLeaves: number | null;
  leavesTaken: number | null;
  absent: number | null;
  approvedLeaves: number | null;
  pendingLeaves: number | null;
}

interface PermissionsData {
  workingDays: number;
  totalPermissions: number;
  permissionTaken: string; // in hours format like "0.0 hrs"
  unapprovedPermissions: string;
  approvedPermissions: string;
  pendingPermissions: string;
}

interface LeavesAndPermissionsCardProps {
  leavesData?: LeavesData;
  permissionsData?: PermissionsData;
  onApplyClick?: () => void;
  isLoading?: boolean;
}

function LeavesAndPermissionsCard({
  leavesData,
  permissionsData,
  onApplyClick,
  isLoading
}: LeavesAndPermissionsCardProps) {
  return (
    <div className={
      cn("bg-card border p-4 rounded-xl h-full", {
        [isLoading ? "animate-pulse" : ""]: true
      })
    }>
      <Tabs defaultValue="leaves" className="w-full">
        <div className="flex items-center justify-between mb-4">
          <TabsList className="bg-transparent">
            <TabsTrigger
              value="leaves"
              className="[data-state=active]:border-b-2 rounded-full px-4 py-2 [data-state=active]:bg-transparent"
            >
              Leaves
            </TabsTrigger>
            <TabsTrigger
              value="permissions"
              className="[data-state=active]:border-b-2 rounded-full px-4 py-2 [data-state=active]:bg-transparent"

            >
              Permissions
            </TabsTrigger>
          </TabsList>
          <button
            onClick={onApplyClick}
            className="text-blue-500 hover:text-blue-400 text-sm font-medium"
          >
            Apply
          </button>
        </div>

        <TabsContent value="leaves" className="mt-0">
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-muted/50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-muted-foreground text-sm">Working Days</span>
                <div className="bg-blue-500/20 p-2 rounded-lg">
                  <Briefcase className="w-4 h-4 text-blue-500" />
                </div>
              </div>
              <div className="text-2xl font-bold text-blue-500">
                {leavesData?.workingDays || 0}
              </div>
            </div>

            <div className="bg-muted/50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-muted-foreground text-sm">Total Leaves</span>
                <div className="bg-purple-500/20 p-2 rounded-lg">
                  <Calendar className="w-4 h-4 text-purple-500" />
                </div>
              </div>
              <div className="text-2xl font-bold text-purple-500">
                {leavesData?.totalLeaves || 0}
              </div>
            </div>
            <div className="bg-muted/50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-muted-foreground text-sm">Leaves Taken</span>
                <div className="bg-yellow-500/20 p-2 rounded-lg">
                  <Calendar className="w-4 h-4 text-yellow-500" />
                </div>
              </div>
              <div className="text-2xl font-bold text-yellow-500">
                {leavesData?.leavesTaken || 0}
              </div>
            </div>

            <div className="bg-muted/50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-muted-foreground text-sm">Absent</span>
                <div className="bg-red-500/20 p-2 rounded-lg">
                  <XCircle className="w-4 h-4 text-red-500" />
                </div>
              </div>
              <div className="text-2xl font-bold text-red-500">
                {leavesData?.absent || 0}
              </div>
            </div>
            <div className="bg-muted/50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-muted-foreground text-sm">Approved Leaves</span>
                <div className="bg-green-500/20 p-2 rounded-lg">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                </div>
              </div>
              <div className="text-2xl font-bold text-green-500">
                {leavesData?.approvedLeaves || 0}
              </div>
            </div>
            <div className="bg-muted/50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-muted-foreground text-sm">Pending Leaves</span>
                <div className="bg-orange-500/20 p-2 rounded-lg">
                  <Clock className="w-4 h-4 text-orange-500" />
                </div>
              </div>
              <div className="text-2xl font-bold text-orange-500">
                {leavesData?.pendingLeaves || 0}
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="permissions" className="mt-0">
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-muted/50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-muted-foreground text-sm">Working Days</span>
                <div className="bg-blue-500/20 p-2 rounded-lg">
                  <Briefcase className="w-4 h-4 text-blue-500" />
                </div>
              </div>
              <div className="text-2xl font-bold text-blue-500">
                {permissionsData?.workingDays || 0}
              </div>
            </div>

            <div className="bg-muted/50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-muted-foreground text-sm">Total Permissions</span>
                <div className="bg-purple-500/20 p-2 rounded-lg">
                  <Calendar className="w-4 h-4 text-purple-500" />
                </div>
              </div>
              <div className="text-2xl font-bold text-purple-500">
                {permissionsData?.totalPermissions || 0}
              </div>
            </div>

            <div className="bg-muted/50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-muted-foreground text-sm">Permission Taken</span>
                <div className="bg-yellow-500/20 p-2 rounded-lg">
                  <Calendar className="w-4 h-4 text-yellow-500" />
                </div>
              </div>
              <div className="text-2xl font-bold text-yellow-500">
                {permissionsData?.permissionTaken || "0.0 hrs"}
              </div>
            </div>
            <div className="bg-muted/50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-muted-foreground text-sm">
                  Unapproved Permissions
                </span>
                <div className="bg-red-500/20 p-2 rounded-lg">
                  <XCircle className="w-4 h-4 text-red-500" />
                </div>
              </div>
              <div className="text-2xl font-bold text-red-500">
                {permissionsData?.unapprovedPermissions || 0}
              </div>
            </div>
            <div className="bg-muted/50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-muted-foreground text-sm">
                  Approved Permissions
                </span>
                <div className="bg-green-500/20 p-2 rounded-lg">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                </div>
              </div>
              <div className="text-2xl font-bold text-green-500">
                {permissionsData?.approvedPermissions || 0}
              </div>
            </div>
            <div className="bg-muted/50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-muted-foreground text-sm">Pending Permissions</span>
                <div className="bg-orange-500/20 p-2 rounded-lg">
                  <Clock className="w-4 h-4 text-orange-500" />
                </div>
              </div>
              <div className="text-2xl font-bold text-orange-500">
                {permissionsData?.pendingPermissions || 0}
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default LeavesAndPermissionsCard;
