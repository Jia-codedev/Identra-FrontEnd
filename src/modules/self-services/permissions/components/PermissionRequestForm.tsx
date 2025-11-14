"use client";

import React, { useState, useEffect } from "react";
import { useTranslations } from "@/hooks/use-translations";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/label";
import { DatePicker } from "@/components/ui/date-picker";
import { TimeSelect } from "@/components/ui/time-select";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/Textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import permissionTypesApi from "@/services/leaveManagement/permissionTypes";
import { useUserId } from "@/store/userStore";
import usePermissionMutations from "../hooks/useMutations";
import { IPermission } from "../types";

interface Props {
  permission?: IPermission | null;
  onClose: (refresh?: boolean) => void;
}

const PermissionRequestForm: React.FC<Props> = ({ permission, onClose }) => {
  const { t } = useTranslations();
  const userId = useUserId();
  const { createPermission, updatePermission } = usePermissionMutations();

  const [type, setType] = useState(
    permission?.permission_type_id?.toString() || ""
  );
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
      let types = [];
      if (Array.isArray(res.data)) {
        types = res.data.filter((pt: any) => pt.status_flag === true);
      } else if (res.data && Array.isArray(res.data.data)) {
        types = res.data.data.filter((pt: any) => pt.status_flag === true);
      }
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
      const to_date_value = toDate
        ? toDate.toISOString().split("T")[0]
        : from_date;

      const payload = {
        employee_id: userId,
        permission_type_id,
        from_date,
        to_date: to_date_value,
        from_time: fromTime,
        to_time: toTime,
        remarks,
      };

      if (permission?.employee_short_permission_id) {
        updatePermission.mutate({
          id: permission.employee_short_permission_id,
          permissionData: payload,
          onClose: () => onClose(true),
          search: "",
          pageSize: 10,
        });
      } else {
        createPermission.mutate({
          permissionData: payload,
          onClose: () => onClose(true),
          search: "",
          pageSize: 10,
        });
      }
    } catch (err: any) {
      setError(err?.message || "Failed to submit request");
    }
  };

  const isLoading = createPermission.isPending || updatePermission.isPending;

  return (
    <Dialog open={true} onOpenChange={() => onClose()}>
      <DialogContent className="max-w-4xl w-full p-0 bg-background rounded-xl shadow-2xl border border-border">
        <div className="w-full p-4">
          <div className="flex items-center justify-between mb-6 px-2">
            <DialogTitle className="text-xl font-semibold text-foreground">
              {permission?.employee_short_permission_id
                ? t("leaveManagement.permissions.actions.edit") ||
                  "Edit Permission"
                : t("leaveManagement.permissions.actions.add") ||
                  "Add Permission"}
            </DialogTitle>
          </div>

          <ScrollArea className="max-h-[60vh] w-full">
            <div className="p-2">
              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded">
                    {error}
                  </div>
                )}

                <div>
                  <Label
                    htmlFor="permission_type"
                    className="block mb-2 font-medium text-sm"
                  >
                    {t("leaveManagement.permissions.columns.type") ||
                      "Permission Type"}{" "}
                    <span className="text-red-500">*</span>
                  </Label>
                  <Select value={type} onValueChange={setType} required>
                    <SelectTrigger className="w-full">
                      <SelectValue
                        placeholder={
                          t("leaveManagement.permissions.columns.type") ||
                          "Select Type"
                        }
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {permissionTypes.map((pt) => (
                        <SelectItem
                          key={pt.permission_type_id}
                          value={String(pt.permission_type_id)}
                        >
                          {pt.permission_type_eng || pt.permission_type_code}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label
                      htmlFor="from_date"
                      className="block mb-2 font-medium text-sm"
                    >
                      {t("leaveManagement.permissions.columns.from") ||
                        "From Date"}{" "}
                      <span className="text-red-500">*</span>
                    </Label>
                    <DatePicker
                      selected={fromDate}
                      onSelect={setFromDate}
                      placeholder="Select from date"
                    />
                  </div>
                  <div>
                    <Label
                      htmlFor="to_date"
                      className="block mb-2 font-medium text-sm"
                    >
                      {t("leaveManagement.permissions.columns.to") || "To Date"}
                    </Label>
                    <DatePicker
                      selected={toDate}
                      onSelect={setToDate}
                      placeholder="Select to date (optional)"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label
                      htmlFor="from_time"
                      className="block mb-2 font-medium text-sm"
                    >
                      From Time <span className="text-red-500">*</span>
                    </Label>
                    <TimeSelect value={fromTime} onChange={setFromTime} />
                  </div>
                  <div>
                    <Label
                      htmlFor="to_time"
                      className="block mb-2 font-medium text-sm"
                    >
                      To Time <span className="text-red-500">*</span>
                    </Label>
                    <TimeSelect value={toTime} onChange={setToTime} />
                  </div>
                </div>

                <div>
                  <Label
                    htmlFor="remarks"
                    className="block mb-2 font-medium text-sm"
                  >
                    {t("leaveManagement.permissions.columns.remarks") ||
                      "Remarks"}
                  </Label>
                  <Textarea
                    id="remarks"
                    value={remarks}
                    onChange={(e) => setRemarks(e.target.value)}
                    placeholder="Enter remarks (optional)"
                    className="w-full min-h-[80px]"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => onClose()}
                    disabled={isLoading}
                    className="flex-1"
                  >
                    {t("common.cancel") || "Cancel"}
                  </Button>
                  <Button type="submit" disabled={isLoading} className="flex-1">
                    {isLoading
                      ? t("common.saving") || "Submitting..."
                      : permission?.employee_short_permission_id
                      ? t("common.update") || "Update"
                      : t("common.save") || "Save"}
                  </Button>
                </div>
              </form>
            </div>
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PermissionRequestForm;
