import { useState, useEffect } from "react";
import sitesApi from "@/services/masterdata/site";

export const useSites = () => {
  const [sites, setSites] = useState<any[]>([]);
  const [selected, setSelected] = useState<number[]>([]);
  const [search, setSearch] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const [pageCount, setPageCount] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(5);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [allChecked, setAllChecked] = useState<boolean>(false);

  useEffect(() => {
    const fetchSites = async () => {
      setIsLoading(true);
      try {
        // The backend `offset` here should be a zero-based page index per product requirement:
        // page 1 -> offset 0, page 2 -> offset 1, page 3 -> offset 2, ...
        const offset = page - 1;
        const response = await sitesApi.getSites({
          offset,
          limit: pageSize,
          name: search,
        });
        setSites(response.data.data || []);
        // If backend returns total records, keep dividing by pageSize; if it returns total pages,
        // this still works because Math.ceil(total / pageSize) will be >= total when total is small.
        setPageCount(Math.ceil((response.data.total ?? 0) / pageSize) || 1);
      } catch (error) {
        console.error("Failed to fetch sites:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSites();
  }, [page, pageSize, search]);

  const selectSite = (id: number) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((siteId) => siteId !== id) : [...prev, id]
    );
  };

  const selectAll = (checked: boolean) => {
    setAllChecked(checked);
    // Some responses use `location_id` while others may use `id` — prefer `location_id` when available.
    setSelected(
      checked
        ? sites.map((site) => site.location_id ?? site.id)
        : []
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
  };
};
