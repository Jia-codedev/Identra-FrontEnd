"use client";

import { useState, useMemo, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import accessZonesApi, { ListAccessZonesRequest } from "@/services/device-and-infra/accessZonesApi";

const DEFAULT_PAGE_SIZE = 10;
const PAGE_SIZE_OPTIONS = [5, 10, 20, 50];

export const useAccessZones = () => {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const [selected, setSelected] = useState<number[]>([]);
  const [statusFilter, setStatusFilter] = useState<boolean | undefined>();
  const [typeFilter, setTypeFilter] = useState<string | undefined>();

  const params: ListAccessZonesRequest = useMemo(() => ({
    limit: pageSize,
    offset: (page - 1) * pageSize,
    ...(search ? { 
      zone_name: search
    } : {}),
    ...(statusFilter !== undefined ? { zone_status: statusFilter } : {}),
    ...(typeFilter ? { zone_type: typeFilter } : {}),
    delete_flag: false, // Only show non-deleted access zones
  }), [page, pageSize, search, statusFilter, typeFilter]);

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["access-zones", params],
    queryFn: () => accessZonesApi.list(params),
  });

  const accessZones = useMemo(() => {
    const items = Array.isArray(data?.data) ? data.data : [];
    return items.map(item => ({
      id: item.zone_id,
      zone_id: item.zone_id,
      zone_name: item.zone_name || "",
      zone_description: item.zone_description || "",
      zone_status: item.zone_status,
      zone_type: item.zone_type,
      zone_type_text: item.zone_type === 'entry' ? 'Entry Only' : 
                     item.zone_type === 'exit' ? 'Exit Only' : 'Entry & Exit',
      building_name: item.building_name || "",
      floor_level: item.floor_level || 0,
      capacity_limit: item.capacity_limit || 0,
      status_text: item.zone_status ? "Active" : "Inactive",
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
      setSelected(accessZones.map(zone => zone.id));
    }
  }, [accessZones]);

  const clearSelection = useCallback(() => {
    setSelected([]);
  }, []);

  const allChecked = useMemo(() => {
    return accessZones.length > 0 && selected.length === accessZones.length;
  }, [accessZones.length, selected.length]);

  return {
    accessZones,
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
    typeFilter,
    selectItem,
    selectAll,
    clearSelection,
    setPage,
    setPageSize,
    setSearch,
    setStatusFilter,
    setTypeFilter,
    refetch,
    pageSizeOptions: PAGE_SIZE_OPTIONS,
  };
};

export default useAccessZones;