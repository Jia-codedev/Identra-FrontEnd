"use client";

import { useState, useMemo, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import permissionTypeApi from "@/services/leaveManagement/permissionType";

const DEFAULT_PAGE_SIZE = 10;

export const usePermissionTypes = () => {
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
    queryKey: ["permissionTypes", params],
    queryFn: () => permissionTypeApi.all(params).then((res) => res.data),
  });

  const permissionTypes = useMemo(() => {
    const items: any[] = Array.isArray((data as any)?.data)
      ? (data as any).data
      : [];
    return items.map((it) => ({
      id: it.permission_type_id,
      code: it.permission_type_code,
      permission_type: it.permission_type_eng || it.permission_type_arb || "",
      status: it.status_flag,
      created_date: it.created_date,
      raw: it,
    }));
  }, [data]);

  const total = (data as any)?.total_count ?? 0;
  const hasNext = (data as any)?.has_next ?? false;
  const pageCount = useMemo(() => {
    if (total && pageSize) {
      return Math.ceil(total / pageSize);
    }
    return page;
  }, [total, pageSize, page]);

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
        prev.length === permissionTypes.length
          ? []
          : permissionTypes.map((l) => l.id)
      ),
    [permissionTypes]
  );
  const clearSelection = useCallback(() => setSelected([]), []);

  const goToPage = useCallback((pageNum: number) => setPage(pageNum), []);

  return {
    permissionTypes,
    isLoading,
    refetch,
    page,
    pageSize,
    pageCount,
    total,
    hasNext,
    hasPrev: page > 1,
    setPage: goToPage,
    setPageSize,
    search,
    setSearch,
    selected,
    selectItem,
    selectAll,
    clearSelection,
  };
};

export default usePermissionTypes;
