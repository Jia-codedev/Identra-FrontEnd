"use client";
"use client";

import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MonthlyRosterHeader } from "./components/MonthlyRosterHeader";
import { MonthlyRosterAddModal } from "./components/MonthlyRosterAddModal";
import { useMonthlyRosterMutations } from "./hooks/useMutations";
import { toast } from "sonner";
import { useMonthlyRosterState } from "./hooks/useMonthlyRosterState";
import employeeMonthlyRosterApi from "@/services/scheduling/employeeMonthlyRoster";
import { GenericTable, TableColumn } from "@/components/common/GenericTable";
import schedulesApi from "@/services/scheduling/schedules";
import { Moon, Clock, Star } from "lucide-react";
import { CustomPagination } from "@/components/common/dashboard/Pagination";
import { useUserId } from "@/store/userStore";
import { useTranslations } from '@/hooks/use-translations';

export default function MonthlyRosterPage() {
  const { t } = useTranslations();
  const [allSchedules, setAllSchedules] = useState<any[]>([]);
  const [assigning, setAssigning] = useState(false);
  // Fetch all schedules for dropdown
  useEffect(() => {
    async function fetchSchedules() {
      try {
        const res = await schedulesApi.getSchedules();
        setAllSchedules(res?.data?.data || []);
      } catch {}
    }
    fetchSchedules();
  }, []);
  const {
    selected,
    page,
    setPage,
    pageSize,
    setPageSize,
    filters,
    onFiltersChange,
    selectMonthlyRoster,
    selectAll,
    allChecked,
    setSelected,
  } = useMonthlyRosterState();

  // Do not auto-set month/year on mount — initial view should show all records without filters

  // Try to auto-select first organization if not set
  // Previously we attempted to auto-select the first organization when none was set.
  // That caused the page to fetch again and sometimes hide records returned for the month/year without an organization filter.
  // To avoid unexpected hiding of data, we do not auto-select an organization anymore.

  const [data, setData] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingRoster, setEditingRoster] = useState<any | null>(null);
  const [scheduleMap, setScheduleMap] = useState<
    Record<
      number,
      {
        code: string;
        color?: string;
        open_shift_flag?: boolean;
        night_shift_flag?: boolean;
        ramadan_flag?: boolean;
      }
    >
  >({});

  // Helper: choose readable text color (black/white) for a given hex background
  const getContrastColor = (hex?: string) => {
    if (!hex) return "#fff";
    try {
      let r = 0,
        g = 0,
        b = 0;
      if (hex.startsWith("rgb")) {
        const parts = hex
          .replace(/rgba?\(|\)/g, "")
          .split(",")
          .map((p) => Number(p.trim()));
        [r, g, b] = parts;
      } else {
        const v = hex.replace("#", "");
        if (v.length === 3) {
          r = parseInt(v[0] + v[0], 16);
          g = parseInt(v[1] + v[1], 16);
          b = parseInt(v[2] + v[2], 16);
        } else {
          r = parseInt(v.substring(0, 2), 16);
          g = parseInt(v.substring(2, 4), 16);
          b = parseInt(v.substring(4, 6), 16);
        }
      }
      const lum = 0.2126 * r + 0.7152 * g + 0.0722 * b;
      return lum > 160 ? "#000" : "#fff";
    } catch (e) {
      return "#fff";
    }
  };
  const [editCell, setEditCell] = useState<{
    rowId: number;
    day: number;
  } | null>(null);
  const [assignSelection, setAssignSelection] = useState<string | undefined>(
    undefined
  );
  // Fetch all unique schedule IDs in the data and cache their code/color (robust to HTML/non-JSON responses)
  useEffect(() => {
    const ids = new Set<number>();
    for (const row of data) {
      for (let i = 1; i <= 31; i++) {
        const val = row[`D${i}`];
        if (typeof val === "number" && !scheduleMap[val]) ids.add(val);
      }
    }
    const toFetch = Array.from(ids);
    if (toFetch.length === 0) return;
    let mounted = true;

    const safeGetSchedule = async (id: number) => {
      try {
        const sresp = await schedulesApi.getScheduleById(id);
        const payload = sresp?.data ?? sresp;
        if (!payload) return { id, code: `SCH-${id}`, color: "#999" };
        if (typeof payload === "string") {
          console.warn(`Schedule ${id} returned non-JSON response`);
          return { id, code: `SCH-${id}`, color: "#999" };
        }
        const result = Array.isArray(payload)
          ? payload[0]
          : payload.data ?? payload;
        if (result && (result.schedule_code || result.code || result.id))
          return result;
        return { id, code: `SCH-${id}`, color: "#999" };
      } catch (err) {
        console.warn("Failed to fetch schedule", id, err);
        return { id, code: `SCH-${id}`, color: "#999" };
      }
    };

    (async () => {
      try {
        const next: Record<number, { code: string; color?: string } & any> = {};
        await Promise.all(
          toFetch.map(async (id) => {
            const s = await safeGetSchedule(id);
            if (!mounted) return;
            // normalize keys
            const code = s.schedule_code ?? s.code ?? `SCH-${id}`;
            const color = s.sch_color ?? s.color ?? "#999";
            const open_shift_flag =
              s.open_shift_flag ?? s.open_shift ?? s.openShift ?? false;
            const night_shift_flag =
              s.night_shift_flag ?? s.night_shift ?? s.nightShift ?? false;
            const ramadan_flag =
              s.ramadan_flag ?? s.ramadan ?? s.ramadanFlag ?? false;
            next[id] = {
              code,
              color,
              open_shift_flag,
              night_shift_flag,
              ramadan_flag,
            };
          })
        );
        if (mounted && Object.keys(next).length) {
          setScheduleMap((prev) => ({ ...prev, ...next }));
        }
      } catch (err) {
        console.warn("Error populating scheduleMap", err);
      }
    })();

    return () => {
      mounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  const { createMutation, finalizeMutation, deleteMutation, editMutation } =
    useMonthlyRosterMutations();
  const currentUserId = useUserId();

  // Compute whether all visible rows are selected (use data length, not pageSize)
  const allCheckedLocal =
    selected.length > 0 && selected.length === data.length;

  // Centralized fetch function so we can call it after mutations
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
      // If month/year provided, prefer filter endpoint (handles overlap logic)
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

  useEffect(() => {
    if (!editCell) {
      setAssignSelection(undefined);
      return;
    }
    const row = data.find((r) => r.schedule_roster_id === editCell.rowId);
    if (!row) {
      setAssignSelection(undefined);
      return;
    }
    const val = row[`D${editCell.day}`];
    setAssignSelection(typeof val === "number" ? String(val) : undefined);
  }, [editCell, data]);

  const handleFinalize = async (row: any) => {
    try {
      await finalizeMutation.mutateAsync(row.schedule_roster_id);
      toast.success(t('scheduling.monthlyRoster.table.finalized') || 'Finalized');
      setPage(1); // reload first page
      await fetchData();
    } catch (e) {
      toast.error(t('scheduling.monthlyRoster.table.finalizeFailed') || 'Failed to finalize');
    }
  };

  const handleDelete = async (row: any) => {
    try {
      await deleteMutation.mutateAsync(row.schedule_roster_id);
      toast.success(t('messages.success.deleted') || 'Deleted');
      setPage(1);
      await fetchData();
    } catch (e) {
      toast.error(t('messages.error.delete') || 'Failed to delete');
    }
  };

  // Table columns for GenericTable
  const columns: TableColumn<any>[] = [
    {
      key: "emp_no",
      header: "Emp No",
      accessor: (row: any) => row.emp_no || "-",
    },
    {
      key: "employee_name",
      header: "Name",
      accessor: (row: any, isRTL: boolean) =>
        isRTL
          ? row.employee_name_arb || row.employee_name
          : row.employee_name || row.employee_name_arb,
    },
    {
      key: "from_date",
      header: "From",
      accessor: (row: any) => row.from_date?.slice(0, 10),
    },
    {
      key: "to_date",
      header: "To",
      accessor: (row: any) => row.to_date?.slice(0, 10),
    },
    {
      key: "version_no",
      header: "Version",
      accessor: (row: any) => row.version_no,
    },
    {
      key: "finalize_flag",
      header: "Finalized",
      accessor: (row: any) => (row.finalize_flag ? "Yes" : "No"),
    },
    ...Array.from({ length: 31 }, (_, i) => ({
      key: `D${i + 1}`,
      header: `${i + 1}`,
      accessor: (row: any) => {
        const scheduleId = row[`D${i + 1}`];
        if (typeof scheduleId === "number" && scheduleMap[scheduleId]) {
          const {
            code,
            color,
            open_shift_flag,
            night_shift_flag,
            ramadan_flag,
          } = scheduleMap[scheduleId];
          const shiftLabel = ramadan_flag
            ? "Ramadan"
            : night_shift_flag
            ? "Night"
            : open_shift_flag
            ? "Open"
            : "Day";
          const bg = color || "#999";
          const textColor = getContrastColor(
            bg.replace(/^rgb\(|\)$/g, "").startsWith("#") ? bg : bg
          );
          return (
            <button
              type="button"
              onClick={() =>
                setEditCell({ rowId: row.schedule_roster_id, day: i + 1 })
              }
              className="w-full h-8 flex items-center justify-center rounded text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-1"
              style={{ backgroundColor: bg, color: textColor }}
            >
              <span className="text-[12px]">{shiftLabel}</span>
            </button>
          );
        }
        // If scheduleId exists but we don't have details yet, show a small fallback label
        if (typeof scheduleId === "number") {
          return (
            <div className="w-full h-8 flex items-center justify-center rounded bg-muted/40 text-sm">
              <div className="flex items-center gap-2">
                <span className="text-[12px] text-muted-foreground">{`#${scheduleId}`}</span>
                <button
                  className="text-[12px] px-2 py-0.5 rounded bg-muted hover:bg-primary/10 border border-dashed border-primary text-primary"
                  onClick={() =>
                    setEditCell({ rowId: row.schedule_roster_id, day: i + 1 })
                  }
                  type="button"
                >
                  Change
                </button>
              </div>
            </div>
          );
        }
        // No schedule assigned: show a button to assign
        return (
          <div className="w-full h-8 flex items-center justify-center border-dashed border-muted/30 bg-muted/10">
            <button
              className="text-[12px] px-2 py-0.5 rounded bg-transparent text-primary"
              onClick={() =>
                setEditCell({ rowId: row.schedule_roster_id, day: i + 1 })
              }
              type="button"
            >
              + Assign
            </button>
          </div>
        );
      },
      width: "60px",
    })),
  ];

  // Assign Modal handler and UI (moved outside columns accessor)
  const handleAssign = async (scheduleId: number) => {
    if (!editCell) return;
    setAssigning(true);
    try {
      const update: any = {};
      update[`D${editCell.day}`] = scheduleId;
      await editMutation.mutateAsync({ id: editCell.rowId, data: update });
      setEditCell(null);
      setAssigning(false);
      await fetchData();
      toast.success("Schedule assigned");
    } catch (e) {
      toast.error("Failed to assign schedule");
      setAssigning(false);
    }
  };

  return (
    <div className="p-6 space-y-4">
      <MonthlyRosterHeader
        filters={filters}
        onFiltersChange={onFiltersChange}
        onAddRoster={() => {
          setIsAddModalOpen(true);
        }}
        selectedIds={selected}
      />
      <GenericTable
        data={data}
        columns={columns}
        selected={selected}
        page={page}
        pageSize={pageSize}
        allChecked={allCheckedLocal}
        getItemId={(row) => row.schedule_roster_id}
        getItemDisplayName={(row, isRTL) =>
          isRTL
            ? row.employee_name_arb || row.employee_name
            : row.employee_name || row.employee_name_arb
        }
        onSelectItem={selectMonthlyRoster}
        onSelectAll={() => selectAll(data.map((row) => row.schedule_roster_id))}
        onEditItem={(item) => {
          setEditingRoster(item);
          setIsAddModalOpen(true);
        }}
        onDeleteItem={(rowId) => {
          const row = data.find((r) => r.schedule_roster_id === rowId);
          if (row) handleDelete(row);
        }}
  noDataMessage={t('scheduling.monthlyRoster.table.noData') || 'No monthly roster data found'}
        isLoading={isLoading}
        onPageChange={setPage}
        onPageSizeChange={setPageSize}
      />

      {/* Assign Modal */}
      <Dialog
        open={!!editCell}
        onOpenChange={(v) => {
          if (!v) setEditCell(null);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('scheduling.monthlyRoster.assign.title') || 'Assign Schedule'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Select
              onValueChange={(v) => setAssignSelection(v)}
              disabled={assigning}
              value={assignSelection}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder={t('scheduling.monthlyRoster.assign.selectSchedule') || 'Select schedule'} />
              </SelectTrigger>
              <SelectContent>
                {allSchedules.map((sch) => (
                  <SelectItem
                    key={sch.schedule_id}
                    value={String(sch.schedule_id)}
                  >
                    <div className="flex items-center justify-between w-full">
                      <div className="inline-flex items-center gap-2">
                        {sch.sch_color && (
                          <span
                            className="inline-block w-3 h-3 rounded-full"
                            style={{ backgroundColor: sch.sch_color }}
                          />
                        )}
                        <span>{sch.schedule_code}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        {sch.open_shift_flag && <Clock className="w-3 h-3" />}
                        {sch.night_shift_flag && <Moon className="w-3 h-3" />}
                        {sch.ramadan_flag && <Star className="w-3 h-3" />}
                      </div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
              <div className="flex items-center gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setEditCell(null);
                  setAssignSelection(undefined);
                }}
                disabled={assigning}
              >
                {t('common.cancel')}
              </Button>
              <Button
                onClick={() => {
                  if (!assignSelection) return;
                  if (!editCell) return;
                  handleAssign(Number(assignSelection));
                }}
                disabled={assigning || !assignSelection}
              >
                {assigning ? t('scheduling.monthlyRoster.assign.assigning') || 'Assigning...' : t('scheduling.monthlyRoster.assign.assign') || 'Assign'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Pagination UI - use shared CustomPagination component */}
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
