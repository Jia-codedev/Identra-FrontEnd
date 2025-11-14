"use client";

import lodash from "lodash";
import { useState, useMemo, useCallback } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import employeeShortPermissionsApi, {
  ListPermissionsRequest,
} from "@/services/leaveManagement/employeeShortPermissions";
import { IPermission, PermissionsState } from "../types";

const PAGE_SIZE = 10;
const PAGE_SIZE_OPTIONS = [10, 20, 50, 100];

interface UsePermissionsOptions {
  employeeId?: number;
}

export const usePermissions = (options?: UsePermissionsOptions) => {
  const [state, setState] = useState<PermissionsState>({
    permissions: [],
    selected: [],
    search: "",
    page: 1,
    pageSize: PAGE_SIZE,
    loading: false,
    error: null,
  });

  const employeeId = options?.employeeId;

  const { data, isLoading, refetch, fetchNextPage, hasNextPage } =
    useInfiniteQuery({
      queryKey: ["permissions", employeeId, state.search, state.pageSize],
      queryFn: ({ pageParam = 1 }) =>
        employeeShortPermissionsApi
          .getPermissions({
            offset: pageParam,
            limit: state.pageSize,
            employee_id: employeeId,
            employee_name: state.search || undefined,
          })
          .then((response) => response.data),
      getNextPageParam: (lastPage, allPages) => {
        if (
          lastPage &&
          Array.isArray(lastPage.data) &&
          lastPage.data.length === state.pageSize
        ) {
          return allPages.length + 1;
        }
        return undefined;
      },
      initialPageParam: 1,
      enabled: employeeId !== undefined && employeeId > 0,
    });

  const permissions = useMemo(() => {
    if (data && data.pages && data.pages[state.page - 1]) {
      return (data.pages[state.page - 1].data || []).map((item: any) => ({
        ...item,
        // Map API field to frontend field for backwards compatibility
        employee_short_permission_id:
          item.short_permission_id || item.employee_short_permission_id,
        employee_name: item.employee_master
          ? `${item.employee_master.firstname_eng || ""} ${
              item.employee_master.lastname_eng || ""
            }`.trim()
          : "N/A",
        permission_type_name:
          item.permission_types?.permission_type_eng ||
          item.permission_types?.permission_type_code ||
          "N/A",
      }));
    }
    return [];
  }, [data, state.page]);

  const total = data?.pages?.[0]?.total ?? 0;
  const pageCount =
    total > 0 ? Math.ceil(total / state.pageSize) : data?.pages?.length || 1;

  const allIds = permissions
    .filter(
      (p: any) =>
        p &&
        (p.employee_short_permission_id !== undefined ||
          p.short_permission_id !== undefined)
    )
    .map((p: any) => p.employee_short_permission_id || p.short_permission_id);
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

  const selectItem = useCallback((id: number) => {
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
      selected: allChecked ? [] : allIds,
    }));
  }, [allChecked, allIds]);

  const clearSelection = useCallback(() => {
    setState((prev) => ({ ...prev, selected: [] }));
  }, []);

  return {
    permissions,
    selected: state.selected,
    search: state.search,
    page: state.page,
    pageCount,
    pageSize: state.pageSize,
    pageSizeOptions: PAGE_SIZE_OPTIONS,
    allChecked,
    setSearch,
    setPage,
    setPageSize,
    selectItem,
    selectAll,
    clearSelection,
    isLoading,
    refetch,
    total,
  };
};

export default usePermissions;
