import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { format, parseISO } from "date-fns";

type Leave = any;

type Props = {
  leaves: Leave[];
  loading?: boolean;
};

const statusMap: Record<string, { label: string; color: string }> = {
  pending: { label: "Pending", color: "bg-yellow-100 text-yellow-800" },
  approved: { label: "Approved", color: "bg-green-100 text-green-800" },
  rejected: { label: "Rejected", color: "bg-red-100 text-red-800" },
};

const formatDateTime = (dt?: string) => {
  if (!dt) return "-";
  try {
    return format(parseISO(dt), "dd MMM yyyy, hh:mm a");
  } catch {
    return dt;
  }
};

const LeavesList: React.FC<Props> = ({ leaves, loading }) => {
  if (loading) {
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

  if (!leaves || leaves.length === 0)
    return (
      <div className="text-center text-muted-foreground py-8">
        <span className="text-sm">No leave requests found.</span>
      </div>
    );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {leaves.map((l: any) => {
        // Use leave_status for status, leave_types.leave_type_eng for leave type, employee_remarks for remarks
        const status = statusMap[l.leave_status?.toLowerCase?.()] || statusMap["pending"];
        // Use leave_unique_ref_no as key if available, else fallback to employee_leave_id
        const cardKey = l.leave_unique_ref_no || l.employee_leave_id;
        return (
          <Card key={cardKey} className="transition-shadow hover:shadow-lg">
            <CardHeader className="pb-2 flex flex-row items-center justify-between">
              <CardTitle className="text-base font-semibold">
                {l.leave_types?.leave_type_eng || "Unknown"}
              </CardTitle>
              <Badge className={status.color + " px-2 py-1 rounded text-xs font-medium"} variant="outline">
                {leaves.map((l: any) => {
                  // Defensive: support both camelCase and snake_case for API fields
                  const leaveType = l.leave_types?.leave_type_eng || l.leave_type || "Unknown";
                  const fromDate = l.from_date || l.start_date;
                  const toDate = l.to_date || l.end_date;
                  const remarks = l.employee_remarks || l.remarks;
                  const statusRaw = l.leave_status || l.status || "pending";
                  const status = statusMap[statusRaw?.toLowerCase?.()] || statusMap["pending"];
                  const cardKey = l.leave_unique_ref_no || l.employee_leave_id || l.id;
                  return (
                    <Card key={cardKey} className="transition-shadow hover:shadow-lg">
                      <CardHeader className="pb-2 flex flex-row items-center justify-between">
                        <CardTitle className="text-base font-semibold">
                          {leaveType}
                        </CardTitle>
                        <Badge className={status.color + " px-2 py-1 rounded text-xs font-medium"} variant="outline">
                          {status.label}
                        </Badge>
                      </CardHeader>
                      <CardContent className="space-y-1 text-sm">
                        <div className="text-muted-foreground">
                          <span className="font-medium">From:</span> {formatDateTime(fromDate)}
                        </div>
                        <div className="text-muted-foreground">
                          <span className="font-medium">To:</span> {formatDateTime(toDate)}
                        </div>
                        <div>
                          <span className="font-medium">Remarks:</span> {remarks || <span className="italic text-gray-400">None</span>}
                        </div>
                        <div className="text-xs text-gray-500 mt-2">
                          {l.leave_unique_ref_no}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
