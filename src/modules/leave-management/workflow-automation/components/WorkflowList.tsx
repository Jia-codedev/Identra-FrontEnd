"use client";

import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { GenericTable, TableColumn } from "@/components/common/GenericTable";
import { Play, Pause, Edit, Trash2 } from "lucide-react";
import { useTranslations } from "@/hooks/use-translations";
import { useLanguage } from "@/providers/language-provider";

interface WorkflowItem {
  workflow_id: number;
  workflow_code: string;
  workflow_name_eng?: string;
  workflow_name_arb?: string;
  workflow_category_eng?: string;
  workflow_category_arb?: string;
  created_id: number;
  created_date: string;
  last_updated_id: number;
  last_updated_date: string;
  status?: 'ACTIVE' | 'INACTIVE' | 'DRAFT';
  isActive?: boolean;
}

interface WorkflowListProps {
  workflows: WorkflowItem[];
  onEdit?: (workflow: WorkflowItem) => void;
  onDelete?: (id: number) => void;
  onToggleStatus?: (id: number, status: 'ACTIVE' | 'INACTIVE') => void;
  isLoading?: boolean;
  selected?: number[];
  allChecked?: boolean;
  onSelectItem?: (id: number) => void;
  onSelectAll?: () => void;
  currentPage?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
  pageSize?: number;
  onPageSizeChange?: (size: number) => void;
  total?: number;
}

const getStatusColor = (isActive: boolean) => {
  return isActive 
    ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
    : 'bg-muted text-muted-foreground';
};

const formatDateTime = (dateString: string) => {
  if (!dateString) return 'N/A';
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  } catch (error) {
    return 'Invalid Date';
  }
};

export default function WorkflowList({
  workflows,
  onEdit,
  onDelete,
  onToggleStatus,
  isLoading = false,
  selected = [],
  allChecked = false,
  onSelectItem,
  onSelectAll,
  currentPage = 1,
  totalPages = 1,
  onPageChange,
  pageSize = 10,
  onPageSizeChange,
  total = 0,
}: WorkflowListProps) {
  const { t } = useTranslations();
  const { currentLocale } = useLanguage();

  const getLocalizedName = (workflow: WorkflowItem) => {
    if (currentLocale === 'ar') {
      return workflow.workflow_name_arb || workflow.workflow_name_eng || 'N/A';
    }
    return workflow.workflow_name_eng || workflow.workflow_name_arb || 'N/A';
  };

  const getLocalizedCategory = (workflow: WorkflowItem) => {
    if (currentLocale === 'ar') {
      return workflow.workflow_category_arb || workflow.workflow_category_eng || 'N/A';
    }
    return workflow.workflow_category_eng || workflow.workflow_category_arb || 'N/A';
  };

  const safeWorkflows = React.useMemo(() => {
    if (!Array.isArray(workflows)) return [];
    return workflows.filter(workflow =>
      workflow &&
      typeof workflow === 'object' &&
      workflow.workflow_id &&
      workflow.workflow_code
    );
  }, [workflows]);

  const columns: TableColumn<WorkflowItem>[] = [
    {
      key: "workflow_code",
      header: t('leaveManagement.workflowAutomation.columns.code') || 'Code',
      accessor: (workflow) => (
        <div className="font-medium text-foreground">{workflow.workflow_code}</div>
      ),
    },
    {
      key: "workflow_name",
      header: t('leaveManagement.workflowAutomation.columns.name') || 'Name',
      accessor: (workflow) => (
        <div className="font-medium text-foreground">
          {getLocalizedName(workflow)}
        </div>
      ),
    },
    {
      key: "workflow_category",
      header: t('leaveManagement.workflowAutomation.columns.category') || 'Category',
      accessor: (workflow) => (
        <div className="text-sm">
          {getLocalizedCategory(workflow)}
        </div>
      ),
    },
    {
      key: "status",
      header: t('leaveManagement.workflowAutomation.columns.status') || 'Status',
      accessor: (workflow) => (
        <Badge className={getStatusColor(workflow.isActive ?? true)}>
          {workflow.isActive ?? true ? t('common.active') || 'Active' : t('common.inactive') || 'Inactive'}
        </Badge>
      ),
    },
  ];

  if (onEdit || onDelete || onToggleStatus) {
    columns.push({
      key: "actions",
      header: t('common.actions') || 'Actions',
      accessor: (workflow) => (
        <div className="flex items-center gap-1">
          {onToggleStatus && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onToggleStatus(workflow.workflow_id, workflow.isActive ? 'INACTIVE' : 'ACTIVE')}
              className="p-1 h-8 w-8"
            >
              {workflow.isActive ? (
                <Pause className="h-4 w-4" />
              ) : (
                <Play className="h-4 w-4" />
              )}
            </Button>
          )}
          
          {onEdit && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit(workflow)}
              className="p-1 h-8 w-8"
            >
              <Edit className="h-4 w-4" />
            </Button>
          )}
          
          {onDelete && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(workflow.workflow_id)}
              className="p-1 h-8 w-8 text-destructive hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      ),
    });
  }

  return (
    <GenericTable
      data={safeWorkflows}
      columns={columns}
      selected={selected}
      page={currentPage}
      pageSize={pageSize}
      allChecked={allChecked}
      getItemId={(workflow) => workflow.workflow_id}
      getItemDisplayName={(workflow) => `${workflow.workflow_code} - ${getLocalizedName(workflow)}`}
      onSelectItem={onSelectItem || (() => {})}
      onSelectAll={onSelectAll || (() => {})}
      onEditItem={onEdit}
      onDeleteItem={onDelete ? (id) => {
        const workflow = safeWorkflows.find(w => w.workflow_id === id);
        if (workflow) onDelete(workflow.workflow_id);
      } : undefined}
      noDataMessage={t('leaveManagement.workflowAutomation.noData') || 'No workflows found'}
      isLoading={isLoading}
      onPageChange={onPageChange || (() => {})}
      onPageSizeChange={onPageSizeChange || (() => {})}
      showActions={!!(onEdit || onDelete)}
    />
  );
}
