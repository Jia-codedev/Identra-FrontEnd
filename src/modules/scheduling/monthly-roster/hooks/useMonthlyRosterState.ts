import { useState } from 'react';
import { MonthlyRosterFilters } from '../types';

export const useMonthlyRosterState = () => {
  const [selected, setSelected] = useState<number[]>([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [filters, setFilters] = useState<MonthlyRosterFilters>({});

  const selectMonthlyRoster = (id: number) => {
    setSelected(prev =>
      prev.includes(id)
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  const selectAll = (allIds: number[]) => {
    setSelected(selected.length === allIds.length ? [] : allIds);
  };

  const allChecked = selected.length > 0 && selected.length === pageSize;

  const onFiltersChange = (newFilters: Partial<MonthlyRosterFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
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
