import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import sitesApi from "@/services/masterdata/site";

export const useSites = () => {
  const [selected, setSelected] = useState<number[]>([]);
  const [search, setSearch] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(5);
  const [allChecked, setAllChecked] = useState<boolean>(false);
  const queryKey = ["sites", search ?? "", pageSize ?? 5, page ?? 1];
  const { data, isLoading, refetch } = useQuery<any>({
    queryKey,
    queryFn: async () => {
      const offset = Math.max(0, (page ?? 1) - 1);
      const resp = await sitesApi.getSites({ offset, limit: pageSize, search });
      return resp.data;
    },
  });

  const sites = data?.data || [];
  const total = data?.total ?? 0;
  const pageCount = Math.max(1, Math.ceil(total / (pageSize || 5)));

  const selectSite = (id: number) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((siteId) => siteId !== id) : [...prev, id]
    );
  };

  const selectAll = (checked: boolean) => {
    setAllChecked(checked);
    setSelected(
      checked ? sites.map((site: any) => site.location_id ?? site.id) : []
    );
  };

  return {
    sites,
    selected,
    search,
    page,
    pageCount,
    pageSize,
    pageSizeOptions: [5, 10, 20, 50],
    allChecked,
    setSearch,
    setPage,
    setPageSize,
    selectSite,
    selectAll,
    isLoading,
    refetch,
  };
};
