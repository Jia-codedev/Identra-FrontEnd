"use client";

import React, { useState } from 'react';
import { useTranslations } from '@/hooks/use-translations';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal, Edit, Trash2, Plus, Settings, Play } from 'lucide-react';
import workflowTypesApi, { WorkflowType, WorkflowTypeStep, WorkflowRequest } from '@/services/leaveManagement/workflowTypes';
import { toast } from 'sonner';

interface Props {
  type: 'workflow-type' | 'workflow-step' | 'workflow-request';
  item: WorkflowType | WorkflowTypeStep | WorkflowRequest;
  onEdit?: () => void;
  onAddStep?: () => void;
  onRefresh: () => void;
}

const WorkflowActions: React.FC<Props> = ({ type, item, onEdit, onAddStep, onRefresh }) => {
  const { t } = useTranslations();
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!confirm(`Are you sure you want to delete this ${type.replace('-', ' ')}?`)) {
      return;
    }
    
    setLoading(true);
    try {
      if (type === 'workflow-type') {
        await workflowTypesApi.deleteWorkflowType((item as WorkflowType).workflow_id);
        toast.success('Workflow type deleted successfully');
      } else if (type === 'workflow-step') {
        await workflowTypesApi.deleteWorkflowStep((item as WorkflowTypeStep).step_id);
        toast.success('Workflow step deleted successfully');
      } else if (type === 'workflow-request') {
        await workflowTypesApi.deleteWorkflowRequest((item as WorkflowRequest).request_id);
        toast.success('Workflow request deleted successfully');
      }
      
      onRefresh();
    } catch (error: any) {
      toast.error(error?.message || `Failed to delete ${type.replace('-', ' ')}`);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async () => {
    setLoading(true);
    try {
      if (type === 'workflow-type') {
        const workflowType = item as WorkflowType;
        await workflowTypesApi.updateWorkflowType(workflowType.workflow_id, {
          ...workflowType,
          is_active: !workflowType.is_active,
        });
        toast.success(`Workflow type ${workflowType.is_active ? 'deactivated' : 'activated'} successfully`);
      } else if (type === 'workflow-step') {
        const step = item as WorkflowTypeStep;
        await workflowTypesApi.updateWorkflowStep(step.step_id, {
          ...step,
          is_active: !step.is_active,
        });
        toast.success(`Workflow step ${step.is_active ? 'deactivated' : 'activated'} successfully`);
      }
      
      onRefresh();
    } catch (error: any) {
      toast.error(error?.message || 'Failed to update status');
    } finally {
      setLoading(false);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" disabled={loading}>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {onEdit && (
          <DropdownMenuItem onClick={onEdit}>
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </DropdownMenuItem>
        )}
        
        {type === 'workflow-type' && onAddStep && (
          <DropdownMenuItem onClick={onAddStep}>
            <Plus className="h-4 w-4 mr-2" />
            Add Step
          </DropdownMenuItem>
        )}
        
        {(type === 'workflow-type' || type === 'workflow-step') && (
          <DropdownMenuItem onClick={handleToggleStatus}>
            <Settings className="h-4 w-4 mr-2" />
            {(item as WorkflowType | WorkflowTypeStep).is_active ? 'Deactivate' : 'Activate'}
          </DropdownMenuItem>
        )}
        
        {type === 'workflow-request' && (
          <DropdownMenuItem onClick={() => toast.info('Process request functionality coming soon')}>
            <Play className="h-4 w-4 mr-2" />
            Process Request
          </DropdownMenuItem>
        )}
        
        <DropdownMenuItem onClick={handleDelete} className="text-red-600">
          <Trash2 className="h-4 w-4 mr-2" />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default WorkflowActions;
