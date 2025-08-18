import React from 'react';
import { GenericTable, TableColumn } from '@/components/common/GenericTable';
import { useTranslations } from '@/hooks/use-translations';
import { IWorkflow } from '../types';

interface WorkflowsTableProps {
    workflows: IWorkflow[];
    selected: number[];
    allChecked: boolean;
    onSelectAll: () => void;
    onSelectWorkflow: (id: number) => void;
    onEditWorkflow: (workflow: IWorkflow) => void;
    onDeleteWorkflow: (id: number) => void;
    isLoading: boolean;
    page: number;
    pageSize: number;
    onPageChange: (page: number) => void;
    onPageSizeChange: (size: number) => void;
}

export const WorkflowsTable: React.FC<WorkflowsTableProps> = ({
    workflows,
    selected,
    allChecked,
    onSelectAll,
    onSelectWorkflow,
    onEditWorkflow,
    onDeleteWorkflow,
    isLoading,
    page,
    pageSize,
    onPageChange,
    onPageSizeChange,
}) => {
    const { t } = useTranslations();

    const columns: TableColumn<IWorkflow>[] = [
        {
            key: 'name',
            header: t('workforce.workflow_name') || 'Workflow Name',
            accessor: (item) => item.name,
        },
        {
            key: 'description',
            header: t('common.description') || 'Description',
            accessor: (item) => item.description,
        },
        {
            key: 'steps',
            header: t('workforce.steps') || 'Steps',
            accessor: (item) =>
                (item as any).number_of_steps ?? (item as any)._count?.workflow_type_steps ?? 0,
        },
    ];

    return (
        <GenericTable
            data={workflows}
            columns={columns}
            selected={selected}
            allChecked={allChecked}
            getItemId={(item) => item.workflow_id}
            getItemDisplayName={(item) => item.name}
            onSelectItem={onSelectWorkflow}
            onSelectAll={onSelectAll}
            onEditItem={onEditWorkflow}
            onDeleteItem={onDeleteWorkflow}
            noDataMessage={t('common.no_data') || 'No data available'}
            isLoading={isLoading}
            page={page}
            pageSize={pageSize}
            onPageChange={onPageChange}
            onPageSizeChange={onPageSizeChange}
        />
    );
};
