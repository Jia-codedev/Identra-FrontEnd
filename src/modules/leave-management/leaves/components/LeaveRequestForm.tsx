"use client";

import React, { useState, useEffect } from "react";
import { useTranslations } from "@/hooks/use-translations";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/Input";;
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
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
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [remarks, setRemarks] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [leaveTypes, setLeaveTypes] = useState<any[]>([]);

  useEffect(() => {
    // TODO: Replace with real API call for leave types
    setLeaveTypes([
      { leave_type_id: 1, leave_type_eng: "Annual Leave" },
      { leave_type_id: 2, leave_type_eng: "Sick Leave" },
      { leave_type_id: 3, leave_type_eng: "Casual Leave" },
    ]);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await employeeLeavesApi.add({
        employee_id: userId,
        leave_type_id: leaveType,
        from_date: from,
        to_date: to,
        remarks,
      });
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
        <DialogTitle>{t('leaveManagement.leaves.actions.add') || 'Add Leave Request'}</DialogTitle>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 font-medium">{t('leaveManagement.leaves.columns.type') || "Leave Type"}</label>
            <Select value={leaveType} onValueChange={setLeaveType} required>
              <SelectTrigger className="w-full">
                <SelectValue placeholder={t('leaveManagement.leaves.columns.type') || "Leave Type"} />
              </SelectTrigger>
              <SelectContent>
                {leaveTypes.map((lt) => (
                  <SelectItem key={lt.leave_type_id} value={String(lt.leave_type_id)}>
                    {lt.leave_type_eng}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex gap-2">
            <div className="flex-1">
              <label className="block mb-1 font-medium">{t('leaveManagement.leaves.columns.start') || "From"}</label>
              <Input type="datetime-local" value={from} onChange={e => setFrom(e.target.value)} required />
            </div>
            <div className="flex-1">
              <label className="block mb-1 font-medium">{t('leaveManagement.leaves.columns.end') || "To"}</label>
              <Input type="datetime-local" value={to} onChange={e => setTo(e.target.value)} required />
            </div>
          </div>
          <div>
            <label className="block mb-1 font-medium">{t('leaveManagement.leaves.columns.remarks') || "Remarks"}</label>
            <Input value={remarks} onChange={e => setRemarks(e.target.value)} />
          </div>
          {error && <div className="text-red-500 text-sm">{error}</div>}
          <div className="flex justify-end gap-2">
            <Button type="button" variant="secondary" onClick={onCancel} disabled={loading}>
              {t('common.cancel') || "Cancel"}
            </Button>
            <Button type="submit" variant="default" disabled={loading}>
              {t('common.save') || "Submit"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default LeaveRequestForm;
