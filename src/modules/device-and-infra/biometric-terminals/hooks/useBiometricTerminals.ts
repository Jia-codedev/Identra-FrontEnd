"use client";

import { useState, useMemo, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import biometricTerminalsApi, { ListBiometricTerminalsRequest } from "@/services/biometric-terminals/biometricTerminalsApi";

const DEFAULT_PAGE_SIZE = 10;
const PAGE_SIZE_OPTIONS = [5, 10, 20, 50];

export const useBiometricTerminals = () => {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const [selected, setSelected] = useState<number[]>([]);
  const [statusFilter, setStatusFilter] = useState<boolean | undefined>();

  const params: ListBiometricTerminalsRequest = useMemo(() => ({
    limit: pageSize,
    offset: (page - 1) * pageSize,
    ...(search ? { 
      device_name: search,
      device_no: search 
    } : {}),
    ...(statusFilter !== undefined ? { device_status: statusFilter } : {}),
    delete_flag: false,
  }), [page, pageSize, search, statusFilter]);

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["biometric-terminals", params],
    queryFn: () => biometricTerminalsApi.list(params),
  });

  const biometricTerminals = useMemo(() => {
    const items = Array.isArray(data?.data) ? data.data : [];
    return items.map(item => ({
      id: item.device_id,
      device_id: item.device_id,
      device_no: item.device_no || "",
      device_name: item.device_name || "",
      device_status: item.device_status,
      status_text: item.device_status ? "Active" : "Inactive",
      created_date: item.created_date || "",
      last_updated_date: item.last_updated_date || "",
      raw: item,
    }));
  }, [data]);

  const pageCount = useMemo(() => {
    if (!data?.total || pageSize <= 0) return 1;
    return Math.ceil(data.total / pageSize);
  }, [data?.total, pageSize]);

  const total = useMemo(() => {
    return data?.total || 0;
  }, [data?.total]);

  const hasNext = useMemo(() => {
    return data?.hasNext || false;
  }, [data?.hasNext]);

  const selectItem = useCallback((id: number) => {
    setSelected(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  }, []);

  const selectAll = useCallback(() => {
    if (allChecked) {
      setSelected([]);
    } else {
      setSelected(biometricTerminals.map(terminal => terminal.id));
    }
  }, [biometricTerminals]);

  const clearSelection = useCallback(() => {
    setSelected([]);
  }, []);

  const allChecked = useMemo(() => {
    return biometricTerminals.length > 0 && selected.length === biometricTerminals.length;
  }, [biometricTerminals.length, selected.length]);

  return {
    biometricTerminals,
    page,
    pageSize,
    pageCount,
    total,
    hasNext,
    isLoading,
    selected,
    allChecked,
    search,
    statusFilter,
    selectItem,
    selectAll,
    clearSelection,
    setPage,
    setPageSize,
    setSearch,
    setStatusFilter,
    refetch,
    pageSizeOptions: PAGE_SIZE_OPTIONS,
  };
};

export default useBiometricTerminals;