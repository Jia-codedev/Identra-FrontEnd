"use client";

import { useState, useEffect, useMemo } from 'react';
import { WeeklyRosterFilters } from '../types';

export const useWeeklyRosterState = () => {
  const [weeklyRosters, setWeeklyRosters] = useState([]);
  const [selected, setSelected] = useState<number[]>([]);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [filters, setFilters] = useState<WeeklyRosterFilters>({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Selection handlers
  const selectWeeklyRoster = (id: number) => {
    setSelected(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  const selectAll = () => {
    setSelected(weeklyRosters.length === selected.length ? [] : weeklyRosters.map((item: any) => item.id));
  };

  const allChecked = weeklyRosters.length > 0 && selected.length === weeklyRosters.length;

  // Filter handlers
  const onFiltersChange = (newFilters: Partial<WeeklyRosterFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
    setPage(1); // Reset to first page when filters change
  };

  // Clear selections when data changes
  useEffect(() => {
    setSelected([]);
  }, [weeklyRosters]);

  return {
    weeklyRosters,
    selected,
    search,
    setSearch,
    page,
    setPage,
    pageSize,
    setPageSize,
    filters,
    onFiltersChange,
    isLoading,
    error,
    selectWeeklyRoster,
    selectAll,
    allChecked,
  };
};
