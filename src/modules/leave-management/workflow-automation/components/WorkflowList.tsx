"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/Table";
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
  const date = new Date(dateString);
  return date.toLocaleString();
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
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (workflows.length === 0) {
    return (
      <div className="text-center py-16">
        <Workflow className="mx-auto h-12 w-12 text-muted-foreground" />
        <h3 className="mt-2 text-sm font-medium text-foreground">
          {t('workflowAutomation.noWorkflows') || 'No workflows found'}
        </h3>
        <p className="mt-1 text-sm text-muted-foreground">
          {t('workflowAutomation.noWorkflowsDescription') || 'Get started by creating your first workflow automation.'}
        </p>
      </div>
    );
  }

  if (viewMode === 'table') {
    return (
      <div className="space-y-4">
        <div className="rounded-lg border border-border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t('workflowAutomation.columns.workflowName') || 'Workflow Name'}</TableHead>
                <TableHead>{t('workflowAutomation.columns.type') || 'Type'}</TableHead>
                <TableHead>{t('workflowAutomation.columns.status') || 'Status'}</TableHead>
                <TableHead>{t('workflowAutomation.columns.triggerCondition') || 'Trigger Condition'}</TableHead>
                <TableHead>{t('workflowAutomation.columns.assignedUsers') || 'Assigned Users'}</TableHead>
                <TableHead>{t('workflowAutomation.columns.executions') || 'Executions'}</TableHead>
                <TableHead>{t('workflowAutomation.columns.lastExecuted') || 'Last Executed'}</TableHead>
                <TableHead className="w-32">{t('workflowAutomation.columns.actions') || 'Actions'}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {workflows.map((workflow) => (
                <TableRow key={workflow.id} className="hover:bg-muted/50">
                  <TableCell>
                    <div>
                      <div className="font-medium text-foreground">{workflow.name}</div>
                      {workflow.description && (
                        <div className="text-sm text-muted-foreground">{workflow.description}</div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getTypeColor(workflow.type)}>
                      {t(`workflowAutomation.types.${workflow.type}`) || workflow.type}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(workflow.status)}>
                      {t(`workflowAutomation.statuses.${workflow.status}`) || workflow.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {workflow.triggerCondition}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    <div className="flex items-center">
                      <Users className="w-4 h-4 mr-1" />
                      {workflow.assignedUsers?.length || 0}
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    <div className="flex items-center">
                      <CheckCircle className="w-4 h-4 mr-1" />
                      {workflow.executionCount}
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {workflow.lastExecuted ? (
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        {formatDateTime(workflow.lastExecuted)}
                      </div>
                    ) : (
                      <span className="text-muted-foreground">{t('workflowAutomation.grid.never') || 'Never'}</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      {onToggleStatus && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onToggleStatus(
                            workflow.id,
                            workflow.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE'
                          )}
                          className="p-1 h-8 w-8"
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
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    );
  }

  // Grid view
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {workflows.map((workflow) => (
          <Card key={workflow.id} className="hover:shadow-md transition-shadow border-border bg-card">
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-medium text-foreground">{workflow.name}</h3>
                  {workflow.description && (
                    <p className="text-sm text-muted-foreground mt-1">{workflow.description}</p>
                  )}
                </div>
                <div className="flex gap-1">
                  <Badge className={getStatusColor(workflow.status)}>
                    {t(`workflowAutomation.statuses.${workflow.status}`) || workflow.status}
                  </Badge>
                </div>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center justify-between">
                  <Badge className={getTypeColor(workflow.type)}>
                    {t(`workflowAutomation.types.${workflow.type}`) || workflow.type}
                  </Badge>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <CheckCircle className="w-4 h-4 mr-1" />
                    {workflow.executionCount} {t('workflowAutomation.grid.runs') || 'runs'}
                  </div>
                </div>

                <div className="text-sm text-muted-foreground">
                  <span className="font-medium text-foreground">{t('workflowAutomation.grid.trigger') || 'Trigger'}:</span> {workflow.triggerCondition}
                </div>

                <div className="flex items-center text-sm text-muted-foreground">
                  <Users className="w-4 h-4 mr-2" />
                  <span>{workflow.assignedUsers?.length || 0} {t('workflowAutomation.grid.assignedUsers') || 'assigned users'}</span>
                </div>

                {workflow.lastExecuted && (
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Clock className="w-4 h-4 mr-2" />
                    <span>{t('workflowAutomation.grid.lastRun') || 'Last run'}: {formatDateTime(workflow.lastExecuted)}</span>
                  </div>
                )}

                <div className="text-sm text-muted-foreground">
                  <span className="font-medium text-foreground">{t('workflowAutomation.grid.created') || 'Created'}:</span> {formatDateTime(workflow.createdAt)}
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-border">
                {onToggleStatus && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onToggleStatus(
                      workflow.id,
                      workflow.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE'
                    )}
                    className="p-2 h-8 w-8"
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
                    className="p-2 h-8 w-8"
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                )}
                {onDelete && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDelete(workflow.id)}
                    className="p-2 h-8 w-8 text-destructive hover:text-destructive"
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
