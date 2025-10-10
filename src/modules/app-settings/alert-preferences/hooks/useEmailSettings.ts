"use client";
import { useState, useMemo, useCallback } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { EmailSettingsState, ChronEmailSetting } from "../types";
import chronEmailSettingsApi from "@/services/settings/chronEmailSettings";

const PAGE_SIZE = 10;
const PAGE_SIZE_OPTIONS = [5, 10, 20, 50];

export const useEmailSettings = () => {
  const [state, setState] = useState<EmailSettingsState>({
    emailSettings: [],
    selected: [],
    search: "",
    page: 1,
    pageSize: PAGE_SIZE,
    loading: false,
    error: null,
  });

  const { data, isLoading, refetch, fetchNextPage, hasNextPage } =
    useInfiniteQuery({
      queryKey: ["emailSettings", state.search, state.pageSize],
      queryFn: ({ pageParam = 1 }) =>
        chronEmailSettingsApi
          .getEmailSettings({
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

  const emailSettings = useMemo(() => {
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
    return emailSettings.length > 0 && 
           state.selected.length === emailSettings.length;
  }, [emailSettings.length, state.selected.length]);

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

  const selectEmailSetting = useCallback((id: number) => {
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
      const allIds = emailSettings.map((setting: ChronEmailSetting) => setting.em_id!);
      return {
        ...prev,
        selected: allChecked ? [] : allIds,
      };
    });
  }, [emailSettings, allChecked]);

  const clearSelection = useCallback(() => {
    setState((prev) => ({ ...prev, selected: [] }));
  }, []);

  return {
    emailSettings,
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
    selectEmailSetting,
    selectAll,
    clearSelection,
    refetch,
  };
};