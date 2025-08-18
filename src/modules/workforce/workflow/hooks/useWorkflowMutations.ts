
import { useMutation, useQueryClient } from '@tanstack/react-query';
import workflowApi from '@/services/workforce/workflowService';
import { IWorkflow } from '../types';

export const useWorkflowMutations = () => {
    const queryClient = useQueryClient();

    const createWorkflowMutation = useMutation({
        mutationFn: (workflowData: Omit<IWorkflow, 'workflow_id'>) => {
            return workflowApi.addWorkflow(workflowData).then((r) => r.data);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['workflows'] });
        },
    });

    const updateWorkflowMutation = useMutation({
        mutationFn: ({ id, workflowData }: { id: number; workflowData: Partial<IWorkflow> }) => {
            return workflowApi.updateWorkflow(id, workflowData).then((r) => r.data);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['workflows'] });
        },
    });

    const deleteWorkflowMutation = useMutation({
        mutationFn: (id: number) => {
            return workflowApi.deleteWorkflow(id).then((r) => r.data);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['workflows'] });
        },
    });

    return {
        createWorkflow: createWorkflowMutation.mutate,
        updateWorkflow: updateWorkflowMutation.mutate,
        deleteWorkflow: deleteWorkflowMutation.mutate,
    };
};
