"use client";
import lodash from "lodash";
import { useState, useMemo, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { RamadanDatesState, IRamadanDate, RamadanDateFilters } from "../types";
import ramadanDatesApi from "@/services/scheduling/ramadandates";

const PAGE_SIZE = 10;
const PAGE_SIZE_OPTIONS = [5, 10, 20, 50];

export const useRamadanDates = () => {
  const [state, setState] = useState<RamadanDatesState>({
    ramadanDates: [],
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

  const {
    data,
    isLoading,
    refetch,
    error
  } = useQuery({
    queryKey: ["ramadanDates", state.filters],
    queryFn: () =>
      ramadanDatesApi
        .getRamadanDates({
          year: state.filters.year,
          month: state.filters.month,
        })
        .then((response) => response.data),
  });

  const { ramadanDates, pageCount } = useMemo(() => {
    let filteredData: IRamadanDate[] = [];
    
    if (data && data.success && Array.isArray(data.data)) {
      filteredData = data.data;
      
      if (state.search) {
        const searchLower = state.search.toLowerCase();
        filteredData = filteredData.filter(
          (ramadanDate) =>
            ramadanDate.ramadan_name_eng.toLowerCase().includes(searchLower) ||
            ramadanDate.ramadan_name_arb.toLowerCase().includes(searchLower) ||
            (ramadanDate.remarks && ramadanDate.remarks.toLowerCase().includes(searchLower))
        );
      }
    }

    const totalItems = filteredData.length;
    const totalPages = Math.ceil(totalItems / state.pageSize);
    const startIndex = (state.page - 1) * state.pageSize;
    const endIndex = startIndex + state.pageSize;
    const paginatedData = filteredData.slice(startIndex, endIndex);

    return {
      ramadanDates: paginatedData,
      pageCount: totalPages,
    };
  }, [data, state.search, state.page, state.pageSize]);

  const setSearch = useCallback(
    lodash.debounce((search: string) => {
      setState((prev) => ({ ...prev, search, page: 1 }));
    }, 300),
    []
  );

  const setPage = useCallback((page: number) => {
    setState((prev) => ({ ...prev, page }));
  }, []);

  const setPageSize = useCallback((pageSize: number) => {
    setState((prev) => ({ ...prev, pageSize, page: 1 }));
  }, []);

  const setFilters = useCallback((filters: Partial<RamadanDateFilters>) => {
    setState((prev) => ({ 
      ...prev, 
      filters: { ...prev.filters, ...filters },
      page: 1 
    }));
  }, []);

  const selectRamadanDate = useCallback((id: number) => {
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
        prev.selected.length === ramadanDates.length
          ? []
          : ramadanDates.map((ramadanDate) => ramadanDate.ramadan_id),
    }));
  }, [ramadanDates]);

  const allChecked = ramadanDates.length > 0 && state.selected.length === ramadanDates.length;

  return {
    ramadanDates,
    selected: state.selected,
    search: state.search,
    page: state.page,
    pageCount,
    pageSize: state.pageSize,
    pageSizeOptions: PAGE_SIZE_OPTIONS,
    filters: state.filters,
    allChecked,
    setSearch,
    setPage,
    setPageSize,
    setFilters,
    selectRamadanDate,
    selectAll,
    isLoading,
    error,
    refetch,
  };
};
