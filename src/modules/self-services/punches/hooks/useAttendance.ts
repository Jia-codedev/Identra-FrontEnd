"use client";

import { useQuery } from "@tanstack/react-query";
import { useState, useCallback } from "react";
import employeeEventTransactionsApi from "@/services/leaveManagement/employeeEventTransactions";

interface UseAttendanceParams {
  initialPage?: number;
  initialLimit?: number;
}

export default function useAttendance(params: UseAttendanceParams = {}) {
  const [page, setPage] = useState(params.initialPage || 1);
  const [limit, setLimit] = useState(params.initialLimit || 10);
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [filters, setFilters] = useState<any>({});

  const attendanceQuery = useQuery({
    queryKey: ["employeeEventTransactions", { page, limit, ...filters }],
    queryFn: () => employeeEventTransactionsApi.getAllEmployeeEventTransactions({ 
      limit, 
      offset: page, 
      ...filters 
    }),
    staleTime: 5 * 60 * 1000, 
  });

  const data = attendanceQuery.data?.data || [];
  const total = attendanceQuery.data?.total || 0;

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
      setSelectedItems(data.map((item: any) => item.transaction_id));
    }
  }, [selectedItems.length, data.length, data]);

  const clearSelection = useCallback(() => {
    setSelectedItems([]);
  }, []);

  const refresh = useCallback(() => {
    attendanceQuery.refetch();
  }, [attendanceQuery]);

  return {
    data,
    total,
    
    page,
    limit,
    
    selectedItems,
    
    isLoading: attendanceQuery.isLoading,
    isFetching: attendanceQuery.isFetching,
    isError: attendanceQuery.isError,
    error: attendanceQuery.error,
    
    handlePageChange,
    handleLimitChange,
    handleFiltersChange,
    handleSelectItem,
    handleSelectAll,
    clearSelection,
    refresh,
    
    hasSelection: selectedItems.length > 0,
    isAllSelected: selectedItems.length === data.length && data.length > 0,
  };
}
