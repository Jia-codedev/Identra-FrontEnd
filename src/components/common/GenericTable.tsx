"use client";

import React from "react";
import { FiEdit2, FiTrash2 } from "react-icons/fi";
import { AnimatePresence } from "framer-motion";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/Table";
import { Checkbox } from "@/components/ui/Checkbox";
import { Button } from "@/components/ui/button";
import { useTranslations } from "@/hooks/use-translations";
import { useLanguage } from "@/providers/language-provider";
import { Skeleton } from "../ui/skeleton";

export interface TableColumn<T> {
  key: string;
  header: string;
  accessor: (item: T, isRTL: boolean) => React.ReactNode;
  width?: string;
  className?: string;
}

interface GenericTableProps<T> {
  data: T[];
  columns: TableColumn<T>[];
  selected: (number | string)[];
  page: number;
  pageSize: number;
  allChecked: boolean;
  getItemId: (item: T) => number | string;
  getItemDisplayName: (item: T, isRTL: boolean) => string;
  onSelectItem: (id: number | string) => void;
  onSelectAll: () => void;
  onEditItem?: (item: T) => void;
  onDeleteItem?: (id: number | string) => void;
  actions?: (item: T) => React.ReactNode;
  noDataMessage: string;
  isLoading?: boolean;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  showActions?: boolean;
  canDelete?: boolean;
  canEdit?: boolean;
}

export function GenericTable<T>({
  data,
  columns,
  selected,
  page,
  pageSize,
  allChecked,
  getItemId,
  getItemDisplayName,
  onSelectItem,
  onSelectAll,
  onEditItem,
  onDeleteItem,
  actions,
  noDataMessage,
  isLoading = false,
  showActions = true,
  canDelete = false,
  canEdit = false,
}: GenericTableProps<T>) {
  const { t } = useTranslations();
  const { isRTL } = useLanguage();
  // Show skeleton while loading irrespective of data length
  if (isLoading) {
    const skeletonRows = Array.from(
      { length: Math.max(3, Math.min(8, pageSize || 5)) },
      (_, i) => i
    );
    return (
      <div className="overflow-x-auto rounded-md">
        <div className="backdrop-blur-xl mt-4 bg-card/70 border border-border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow
                className={`bg-gradient-to-${
                  isRTL ? "l" : "r"
                } from-primary/10 to-background/80 backdrop-blur-md`}
              >
                <TableHead className="w-12 text-center">
                  <Checkbox
                    checked={allChecked}
                    onCheckedChange={onSelectAll}
                    aria-label={t("common.selectAll")}
                  />
                </TableHead>
                {columns.map((column) => (
                  <TableHead
                    key={column.key}
                    className={`text-base font-bold text-primary drop-shadow-sm tracking-wide ${
                      column.width || ""
                    } ${column.className || ""}`}
                  >
                    {column.header}
                  </TableHead>
                ))}
                {(onEditItem ||
                  onDeleteItem ||
                  actions ||
                  canEdit ||
                  canDelete) && (
                  <TableHead className="w-32 text-center text-base font-bold text-primary drop-shadow-sm tracking-wide">
                    {t("common.actions")}
                  </TableHead>
                )}
              </TableRow>
            </TableHeader>
            <TableBody className="oberflow-y-auto max-h-[60vh]">
              <AnimatePresence>
                {skeletonRows.map((idx) => (
                  <TableRow
                    key={`skeleton-${idx}`}
                    className={
                      ((page - 1) * (pageSize || 5) + idx) % 2 === 0
                        ? "bg-card/60"
                        : "bg-card/40"
                    }
                    style={{ backdropFilter: "blur(8px)" }}
                  >
                    <TableCell className="text-center">
                      <Skeleton className="h-4 w-4 rounded-sm mx-auto" />
                    </TableCell>
                    {columns.map((column) => (
                      <TableCell
                        key={`skeleton-cell-${column.key}-${idx}`}
                        className="text-foreground text-md drop-shadow-sm"
                      >
                        <Skeleton className="h-4 w-3/5" />
                      </TableCell>
                    ))}
                    {(onEditItem ||
                      onDeleteItem ||
                      actions ||
                      canDelete ||
                      canEdit) && (
                      <TableCell
                        className={`text-center flex ${
                          isRTL ? "flex-row-reverse" : "flex-row"
                        } gap-2 justify-center`}
                      >
                        <Skeleton className="h-8 w-8 rounded-full" />
                        {(onDeleteItem || canDelete) && (
                          <Skeleton className="h-8 w-8 rounded-full" />
                        )}
                      </TableCell>
                    )}
                  </TableRow>
                ))}
              </AnimatePresence>
            </TableBody>
          </Table>
        </div>
      </div>
    );
  }
  // When there's no data, show the table header and a single body row
  // that displays the `noDataMessage`. This keeps table layout consistent
  // while still informing the user that there's no data.

  return (
    <div className="overflow-x-auto w-full grid grid-cols-1 border rounded-md overflow-hidden">
      <div className="backdrop-blur-xl bg-card/70 rounded-md">
        <Table>
          <TableHeader>
            <TableRow
              className={`bg-gradient-to-${
                isRTL ? "l" : "r"
              } from-primary/10 to-background/80 backdrop-blur-md`}
            >
              <TableHead className="w-12 text-center">
                <Checkbox
                  checked={allChecked}
                  onCheckedChange={onSelectAll}
                  aria-label={t("common.selectAll")}
                />
              </TableHead>
              {columns.map((column) => (
                <TableHead
                  key={column.key}
                  className={`text-base font-bold text-primary drop-shadow-sm tracking-wide ${
                    column.width || ""
                  } ${column.className || ""}`}
                >
                  {column.header}
                </TableHead>
              ))}
              {(onEditItem ||
                onDeleteItem ||
                actions ||
                canEdit ||
                canDelete) && (
                <TableHead className="w-32 text-center text-base font-bold text-primary drop-shadow-sm tracking-wide">
                  {t("common.actions")}
                </TableHead>
              )}
            </TableRow>
          </TableHeader>
          <TableBody className="oberflow-y-auto max-h-[60vh]">
            <AnimatePresence>
              {data.length === 0 ? (
                <TableRow
                  key="empty-row"
                  className={"bg-card/40"}
                  style={{ backdropFilter: "blur(8px)" }}
                >
                  <TableCell
                    colSpan={
                      columns.length +
                      1 +
                      ((onEditItem || onDeleteItem || actions || canDelete || canEdit) ? 1 : 0)
                    }
                    className="text-center py-20 text-muted-foreground "
                  >
                    {noDataMessage}
                  </TableCell>
                </TableRow>
              ) : (
                data
                  .filter((item) => item && getItemId(item) !== undefined)
                  .map((item, idx) => {
                    const itemId = getItemId(item);
                    return (
                      <TableRow
                        key={itemId}
                        className={
                          ((page - 1) * pageSize + idx) % 2 === 0
                            ? "bg-card/60 hover:bg-primary/10 transition-all "
                            : "bg-card/40 hover:bg-primary/10 transition-all "
                        }
                        style={{ backdropFilter: "blur(8px)" }}
                      >
                        <TableCell className="text-center">
                          <Checkbox
                            checked={selected.includes(itemId)}
                            onCheckedChange={() => onSelectItem(itemId)}
                            aria-label={`${t(
                              "common.select"
                            )} ${getItemDisplayName(item, isRTL)}`}
                          />
                        </TableCell>
                        {columns.map((column) => (
                          <TableCell
                            key={column.key}
                            className="text-foreground text-md drop-shadow-sm"
                          >
                            {column.accessor(item, isRTL)}
                          </TableCell>
                        ))}
                        {(onEditItem ||
                          onDeleteItem ||
                          actions ||
                          canDelete ||
                          canEdit) && (
                          <TableCell
                            className={`text-center flex ${
                              isRTL ? "flex-row-reverse" : "flex-row"
                            } gap-2 justify-center`}
                          >
                            {actions && showActions ? (
                              actions(item)
                            ) : (
                              <>
                                {onEditItem && (
                                  <Button
                                    disabled={!canEdit}
                                    size="icon"
                                    variant="outline"
                                    className="p-2 rounded-full group cursor-pointer"
                                    onClick={() => {
                                      if (canEdit) onEditItem(item);
                                    }}
                                    aria-label={t("common.edit")}
                                    title={
                                      !canEdit
                                        ? t("common.permissionRequired")
                                        : t("common.edit")
                                    }
                                  >
                                    <FiEdit2 className="text-primary group-hover:scale-110 transition-transform" />
                                  </Button>
                                )}
                                {onDeleteItem && (
                                  <Button
                                    disabled={!canDelete}
                                    size="icon"
                                    variant="destructive"
                                    className="p-2 rounded-full group cursor-pointer"
                                    onClick={() => onDeleteItem(itemId)}
                                    aria-label={t("common.delete")}
                                    title={
                                      !canDelete
                                        ? t("common.permissionRequired")
                                        : t("common.delete")
                                    }
                                  >
                                    <FiTrash2 className="text-white group-hover:scale-110 transition-transform" />
                                  </Button>
                                )}
                              </>
                            )}
                          </TableCell>
                        )}
                      </TableRow>
                    );
                  })
              )}
            </AnimatePresence>
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
