"use client";
import React, { useState } from "react";
import { useTranslations } from "@/hooks/use-translations";
import { useDeptAdmins } from "../hooks/useDeptAdmins";
import DeptAdminsHeader from "../components/DeptAdminsHeader";
import DeptAdminsTable from "../components/DeptAdminsTable";
import DeptAdminModal from "../components/DeptAdminModal";
import { useDeptAdminMutations } from "../hooks/useMutations";
import { IDepartmentAdmin } from "../types";
import { CustomPagination } from "@/components/common/dashboard/Pagination";

export default function DeptAdminsPage() {
  const { t } = useTranslations();
  const {
    items,
    selected,
    search,
    page,
    pageSize,
    pageCount,
    isLoading,
    allChecked,
    setSearch,
    setPage,
    setPageSize,
    selectItem,
    selectAll,
    clearSelection,
  } = useDeptAdmins();

  const {
    createDeptAdmin,
    updateDeptAdmin,
    deleteDeptAdmin,
    deleteDeptAdmins,
  } = useDeptAdminMutations();
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"add" | "edit">("add");
  const [editing, setEditing] = useState<IDepartmentAdmin | null>(null);

  const handleAdd = () => {
    setModalMode("add");
    setEditing(null);
    setModalOpen(true);
  };

  const handleEdit = (item: IDepartmentAdmin) => {
    setModalMode("edit");
    setEditing(item);
    setModalOpen(true);
  };

  const handleSave = (data: Partial<IDepartmentAdmin>) => {
    if (modalMode === "add") {
      createDeptAdmin({
        deptAdminData: data,
        onClose: () => setModalOpen(false),
        search,
        pageSize,
      });
    } else if (modalMode === "edit" && editing && editing.dept_admin_id) {
      updateDeptAdmin({
        id: Number(editing.dept_admin_id),
        deptAdminData: data,
        onClose: () => setModalOpen(false),
        search,
        pageSize,
      });
    }
  };

  const handleDelete = (id: number) => {
    deleteDeptAdmin(id);
  };

  const handleDeleteSelected = () => {
    if (selected && selected.length > 0) deleteDeptAdmins(selected as number[]);
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">
        {t("masterData.deptAdmins.title") || "Dept Admins"}
      </h1>
      <DeptAdminsHeader
        search={search}
        setSearch={setSearch}
        onAdd={handleAdd}
        selectedCount={selected.length}
        onDeleteSelected={handleDeleteSelected}
      />
      <div className="overflow-x-auto">
        <DeptAdminsTable
          data={items}
          selected={selected}
          page={page}
          pageSize={pageSize}
          allChecked={allChecked}
          getItemId={(it) => it.dept_admin_id}
          getItemDisplayName={(it) => String(it.employee_id || "")}
          onSelectItem={selectItem}
          onSelectAll={selectAll}
          onEditItem={handleEdit}
          onDeleteItem={(id: number) => handleDelete(Number(id))}
          noDataMessage={
            t("masterData.deptAdmins.noData") || "No dept admins found"
          }
          isLoading={isLoading}
          onPageChange={setPage}
          onPageSizeChange={setPageSize}
        />
      </div>
      <CustomPagination
        currentPage={page}
        onPageChange={setPage}
        onPageSizeChange={setPageSize}
        pageSize={pageSize}
        pageSizeOptions={[5, 10, 20, 50]}
        totalPages={pageCount}
        key={page}
      />

      <DeptAdminModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
        deptAdmin={editing}
        mode={modalMode}
      />
    </div>
  );
}
