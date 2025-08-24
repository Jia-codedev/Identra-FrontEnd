import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { format, parseISO } from "date-fns";
// Helper to format date/time
const formatDateTime = (dt: string) => {
  if (!dt) return "-";
  try {
    return format(parseISO(dt), "dd MMM yyyy, hh:mm a");
  } catch {
    return dt;
  }
};

type Permission = any;

type Props = {
  permissions: Permission[];
  loading?: boolean;
};

const statusMap: Record<number, { label: string; color: string }> = {
  0: { label: "Pending", color: "bg-yellow-100 text-yellow-800" },
  1: { label: "Approved", color: "bg-green-100 text-green-800" },
  2: { label: "Rejected", color: "bg-red-100 text-red-800" },
};

const PermissionList: React.FC<Props> = ({ permissions, loading }) => {
  if (loading) {
    // Show skeletons for loading state
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <Skeleton className="h-4 w-1/3 mb-2" />
              <Skeleton className="h-3 w-1/4" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-3 w-2/3 mb-2" />
              <Skeleton className="h-3 w-1/2" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!permissions || permissions.length === 0)
    return (
      <div className="text-center text-muted-foreground py-8">
        <span className="text-sm">No permission requests found.</span>
      </div>
    );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {permissions.map((p) => {
        const status = statusMap[p.approve_reject_flag] || statusMap[0];
        return (
          <Card
            key={p.single_permissions_id}
            className="transition-shadow hover:shadow-lg"
          >
            <CardHeader className="pb-2 flex flex-row items-center justify-between">
              <CardTitle className="text-base font-semibold">
                {p.permission_types?.permission_type_eng || "Unknown"}
              </CardTitle>
              <Badge
                className={
                  status.color + " px-2 py-1 rounded text-xs font-medium"
                }
                variant="outline"
              >
                {status.label}
              </Badge>
            </CardHeader>
            <CardContent className="space-y-1 text-sm">
              <div className="text-muted-foreground">
                <span className="font-medium">From:</span>{" "}
                {formatDateTime(p.from_date)}
              </div>
              <div className="text-muted-foreground">
                <span className="font-medium">To:</span>{" "}
                {formatDateTime(p.to_date)}
              </div>
              <div>
                <span className="font-medium">Remarks:</span>{" "}
                {p.remarks || (
                  <span className="italic text-gray-400">None</span>
                )}
              </div>
              <div className="text-xs text-gray-500 mt-2">
                {p
                  .employee_master_employee_short_permissions_employee_idToemployee_master
                  ?.emp_no || ""}
                {p
                  .employee_master_employee_short_permissions_employee_idToemployee_master
                  ?.firstname_eng
                  ? ` - ${p.employee_master_employee_short_permissions_employee_idToemployee_master.firstname_eng}`
                  : ""}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default PermissionList;
