"use client";

import React, { useEffect, useState } from "react";
import { useTranslations } from "@/hooks/use-translations";
import { useLanguage } from "@/providers/language-provider";
import { Input } from "@/components/ui/Input";;
import { Button } from "@/components/ui/button";
import { ProcessAutomationHeader } from "../components/ProcessAutomationHeader";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { CustomPagination } from "@/components/common/dashboard/Pagination";
import { GenericTable, TableColumn } from "@/components/common/GenericTable";
import workflowApi from "@/services/workforce/workflowService";
import { useRouter } from "next/navigation";
import { debounce } from 'lodash';

type WorkflowType = {
  workflow_id: number;
  workflow_code?: string;
  workflow_name_eng?: string;
  workflow_name_arb?: string;
  workflow_category_eng?: string;
  workflow_category_arb?: string;
  description?: string | null;
  is_active?: number | boolean;
  _count?: {
    workflow_type_steps: number; // Added count for workflow_type_steps
  };
};

export default function ProcessAutomationPage() {
  const { t } = useTranslations();
  const { currentLocale } = useLanguage();
  const router = useRouter();

  // Helper function to get localized workflow name
  const getLocalizedName = (workflow: WorkflowType) => {
    if (currentLocale === 'ar') {
      return workflow.workflow_name_arb || workflow.workflow_name_eng || '-';
    }
    return workflow.workflow_name_eng || workflow.workflow_name_arb || '-';
  };

  const [data, setData] = useState<WorkflowType[]>([]);
  const [selected, setSelected] = useState<number[]>([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [pageCount, setPageCount] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; type: "single" | "bulk" | null; id?: number }>({ open: false, type: null });

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const res = await workflowApi.getWorkflows({
        offset: page,
        limit: pageSize,
        search, // Pass search query to the API
      });
      let items: any = res?.data?.data ?? res?.data ?? [];

      // Normalize response to an array in common shapes
      if (!Array.isArray(items)) {
        if (items && Array.isArray(items.data)) items = items.data;
        else if (items && Array.isArray(items.rows)) items = items.rows;
        else if (items && Array.isArray(items.results)) items = items.results;
        else items = [];
      }

      const count = res?.data?.count ?? res?.data?.total ?? (Array.isArray(items) ? items.length : 0);
      setData(items);
      setPageCount(Math.max(1, Math.ceil((count || 0) / pageSize)));
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, pageSize]);

  const columns: TableColumn<WorkflowType>[] = [
    { key: "code", header: t("workflow.code") || "Code", accessor: (item) => item.workflow_code || "-", width: "w-40" },
    { key: "name", header: t("workflow.name") || "Name", accessor: (item) => getLocalizedName(item) },
    { key: "steps", header: t("workflow.steps") || "Steps", accessor: (item) => item._count?.workflow_type_steps || 0 }, // Add step count column
  ];

  const getItemId = (item: WorkflowType) => item.workflow_id;
  const getItemDisplayName = (item: WorkflowType) => getLocalizedName(item) || item.workflow_code || String(item.workflow_id);

  const selectItem = (id: number) => {
    setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const selectAll = () => {
    if (selected.length === data.length) setSelected([]);
    else setSelected(data.map((d) => getItemId(d)));
  };

  const handleEdit = (item: WorkflowType) => {
    router.push(`/leave-management/process-automation/edit/${item.workflow_id}`);
  };

  const handleDelete = (id?: number) => {
    setDeleteDialog({ open: true, type: id ? "single" : "bulk", id });
  };

  const confirmDelete = async () => {
    try {
      if (deleteDialog.type === "single" && deleteDialog.id) {
        await workflowApi.deleteWorkflow(deleteDialog.id);
      } else if (deleteDialog.type === "bulk" && selected.length > 0) {
        // call delete for each selected
        await Promise.all(selected.map((id) => workflowApi.deleteWorkflow(id)));
      }
      setDeleteDialog({ open: false, type: null });
      setSelected([]);
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const debouncedFetchData = debounce(fetchData, 300); // Debounce fetchData by 300ms

  const handleSearchChange = (value: string) => {
    setSearch(value);
    debouncedFetchData(); // Use debounced function for search
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-start">
      <div className="w-full relative">
        <div className="rounded-2xl border py-4 border-border bg-background/90 p-4">
          <ProcessAutomationHeader
            search={search}
            onSearchChange={handleSearchChange} // Pass debounced handler
            onAdd={() => router.push('/leave-management/process-automation/add')}
            selectedCount={selected.length}
            onDeleteSelected={() => handleDelete()}
          />

          <GenericTable
            data={data}
            columns={columns}
            selected={selected}
            page={page}
            pageSize={pageSize}
            allChecked={selected.length === data.length && data.length > 0}
            getItemId={getItemId}
            getItemDisplayName={getItemDisplayName}
            onSelectItem={selectItem}
            onSelectAll={selectAll}
            onEditItem={handleEdit}
            onDeleteItem={(id) => handleDelete(id)}
            noDataMessage={t("workflow.noData") || "No workflow types found"}
            isLoading={isLoading}
            onPageChange={(p) => setPage(p)}
            onPageSizeChange={(s) => setPageSize(s)}
          />

          <div className="mt-4">
            <CustomPagination currentPage={page} totalPages={pageCount} onPageChange={setPage} pageSize={pageSize} pageSizeOptions={[5,10,20,50]} onPageSizeChange={setPageSize} />
          </div>
        </div>
      </div>

      <Dialog open={deleteDialog.open} onOpenChange={(open) => !open && setDeleteDialog({ open: false, type: null })}>
        <DialogContent className="p-0">
          <DialogHeader className="p-2">
            <DialogTitle className="mb-1 p-2">{t("common.confirm") + " " + t("common.delete")}</DialogTitle>
            <div className="bg-black/5 p-4 rounded-lg dark:bg-white/5">
              <DialogDescription>
                {deleteDialog.type === "single" ? t("messages.confirm.delete") : t("messages.confirm.delete", { count: selected.length })}
              </DialogDescription>
              <div className="flex justify-end space-x-2 mt-4">
                <Button variant="outline" onClick={() => setDeleteDialog({ open: false, type: null })}>{t("common.cancel")}</Button>
                <Button variant="destructive" onClick={confirmDelete}>{t("common.delete")}</Button>
              </div>
            </div>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}
