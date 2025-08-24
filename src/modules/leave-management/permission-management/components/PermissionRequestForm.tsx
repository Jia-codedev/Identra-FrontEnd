"use client";

import React, { useState, useEffect } from "react";
import { useTranslations } from "@/hooks/use-translations";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DatePicker } from "@/components/ui/date-picker";
import { TimeSelect } from "@/components/ui/time-select";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import permissionTypesApi from "@/services/leaveManagement/permissionTypes";
import { useUserId } from "@/store/userStore";
import employeeShortPermissionsApi from "@/services/leaveManagement/employeeShortPermissions";

interface Props {
  onSuccess: () => void;
  onCancel: () => void;
}

const PermissionRequestForm: React.FC<Props> = ({ onSuccess, onCancel }) => {
  const { t } = useTranslations();
  const userId = useUserId();
  const [type, setType] = useState("");
  const [permissionTypes, setPermissionTypes] = useState<any[]>([]);
  useEffect(() => {
    permissionTypesApi.getActive().then((res: any) => {
      console.log('Permission types API response:', res);
      let types = [];
      if (Array.isArray(res.data)) {
        types = res.data;
      } else if (res.data && Array.isArray(res.data.data)) {
        types = res.data.data;
      } else if (res.data && Array.isArray(res.data.result)) {
        types = res.data.result;
      }
      console.log('Processed permission types:', types);
      setPermissionTypes(types);
    });
  }, []);
  const [fromDate, setFromDate] = useState<Date | undefined>(undefined);
  const [fromTime, setFromTime] = useState<string>("");
  const [toTime, setToTime] = useState<string>("");
  const [remarks, setRemarks] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      // Prepare correct payload for API
      const permission_type_id = type ? Number(type) : undefined;
      const from_date = fromDate ? fromDate.toISOString().split("T")[0] : "";
      const to_date = from_date; // For time-based permission, to_date is same as from_date
      const from_time = fromTime;
      const to_time = toTime;
      await employeeShortPermissionsApi.add({
        employee_id: userId,
        permission_type_id,
        from_date,
        to_date,
        from_time,
        to_time,
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
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block mb-1 font-medium">{t('leaveManagement.permissions.columns.type') || "Permission Type"}</label>
        <Select value={type} onValueChange={setType} required>
          <SelectTrigger className="w-full">
            <SelectValue placeholder={t('leaveManagement.permissions.columns.type') || "Permission Type"} />
          </SelectTrigger>
          <SelectContent>
            {permissionTypes.map((pt) => (
              <SelectItem key={pt.permission_type_id} value={String(pt.permission_type_id)}>
                {pt.permission_type_eng || pt.permission_type_code}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="flex flex-col md:flex-row gap-4 w-full">
        <div className="md:w-1/2 w-full flex flex-col justify-between">
          <label className="block mb-1 font-medium">
            {t('leaveManagement.permissions.columns.date') !== 'leaveManagement.permissions.columns.date'
              ? t('leaveManagement.permissions.columns.date')
              : 'Date'}
          </label>
          <DatePicker
            selected={fromDate}
            onSelect={setFromDate}
            placeholder={t('leaveManagement.permissions.placeholders.date') !== 'leaveManagement.permissions.placeholders.date' ? t('leaveManagement.permissions.placeholders.date') : 'Select date'}
            className="w-full"
          />
        </div>
        <div className="md:w-1/2 w-full flex flex-col justify-between">
          <label className="block mb-1 font-medium">
            {t('leaveManagement.permissions.columns.time') !== 'leaveManagement.permissions.columns.time'
              ? t('leaveManagement.permissions.columns.time')
              : 'Time'}
          </label>
          <div className="flex flex-col sm:flex-row gap-2 w-full">
            <div className="flex-1 min-w-0">
              <span className="text-xs text-muted-foreground mb-1 block">
                {t('leaveManagement.permissions.columns.from') !== 'leaveManagement.permissions.columns.from'
                  ? t('leaveManagement.permissions.columns.from')
                  : 'From'}
              </span>
              <TimeSelect value={fromTime} onChange={setFromTime} className="w-full" />
            </div>
            <div className="flex-1 min-w-0">
              <span className="text-xs text-muted-foreground mb-1 block">
                {t('leaveManagement.permissions.columns.to') !== 'leaveManagement.permissions.columns.to'
                  ? t('leaveManagement.permissions.columns.to')
                  : 'To'}
              </span>
              <TimeSelect value={toTime} onChange={setToTime} className="w-full" />
            </div>
          </div>
        </div>
      </div>
      <div>
        <label className="block mb-1 font-medium">{t('leaveManagement.permissions.columns.remarks') || "Remarks"}</label>
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
  );
};

export default PermissionRequestForm;
