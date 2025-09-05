"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { GenericTable, TableColumn } from "@/components/common/GenericTable";
import { Workflow, Play, Pause, Edit, Trash2, Clock, Users, CheckCircle } from "lucide-react";
import { useTranslations } from "@/hooks/use-translations";

type ViewMode = 'table' | 'grid';

interface WorkflowItem {
  id: string;
  name: string;
  description?: string;
  type: 'APPROVAL' | 'NOTIFICATION' | 'ESCALATION' | 'AUTOMATION';
  status: 'ACTIVE' | 'INACTIVE' | 'DRAFT' | 'PENDING';
  triggerCondition: string;
  assignedUsers?: string[];
  approvalLevels?: number;
  createdAt: string;
  updatedAt: string;
  lastExecuted?: string;
  executionCount: number;
}

interface WorkflowListProps {
  workflows: WorkflowItem[];
  viewMode: ViewMode;
  onEdit?: (workflow: WorkflowItem) => void;
  onDelete?: (id: string) => void;
  onToggleStatus?: (id: string, status: 'ACTIVE' | 'INACTIVE') => void;
  isLoading?: boolean;
}

const getTypeColor = (type: string) => {
  switch (type) {
    case 'APPROVAL':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
    case 'NOTIFICATION':
      return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
    case 'ESCALATION':
      return 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400';
    case 'AUTOMATION':
      return 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400';
    default:
      return 'bg-muted text-muted-foreground';
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'ACTIVE':
      return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
    case 'INACTIVE':
      return 'bg-muted text-muted-foreground';
    case 'DRAFT':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
    case 'PENDING':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
    default:
      return 'bg-muted text-muted-foreground';
  }
};

const formatDateTime = (dateString: string) => {
  if (!dateString) return 'N/A';
  try {
    const date = new Date(dateString);
    return date.toLocaleString();
  } catch (error) {
    return 'Invalid Date';
  }
};

export default function WorkflowList({
  workflows,
  viewMode,
  onEdit,
  onDelete,
  onToggleStatus,
  isLoading = false,
}: WorkflowListProps) {
  const { t } = useTranslations();

  // Ensure workflows is always an array and filter out invalid items
  const safeWorkflows = React.useMemo(() => {
    if (!Array.isArray(workflows)) return [];
    return workflows.filter(workflow =>
      workflow &&
      typeof workflow === 'object' &&
      workflow.id &&
      workflow.name
    );
  }, [workflows]);

  // Helper functions for GenericTable - Fixed to match interface exactly
  const getItemId = React.useCallback((workflow: WorkflowItem): number => {
    if (!workflow || !workflow.id) return 0;
    // Convert string ID to number using hash function for consistency
    const id = workflow.id;
    if (typeof id === 'string') {
      // Simple hash function to convert string to number
      let hash = 0;
      for (let i = 0; i < id.length; i++) {
        const char = id.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32-bit integer
      }
      return Math.abs(hash);
    }
    return parseInt(id) || 0;
  }, []);

  // Fixed to match GenericTable interface signature
  const getItemDisplayName = React.useCallback((workflow: WorkflowItem, isRTL: boolean): string => {
    return workflow?.name || 'Unknown Workflow';
  }, []);

  // Define table columns for GenericTable
  const columns: TableColumn<WorkflowItem>[] = React.useMemo(() => [
    {
      key: 'name',
      header: t('workflowAutomation.columns.workflowName') || t('common.name') || 'Workflow Name',
      accessor: (workflow: WorkflowItem, isRTL: boolean) => (
        <div>
          <div className="font-medium text-foreground">{workflow?.name || 'N/A'}</div>
          {workflow?.description && (
            <div className="text-sm text-muted-foreground">{workflow.description}</div>
          )}
        </div>
      ),
    },
    {
      key: 'type',
      header: t('workflowAutomation.columns.type') || t('common.type') || 'Type',
      accessor: (workflow: WorkflowItem, isRTL: boolean) => (
        <Badge className={getTypeColor(workflow?.type || '')}>
          {t(`workflowAutomation.types.${workflow?.type}`) || workflow?.type || 'Unknown'}
        </Badge>
      ),
    },
    {
      key: 'status',
      header: t('workflowAutomation.columns.status') || t('common.status') || 'Status',
      accessor: (workflow: WorkflowItem, isRTL: boolean) => (
        <Badge className={getStatusColor(workflow?.status || '')}>
          {t(`workflowAutomation.statuses.${workflow?.status}`) || workflow?.status || 'Unknown'}
        </Badge>
      ),
    },
    {
      key: 'trigger',
      header: t('workflowAutomation.columns.triggerCondition') || 'Trigger Condition',
      accessor: (workflow: WorkflowItem, isRTL: boolean) => (
        <span className="text-muted-foreground">{workflow?.triggerCondition || 'N/A'}</span>
      ),
    },
    {
      key: 'assignedUsers',
      header: t('workflowAutomation.columns.assignedUsers') || 'Assigned Users',
      accessor: (workflow: WorkflowItem, isRTL: boolean) => (
        <div className="flex items-center text-muted-foreground">
          <Users className="w-4 h-4 mr-1" />
          {workflow?.assignedUsers?.length || 0}
        </div>
      ),
    },
    {
      key: 'executions',
      header: t('workflowAutomation.columns.executions') || 'Executions',
      accessor: (workflow: WorkflowItem, isRTL: boolean) => (
        <div className="flex items-center text-muted-foreground">
          <CheckCircle className="w-4 h-4 mr-1" />
          {workflow?.executionCount || 0}
        </div>
      ),
    },
    {
      key: 'lastExecuted',
      header: t('workflowAutomation.columns.lastExecuted') || 'Last Executed',
      accessor: (workflow: WorkflowItem, isRTL: boolean) => (
        workflow?.lastExecuted ? (
          <div className="flex items-center text-muted-foreground">
            <Clock className="w-4 h-4 mr-1" />
            {formatDateTime(workflow.lastExecuted)}
          </div>
        ) : (
          <span className="text-muted-foreground">{t('workflowAutomation.grid.never') || 'Never'}</span>
        )
      ),
    },
  ], [t]);

  // Custom actions component
  const renderActions = React.useCallback((workflow: WorkflowItem) => {
    if (!workflow) return null;

    return (
      <div className="flex items-center justify-center gap-1">
        {onToggleStatus && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onToggleStatus(
              workflow.id,
              workflow.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE'
            )}
            className="p-1 h-8 w-8"
            title={workflow.status === 'ACTIVE' ? t('workflowAutomation.actions.deactivate') || t('common.deactivate') : t('workflowAutomation.actions.activate') || t('common.activate')}
          >
            {workflow.status === 'ACTIVE' ? (
              <Pause className="w-4 h-4" />
            ) : (
              <Play className="w-4 h-4" />
            )}
          </Button>
        )}
        {onEdit && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit(workflow)}
            className="p-1 h-8 w-8"
            title={t('workflowAutomation.actions.edit') || t('common.edit') || 'Edit'}
          >
            <Edit className="w-4 h-4" />
          </Button>
        )}
        {onDelete && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(workflow.id)}
            className="p-1 h-8 w-8 text-destructive hover:text-destructive"
            title={t('workflowAutomation.actions.delete') || t('common.delete') || 'Delete'}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        )}
      </div>
    );
  }, [onToggleStatus, onEdit, onDelete, t]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!safeWorkflows || safeWorkflows.length === 0) {
    return (
      <div className="text-center py-16">
        <Workflow className="mx-auto h-12 w-12 text-muted-foreground" />
        <h3 className="mt-2 text-sm font-medium text-foreground">
          {t('workflowAutomation.noWorkflows') || t('common.noResults') || 'No workflows found'}
        </h3>
        <p className="mt-1 text-sm text-muted-foreground">
          {t('workflowAutomation.noWorkflowsDescription') || 'Get started by creating your first workflow automation.'}
        </p>
      </div>
    );
  }

  if (viewMode === 'table') {
    return (
      <GenericTable
        data={safeWorkflows}
        columns={columns}
        selected={[]}
        page={1}
        pageSize={safeWorkflows.length}
        allChecked={false}
        getItemId={getItemId}
        getItemDisplayName={getItemDisplayName}
        onSelectItem={() => {}}
        onSelectAll={() => {}}
        onEditItem={onEdit}
        actions={renderActions}
        noDataMessage={t('workflowAutomation.noWorkflows') || t('common.noResults') || 'No workflows found'}
        isLoading={isLoading}
        onPageChange={() => {}}
        onPageSizeChange={() => {}}
      />
    );
  }

  // Grid view
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {safeWorkflows.map((workflow) => (
          <Card key={workflow?.id || Math.random()} className="hover:shadow-md transition-shadow border-border bg-card">
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-medium text-foreground">{workflow?.name || 'Unknown Workflow'}</h3>
                  {workflow?.description && (
                    <p className="text-sm text-muted-foreground mt-1">{workflow.description}</p>
                  )}
                </div>
                <div className="flex gap-1">
                  <Badge className={getStatusColor(workflow?.status || '')}>
                    {t(`workflowAutomation.statuses.${workflow?.status}`) || workflow?.status || 'Unknown'}
                  </Badge>
                </div>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center justify-between">
                  <Badge className={getTypeColor(workflow?.type || '')}>
                    {t(`workflowAutomation.types.${workflow?.type}`) || workflow?.type || 'Unknown'}
                  </Badge>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <CheckCircle className="w-4 h-4 mr-1" />
                    {workflow?.executionCount || 0} {t('workflowAutomation.grid.runs') || 'runs'}
                  </div>
                </div>

                <div className="text-sm text-muted-foreground">
                  <span className="font-medium text-foreground">{t('workflowAutomation.grid.trigger') || 'Trigger'}:</span> {workflow?.triggerCondition || 'N/A'}
                </div>

                <div className="flex items-center text-sm text-muted-foreground">
                  <Users className="w-4 h-4 mr-2" />
                  <span>{workflow?.assignedUsers?.length || 0} {t('workflowAutomation.grid.assignedUsers') || 'assigned users'}</span>
                </div>

                {workflow?.lastExecuted && (
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Clock className="w-4 h-4 mr-2" />
                    <span>{t('workflowAutomation.grid.lastRun') || 'Last run'}: {formatDateTime(workflow.lastExecuted)}</span>
                  </div>
                )}

                <div className="text-sm text-muted-foreground">
                  <span className="font-medium text-foreground">{t('workflowAutomation.grid.created') || t('common.created') || 'Created'}:</span> {formatDateTime(workflow?.createdAt)}
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-border">
                {onToggleStatus && workflow && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onToggleStatus(
                      workflow.id,
                      workflow.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE'
                    )}
                    className="p-2 h-8 w-8"
                    title={workflow.status === 'ACTIVE' ? t('workflowAutomation.actions.deactivate') : t('workflowAutomation.actions.activate')}
                  >
                    {workflow.status === 'ACTIVE' ? (
                      <Pause className="w-4 h-4" />
                    ) : (
                      <Play className="w-4 h-4" />
                    )}
                  </Button>
                )}
                {onEdit && workflow && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onEdit(workflow)}
                    className="p-2 h-8 w-8"
                    title={t('workflowAutomation.actions.edit') || t('common.edit')}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                )}
                {onDelete && workflow && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDelete(workflow.id)}
                    className="p-2 h-8 w-8 text-destructive hover:text-destructive"
                    title={t('workflowAutomation.actions.delete') || t('common.delete')}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
