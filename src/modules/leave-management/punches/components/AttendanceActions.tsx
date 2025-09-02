"use client";

import React, { useState } from 'react';
import { useTranslations } from '@/hooks/use-translations';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal, Edit, Trash2, FileText } from 'lucide-react';
import attendanceApi, { AttendanceRecord } from '@/services/leaveManagement/attendance';
import { toast } from 'sonner';

interface Props {
  attendance: AttendanceRecord;
  onEdit: () => void;
  onRefresh: () => void;
}

const AttendanceActions: React.FC<Props> = ({ attendance, onEdit, onRefresh }) => {
  const { t } = useTranslations();
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this attendance record?')) {
      return;
    }
    
    setLoading(true);
    try {
      await attendanceApi.deleteAttendance(attendance.id);
      toast.success('Attendance record deleted successfully');
      onRefresh();
    } catch (error: any) {
      toast.error(error?.message || 'Failed to delete attendance record');
    } finally {
      setLoading(false);
    }
  };

  const handleViewSummary = async () => {
    try {
      const summary = await attendanceApi.getAttendanceSummary({
        employee_id: attendance.employee_id,
        from_date: attendance.Ddate,
        to_date: attendance.Ddate,
      });
      
      // Display summary in a simple alert for now
      // In a real app, you'd want to show this in a modal or separate view
      alert(`Attendance Summary:\n${JSON.stringify(summary.data, null, 2)}`);
    } catch (error: any) {
      toast.error(error?.message || 'Failed to get attendance summary');
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" disabled={loading}>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={onEdit}>
          <Edit className="h-4 w-4 mr-2" />
          Edit
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleViewSummary}>
          <FileText className="h-4 w-4 mr-2" />
          View Summary
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleDelete} className="text-red-600">
          <Trash2 className="h-4 w-4 mr-2" />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default AttendanceActions;
