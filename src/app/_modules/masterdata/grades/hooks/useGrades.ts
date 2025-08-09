"use client";
import lodash from "lodash"
import { useState, useMemo, useCallback } from "react";

import { GradesState, IGrade } from "../types";
import { useInfiniteQuery } from "@tanstack/react-query";
import gradesApi from "@/services/masterdata/grades";


const PAGE_SIZE = 5;
const PAGE_SIZE_OPTIONS = [5, 10, 20, 50];

export const useGrades = () => {
  const [state, setState] = useState<GradesState>({
    grades: [],
    selected: [],
    search: "",
    page: 1,
    pageSize: PAGE_SIZE,
    loading: false,
    error: null,
  });
  const {
    data,
    isLoading,
    refetch,
    fetchNextPage,
    hasNextPage
  } = useInfiniteQuery({
    queryKey: ["grades", state.search, state.pageSize],
    queryFn: ({ pageParam = 1 }) =>
      gradesApi
        .getGrades({
          offset: pageParam,
          limit: state.pageSize,
          name: state.search,
        })
        .then((response) => response.data),
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage && Array.isArray(lastPage.data) && lastPage.data.length === state.pageSize) {
        return allPages.length + 1;
      }
      return undefined;
    },
    initialPageParam: 1,
  });

  // Only show the current page's data
  const grades = useMemo(() => {
    if (data && data.pages && data.pages[state.page - 1]) {
      return data.pages[state.page - 1].data || [];
    }
    return [];
  }, [data, state.page]);


  // Total pages: if the API returns total, use it; else, fallback to loaded pages
  const total = data?.pages?.[0]?.total ?? 0;
  const pageCount = total > 0 ? Math.ceil(total / state.pageSize) : (data?.pages?.length || 1);

  const allIds = grades
    .filter((g: IGrade) => g && g.grade_id !== undefined)
    .map((g: IGrade) => g.grade_id);
  const allChecked =
    allIds.length > 0 && allIds.every((id: number) => state.selected.includes(id));

  // Stable debounce for search
  const debouncedRefetch = useMemo(() => lodash.debounce(refetch, 500), [refetch]);

  const setSearch = useCallback((search: string) => {
    setState((prev) => ({ ...prev, search, page: 1 }));
    debouncedRefetch();
  }, [debouncedRefetch]);


  const setPageSize = useCallback((size: number) => {
    setState((prev) => ({ ...prev, pageSize: size, page: 1 }));
    refetch();
  }, [refetch]);


  const setPage = useCallback(
    async (page: number) => {
      if (page >= 1 && page <= pageCount) {
        // Always try to fetch the next page if not loaded
        if (data && data.pages && !data.pages[page - 1] && hasNextPage) {
          await fetchNextPage();
        }
        setState((prev) => ({ ...prev, page }));
      }
    },
    [pageCount, data, hasNextPage, fetchNextPage]
  );


  const selectGrade = useCallback((id: number) => {
    setState((prev) => ({
      ...prev,
      selected: prev.selected.includes(id)
        ? prev.selected.filter((i) => i !== id)
        : [...prev.selected, id],
    }));
  }, []);


  const selectAll = useCallback(() => {
    setState((prev) => ({
      ...prev,
      selected: allChecked
        ? prev.selected.filter((id: number) => !allIds.includes(id))
        : [
          ...prev.selected,
          ...allIds.filter((id: number) => !prev.selected.includes(id)),
        ],
    }));
  }, [allChecked, allIds]);


  const clearSelection = useCallback(() => {
    setState((prev) => ({ ...prev, selected: [] }));
  }, []);

  return {
    // State
    grades,
    allGrades: state.grades,
    selected: state.selected,
    search: state.search,
    page: state.page,
    pageSize: state.pageSize,
    pageSizeOptions: PAGE_SIZE_OPTIONS,
    pageCount,
    loading: state.loading,
    error: state.error,
    allChecked,
    isLoading,
    refetch,
    // Actions
    setSearch,
    setPage,
    setPageSize,
    selectGrade,
    selectAll,
    clearSelection,
  };
};
