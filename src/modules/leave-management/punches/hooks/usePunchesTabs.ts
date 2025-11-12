"use client";

import { useState, useCallback, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useUserId } from "@/store/userStore";
import employeeApi from "@/services/employeemaster/employee";
import employeeEventTransactionsApi from "@/services/leaveManagement/employeeEventTransactions";

export type PunchesTabType = "my-punches" | "team-punches";

interface UsePunchesTabsParams {
  initialPage?: number;
  initialLimit?: number;
  initialTab?: PunchesTabType;
}

export default function usePunchesTabs(params: UsePunchesTabsParams = {}) {
  const [activeTab, setActiveTab] = useState<PunchesTabType>(
    params.initialTab || "my-punches"
  );
  const [page, setPage] = useState(params.initialPage || 1);
  const [limit, setLimit] = useState(params.initialLimit || 10);
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [filters, setFilters] = useState<any>({});

  const currentUserId = useUserId();

  // For team punches, we don't need to fetch team members separately
  // The API will filter by manager_id directly
  const teamMembersQuery = useQuery({
    queryKey: ["teamMembers", currentUserId],
    queryFn: async () => {
      // This is kept for compatibility but won't be used for filtering
      return [];
    },
    enabled: false, // Disabled as we use manager_id filter directly in the API
    staleTime: 10 * 60 * 1000,
  });

  const employeeFilter = useMemo(() => {
    if (activeTab === "my-punches") {
      return { employee_id: currentUserId };
    } else if (activeTab === "team-punches") {
      // Use manager_id to fetch all punches of employees under this manager
      return { manager_id: currentUserId };
    }
    return {};
  }, [activeTab, currentUserId]);

  const punchesQuery = useQuery({
    queryKey: [
      "punches",
      activeTab,
      { page, limit, ...filters, ...employeeFilter },
    ],
    queryFn: () =>
      employeeEventTransactionsApi.getAllEmployeeEventTransactions({
        limit,
        offset: page,
        ...filters,
        ...employeeFilter,
      }),
    enabled:
      !!currentUserId &&
      (activeTab === "my-punches" ||
        (activeTab === "team-punches" && !teamMembersQuery.isLoading)),
    staleTime: 5 * 60 * 1000,
  });

  const data = punchesQuery.data?.data || [];
  const total = punchesQuery.data?.total || 0;

  const handleTabChange = useCallback((tab: PunchesTabType) => {
    setActiveTab(tab);
    setPage(1);
    setSelectedItems([]);
  }, []);

  const handlePageChange = useCallback((newPage: number) => {
    setPage(newPage);
  }, []);

  const handleLimitChange = useCallback((newLimit: number) => {
    setLimit(newLimit);
    setPage(1);
  }, []);

  const handleFiltersChange = useCallback((newFilters: any) => {
    setFilters(newFilters);
    setPage(1);
  }, []);

  const handleSelectItem = useCallback((id: number) => {
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  }, []);

  const handleSelectAll = useCallback(() => {
    if (selectedItems.length === data.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(data.map((item: any) => item.transaction_id));
    }
  }, [selectedItems.length, data.length, data]);

  const clearSelection = useCallback(() => {
    setSelectedItems([]);
  }, []);

  const refresh = useCallback(() => {
    punchesQuery.refetch();
    if (activeTab === "team-punches") {
      teamMembersQuery.refetch();
    }
  }, [punchesQuery, teamMembersQuery, activeTab]);

  return {
    activeTab,
    handleTabChange,

    data,
    total,
    teamMembers: teamMembersQuery.data || [],

    page,
    limit,

    selectedItems,

    isLoading:
      punchesQuery.isLoading ||
      (activeTab === "team-punches" && teamMembersQuery.isLoading),
    isFetching: punchesQuery.isFetching || teamMembersQuery.isFetching,
    isError: punchesQuery.isError || teamMembersQuery.isError,
    error: punchesQuery.error || teamMembersQuery.error,

    handlePageChange,
    handleLimitChange,
    handleFiltersChange,
    handleSelectItem,
    handleSelectAll,
    clearSelection,
    refresh,
    hasSelection: selectedItems.length > 0,
    isAllSelected: selectedItems.length === data.length && data.length > 0,
    currentUserId,
  };
}
