import { useState, useMemo, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import employeeShortPermissionsApi, {
  ListPermissionsRequest,
} from "@/services/leaveManagement/employeeShortPermissions";

const DEFAULT_PAGE_SIZE = 10;

export const useEmployeePermissions = (
  initialFilters: Partial<ListPermissionsRequest> = {}
) => {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);

  const params: ListPermissionsRequest = useMemo(
    () => ({
      limit: pageSize,
      offset: page,
      ...(search ? { employee_id: search } : {}),
      ...initialFilters,
    }),
    [page, pageSize, search, initialFilters]
  );

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["permissions", params],
    queryFn: () =>
      employeeShortPermissionsApi.list(params).then((res) => res.data),
  });

  const items = useMemo(() => {
    const arr: any[] = Array.isArray((data as any)?.data)
      ? (data as any).data
      : [];
    console.log("Permissions raw data:", arr);
    const transformed = arr.map((it) => ({
      id: it.single_permissions_id,
      employee_name:
        it.employee_name ||
        `${it.firstname_eng || ""} ${it.lastname_eng || ""}`.trim(),
      start_date: it.from_date,
      end_date: it.to_date,
      status: it.approve_reject_flag === 1 ? "APPROVED" : it.approve_reject_flag === 2 ? "REJECTED" : "PENDING",
      reason: it.remarks,
      created_date: it.created_date,
      raw: it,
    }));
    console.log("Permissions transformed data:", transformed);
    return transformed;
  }, [data]);

  const total = (data as any)?.total ?? 0;
  const hasNext = (data as any)?.hasNext ?? false;

  const selectItem = useCallback(() => {}, []);

  return {
    data: items,
    isLoading,
    refetch,
    page,
    pageSize,
    total,
    hasNext,
    setPage,
    setPageSize,
    search,
    setSearch,
    selectItem,
  };
};

export default useEmployeePermissions;
