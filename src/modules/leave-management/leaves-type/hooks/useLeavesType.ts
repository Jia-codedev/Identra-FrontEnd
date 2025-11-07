"use client";

import { useState, useMemo, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import leaveTypeApi from "@/services/leaveManagement/leaveType";

const DEFAULT_PAGE_SIZE = 10;

export const useLeaves = () => {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const [selected, setSelected] = useState<number[]>([]);

  const params = useMemo(
    () => ({
      limit: pageSize,
      offset: page,
      ...(search ? { search: search } : {}),
    }),
    [page, pageSize, search]
  );

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["leaveTypes", params],
    queryFn: () => leaveTypeApi.all(params).then((res) => res.data),
  });

  const leaves = useMemo(() => {
    const items: any[] = Array.isArray((data as any)?.data)
      ? (data as any).data
      : [];
    return items.map((it) => ({
      id: it.leave_type_id,
      code: it.code || it.leave_type_code,
      leave_type:
        it.leave_type_eng || it.leave_type_name || it.leave_type_arb || "",
      status: it.status_flag,
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

  const selectItem = useCallback(
    (id: number) =>
      setSelected((prev) =>
        prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
      ),
    []
  );
  const selectAll = useCallback(
    () =>
      setSelected((prev) =>
        prev.length === leaves.length ? [] : leaves.map((l) => l.id)
      ),
    [leaves]
  );
  const clearSelection = useCallback(() => setSelected([]), []);

  const goToNextPage = useCallback(() => {
    if (hasNext) setPage((prev) => prev + 1);
  }, [hasNext]);

  const goToPrevPage = useCallback(() => {
    if (page > 1) setPage((prev) => prev - 1);
  }, [page]);

  const goToPage = useCallback(
    (pageNum: number) => {
      if (pageNum >= 1 && (pageNum <= pageCount || hasNext)) setPage(pageNum);
    },
    [pageCount, hasNext]
  );

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
