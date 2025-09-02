"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/Table";
import { CustomPagination } from "@/components/common/dashboard/Pagination";
import { Clock, MapPin, Smartphone, Edit, Trash2 } from "lucide-react";

const formatDateTime = (dateString: string) => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return date.toLocaleString();
};

const formatTime = (timeString: string) => {
  if (!timeString) return 'N/A';
  const date = new Date(timeString);
  return date.toLocaleTimeString();
};

type ViewMode = 'table' | 'grid';

interface AttendanceRecord {
  id: number;
  employee_id: number;
  employee_no: string;
  employee_name?: string;
  Ddate: string;
  check_in?: string;
  check_out?: string;
  break_start?: string;
  break_end?: string;
  total_work_hours?: number;
  overtime_hours?: number;
  status?: string;
  location?: string;
  device_id?: string;
  created_date?: string;
  last_updated_date?: string;
}

interface PunchesListProps {
  punches: AttendanceRecord[];
  viewMode: ViewMode;
  currentPage: number;
  totalPages: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  onEdit?: (punch: AttendanceRecord) => void;
  onDelete?: (id: number) => void;
  isLoading?: boolean;
}

const getStatusColor = (status: string) => {
  switch (status?.toLowerCase()) {
    case 'present':
      return 'bg-green-100 text-green-800';
    case 'absent':
      return 'bg-red-100 text-red-800';
    case 'late':
      return 'bg-yellow-100 text-yellow-800';
    case 'half day':
      return 'bg-blue-100 text-blue-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export default function PunchesList({
  punches,
  viewMode,
  currentPage,
  totalPages,
  pageSize,
  onPageChange,
  onPageSizeChange,
  onEdit,
  onDelete,
  isLoading = false,
}: PunchesListProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (punches.length === 0) {
    return (
      <div className="text-center py-16">
        <Clock className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">No attendance records found</h3>
        <p className="mt-1 text-sm text-gray-500">
          No attendance records match your current filters.
        </p>
      </div>
    );
  }

  if (viewMode === 'table') {
    return (
      <div className="space-y-4">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Employee</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Check In</TableHead>
              <TableHead>Check Out</TableHead>
              <TableHead>Break</TableHead>
              <TableHead>Work Hours</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {punches.map((punch) => (
              <TableRow key={punch.id}>
                <TableCell>
                  <div>
                    <div className="font-medium text-gray-900">{punch.employee_name || 'Unknown'}</div>
                    <div className="text-sm text-gray-500">#{punch.employee_no}</div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="text-sm">
                    <div className="font-medium">{formatDateTime(punch.Ddate)}</div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="text-sm text-gray-600">
                    {formatTime(punch.check_in || '')}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="text-sm text-gray-600">
                    {formatTime(punch.check_out || '')}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="text-sm text-gray-600">
                    {punch.break_start && punch.break_end ? 
                      `${formatTime(punch.break_start)} - ${formatTime(punch.break_end)}` : 
                      'N/A'
                    }
                  </div>
                </TableCell>
                <TableCell>
                  <div className="text-sm">
                    <div className="font-medium">{punch.total_work_hours || 0}h</div>
                    {punch.overtime_hours && punch.overtime_hours > 0 && (
                      <div className="text-xs text-blue-600">+{punch.overtime_hours}h OT</div>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center text-sm text-gray-600">
                    <MapPin className="w-3 h-3 mr-1" />
                    {punch.location || 'Unknown'}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge className={getStatusColor(punch.status || '')}>
                    {punch.status || 'Unknown'}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    {onEdit && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onEdit(punch)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                    )}
                    {onDelete && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onDelete(punch.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <CustomPagination
          currentPage={currentPage}
          totalPages={totalPages}
          pageSize={pageSize}
          pageSizeOptions={[10, 25, 50, 100]}
          onPageChange={onPageChange}
          onPageSizeChange={onPageSizeChange}
        />
      </div>
    );
  }

  // Grid view
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {punches.map((punch) => (
          <Card key={punch.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-medium text-gray-900">{punch.employee_name || 'Unknown'}</h3>
                  <p className="text-sm text-gray-500">#{punch.employee_no}</p>
                </div>
                <div className="flex gap-1">
                  <Badge className={getStatusColor(punch.status || '')}>
                    {punch.status || 'Unknown'}
                  </Badge>
                </div>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center text-sm">
                  <Clock className="w-4 h-4 mr-2 text-gray-400" />
                  <span className="font-medium">{formatDateTime(punch.Ddate)}</span>
                </div>
                
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-gray-500">In:</span> {formatTime(punch.check_in || '')}
                  </div>
                  <div>
                    <span className="text-gray-500">Out:</span> {formatTime(punch.check_out || '')}
                  </div>
                </div>

                {punch.break_start && punch.break_end && (
                  <div className="text-sm text-gray-600">
                    <span className="font-medium">Break:</span> {formatTime(punch.break_start)} - {formatTime(punch.break_end)}
                  </div>
                )}

                <div className="flex items-center justify-between text-sm">
                  <div>
                    <span className="text-gray-500">Work:</span> {punch.total_work_hours || 0}h
                  </div>
                  {punch.overtime_hours && punch.overtime_hours > 0 && (
                    <div className="text-blue-600">
                      <span className="font-medium">OT:</span> {punch.overtime_hours}h
                    </div>
                  )}
                </div>

                <div className="flex items-center text-sm text-gray-600">
                  <MapPin className="w-4 h-4 mr-2" />
                  <span>{punch.location || 'Unknown Location'}</span>
                </div>

                {punch.device_id && (
                  <div className="flex items-center text-sm text-gray-600">
                    <Smartphone className="w-4 h-4 mr-2" />
                    <span>Device: {punch.device_id}</span>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t">
                {onEdit && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onEdit(punch)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                )}
                {onDelete && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDelete(punch.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <CustomPagination
        currentPage={currentPage}
        totalPages={totalPages}
        pageSize={pageSize}
        pageSizeOptions={[10, 25, 50, 100]}
        onPageChange={onPageChange}
        onPageSizeChange={onPageSizeChange}
      />
    </div>
  );
}
