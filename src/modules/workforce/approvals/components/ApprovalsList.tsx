"use client";

import React from "react";
import { GenericTable, TableColumn } from "@/components/common/GenericTable";
import { useTranslations } from "@/hooks/use-translations";
import apiClient from "@/configs/api/Axios";

interface Props {
  items: any[];
  selectedIds: number[];
  page: number;
  pageSize: number;
  total?: number;
  allChecked?: boolean;
  onSelectItem: (id: number) => void;
  onSelectAll: () => void;
  onEditItem?: (item: any) => void;
  onDeleteItem?: (id: number) => void;
  onProcessItem?: (id: number, action: "APPROVED" | "REJECTED") => void;
  isLoading?: boolean;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
  type?: "leaves" | "permissions";
}

export const ApprovalsList: React.FC<Props> = ({
  items,
  selectedIds,
  page,
  pageSize,
  total,
  allChecked,
  onSelectItem,
  onSelectAll,
  onEditItem,
  onDeleteItem,
  onProcessItem,
  isLoading,
  onPageChange,
  onPageSizeChange,
  type = "leaves",
}) => {
  console.log(
    "ApprovalsList - Type:",
    type,
    "Items:",
    items,
    "Length:",
    items?.length
  );
  const { t } = useTranslations();

  const getColumns = (): TableColumn<any>[] => {
    const baseColumns: TableColumn<any>[] = [
      {
        key: "employee",
        header: t("workforce.approvals.requesterName") || "Requester",
        accessor: (it) => {
          console.log("Employee Item:", it);
          if (it.raw?.employee_master) {
            const { firstname_eng, lastname_eng, firstname_arb, lastname_arb } =
              it.raw.employee_master;
            return (
              `${firstname_eng || ""} ${lastname_eng || ""}`.trim() ||
              `${firstname_arb || ""} ${lastname_arb || ""}`.trim()
            );
          }
          return it.employee_name || "-";
        },
      },
    ];

    if (type === "leaves") {
      baseColumns.push(
        {
          key: "leaveType",
          header: t("workforce.approvals.leaveType") || "Leave Type",
          accessor: (it) =>
            it.leave_type || it.raw?.leave_types?.leave_type_eng || "-",
        },
        {
          key: "dateRange",
          header: `${t("workforce.approvals.fromDate") || "From"} - ${
            t("workforce.approvals.toDate") || "To"
          }`,
          accessor: (it) => {
            const start = it.start_date
              ? new Date(it.start_date).toLocaleDateString()
              : "-";
            const end = it.end_date
              ? new Date(it.end_date).toLocaleDateString()
              : "-";
            return `${start} - ${end}`;
          },
        },
        {
          key: "status",
          header: t("workforce.approvals.status") || "Status",
          accessor: (it) => it.status || it.leave_status || "-",
        },
        {
          key: "document",
          header: t("workforce.approvals.document") || "Document",
          accessor: (it) => {
            const docPath =
              it.leave_doc_filename_path || it.raw?.leave_doc_filename_path;
            if (docPath) {
              return (
                <button
                  onClick={() => {
                    apiClient
                      .get(docPath, { responseType: "blob" })
                      .then((response) => {
                        const url = window.URL.createObjectURL(
                          new Blob([response.data])
                        );
                        const link = document.createElement("a");
                        link.href = url;
                        link.setAttribute(
                          "download",
                          docPath.split("/").pop() || "document"
                        );
                        document.body.appendChild(link);
                        link.click();
                        link.parentNode?.removeChild(link);
                      });
                  }}
                  className="px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  {t("workforce.approvals.download") || "Download"}
                </button>
              );
            }
            return "-";
          },
        }
      );
    } else if (type === "permissions") {
      baseColumns.push(
        {
          key: "permissionType",
          header: t("workforce.approvals.permissionType") || "Permission Type",
          accessor: (it) =>
            it.permission_type ||
            it.raw?.permission_types?.permission_type_eng ||
            "-",
        },
        {
          key: "dateRange",
            header: `${t("workforce.approvals.fromTime") || "From Time"} - ${t("workforce.approvals.toTime") || "To Time"}`,
            accessor: (it) => {
              const start = it.from_time ? new Date(it.from_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "-";
              const end = it.to_time ? new Date(it.to_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "-";
              return `${start} - ${end}`;
            },
        },
        {
          key: "status",
          header: t("workforce.approvals.status") || "Status",
          accessor: (it) => it.status || it.permission_status || "-",
        },
        {
          key: "reason",
          header: t("workforce.approvals.reason") || "Reason",
          accessor: (it) => it.reason || "-",
        }
      );
    }

    baseColumns.push({
      key: "created",
      header: t("workforce.approvals.approvalDate") || "Created",
      accessor: (it) =>
        it.created_date ? new Date(it.created_date).toLocaleString() : "-",
    });

    return baseColumns;
  };

  const columns = getColumns();

  return (
    <GenericTable<any>
      data={items}
      columns={columns}
      selected={selectedIds}
      page={page}
      pageSize={pageSize}
      allChecked={!!allChecked}
      getItemId={(it) => it.id}
      getItemDisplayName={(it) => {
        if (it.employee_name) return it.employee_name;
        if (it.employee_master) {
          const { firstname_eng, lastname_eng, firstname_arb, lastname_arb } =
            it.employee_master;
          return (
            `${firstname_eng || ""} ${lastname_eng || ""}`.trim() ||
            `${firstname_arb || ""} ${lastname_arb || ""}`.trim() ||
            `Item ${it.id}`
          );
        }
        return it.employee_name || `Item ${it.id}`;
      }}
      onSelectItem={(id) => onSelectItem(Number(id))}
      onSelectAll={onSelectAll}
      onEditItem={onEditItem as any}
      onDeleteItem={(id) => onDeleteItem && onDeleteItem(Number(id))}
      onPageChange={onPageChange ?? (() => {})}
      onPageSizeChange={onPageSizeChange ?? (() => {})}
      noDataMessage={
        t("workforce.approvals.noApprovalsFound") || "No items found"
      }
      isLoading={isLoading}
      showActions={!!onProcessItem}
      actions={(item: any) => (
        <div className="flex gap-2">
          {item.status === "PENDING" && onProcessItem && (
            <>
              <button
                onClick={() => onProcessItem(item.id, "APPROVED")}
                className="px-3 py-1 text-xs bg-green-600 text-white rounded"
              >
                {t("workforce.approvals.approve") || "Approve"}
              </button>
              <button
                onClick={() => onProcessItem(item.id, "REJECTED")}
                className="px-3 py-1 text-xs bg-red-600 text-white rounded"
              >
                {t("workforce.approvals.reject") || "Reject"}
              </button>
            </>
          )}
        </div>
      )}
    />
  );
};

export default ApprovalsList;
