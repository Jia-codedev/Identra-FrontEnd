"use client";

import { useState, useMemo, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import buildingsApi, { ListBuildingsRequest } from "@/services/device-and-infra/buildingsApi";

const DEFAULT_PAGE_SIZE = 10;
const PAGE_SIZE_OPTIONS = [5, 10, 20, 50];

export const useBuildings = () => {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const [selected, setSelected] = useState<number[]>([]);
  const [statusFilter, setStatusFilter] = useState<boolean | undefined>();
  const [typeFilter, setTypeFilter] = useState<string | undefined>();
  const [cityFilter, setCityFilter] = useState<string | undefined>();

  const params: ListBuildingsRequest = useMemo(() => ({
    limit: pageSize,
    offset: (page - 1) * pageSize,
    ...(search ? { 
      building_name: search
    } : {}),
    ...(statusFilter !== undefined ? { building_status: statusFilter } : {}),
    ...(typeFilter ? { building_type: typeFilter } : {}),
    ...(cityFilter ? { city: cityFilter } : {}),
    delete_flag: false, // Only show non-deleted buildings
  }), [page, pageSize, search, statusFilter, typeFilter, cityFilter]);

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["buildings", params],
    queryFn: () => buildingsApi.list(params),
  });

  const buildings = useMemo(() => {
    const items = Array.isArray(data?.data) ? data.data : [];
    return items.map(item => ({
      id: item.id,
      building_id: item.id,
      building_name: item.building_name || "",
      building_code: item.building_code || "",
      building_address: item.building_address || "",
      building_description: item.building_description || "",
      building_status: item.building_status,
      building_type: item.building_type,
      building_type_text: item.building_type === 'office' ? 'Office' : 
                         item.building_type === 'warehouse' ? 'Warehouse' :
                         item.building_type === 'factory' ? 'Factory' :
                         item.building_type === 'residential' ? 'Residential' : 'Mixed Use',
      total_floors: item.total_floors || 0,
      total_area: item.total_area || 0,
      contact_person: item.contact_person || "",
      contact_phone: item.contact_phone || "",
      contact_email: item.contact_email || "",
      city: item.city || "",
      country: item.country || "",
      postal_code: item.postal_code || "",
      status_text: item.building_status ? "Active" : "Inactive",
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
      setSelected(buildings.map(building => building.id));
    }
  }, [buildings]);

  const clearSelection = useCallback(() => {
    setSelected([]);
  }, []);

  const allChecked = useMemo(() => {
    return buildings.length > 0 && selected.length === buildings.length;
  }, [buildings.length, selected.length]);

  return {
    buildings,
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
    cityFilter,
    selectItem,
    selectAll,
    clearSelection,
    setPage,
    setPageSize,
    setSearch,
    setStatusFilter,
    setTypeFilter,
    setCityFilter,
    refetch,
    pageSizeOptions: PAGE_SIZE_OPTIONS,
  };
};

export default useBuildings;