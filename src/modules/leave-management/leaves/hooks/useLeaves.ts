"use client";

import { useState, useMemo, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLanguage } from "@/providers/language-provider";
import employeeLeavesApi, { ListLeavesRequest } from "@/services/leaveManagement/employeeLeaves";

const DEFAULT_PAGE_SIZE = 10;

export const useLeaves = () => {
  const { isRTL } = useLanguage();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const [selected, setSelected] = useState<number[]>([]);

  const params: ListLeavesRequest = useMemo(() => ({
    limit: pageSize,
    offset: (page - 1) * pageSize,
    ...(search ? { employee_id: search } : {}),
  }), [page, pageSize, search]);

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["leaves", params],
    queryFn: () => employeeLeavesApi.list(params).then(res => res.data),
  });

  const leaves = useMemo(() => {
    const items: any[] = Array.isArray((data as any)?.data) ? (data as any).data : [];
    return items.map(it => {
      // Employee information
      const employee = it.employee_master_employee_leaves_employee_idToemployee_master;
      const employeeName = employee ? 
        (isRTL ? 
          `${employee.firstname_arb || employee.firstname_eng || ''} ${employee.lastname_arb || employee.lastname_eng || ''}`.trim() :
          `${employee.firstname_eng || employee.firstname_arb || ''} ${employee.lastname_eng || employee.lastname_arb || ''}`.trim()
        ) : 'N/A';
      
      // Leave type information based on language
      const leaveType = it.leave_types ? 
        (isRTL ? 
          (it.leave_types.leave_type_arb || it.leave_types.leave_type_eng || 'Unknown') :
          (it.leave_types.leave_type_eng || it.leave_types.leave_type_arb || 'Unknown')
        ) : 'Unknown';

      return {
        id: it.employee_leave_id,
        employee_name: employeeName,
        employee_no: employee?.emp_no || 'N/A',
        leave_type: leaveType,
        start_date: it.from_date,
        end_date: it.to_date,
        status: it.leave_status,
        total_days: it.number_of_leaves,
        employee_remarks: it.employee_remarks,
        approver_remarks: it.approver_remarks,
        leave_unique_ref_no: it.leave_unique_ref_no,
        raw: it,
      };
    });
  }, [data, isRTL]);
  const total = (data as any)?.total ?? 0;
  const hasNext = (data as any)?.hasNext ?? false;
  const pageCount = useMemo(() => {
    if (hasNext) {
      // If there are more pages, calculate based on current page + 1
      return page + 1;
    } else {
      // If no more pages, this is the last page
      return page;
    }
  }, [page, hasNext]);

  const selectItem = useCallback((id: number) => setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]), []);
  const selectAll = useCallback(() => setSelected(prev => prev.length === leaves.length ? [] : leaves.map(l => l.id)), [leaves]);
  const clearSelection = useCallback(() => setSelected([]), []);

  const goToNextPage = useCallback(() => {
    if (hasNext) {
      setPage(prev => prev + 1);
    }
  }, [hasNext]);

  const goToPrevPage = useCallback(() => {
    if (page > 1) {
      setPage(prev => prev - 1);
    }
  }, [page]);

  const goToPage = useCallback((pageNum: number) => {
    if (pageNum >= 1 && (pageNum <= pageCount || hasNext)) {
      setPage(pageNum);
    }
  }, [pageCount, hasNext]);

  return {
    leaves,
    isLoading,
    refetch,
    page,
    pageSize,
    pageCount,
    total,
    hasNext,
    hasPrev: page > 1,
    setPage: goToPage,
    goToNextPage,
    goToPrevPage,
    setPageSize,
    search,
    setSearch,
    selected,
    selectItem,
    selectAll,
    clearSelection,
  };
};

export default useLeaves;
