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
import { toast } from "sonner";

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
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [leaveTypes, setLeaveTypes] = useState<any[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const resetForm = () => {
    setLeaveType("");
    setFromDate(undefined);
    setFromTime("");
    setToDate(undefined);
    setToTime("");
    setRemarks("");
    setFile(null);
    setError("");
    setFieldErrors({});
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

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
    setFieldErrors({});
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

      // Only append file if a valid file was selected
      if (file && file.size > 0) {
        formData.append("leave_doc", file);
      }

      const res = await employeeLeavesApi.add(formData);
      if (res.status === 400) {
        console.log("Response at 400:", res.data);
        toast.error(
          res?.data?.error[0]?.message ||
            "Failed to submit leave request. Please check your input."
        );
        return;
      }
      toast.success("Leave request submitted successfully!");
      resetForm();
      onSuccess();
    } catch (err: any) {
      const resp = err?.response?.data;
      if (resp) {
        if (Array.isArray(resp.error) && resp.error.length > 0) {
          const fieldErrs: Record<string, string> = {};
          resp.error.forEach((item: any) => {
            const path =
              Array.isArray(item.path) && item.path.length > 0
                ? item.path[0]
                : null;
            if (path) {
              fieldErrs[path] = item.message || item.msg || String(item);
            }
          });
          setFieldErrors(fieldErrs);
        }

        if (resp.message) {
          setError(resp.message);
        } else if (!Array.isArray(resp.error) || resp.error.length === 0) {
          setError(JSON.stringify(resp));
        }
      } else {
        setError(err?.message || "Failed to submit request");
      }
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
            {fieldErrors["leave_type_id"] && (
              <div className="text-sm text-red-500 mt-1">
                {fieldErrors["leave_type_id"]}
              </div>
            )}
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
              ref={fileInputRef}
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={(e) => {
                const selectedFile = e.target.files?.[0];
                if (selectedFile) {
                  // Validate file size (e.g., max 5MB)
                  const maxSize = 5 * 1024 * 1024; // 5MB
                  if (selectedFile.size > maxSize) {
                    toast.error("File size must be less than 5MB");
                    e.target.value = ""; // Clear the input
                    setFile(null);
                    return;
                  }
                  setFile(selectedFile);
                } else {
                  setFile(null);
                }
              }}
              className="block w-full p-2 border rounded"
            />
            {file && (
              <div className="text-sm text-green-600 mt-1">
                Selected: {file.name} ({(file.size / 1024).toFixed(2)} KB)
              </div>
            )}
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
              {fieldErrors["from_date"] && (
                <div className="text-sm text-red-500 mt-1">
                  {fieldErrors["from_date"]}
                </div>
              )}
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
              {fieldErrors["to_date"] && (
                <div className="text-sm text-red-500 mt-1">
                  {fieldErrors["to_date"]}
                </div>
              )}
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
              onClick={() => {
                resetForm();
                onCancel();
              }}
              disabled={loading}
            >
              {t("common.cancel") || "Cancel"}
            </Button>
            <Button type="submit" variant="default" disabled={loading}>
              {loading ? "Submitting..." : t("common.save") || "Submit"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default LeaveRequestForm;
