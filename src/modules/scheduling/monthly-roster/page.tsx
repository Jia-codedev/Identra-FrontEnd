"use client";

import React, { useEffect, useState } from "react";
import { MonthlyRosterHeader } from "./components/MonthlyRosterHeader";
import { MonthlyRosterTable } from "./components/MonthlyRosterTable";
import { MonthlyRosterAddModal } from "./components/MonthlyRosterAddModal";
import { useMonthlyRosterMutations } from "./hooks/useMutations";
import { toast } from "sonner";
import { useMonthlyRosterState } from "./hooks/useMonthlyRosterState";
import employeeMonthlyRosterApi from "@/services/scheduling/employeeMonthlyRoster";
import { CustomPagination } from "@/components/common/dashboard/Pagination";
import { useUserId } from "@/store/userStore";
import { useTranslations } from "@/hooks/use-translations";
import { MonthlyRosterRow } from "./types";

export default function MonthlyRosterPage() {
  const { t } = useTranslations();
  
  const {
    page,
    setPage,
    pageSize,
    setPageSize,
    filters,
    onFiltersChange,
  } = useMonthlyRosterState();

  const [data, setData] = useState<MonthlyRosterRow[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingRoster, setEditingRoster] = useState<any | null>(null);

  const { createMutation, finalizeMutation, deleteMutation, editMutation } =
    useMonthlyRosterMutations();
  const currentUserId = useUserId();

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const baseParams: any = {
        organization_id: filters.organization_id,
        employee_group_id: filters.employee_group_id,
        employee_id: filters.employee_id,
        manager_id: filters.manager_id,
        schedule_id: filters.schedule_id,
        finalize_flag: filters.finalize_flag,
        limit: pageSize,
        offset: (page - 1) * pageSize,
        orderBy: "created_date desc",
      };

      let resp: any;
      if (filters.month && filters.year) {
        const params = {
          ...baseParams,
          month: filters.month,
          year: filters.year,
        };
        resp = await employeeMonthlyRosterApi.filter({ ...params });
      } else {
        resp = await employeeMonthlyRosterApi.getAll(baseParams);
      }
      
      const payload = resp?.data ?? resp;
      let items: any[] | undefined;
      let totalCount: number | undefined;
      
      if (Array.isArray(payload)) {
        items = payload as any[];
      } else if (payload && Array.isArray(payload.data)) {
        items = payload.data;
        totalCount = payload.total;
      } else if (payload && payload.success && Array.isArray(payload.data)) {
        items = payload.data;
        totalCount = payload.total;
      } else {
        console.warn("Unexpected monthly roster response shape:", payload);
      }

      if (items) {
        setData(items);
        setTotal(
          typeof totalCount === "number" ? totalCount : items.length || 0
        );
      } else {
        console.warn(
          "Monthly roster: no items found in response, keeping existing data"
        );
      }
    } catch (e) {
      console.error("Failed to fetch monthly roster:", e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [filters, page, pageSize]);

  const handleFinalize = async (row: MonthlyRosterRow) => {
    try {
      await finalizeMutation.mutateAsync(row.schedule_roster_id);
      toast.success(
        t("scheduling.monthlyRoster.table.finalized") || "Finalized"
      );
      setPage(1);
      await fetchData();
    } catch (e) {
      toast.error(
        t("scheduling.monthlyRoster.table.finalizeFailed") ||
          "Failed to finalize"
      );
    }
  };

  const handleDelete = async (row: MonthlyRosterRow) => {
    try {
      await deleteMutation.mutateAsync(row.schedule_roster_id);
      toast.success(t("toast.success.monthlyRoasterDeleted") || "Deleted");
      setPage(1);
      await fetchData();
    } catch (e) {
      toast.error(
        t("toast.error.monthlyRoasterDeleteError") || "Failed to delete"
      );
    }
  };

  const handleEdit = (row: MonthlyRosterRow) => {
    setEditingRoster(row);
    setIsAddModalOpen(true);
  };

  return (
    <div className="p-6 space-y-4">
      <MonthlyRosterHeader
        filters={filters}
        onFiltersChange={onFiltersChange}
        onAddRoster={() => {
          setIsAddModalOpen(true);
        }}
        selectedIds={[]}
      />
      
      <MonthlyRosterTable
        data={data}
        isLoading={isLoading}
        onEdit={handleEdit}
        onFinalize={handleFinalize}
        onDelete={handleDelete}
      />

      {/* Pagination */}
      <CustomPagination
        currentPage={page}
        totalPages={Math.max(1, Math.ceil(total / pageSize))}
        onPageChange={(p) => setPage(p)}
        pageSize={pageSize}
        pageSizeOptions={[10, 20, 50, 100]}
        onPageSizeChange={(s) => {
          setPageSize(s);
          setPage(1);
        }}
      />

      {/* Add/Edit Modal */}
      <MonthlyRosterAddModal
        isOpen={isAddModalOpen}
        initialData={editingRoster || null}
        onClose={() => {
          setIsAddModalOpen(false);
          setEditingRoster(null);
        }}
        onSubmit={async (payload: any) => {
          try {
            if (editingRoster) {
              await editMutation.mutateAsync({
                id: editingRoster.schedule_roster_id,
                data: { ...payload, user_id: currentUserId },
              });
              toast.success("Monthly roster updated");
            } else {
              await createMutation.mutateAsync({
                ...payload,
                user_id: currentUserId,
              });
              toast.success("Monthly roster created");
            }
            setIsAddModalOpen(false);
            setEditingRoster(null);
            await fetchData();
          } catch (err) {
            toast.error("Failed to save roster");
          }
        }}
        isLoading={
          Boolean((createMutation as any).isLoading) ||
          Boolean((editMutation as any).isLoading)
        }
      />
    </div>
  );
}
