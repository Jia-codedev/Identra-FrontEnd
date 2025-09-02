"use client";

import { useQuery } from "@tanstack/react-query";
import { useState, useCallback } from "react";
import attendanceApi from "@/services/leaveManagement/attendance";

interface UseAttendanceParams {
  initialPage?: number;
  initialLimit?: number;
}

export default function useAttendance(params: UseAttendanceParams = {}) {
  const [page, setPage] = useState(params.initialPage || 1);
  const [limit, setLimit] = useState(params.initialLimit || 10);
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [filters, setFilters] = useState<any>({});

  // Get attendance records with pagination
  const attendanceQuery = useQuery({
    queryKey: ["attendance", { page, limit, ...filters }],
    queryFn: () => attendanceApi.getAllAttendance({ 
      limit, 
      offset: (page - 1) * limit, 
      ...filters 
    }),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Get attendance summary
  const summaryQuery = useQuery({
    queryKey: ["attendance-summary", filters],
    queryFn: () => attendanceApi.getAttendanceSummary(filters),
    staleTime: 5 * 60 * 1000,
  });

  const data = attendanceQuery.data?.data?.data || [];
  const total = attendanceQuery.data?.data?.total || 0;
  const summary = summaryQuery.data?.data || {};

  const handlePageChange = useCallback((newPage: number) => {
    setPage(newPage);
  }, []);

  const handleLimitChange = useCallback((newLimit: number) => {
    setLimit(newLimit);
    setPage(1); // Reset to first page when changing limit
  }, []);

  const handleFiltersChange = useCallback((newFilters: any) => {
    setFilters(newFilters);
    setPage(1); // Reset to first page when changing filters
  }, []);

  const handleSelectItem = useCallback((id: number) => {
    setSelectedItems(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  }, []);

  const handleSelectAll = useCallback(() => {
    if (selectedItems.length === data.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(data.map((item: any) => item.id));
    }
  }, [selectedItems.length, data.length, data]);

  const clearSelection = useCallback(() => {
    setSelectedItems([]);
  }, []);

  const refresh = useCallback(() => {
    attendanceQuery.refetch();
    summaryQuery.refetch();
  }, [attendanceQuery, summaryQuery]);

  return {
    // Data
    data,
    total,
    summary,
    
    // Pagination
    page,
    limit,
    
    // Selection
    selectedItems,
    
    // Loading states
    isLoading: attendanceQuery.isLoading,
    isFetching: attendanceQuery.isFetching,
    isError: attendanceQuery.isError,
    error: attendanceQuery.error,
    
    // Actions
    handlePageChange,
    handleLimitChange,
    handleFiltersChange,
    handleSelectItem,
    handleSelectAll,
    clearSelection,
    refresh,
    
    // Computed values
    hasSelection: selectedItems.length > 0,
    isAllSelected: selectedItems.length === data.length && data.length > 0,
  };
}
