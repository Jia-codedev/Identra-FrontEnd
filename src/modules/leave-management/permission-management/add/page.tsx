"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "@/hooks/use-translations";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import permissionTypesApi from "@/services/leaveManagement/permissionTypes";
import employeeShortPermissionsApi from "@/services/leaveManagement/employeeShortPermissions";
import { useUserId } from "@/store/userStore";

export default function AddPermissionPage() {
  const { t } = useTranslations();
  const router = useRouter();
  const userId = useUserId();

  const [types, setTypes] = useState<any[]>([]);
  const [typeId, setTypeId] = useState<number | undefined>(undefined);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [remarks, setRemarks] = useState("");

  useEffect(() => {
    permissionTypesApi
      .getActive()
      .then((res) => setTypes(res.data || []))
      .catch(() => setTypes([]));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) {
      alert("User not logged in");
      return;
    }
    try {
      await employeeShortPermissionsApi.add({
        permission_type_id: typeId,
        employee_id: userId,
        from_date: fromDate,
        to_date: toDate,
        remarks,
      });
      router.push("/leave-management/permission-management");
    } catch (err) {
      alert("Failed to submit permission");
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">
        {t("leaveManagement.permissions.title") || "Add Permission"}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4 max-w-lg">
        <div>
          <label className="block text-sm font-medium">Permission Type</label>
          <select
            className="mt-1 block w-full"
            value={typeId}
            onChange={(e) => setTypeId(Number(e.target.value))}
          >
            <option value="">Select type</option>
            {types.map((ti) => (
              <option key={ti.permission_type_id} value={ti.permission_type_id}>
                {ti.permission_type_eng}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium">From</label>
          <Input
            type="datetime-local"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium">To</label>
          <Input
            type="datetime-local"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Remarks</label>
          <Input value={remarks} onChange={(e) => setRemarks(e.target.value)} />
        </div>

        <div className="flex gap-2">
          <Button type="submit">Submit</Button>
          <Button
            type="button"
            variant="secondary"
            onClick={() =>
              router.push("/leave-management/permission-management")
            }
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}
