"use client";

import React, { useState } from "react";
import { useTranslations } from "@/hooks/use-translations";
import { LeavesHeader } from "./components/LeavesHeader";
// import { GenericTable, TableColumn } from "@/components/common/GenericTable";
import LeavesList from "./components/LeavesList";
import LeaveRequestForm from "./components/LeaveRequestForm";
import { Dialog } from "@/components/ui/dialog";
import { CustomPagination } from "@/components/common/dashboard/Pagination";
import { useRouter } from "next/navigation";

import { debounce } from 'lodash';
import useLeaves from './hooks/useLeaves';
import employeeLeavesApi from '@/services/leaveManagement/employeeLeaves';
import { format, parseISO } from 'date-fns';
// approval/rejection flow removed for this view

type LeaveType = {
  id: number;
  employee_name?: string;
  leave_type?: string;
  start_date?: string;
  end_date?: string;
  status?: string;
  raw?: any;
};

export default function LeavesPage() {
  const { t } = useTranslations();
  const router = useRouter();

  const {
  leaves: data,
  isLoading,
    page,
    pageSize,
    pageCount,
    setPage,
    setPageSize,
    search,
    setSearch,
    selected,
    selectItem,
    selectAll,
    refetch,
  } = useLeaves();
  // Helper to format date/time
  const formatDateTime = (dt?: string) => {
    if (!dt) return "-";
    try {
      return format(parseISO(dt), "dd MMM yyyy, hh:mm a");
    } catch {
      return dt;
    }
  };


  const getItemId = (item: LeaveType) => item.id;
  const getItemDisplayName = (item: LeaveType) => item.employee_name || String(item.id);


  const debouncedSetSearch = debounce((v: string) => setSearch(v), 300);
  const handleSearchChange = (value: string) => {
    debouncedSetSearch(value);
  };

  const [showDialog, setShowDialog] = useState(false);
  const handleAdd = () => setShowDialog(true);
  const handleDialogClose = (refresh = false) => {
    setShowDialog(false);
    if (refresh) refetch();
  };


  return (
    <div className="w-full h-full flex flex-col items-center justify-start">
      <div className="w-full relative">
        <div className="rounded-2xl border py-4 border-border bg-background/90 p-4">

          <LeavesHeader
            search={search}
            onSearchChange={handleSearchChange}
            onAdd={handleAdd}
            selectedCount={selected.length}
          />

          <Dialog open={showDialog} onOpenChange={setShowDialog}>
            <LeaveRequestForm open={showDialog} onSuccess={() => handleDialogClose(true)} onCancel={() => handleDialogClose(false)} />
          </Dialog>

          <div className="w-full mt-4">
            <LeavesList leaves={data} loading={isLoading} />
          </div>

          <div className="mt-4">
            <CustomPagination currentPage={page} totalPages={pageCount} onPageChange={setPage} pageSize={pageSize} pageSizeOptions={[5,10,20,50]} onPageSizeChange={setPageSize} />
          </div>
        </div>
      </div>
      {/* approval modal removed */}
    </div>
  );
}
