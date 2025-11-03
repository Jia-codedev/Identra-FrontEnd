"use client";
import lodash from "lodash";
import { useState, useMemo, useCallback } from "react";
import { WorkflowApprovalState, IWorkflowApproval } from "../types";
import { useInfiniteQuery } from "@tanstack/react-query";
import workflowApprovalApi from "@/services/workforce/workflowApprovalService";

const PAGE_SIZE = 10;
const PAGE_SIZE_OPTIONS = [5, 10, 20, 50];

export const useWorkflowApprovals = () => {
  const [state, setState] = useState<WorkflowApprovalState>({
    approvals: [],
    total: 0,
    page: 1,
    pageSize: PAGE_SIZE,
    isLoading: false,
    error: null,
  });

  const [filters, setFilters] = useState({
    search: "",
    approval_status: "all",
    approver_id: "",
    request_id: "",
    employee_number: "",
    employee_name: "",
    from_date: "",
    to_date: "",
  });

  const { data, isLoading, refetch, fetchNextPage, hasNextPage } =
    useInfiniteQuery({
      queryKey: ["workflowApprovals", filters, state.pageSize],
      queryFn: ({ pageParam = 1 }) => {
        const apiFilters: any = {
          offset: pageParam,
          limit: state.pageSize,
        };

        if (filters.approval_status && filters.approval_status !== "all") apiFilters.approval_status = filters.approval_status;
        if (filters.approver_id) apiFilters.approver_id = parseInt(filters.approver_id);
        if (filters.request_id) apiFilters.request_id = parseInt(filters.request_id);
        if (filters.employee_number) apiFilters.employee_number = filters.employee_number;
        if (filters.employee_name) apiFilters.employee_name = filters.employee_name;
        if (filters.from_date) apiFilters.from_date = filters.from_date;
        if (filters.to_date) apiFilters.to_date = filters.to_date;

        return workflowApprovalApi
          .getWorkflowApprovals(apiFilters)
          .then((response) => response.data);
      },
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
    });

  const approvals = useMemo(() => {
    if (data && data.pages && data.pages[state.page - 1]) {
      return data.pages[state.page - 1].data || [];
    }
    return [];
  }, [data, state.page]);

  const total = data?.pages?.[0]?.total ?? 0;
  const pageCount =
    total > 0 ? Math.ceil(total / state.pageSize) : data?.pages?.length || 1;

  const allIds = approvals
    .filter((approval: IWorkflowApproval) => approval && approval.workflow_approval_id)
    .map((approval: IWorkflowApproval) => approval.workflow_approval_id);
  const allChecked =
    allIds.length > 0 &&
    allIds.every((id: number) => state.approvals.some(a => a.workflow_approval_id === id));

  const debouncedRefetch = useMemo(
    () => lodash.debounce(refetch, 500),
    [refetch]
  );

  const setSearch = useCallback(
    (search: string) => {
      setFilters((prev) => ({ ...prev, search }));
      setState((prev) => ({ ...prev, page: 1 }));
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

  const selectApproval = useCallback((id: number) => {
    setState((prev) => ({
      ...prev,
      approvals: prev.approvals.some((a: IWorkflowApproval) => a.workflow_approval_id === id)
        ? prev.approvals.filter((a: IWorkflowApproval) => a.workflow_approval_id !== id)
        : [...prev.approvals, approvals.find((a: IWorkflowApproval) => a.workflow_approval_id === id)!].filter(Boolean),
    }));
  }, [approvals]);

  const selectAll = useCallback(() => {
    setState((prev) => ({
      ...prev,
      approvals: allChecked
        ? prev.approvals.filter((a: IWorkflowApproval) => !allIds.includes(a.workflow_approval_id))
        : [
            ...prev.approvals,
            ...approvals.filter((a: IWorkflowApproval) => !prev.approvals.some((selected: IWorkflowApproval) => selected.workflow_approval_id === a.workflow_approval_id)),
          ],
    }));
  }, [allChecked, allIds, approvals]);

  const clearSelection = useCallback(() => {
    setState((prev) => ({ ...prev, approvals: [] }));
  }, []);

  const setFiltersAndRefetch = useCallback(
    (newFilters: Partial<typeof filters>) => {
      setFilters((prev) => ({ ...prev, ...newFilters }));
      setState((prev) => ({ ...prev, page: 1 }));
      refetch();
    },
    [refetch]
  );

  return {
    approvals,
    selected: state.approvals,
    search: filters.search,
    page: state.page,
    pageSize: state.pageSize,
    pageSizeOptions: PAGE_SIZE_OPTIONS,
    pageCount,
    loading: state.isLoading,
    error: state.error,
    allChecked,
    isLoading,
    refetch,
    setSearch,
    setPage,
    setPageSize,
    selectApproval,
    selectAll,
    clearSelection,
    filters,
    setFilters: setFiltersAndRefetch,
  };
};