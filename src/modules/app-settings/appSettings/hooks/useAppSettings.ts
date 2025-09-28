"use client";
import lodash from "lodash";
import { useState, useMemo, useCallback } from "react";
import { AppSettingState, IAppSetting } from "../types";
import { useInfiniteQuery } from "@tanstack/react-query";
import appSettingsApi from "@/services/settings/appSettings";

const PAGE_SIZE = 10;
const PAGE_SIZE_OPTIONS = [5, 10, 20, 50];

export const useAppSettings = () => {
  const [state, setState] = useState<AppSettingState>({
    appSettings: [],
    selected: [],
    search: "",
    page: 1,
    pageSize: PAGE_SIZE,
    loading: false,
    error: null,
  });

  const { data, isLoading, refetch, fetchNextPage, hasNextPage } =
    useInfiniteQuery({
      queryKey: ["appSettings", state.search, state.pageSize],
      queryFn: ({ pageParam = 1 }) =>
        appSettingsApi
          .getAppSettings({
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

  const appSettings = useMemo(() => {
    if (data && data.pages && data.pages[state.page - 1]) {
      return data.pages[state.page - 1].data || [];
    }
    return [];
  }, [data, state.page]);

  const total = data?.pages?.[0]?.total ?? 0;
  const pageCount =
    total > 0 ? Math.ceil(total / state.pageSize) : data?.pages?.length || 1;

  const allIds = appSettings
    .filter((setting: IAppSetting) => setting && setting.version_name)
    .map((setting: IAppSetting) => setting.version_name);
  const allChecked =
    allIds.length > 0 &&
    allIds.every((versionName: string) => state.selected.includes(versionName));

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

  const selectAppSetting = useCallback((id: string | number) => {
    const versionName = id as string;
    setState((prev) => ({
      ...prev,
      selected: prev.selected.includes(versionName)
        ? prev.selected.filter((name) => name !== versionName)
        : [...prev.selected, versionName],
    }));
  }, []);

  const selectAll = useCallback(() => {
    setState((prev) => ({
      ...prev,
      selected: allChecked
        ? prev.selected.filter((name: string) => !allIds.includes(name))
        : [
            ...prev.selected,
            ...allIds.filter((name: string) => !prev.selected.includes(name)),
          ],
    }));
  }, [allChecked, allIds]);

  const clearSelection = useCallback(() => {
    setState((prev) => ({ ...prev, selected: [] }));
  }, []);

  return {
    appSettings,
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
    selectAppSetting,
    selectAll,
    clearSelection,
  };
};