"use client";
import { useState, useMemo, useCallback } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { DbSettingsState, ChronDbSetting } from "../types";
import chronDbSettingsApi from "@/services/settings/chronDbSettings";

const PAGE_SIZE = 10;
const PAGE_SIZE_OPTIONS = [5, 10, 20, 50];

export const useDbSettings = () => {
  const [state, setState] = useState<DbSettingsState>({
    dbSettings: [],
    selected: [],
    search: "",
    page: 1,
    pageSize: PAGE_SIZE,
    loading: false,
    error: null,
  });

  const { data, isLoading, refetch, fetchNextPage, hasNextPage } =
    useInfiniteQuery({
      queryKey: ["dbSettings", state.search, state.pageSize],
      queryFn: ({ pageParam = 1 }) =>
        chronDbSettingsApi
          .getDbSettings({
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

  const dbSettings = useMemo(() => {
    if (data && data.pages && data.pages[state.page - 1]) {
      return data.pages[state.page - 1].data || [];
    }
    return [];
  }, [data, state.page]);

  const total = useMemo(() => {
    if (data && data.pages && data.pages[0]) {
      return data.pages[0].total || 0;
    }
    return 0;
  }, [data]);

  const pageCount = useMemo(() => {
    return Math.ceil(total / state.pageSize);
  }, [total, state.pageSize]);

  const allChecked = useMemo(() => {
    return dbSettings.length > 0 && 
           state.selected.length === dbSettings.length;
  }, [dbSettings.length, state.selected.length]);

  const setSearch = useCallback((search: string) => {
    setState((prev) => ({ ...prev, search, page: 1 }));
  }, []);

  const setPage = useCallback((page: number) => {
    setState((prev) => ({ ...prev, page }));
    if (data?.pages && !data.pages[page - 1]) {
      fetchNextPage();
    }
  }, [data?.pages, fetchNextPage]);

  const setPageSize = useCallback((pageSize: number) => {
    setState((prev) => ({ ...prev, pageSize, page: 1 }));
  }, []);

  const selectDbSetting = useCallback((id: number) => {
    setState((prev) => {
      const isSelected = prev.selected.includes(id);
      return {
        ...prev,
        selected: isSelected
          ? prev.selected.filter((selectedId) => selectedId !== id)
          : [...prev.selected, id],
      };
    });
  }, []);

  const selectAll = useCallback(() => {
    setState((prev) => {
      const allIds = dbSettings.map((setting: ChronDbSetting) => setting.db_settings_id!);
      return {
        ...prev,
        selected: allChecked ? [] : allIds,
      };
    });
  }, [dbSettings, allChecked]);

  const clearSelection = useCallback(() => {
    setState((prev) => ({ ...prev, selected: [] }));
  }, []);

  return {
    dbSettings,
    selected: state.selected,
    search: state.search,
    page: state.page,
    pageCount,
    pageSize: state.pageSize,
    pageSizeOptions: PAGE_SIZE_OPTIONS,
    total,
    allChecked,
    isLoading,
    setSearch,
    setPage,
    setPageSize,
    selectDbSetting,
    selectAll,
    clearSelection,
    refetch,
  };
};