
import { useMemo, useCallback, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import workflowApi from '@/services/workforce/workflowService';
import { IWorkflow } from '../types';

const DEFAULT_PAGE_SIZE = 10;

export const useWorkflows = () => {
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
    const [search, setSearch] = useState('');
    const [selected, setSelected] = useState<number[]>([]);
    const [allChecked, setAllChecked] = useState(false);

    const { data, isLoading, refetch } = useQuery({
        queryKey: ['workflows', page, pageSize, search],
        queryFn: async () => {
            const resp = await workflowApi.getWorkflows({ offset: page, limit: pageSize, search }).then(r => r.data);
            return resp;
        },
    });

    const workflows: IWorkflow[] = useMemo(() => ((data as any)?.data ?? []), [data]);

    const total = (data as any)?.total ?? (Array.isArray(workflows) ? workflows.length : 0);
    const pageCount = total > 0 ? Math.ceil(total / pageSize) : 1;

    const selectWorkflow = useCallback((id: number) => {
        setSelected((prev) => (prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]));
    }, []);

    const selectAll = useCallback(() => {
        if (allChecked) {
            setSelected([]);
        } else {
            setSelected(workflows.map((w) => w.workflow_id));
        }
        setAllChecked(!allChecked);
    }, [allChecked, workflows]);

    return {
        workflows,
        selected,
        search,
        page,
        pageCount,
        pageSize,
        allChecked,
        isLoading,
        error: null,
        setSearch,
        setPage,
        setPageSize,
        selectWorkflow,
        selectAll,
        refetch,
    };
};
