"use client";
import lodash from "lodash";
import { useState, useMemo, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { HolidaysState, IHoliday, HolidayFilters, CreateHolidayRequest } from "../types";
import holidaysApi from "@/services/scheduling/holidays";

const PAGE_SIZE = 10;
const PAGE_SIZE_OPTIONS = [5, 10, 20, 50];

export const useHolidays = () => {
  const [state, setState] = useState<HolidaysState>({
    holidays: [],
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
    queryKey: ["holidays", state.filters, state.search, state.page, state.pageSize],
    queryFn: () =>
      holidaysApi
        .getHolidays({
          year: state.filters.year,
          month: state.filters.month,
          recurring_flag: state.filters.recurring_flag,
          public_holiday_flag: state.filters.public_holiday_flag,
          limit: state.pageSize,
          offset: state.page,
        })
        .then((response) => response.data),
  });

  const queryClient = useQueryClient();

  type AddHolidayResponse = {
    success?: boolean;
    message?: string;
    data: IHoliday;
  };

  const addHolidayFn: (payload: CreateHolidayRequest) => Promise<AddHolidayResponse> = (
    payload
  ) => holidaysApi.addHoliday(payload).then((response) => response.data as AddHolidayResponse);

  const addHolidayMutation = useMutation<AddHolidayResponse, unknown, CreateHolidayRequest>({
    mutationFn: addHolidayFn,
    onSuccess: (response: AddHolidayResponse) => {
        try {
          const key = ["holidays", state.filters, state.search, state.page, state.pageSize];

          queryClient.setQueryData(key, (old: any) => {
            if (!old || !old.success) return old;

            const existing: IHoliday[] = Array.isArray(old.data) ? old.data : [];

            // Prepend new holiday to the current page's data and trim to pageSize
            const newList = [response.data, ...existing].slice(0, state.pageSize);

            return {
              ...old,
              data: newList,
              total: (old.total || 0) + 1,
            };
          });
        } catch (e) {
          // If updating cache fails, don't throw — leave original cache intact
          // The caller can still call refetch() if needed
          // eslint-disable-next-line no-console
          console.error("Failed to update holidays cache after add:", e);
        }
    },
  });

  // Get holidays and pagination data from server response
  const { holidays, pageCount, total } = useMemo(() => {
    if (data && data.success && Array.isArray(data.data)) {
      let filteredData: IHoliday[] = data.data;
      
      // Apply client-side search filter if search term exists
      // (since the backend doesn't support search filtering yet)
      if (state.search) {
        const searchLower = state.search.toLowerCase();
        filteredData = filteredData.filter(
          (holiday) =>
            holiday.holiday_eng.toLowerCase().includes(searchLower) ||
            holiday.holiday_arb.toLowerCase().includes(searchLower) ||
            (holiday.remarks && holiday.remarks.toLowerCase().includes(searchLower))
        );
      }

      // If we're doing client-side search, calculate pagination manually
      if (state.search) {
        const totalItems = filteredData.length;
        const totalPages = Math.ceil(totalItems / state.pageSize);
        const startIndex = (state.page - 1) * state.pageSize;
        const endIndex = startIndex + state.pageSize;
        const paginatedData = filteredData.slice(startIndex, endIndex);

        return {
          holidays: paginatedData,
          pageCount: totalPages,
          total: totalItems,
        };
      }

      // Use server-side pagination data when no search
      return {
        holidays: filteredData,
        pageCount: Math.ceil((data.total || 0) / state.pageSize),
        total: data.total || 0,
      };
    }

    return {
      holidays: [],
      pageCount: 0,
      total: 0,
    };
  }, [data, state.search, state.page, state.pageSize]);

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

  const setFilters = useCallback((filters: Partial<HolidayFilters>) => {
    setState((prev) => ({ 
      ...prev, 
      filters: { ...prev.filters, ...filters },
      page: 1 
    }));
  }, []);

  const selectHoliday = useCallback((id: number) => {
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
        prev.selected.length === holidays.length
          ? []
          : holidays.map((holiday) => holiday.holiday_id),
    }));
  }, [holidays]);

  const clearSelection = useCallback(() => {
    setState((prev) => ({ ...prev, selected: [] }));
  }, []);

  const allChecked = useMemo(() => {
    return holidays.length > 0 && state.selected.length === holidays.length;
  }, [holidays.length, state.selected.length]);

  return {
    holidays,
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
    selectHoliday,
    selectAll,
    clearSelection,
    refetch,
    // Mutation helpers to add holidays and update cache without invalidation
    addHoliday: addHolidayMutation.mutate,
    addHolidayAsync: addHolidayMutation.mutateAsync,
    addHolidayStatus: {
      status: addHolidayMutation.status,
      isLoading: addHolidayMutation.status === "pending",
      isError: addHolidayMutation.status === "error",
      error: addHolidayMutation.error,
    },
  };
};
