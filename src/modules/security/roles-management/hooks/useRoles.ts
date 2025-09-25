import { useState, useCallback } from "react";
import { SecRole } from "@/services/security/securityRoles";
import { useQuery } from "@tanstack/react-query";
import { securityRolesApi } from "@/services/security";

const PAGE_SIZE = 10;
const PAGE_SIZE_OPTIONS = [5, 10, 20, 50];

type RolesApiResponse = {
  data: SecRole[];
  total: number;
  [key: string]: any;
};

export const useRoles = () => {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(PAGE_SIZE);
  const [selected, setSelected] = useState<number[]>([]);

  const { data, isLoading, refetch } = useQuery<RolesApiResponse>({
    queryKey: ["roles", search, page, pageSize],
    queryFn: () =>
      securityRolesApi.getRoles({ offset: page, limit: pageSize, search }).then((res) => res.data),
  });

  const roles: SecRole[] = data?.data || [];
  const total = data?.total || 0;
  const pageCount = total > 0 ? Math.ceil(total / pageSize) : 1;
  const allIds = roles.map((r) => r.role_id);
  const allChecked = allIds.length > 0 && allIds.every((id) => selected.includes(id));

  const selectRole = useCallback((id: number) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  }, []);

  const selectAll = useCallback(() => {
    setSelected((prev) =>
      allChecked ? prev.filter((id) => !allIds.includes(id)) : [...prev, ...allIds.filter((id) => !prev.includes(id))]
    );
  }, [allChecked, allIds]);

  const clearSelection = useCallback(() => {
    setSelected([]);
  }, []);

  return {
    roles,
    selected,
    search,
    page,
    pageCount,
    pageSize,
    pageSizeOptions: PAGE_SIZE_OPTIONS,
    allChecked,
    isLoading,
    refetch,
    setSearch,
    setPage,
    setPageSize,
    selectRole,
    selectAll,
    clearSelection,
  };
};
