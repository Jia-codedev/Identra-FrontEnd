"use client";

import React, { useState, useEffect } from "react";
import { useTranslations } from "@/hooks/use-translations";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/Input";
import { DatePicker } from "@/components/ui/date-picker";
import { TimeSelect } from "@/components/ui/time-select";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import permissionTypesApi from "@/services/leaveManagement/permissionTypes";
import { useUserId } from "@/store/userStore";
import usePermissionMutations from "../hooks/useMutations";

interface Props {
  permission?: any;
  onClose: (refresh?: boolean) => void;
}

const PermissionRequestForm: React.FC<Props> = ({ permission, onClose }) => {
  const { t } = useTranslations();
  const userId = useUserId();
  const mutations = usePermissionMutations();
  const [type, setType] = useState(permission?.permission_type_id?.toString() || "");
  const [permissionTypes, setPermissionTypes] = useState<any[]>([]);
  const [fromDate, setFromDate] = useState<Date | undefined>(
    permission?.from_date ? new Date(permission.from_date) : undefined
  );
  const [toDate, setToDate] = useState<Date | undefined>(
    permission?.to_date ? new Date(permission.to_date) : undefined
  );
  const [fromTime, setFromTime] = useState<string>(permission?.from_time || "");
  const [toTime, setToTime] = useState<string>(permission?.to_time || "");
  const [remarks, setRemarks] = useState(permission?.remarks || "");
  const [error, setError] = useState("");

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    if (!type) {
      setError("Please select a permission type");
      return;
    }
    
    if (!fromDate) {
      setError("Please select a from date");
      return;
    }
    
    if (!fromTime) {
      setError("Please select a from time");
      return;
    }
    
    if (!toTime) {
      setError("Please select a to time");
      return;
    }
    
    try {
      const permission_type_id = type ? Number(type) : undefined;
      const from_date = fromDate ? fromDate.toISOString().split("T")[0] : "";
      const to_date_value = toDate ? toDate.toISOString().split("T")[0] : from_date;
      
      const payload = {
        employee_id: userId,
        permission_type_id,
        from_date,
        to_date: to_date_value,
        from_time: fromTime,
        to_time: toTime,
        remarks,
      };

      if (permission?.id) {
        await mutations.update.mutateAsync({ id: permission.id, data: payload });
      } else {
        await mutations.create.mutateAsync(payload);
      }
      
      onClose(true);
    } catch (err: any) {
      setError(err?.message || "Failed to submit request");
    }
  };

  const isLoading = mutations.create.isPending || mutations.update.isPending;

  return (
    <DialogContent className="max-w-4xl">
      <DialogHeader>
        <DialogTitle>
          {permission?.id 
            ? t('leaveManagement.permissions.actions.edit')
            : t('leaveManagement.permissions.actions.add')
          }
        </DialogTitle>
      </DialogHeader>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}
        
        <div>
          <label className="block mb-1 font-medium">
            {t('leaveManagement.permissions.columns.type')} <span className="text-red-500">*</span>
          </label>
          <Select value={type} onValueChange={setType} required>
            <SelectTrigger className="w-full">
              <SelectValue placeholder={t('leaveManagement.permissions.columns.type')} />
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block mb-1 font-medium">
              {t('leaveManagement.permissions.columns.from')} <span className="text-red-500">*</span>
            </label>
            <DatePicker
              selected={fromDate}
              onSelect={setFromDate}
              placeholder="Select from date"
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">
              {t('leaveManagement.permissions.columns.to')}
            </label>
            <DatePicker
              selected={toDate}
              onSelect={setToDate}
              placeholder="Select to date"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block mb-1 font-medium">
              From Time <span className="text-red-500">*</span>
            </label>
            <TimeSelect
              value={fromTime}
              onChange={setFromTime}
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">
              To Time <span className="text-red-500">*</span>
            </label>
            <TimeSelect
              value={toTime}
              onChange={setToTime}
            />
          </div>
        </div>

        <div>
          <label className="block mb-1 font-medium">
            {t('leaveManagement.permissions.columns.remarks')}
          </label>
          <Input
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
            placeholder="Enter remarks"
            className="w-full"
          />
        </div>

        <div className="flex gap-2 justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={() => onClose()}
            disabled={isLoading}
          >
            {t('common.cancel')}
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? (t('common.saving') || 'Submitting...') : permission?.id ? t('common.update') : t('common.save')}
          </Button>
        </div>
      </form>
    </DialogContent>
  );
};

export default PermissionRequestForm;
