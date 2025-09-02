"use client";

import { useQuery } from "@tanstack/react-query";
import { useState, useCallback } from "react";
import workflowTypesApi from "@/services/leaveManagement/workflowTypes";

interface UseWorkflowParams {
  initialPage?: number;
  initialLimit?: number;
}

export default function useWorkflow(params: UseWorkflowParams = {}) {
  const [page, setPage] = useState(params.initialPage || 1);
  const [limit, setLimit] = useState(params.initialLimit || 10);
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [filters, setFilters] = useState<any>({});

  // Get workflow types with pagination
  const workflowTypesQuery = useQuery({
    queryKey: ["workflow-types", { page, limit, ...filters }],
    queryFn: () => workflowTypesApi.getAllWorkflowTypes(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Get workflow steps
  const stepsQuery = useQuery({
    queryKey: ["workflow-steps"],
    queryFn: () => workflowTypesApi.getAllWorkflowSteps(),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });

  // Get workflow requests
  const requestsQuery = useQuery({
    queryKey: ["workflow-requests", { page, limit, ...filters }],
    queryFn: () => workflowTypesApi.getAllWorkflowRequests(),
    staleTime: 5 * 60 * 1000,
  });

  const workflowTypes = workflowTypesQuery.data?.data?.data || [];
  const steps = stepsQuery.data?.data?.data || [];
  const requests = requestsQuery.data?.data?.data || [];
  const total = workflowTypesQuery.data?.data?.total || 0;

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
    if (selectedItems.length === workflowTypes.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(workflowTypes.map((item: any) => item.id));
    }
  }, [selectedItems.length, workflowTypes]);

  const clearSelection = useCallback(() => {
    setSelectedItems([]);
  }, []);

  const refresh = useCallback(() => {
    workflowTypesQuery.refetch();
    stepsQuery.refetch();
    requestsQuery.refetch();
  }, [workflowTypesQuery, stepsQuery, requestsQuery]);

  return {
    // Data
    workflowTypes,
    steps,
    requests,
    total,
    
    // Pagination
    page,
    limit,
    
    // Selection
    selectedItems,
    
    // Loading states
    isLoading: workflowTypesQuery.isLoading || stepsQuery.isLoading,
    isFetching: workflowTypesQuery.isFetching || stepsQuery.isFetching,
    isError: workflowTypesQuery.isError || stepsQuery.isError,
    error: workflowTypesQuery.error || stepsQuery.error,
    
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
    isAllSelected: selectedItems.length === workflowTypes.length && workflowTypes.length > 0,
  };
}
