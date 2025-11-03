"use client";

import { useState, useMemo, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import employeeShortPermissionsApi, { ListPermissionsRequest } from "@/services/leaveManagement/employeeShortPermissions";

const DEFAULT_PAGE_SIZE = 10;

export const usePermissions = () => {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const [selected, setSelected] = useState<number[]>([]);

  const params: ListPermissionsRequest = useMemo(() => ({
    limit: pageSize,
    offset: (page - 1) * pageSize,
    ...(search ? { employee_name: search } : {}),
  }), [page, pageSize, search]);

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["permissions", params],
    queryFn: () => employeeShortPermissionsApi.list(params).then(res => res.data),
  });

  const permissions = useMemo(() => {
    const items: any[] = Array.isArray((data as any)?.data) ? (data as any).data : [];
    return items.map(it => ({
      id: it.employee_short_permission_id,
      employee_id: it.employee_id,
      employee_name: it.employee_name || `${it.firstname_eng || ''} ${it.lastname_eng || ''}`.trim(),
      permission_type: it.permission_type_name || it.permission_type || String(it.permission_type_id || ''),
      from_date: it.from_date,
      to_date: it.to_date,
      from_time: it.from_time,
      to_time: it.to_time,
      status: it.status || it.approve_reject_flag_name || 'pending',
      remarks: it.remarks,
      created_date: it.created_date,
      raw: it,
    }));
  }, [data]);

  const total = (data as any)?.total ?? 0;
  const hasNext = (data as any)?.hasNext ?? false;
  const pageCount = useMemo(() => {
    if (hasNext) {
      return page + 1;
    } else {
      return page;
    }
  }, [page, hasNext]);

  const selectItem = useCallback((id: number) => setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]), []);
  const selectAll = useCallback(() => setSelected(prev => prev.length === permissions.length ? [] : permissions.map(p => p.id)), [permissions]);
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
    permissions,
    isLoading,
    refetch,
    page,
    pageSize,
    pageCount,
    total,
    hasNext,
    setPage,
    setPageSize,
    search,
    setSearch,
    selected,
    selectItem,
    selectAll,
    clearSelection,
    goToNextPage,
    goToPrevPage,
    goToPage,
  };
};

export default usePermissions;
