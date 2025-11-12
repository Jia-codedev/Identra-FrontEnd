import { useState } from "react";
import { MonthlyRosterFilters } from "../types";

export const useMonthlyRosterState = () => {
  const [selected, setSelected] = useState<number[]>([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Initialize with current month date range
  const currentDate = new Date();
  const firstDay = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1
  );
  const lastDay = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    0
  );

  const [filters, setFilters] = useState<MonthlyRosterFilters>({
    from_date: firstDay.toISOString().split("T")[0], // YYYY-MM-DD format
    to_date: lastDay.toISOString().split("T")[0],
  });

  const selectMonthlyRoster = (id: number) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const selectAll = (allIds: number[]) => {
    setSelected(selected.length === allIds.length ? [] : allIds);
  };

  const allChecked = selected.length > 0 && selected.length === pageSize;

  const onFiltersChange = (newFilters: Partial<MonthlyRosterFilters>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
    setPage(1);
  };

  return {
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
  };
};
