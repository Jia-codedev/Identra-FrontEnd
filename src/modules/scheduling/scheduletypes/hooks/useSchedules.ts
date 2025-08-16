"use client";
import lodash from "lodash";
import { useState, useMemo, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { SchedulesState, ISchedule, ScheduleFilters } from "../types";
import schedulesApi from "@/services/scheduling/schedules";

const PAGE_SIZE = 10;
const PAGE_SIZE_OPTIONS = [5, 10, 20, 50];

export const useSchedules = () => {
  const [state, setState] = useState<SchedulesState>({
    schedules: [],
    selected: [],
    search: "",
    page: 1,
    pageSize: PAGE_SIZE,
    loading: false,
    error: null,
    filters: {
      search: "",
    },
  });

  const [searchInput, setSearchInput] = useState("");

  const {
    data,
    isLoading,
    refetch,
    error
  } = useQuery({
    queryKey: ["schedules", state.filters, state.search, state.page, state.pageSize],
    queryFn: () => {
      // Use search API if there are search filters, otherwise use get all
      if (state.search || state.filters.code || state.filters.organization_name) {
        return schedulesApi
          .searchSchedules({
            code: state.filters.code || state.search,
            organization: state.filters.organization_name,
            limit: state.pageSize,
            offset: state.page,
          })
          .then((response) => response.data);
      } else {
        return schedulesApi
          .getSchedules({
            limit: state.pageSize,
            offset: state.page,
          })
          .then((response) => response.data);
      }
    },
  });

  // Get schedules and pagination data from server response
  const { schedules, pageCount, total } = useMemo(() => {
    if (data && data.success && Array.isArray(data.data)) {
      let filteredData: ISchedule[] = data.data;
      
      // Apply additional client-side filters if needed
      if (state.filters.organization_id) {
        filteredData = filteredData.filter(
          (schedule) => schedule.organization_id === state.filters.organization_id
        );
      }

      if (state.filters.status_flag !== undefined) {
        filteredData = filteredData.filter(
          (schedule) => schedule.status_flag === state.filters.status_flag
        );
      }

      if (state.filters.open_shift_flag !== undefined) {
        filteredData = filteredData.filter(
          (schedule) => schedule.open_shift_flag === state.filters.open_shift_flag
        );
      }

      if (state.filters.night_shift_flag !== undefined) {
        filteredData = filteredData.filter(
          (schedule) => schedule.night_shift_flag === state.filters.night_shift_flag
        );
      }

      if (state.filters.ramadan_flag !== undefined) {
        filteredData = filteredData.filter(
          (schedule) => schedule.ramadan_flag === state.filters.ramadan_flag
        );
      }

      // Use pagination data from API response if available
      if (data.pagination) {
        return {
          schedules: filteredData,
          pageCount: data.pagination.total_pages,
          total: data.pagination.total_count,
        };
      }

      // If we're doing client-side filtering, calculate pagination manually
      if (Object.keys(state.filters).some(key => state.filters[key as keyof ScheduleFilters] !== undefined && key !== 'search')) {
        const totalItems = filteredData.length;
        const totalPages = Math.ceil(totalItems / state.pageSize);
        const startIndex = (state.page - 1) * state.pageSize;
        const endIndex = startIndex + state.pageSize;
        const paginatedData = filteredData.slice(startIndex, endIndex);

        return {
          schedules: paginatedData,
          pageCount: totalPages,
          total: totalItems,
        };
      }

      // Use default pagination calculation
      return {
        schedules: filteredData,
        pageCount: Math.ceil((filteredData.length || 0) / state.pageSize),
        total: filteredData.length || 0,
      };
    }

    return {
      schedules: [],
      pageCount: 0,
      total: 0,
    };
  }, [data, state.filters, state.page, state.pageSize]);

  const debouncedSetSearch = useCallback(
    lodash.debounce((search: string) => {
      setState((prev) => ({ ...prev, search, page: 1 }));
    }, 300),
    []
  );

  const setSearch = useCallback((search: string) => {
    setSearchInput(search);
    debouncedSetSearch(search);
  }, [debouncedSetSearch]);

  const setPage = useCallback((page: number) => {
    setState((prev) => ({ ...prev, page }));
  }, []);

  const setPageSize = useCallback((pageSize: number) => {
    setState((prev) => ({ ...prev, pageSize, page: 1 }));
  }, []);

  const setFilters = useCallback((filters: Partial<ScheduleFilters>) => {
    setState((prev) => ({ 
      ...prev, 
      filters: { ...prev.filters, ...filters },
      page: 1 
    }));
  }, []);

  const selectSchedule = useCallback((id: number) => {
    setState((prev) => ({
      ...prev,
      selected: prev.selected.includes(id)
        ? prev.selected.filter((selectedId) => selectedId !== id)
        : [...prev.selected, id],
    }));
  }, []);

  const selectAll = useCallback(() => {
    setState((prev) => ({
      ...prev,
      selected:
        prev.selected.length === schedules.length
          ? []
          : schedules.map((schedule) => schedule.schedule_id),
    }));
  }, [schedules]);

  const clearSelection = useCallback(() => {
    setState((prev) => ({ ...prev, selected: [] }));
  }, []);

  const allChecked = useMemo(() => {
    return schedules.length > 0 && state.selected.length === schedules.length;
  }, [schedules.length, state.selected.length]);

  return {
    schedules,
    selected: state.selected,
    search: searchInput, // Use searchInput for display
    page: state.page,
    pageCount,
    pageSize: state.pageSize,
    pageSizeOptions: PAGE_SIZE_OPTIONS,
    filters: state.filters,
    allChecked,
    isLoading,
    error,
    total,
    setSearch,
    setPage,
    setPageSize,
    setFilters,
    selectSchedule,
    selectAll,
    clearSelection,
    refetch,
  };
};
