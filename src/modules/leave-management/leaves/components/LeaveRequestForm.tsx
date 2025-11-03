"use client";

import React, { useState, useEffect } from "react";
import { DatePicker } from "@/components/ui/date-picker";
import { useTranslations } from "@/hooks/use-translations";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/Input";
import { TimePicker } from "@/components/ui/time-picker";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import employeeLeavesApi from "@/services/leaveManagement/employeeLeaves";
import { useUserId } from "@/store/userStore";

interface Props {
  open: boolean;
  onSuccess: () => void;
  onCancel: () => void;
}

const LeaveRequestForm: React.FC<Props> = ({ open, onSuccess, onCancel }) => {
  const { t } = useTranslations();
  const userId = useUserId();
  const [leaveType, setLeaveType] = useState("");
  const [fromDate, setFromDate] = useState<Date | undefined>(undefined);
  const [fromTime, setFromTime] = useState("");
  const [toDate, setToDate] = useState<Date | undefined>(undefined);
  const [toTime, setToTime] = useState("");
  const timeOptions = Array.from({ length: 24 * 4 }, (_, i) => {
    const h = Math.floor(i / 4)
      .toString()
      .padStart(2, "0");
    const m = ((i % 4) * 15).toString().padStart(2, "0");
    return `${h}:${m}`;
  });
  const [remarks, setRemarks] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [leaveTypes, setLeaveTypes] = useState<any[]>([]);
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    const fetchLeaveTypes = async () => {
      try {
        const res = await employeeLeavesApi.getLeaveTypes();
        setLeaveTypes(Array.isArray(res.data.data) ? res.data.data : []);
      } catch (err) {
        console.error("Error fetching leave types:", err);
        setLeaveTypes([]);
      }
    };
    fetchLeaveTypes();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const formData = new FormData();
      formData.append("employee_id", String(userId ?? ""));
      formData.append("leave_type_id", String(leaveType ?? ""));
      const formatDate = (date: Date | undefined) =>
        date
          ? `${date.getFullYear()}-${(date.getMonth() + 1)
              .toString()
              .padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")}`
          : "";
      const fromDateTime =
        fromDate && fromTime ? `${formatDate(fromDate)}T${fromTime}` : "";
      const toDateTime =
        toDate && toTime ? `${formatDate(toDate)}T${toTime}` : "";
      formData.append("from_date", fromDateTime);
      formData.append("to_date", toDateTime);
      formData.append("employee_remarks", String(remarks ?? ""));
      if (file) {
        formData.append("leave_doc", file);
      }
      await employeeLeavesApi.add(formData);
      onSuccess();
    } catch (err: any) {
      setError(err?.message || "Failed to submit request");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onCancel}>
      <DialogContent>
        <DialogTitle>
          {t("leaveManagement.leaves.actions.add") || "Add Leave Request"}
        </DialogTitle>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 font-medium">
              {t("leaveManagement.leaves.columns.type") || "Leave Type"}
            </label>
            <Select
              value={leaveType}
              onValueChange={setLeaveType}
              required
              disabled={leaveTypes.length === 0}
            >
              <SelectTrigger className="w-full">
                <SelectValue
                  placeholder={
                    t("leaveManagement.leaves.columns.type") || "Leave Type"
                  }
                />
              </SelectTrigger>
              <SelectContent>
                {leaveTypes.map((lt) => (
                  <SelectItem
                    key={lt.leave_type_id}
                    value={String(lt.leave_type_id)}
                  >
                    {lt.leave_type_eng || lt.leave_type_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {leaveTypes.length === 0 && (
              <div className="text-sm text-red-500 mt-1">
                No leave types found. Please contact admin.
              </div>
            )}
          </div>
          <div>
            <label className="block mb-1 font-medium">
              Upload Document (optional)
            </label>
            <input
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="block w-full p-2"
            />
          </div>
          {/* Approver field removed as approval is handled by backend */}
          <div className="flex gap-2">
            <div className="flex-1">
              <label className="block mb-1 font-medium">
                {t("leaveManagement.leaves.columns.start") || "From Date"}
              </label>
              <DatePicker
                selected={fromDate}
                onSelect={setFromDate}
                placeholder="Select date"
                disabled={false}
                className="w-full"
              />
              <label className="block mb-1 font-medium mt-2">From Time</label>
              <Select value={fromTime} onValueChange={setFromTime} required>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Time" />
                </SelectTrigger>
                <SelectContent>
                  {timeOptions.map((t) => (
                    <SelectItem key={t} value={t}>
                      {t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1">
              <label className="block mb-1 font-medium">
                {t("leaveManagement.leaves.columns.end") || "To Date"}
              </label>
              <DatePicker
                selected={toDate}
                onSelect={setToDate}
                placeholder="Select date"
                disabled={false}
                className="w-full"
              />
              <label className="block mb-1 font-medium mt-2">To Time</label>
              <Select value={toTime} onValueChange={setToTime} required>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Time" />
                </SelectTrigger>
                <SelectContent>
                  {timeOptions.map((t) => (
                    <SelectItem key={t} value={t}>
                      {t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div>
            <label className="block mb-1 font-medium">
              {t("leaveManagement.leaves.columns.remarks") || "Remarks"}
            </label>
            <Input
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
            />
          </div>
          {error && <div className="text-red-500 text-sm">{error}</div>}
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="secondary"
              onClick={onCancel}
              disabled={loading}
            >
              {t("common.cancel") || "Cancel"}
            </Button>
            <Button type="submit" variant="default" disabled={loading}>
              {t("common.save") || "Submit"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default LeaveRequestForm;
