"use client";
import lodash from "lodash";
import { useState, useMemo, useCallback } from "react";

import { DepartmentsState, IDepartment } from "../types";
import { useInfiniteQuery } from "@tanstack/react-query";
import departmentsApi from "@/services/masterdata/departments";

const PAGE_SIZE = 10;
const PAGE_SIZE_OPTIONS = [5, 10, 20, 50];

export const useDepartments = () => {
  const [state, setState] = useState<DepartmentsState>({
    departments: [],
    selected: [],
    search: "",
    page: 1,
    pageSize: PAGE_SIZE,
    loading: false,
    error: null,
  });

  const { data, isLoading, refetch, fetchNextPage, hasNextPage } =
    useInfiniteQuery({
      queryKey: ["departments", state.search, state.pageSize],
      queryFn: ({ pageParam = 1 }) =>
        departmentsApi
          .getDepartments({
            page: pageParam,
            limit: state.pageSize,
            search: state.search,
          })
          .then((response) => response.data),
      getNextPageParam: (lastPage, allPages) => {
        if (lastPage?.pagination?.page < lastPage?.pagination?.totalPages) {
          return allPages.length + 1;
        }
        return undefined;
      },
      initialPageParam: 1,
    });

  const departments = useMemo(() => {
    if (data && data.pages && data.pages[state.page - 1]) {
      return data.pages[state.page - 1].data || [];
    }
    return [];
  }, [data, state.page]);

  const total = data?.pages?.[0]?.pagination?.total ?? 0;
  const pageCount = data?.pages?.[0]?.pagination?.totalPages ?? 1;

  const allIds = departments
    .filter((d: IDepartment) => d && d.department_id !== undefined)
    .map((d: IDepartment) => d.department_id);

  const allChecked =
    allIds.length > 0 &&
    allIds.every((id: number) => state.selected.includes(id));

  const debouncedRefetch = useMemo(
    () => lodash.debounce(refetch, 500),
    [refetch]
  );

  const setSearch = useCallback(
    (search: string) => {
      setState((prev) => ({ ...prev, search, page: 1 }));
      debouncedRefetch();
    },
    [debouncedRefetch]
  );

  const setPageSize = useCallback(
    (size: number) => {
      setState((prev) => ({ ...prev, pageSize: size, page: 1 }));
      refetch();
    },
    [refetch]
  );

  const setPage = useCallback(
    async (page: number) => {
      if (page >= 1 && page <= pageCount) {
        if (data && data.pages && !data.pages[page - 1] && hasNextPage) {
          await fetchNextPage();
        }
        setState((prev) => ({ ...prev, page }));
      }
    },
    [pageCount, data, hasNextPage, fetchNextPage]
  );

  const selectDepartment = useCallback((id: number) => {
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
    departments,
    allDepartments: state.departments,
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
    setSearch,
    setPage,
    setPageSize,
    selectDepartment,
    selectAll,
    clearSelection,
  };
};
