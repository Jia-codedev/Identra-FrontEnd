"use client";

import React, { useState } from 'react';
import { useTranslations } from '@/hooks/use-translations';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/Input';
import { DatePicker } from '@/components/ui/date-picker';
import { TimeSelect } from '@/components/ui/time-select';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/select';
import { useUserId } from '@/store/userStore';
import attendanceApi, { AttendanceRecord } from '@/services/leaveManagement/attendance';

interface Props {
  attendance?: AttendanceRecord | null;
  onClose: (refresh?: boolean) => void;
}

const AttendanceForm: React.FC<Props> = ({ attendance, onClose }) => {
  const { t } = useTranslations();
  const userId = useUserId();
  const [employeeId, setEmployeeId] = useState(attendance?.employee_id?.toString() || userId?.toString() || "");
  const [employeeNo, setEmployeeNo] = useState(attendance?.employee_no || "");
  const [date, setDate] = useState<Date | undefined>(
    attendance?.Ddate ? new Date(attendance.Ddate) : undefined
  );
  const [checkIn, setCheckIn] = useState<string>(attendance?.check_in || "");
  const [checkOut, setCheckOut] = useState<string>(attendance?.check_out || "");
  const [breakStart, setBreakStart] = useState<string>(attendance?.break_start || "");
  const [breakEnd, setBreakEnd] = useState<string>(attendance?.break_end || "");
  const [status, setStatus] = useState(attendance?.status || "");
  const [location, setLocation] = useState(attendance?.location || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    try {
      const dateValue = date ? date.toISOString().split("T")[0] : "";
      
      const payload = {
        employee_id: Number(employeeId),
        employee_no: employeeNo,
        Ddate: dateValue,
        check_in: checkIn,
        check_out: checkOut,
        break_start: breakStart,
        break_end: breakEnd,
        status: status,
        location: location,
      };

      if (attendance?.id) {
        await attendanceApi.updateAttendance(attendance.id, payload);
      } else {
        await attendanceApi.createAttendance(payload);
      }
      
      onClose(true);
    } catch (err: any) {
      setError(err?.message || "Failed to submit attendance record");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block mb-1 font-medium">Employee ID</label>
          <Input
            type="number"
            value={employeeId}
            onChange={(e) => setEmployeeId(e.target.value)}
            placeholder="Enter employee ID"
            required
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Employee Number</label>
          <Input
            value={employeeNo}
            onChange={(e) => setEmployeeNo(e.target.value)}
            placeholder="Enter employee number"
            required
          />
        </div>
      </div>

      <div>
        <label className="block mb-1 font-medium">Date</label>
        <DatePicker
          selected={date}
          onSelect={setDate}
          placeholder="Select date"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block mb-1 font-medium">Check In Time</label>
          <TimeSelect
            value={checkIn}
            onChange={setCheckIn}
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Check Out Time</label>
          <TimeSelect
            value={checkOut}
            onChange={setCheckOut}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block mb-1 font-medium">Break Start</label>
          <TimeSelect
            value={breakStart}
            onChange={setBreakStart}
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Break End</label>
          <TimeSelect
            value={breakEnd}
            onChange={setBreakEnd}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block mb-1 font-medium">Status</label>
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="present">Present</SelectItem>
              <SelectItem value="absent">Absent</SelectItem>
              <SelectItem value="late">Late</SelectItem>
              <SelectItem value="partial">Partial Day</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="block mb-1 font-medium">Location</label>
          <Input
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Enter location"
          />
        </div>
      </div>

      <div className="flex gap-2 justify-end">
        <Button
          type="button"
          variant="outline"
          onClick={() => onClose()}
          disabled={loading}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? 'Submitting...' : attendance?.id ? 'Update' : 'Save'}
        </Button>
      </div>
    </form>
  );
};

export default AttendanceForm;
