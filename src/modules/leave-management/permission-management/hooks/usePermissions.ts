"use client"

import { useMemo, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import employeeShortPermissionsApi, { ListPermissionsRequest } from '@/services/leaveManagement/employeeShortPermissions'

const DEFAULT_PAGE_SIZE = 10

export default function usePermissions() {
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE)

  const [selected, setSelected] = useState<number[]>([])

  const params: ListPermissionsRequest = useMemo(() => ({ limit: pageSize, offset: page }), [page, pageSize])

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['permissions', params],
    queryFn: () => employeeShortPermissionsApi.list(params).then(res => res.data),
  })

  const total = (data as any)?.total ?? 0
  const pageCount = total > 0 ? Math.max(1, Math.ceil(total / pageSize)) : 1

  const selectItem = (id: number) => setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])
  const selectAll = () => setSelected(prev => prev.length === (Array.isArray((data as any)?.data) ? (data as any).data.length : 0) ? [] : (Array.isArray((data as any)?.data) ? (data as any).data.map((d: any) => d.single_permissions_id) : []))
  const clearSelection = () => setSelected([])

  return { data, isLoading, refetch, page, setPage, pageSize, setPageSize, total, pageCount, selected, selectItem, selectAll, clearSelection }
}
