"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useTranslations } from "@/hooks/use-translations";
import { MonthlyRosterRow } from "../types";
import { useLanguage } from "@/providers/language-provider";
import { Button } from "@/components/ui/button";
import { GenericTable, TableColumn } from "@/components/common/GenericTable";
import { ScheduleCalendarModal } from "./ScheduleCalendarModal";
import { Calendar } from "lucide-react";
import { ca } from "date-fns/locale";
import { useMonthlyRosterMutations } from "../hooks/useMutations";

interface MonthlyRosterTableProps {
  data: MonthlyRosterRow[];
  isLoading?: boolean;
  onEdit?: (row: MonthlyRosterRow) => void;
  onFinalize?: (row: MonthlyRosterRow) => void;
  onDelete?: (row: MonthlyRosterRow) => void;
  onRefetch?: () => void | Promise<void>;
  canEdit?: boolean;
  canDelete?: boolean;
  noDataMessage?: string;
}

export const MonthlyRosterTable: React.FC<MonthlyRosterTableProps> = ({
  data,
  isLoading,
  onEdit,
  onFinalize,
  onDelete,
  onRefetch,
  canEdit,
  canDelete,
  noDataMessage,
}) => {
  const { isRTL } = useLanguage();
  const { t } = useTranslations();
  const { editMutation } = useMonthlyRosterMutations();
  const [selectedEmployee, setSelectedEmployee] =
    useState<MonthlyRosterRow | null>(null);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  // Update selectedEmployee when data changes (after refetch)
  useEffect(() => {
    if (selectedEmployee && data.length > 0) {
      const updatedEmployee = data.find(
        (row) => row.schedule_roster_id === selectedEmployee.schedule_roster_id
      );
      if (updatedEmployee) {
        setSelectedEmployee(updatedEmployee);
      }
    }
  }, [data, selectedEmployee?.schedule_roster_id]);

  // We'll fetch schedule data when opening the calendar modal instead
  // No need to pre-calculate day keys since we're not showing day columns

  // Schedule data will be fetched inside the calendar modal when needed

  const handleViewSchedule = (row: MonthlyRosterRow) => {
    setSelectedEmployee(row);
    setIsCalendarOpen(true);
  };

  const handleCloseCalendar = () => {
    setIsCalendarOpen(false);
    setSelectedEmployee(null);
  };

  const handleUpdateSchedule = async (
    day: number,
    scheduleId: number | null
  ) => {
    if (!selectedEmployee) {
      throw new Error("No employee selected");
    }

    const dayKey = `D${day}` as `D${number}`;

    // Prepare the update data with only the specific day field
    const updateData: any = {
      [dayKey]: scheduleId ?? undefined,
    };

    // Use the mutation - cache update is handled in the mutation hook
    await editMutation.mutateAsync({
      id: selectedEmployee.schedule_roster_id,
      data: updateData,
    });

    // Update the local selectedEmployee state immediately for better UX
    setSelectedEmployee({
      ...selectedEmployee,
      [dayKey]: scheduleId,
    });

    // Trigger refetch from parent to update the data array
    if (onRefetch) {
      await onRefetch();
    }
  };

  const columns: TableColumn<MonthlyRosterRow>[] = useMemo(() => {
    const baseColumns: TableColumn<MonthlyRosterRow>[] = [
      {
        key: "emp_no",
        header: t("scheduling.monthlyRoster.table.empNo") || "Emp No",
        accessor: (row) => row.emp_no || "-",
      },
      {
        key: "employee_name",
        header: t("common.name") || "Name",
        accessor: (row) =>
          isRTL
            ? row.employee_name_arb || row.employee_name
            : row.employee_name || row.employee_name_arb,
      },
      {
        key: "view_schedule",
        header:
          t("scheduling.monthlyRoster.table.viewSchedule") || "View Schedule",
        accessor: (row) => (
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleViewSchedule(row)}
            className="flex items-center gap-2"
          >
            <Calendar size={16} />
            {t("scheduling.monthlyRoster.table.viewSchedule") ||
              "View Schedule"}
          </Button>
        ),
        width: "w-32",
        className: "text-center",
      },
    ];

    return baseColumns;
  }, [isRTL, t]);

  const displayNoDataMessage =
    noDataMessage ||
    t("scheduling.monthlyRoster.table.noData") ||
    "No monthly roster data found";

  return (
    <>
      <GenericTable
        canEdit={canEdit}
        canDelete={canDelete}
        data={data}
        columns={columns}
        selected={[]}
        page={1}
        pageSize={data.length}
        allChecked={false}
        getItemId={(item) => item.schedule_roster_id}
        getItemDisplayName={(item) =>
          item.employee_name || item.employee_name_arb || "Unknown"
        }
        onSelectItem={() => {}}
        onSelectAll={() => {}}
        onEditItem={onEdit}
        onDeleteItem={(id) => {
          const row = data.find((r) => r.schedule_roster_id === id);
          if (row && onDelete) onDelete(row);
        }}
        noDataMessage={displayNoDataMessage}
        isLoading={isLoading}
        onPageChange={() => {}}
        onPageSizeChange={() => {}}
        showActions={false}
      />

      {selectedEmployee && (
        <ScheduleCalendarModal
          isOpen={isCalendarOpen}
          onClose={handleCloseCalendar}
          employeeData={selectedEmployee}
          onUpdateSchedule={handleUpdateSchedule}
          isUpdating={editMutation.isPending}
        />
      )}
    </>
  );
};
