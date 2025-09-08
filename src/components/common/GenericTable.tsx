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
import Loader from "./loader";

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
  selected: number[];
  page: number;
  pageSize: number;
  allChecked: boolean;
  getItemId: (item: T) => number;
  getItemDisplayName: (item: T, isRTL: boolean) => string;
  onSelectItem: (id: number) => void;
  onSelectAll: () => void;
  onEditItem?: (item: T) => void;
  onDeleteItem?: (id: number) => void;
  actions?: (item: T) => React.ReactNode;
  noDataMessage: string;
  isLoading?: boolean;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
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
  onPageChange,
  onPageSizeChange,
}: GenericTableProps<T>) {
  const { t } = useTranslations();
  const { isRTL } = useLanguage();

  if (data.length === 0) {
    return (
      <div className="overflow-x-auto rounded-b-3xl px-4">
        <div className="backdrop-blur-xl mt-4 bg-card/70 border border-border rounded-2xl overflow-hidden">
          {isLoading ? (
            <Loader />
          ) : (
            <div className="p-4 text-center text-muted-foreground">
              {noDataMessage}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto w-full grid grid-cols-1 rounded-b-3xl px-4">
      <div className="backdrop-blur-xl mt-4 bg-card/70 border border-border rounded-2xl overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow
              className={`bg-gradient-to-${isRTL ? "l" : "r"} from-primary/10 to-background/80 backdrop-blur-md`}
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
              { (onEditItem || onDeleteItem || actions) && (
                <TableHead className="w-32 text-center text-base font-bold text-primary drop-shadow-sm tracking-wide">
                  {t("common.actions")}
                </TableHead>
              ) }
            </TableRow>
          </TableHeader>
          <TableBody>
            <AnimatePresence>
              {data
                .filter((item) => item && getItemId(item) !== undefined && getItemId(item) !== null)
                .map((item, idx) => {
                  const itemId = getItemId(item);
                  const uniqueKey = `${itemId}-${idx}`; // Ensure unique key even with duplicate IDs
                  return (
                    <TableRow
                      key={uniqueKey}
                      className={
                        ((page - 1) * pageSize + idx) % 2 === 0
                          ? "bg-card/60 hover:bg-primary/10 transition-all border-b border-border"
                          : "bg-card/40 hover:bg-primary/10 transition-all border-b border-border"
                      }
                      style={{ backdropFilter: "blur(8px)" }}
                    >
                      <TableCell className="text-center">
                        <Checkbox
                          checked={selected.includes(itemId)}
                          onCheckedChange={() => onSelectItem(itemId)}
                          aria-label={`${t("common.select")} ${getItemDisplayName(item, isRTL)}`}
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
                      { (onEditItem || onDeleteItem || actions) && (
                        <TableCell
                          className={`text-center flex ${isRTL ? "flex-row-reverse" : "flex-row"
                            } gap-2 justify-center`}
                        >
                          {actions ? (
                            actions(item)
                          ) : (
                            <React.Fragment key={`actions-${itemId}`}>
                              {onEditItem && (
                                <Button
                                  key={`edit-${itemId}`}
                                  size="icon"
                                  variant="outline"
                                  className="p-2 rounded-full group cursor-pointer"
                                  onClick={() => onEditItem(item)}
                                  aria-label={t("common.edit")}
                                >
                                  <FiEdit2 className="text-primary group-hover:scale-110 transition-transform" />
                                </Button>
                              )}
                              {onDeleteItem && (
                                <Button
                                  key={`delete-${itemId}`}
                                  size="icon"
                                  variant="destructive"
                                  className="p-2 rounded-full group cursor-pointer"
                                  onClick={() => onDeleteItem(itemId)}
                                  aria-label={t("common.delete")}
                                >
                                  <FiTrash2 className="text-white group-hover:scale-110 transition-transform" />
                                </Button>
                              )}
                            </React.Fragment>
                          )}
                        </TableCell>
                      )}
                    </TableRow>
                  );
                })}
            </AnimatePresence>
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

