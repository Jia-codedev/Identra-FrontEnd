"use client";
import lodash from "lodash";
import { useState, useMemo, useCallback } from "react";

import { DesignationsState, IDesignation } from "../types";
import { useInfiniteQuery } from "@tanstack/react-query";
import designationsApi from "@/services/masterdata/designation";

const PAGE_SIZE = 5;
const PAGE_SIZE_OPTIONS = [5, 10, 20, 50];

export const useDesignations = () => {
  const [state, setState] = useState<DesignationsState>({
    designations: [],
    selected: [],
    search: "",
    page: 1,
    pageSize: PAGE_SIZE,
    loading: false,
    error: null,
  });

  const {
    data,
    isLoading,
    refetch,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery({
    queryKey: ["designations", state.search, state.pageSize],
    queryFn: ({ pageParam = 1 }) =>
      designationsApi
        .getDesignations({
          offset: pageParam,
          limit: state.pageSize,
          search: state.search,
        })
        .then((response) => response.data),
    getNextPageParam: (lastPage, allPages) => {
      if (
        lastPage &&
        Array.isArray(lastPage.data) &&
        lastPage.data.length === state.pageSize
      ) {
        return allPages.length + 1;
      }
      return undefined;
    },
    initialPageParam: 1,
  });

  const designations = useMemo(() => {
    if (data && data.pages && data.pages[state.page - 1]) {
      return data.pages[state.page - 1].data || [];
    }
    return [];
  }, [data, state.page]);

  const total = data?.pages?.[0]?.total ?? 0;
  const pageCount =
    total > 0
      ? Math.ceil(total / state.pageSize)
      : data?.pages?.length || 1;

  const allIds = designations
    .filter((d: IDesignation) => d && d.designation_id !== undefined)
    .map((d: IDesignation) => d.designation_id);

  const allChecked =
    allIds.length > 0 &&
    allIds.every((id: number) => state.selected.includes(id));

  const debouncedRefetch = useMemo(
    () => lodash.debounce(refetch, 500),
    [refetch]
  );

  const setSearch = useCallback(
    (search: string) => {
      setState((prev) => ({ ...prev, search, page: 1 }));
      debouncedRefetch();
    },
    [debouncedRefetch]
  );

  const setPageSize = useCallback(
    (size: number) => {
      setState((prev) => ({ ...prev, pageSize: size, page: 1 }));
      refetch();
    },
    [refetch]
  );

  const setPage = useCallback(
    async (page: number) => {
      if (page >= 1 && page <= pageCount) {
        if (data && data.pages && !data.pages[page - 1] && hasNextPage) {
          await fetchNextPage();
        }
        setState((prev) => ({ ...prev, page }));
      }
    },
    [pageCount, data, hasNextPage, fetchNextPage]
  );

  const selectDesignation = useCallback((id: number) => {
    setState((prev) => ({
      ...prev,
      selected: prev.selected.includes(id)
        ? prev.selected.filter((i) => i !== id)
        : [...prev.selected, id],
    }));
  }, []);

  const selectAll = useCallback(() => {
    setState((prev) => ({
      ...prev,
      selected: allChecked
        ? prev.selected.filter((id: number) => !allIds.includes(id))
        : [
            ...prev.selected,
            ...allIds.filter((id: number) => !prev.selected.includes(id)),
          ],
    }));
  }, [allChecked, allIds]);

  const clearSelection = useCallback(() => {
    setState((prev) => ({ ...prev, selected: [] }));
  }, []);

  return {
    designations,
    allDesignations: state.designations,
    selected: state.selected,
    search: state.search,
    page: state.page,
    pageSize: state.pageSize,
    pageSizeOptions: PAGE_SIZE_OPTIONS,
    pageCount,
    loading: state.loading,
    error: state.error,
    allChecked,
    isLoading,
    refetch,
    setSearch,
    setPage,
    setPageSize,
    selectDesignation,
    selectAll,
    clearSelection,
  };
};
