"use client";
import lodash from 'lodash';
import { useState, useMemo, useCallback } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import deptAdminsApi from '@/services/masterdata/deptAdmins';

const PAGE_SIZE = 10;
const PAGE_SIZE_OPTIONS = [5, 10, 20, 50];

export const useDeptAdmins = () => {
  type State = {
    items: any[];
    selected: number[];
    search: string;
    page: number;
    pageSize: number;
    loading: boolean;
    error: any | null;
  };

  const [state, setState] = useState<State>({
    items: [],
    selected: [],
    search: '',
    page: 1,
    pageSize: PAGE_SIZE,
    loading: false,
    error: null,
  });

  const { data, isLoading, refetch, fetchNextPage, hasNextPage } = useInfiniteQuery({
    queryKey: ['deptAdmins', state.search, state.pageSize],
    queryFn: ({ pageParam = 1 }) =>
      deptAdminsApi
        .getDeptAdmins({ offset: pageParam, limit: state.pageSize, search: state.search })
        .then((res) => res.data),
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage && Array.isArray(lastPage.data) && lastPage.data.length === state.pageSize) return allPages.length + 1;
      return undefined;
    },
    initialPageParam: 1,
  });

  const items = useMemo(() => {
    if (data && data.pages && data.pages[state.page - 1]) return data.pages[state.page - 1].data || [];
    return [];
  }, [data, state.page]);

  const total = data?.pages?.[0]?.total ?? 0;
  const pageCount = total > 0 ? Math.ceil(total / state.pageSize) : (data?.pages?.length || 1);

  const allIds = items.map((i: any) => i.dept_admin_id).filter(Boolean);
  const allChecked = allIds.length > 0 && allIds.every((id: number) => state.selected.includes(id));

  const debouncedRefetch = useMemo(() => lodash.debounce(refetch, 300), [refetch]);

  const setSearch = useCallback((search: string) => {
    setState((p) => ({ ...p, search, page: 1 }));
    debouncedRefetch();
  }, [debouncedRefetch]);

  const setPageSize = useCallback((size: number) => { setState((p) => ({ ...p, pageSize: size, page: 1 })); refetch(); }, [refetch]);

  const setPage = useCallback(async (page: number) => {
    if (page >= 1 && page <= pageCount) {
      if (data && data.pages && !data.pages[page - 1] && hasNextPage) await fetchNextPage();
      setState((p) => ({ ...p, page }));
    }
  }, [pageCount, data, hasNextPage, fetchNextPage]);

  const selectItem = useCallback((id: number) => { setState((p) => ({ ...p, selected: p.selected.includes(id) ? p.selected.filter((i) => i !== id) : [...p.selected, id] })); }, []);

  const selectAll = useCallback(() => { setState((p) => ({ ...p, selected: allChecked ? p.selected.filter((id: number) => !allIds.includes(id)) : [...p.selected, ...allIds.filter((id: number) => !p.selected.includes(id))] })); }, [allChecked, allIds]);

  const clearSelection = useCallback(() => setState((p) => ({ ...p, selected: [] })), []);

  return {
    items,
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
    selectItem,
    selectAll,
    clearSelection,
  };
};
