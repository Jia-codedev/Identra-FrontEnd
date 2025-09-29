import { useMutation, useQueryClient } from "@tanstack/react-query";
import { IWorkflowApproval, CreateWorkflowApprovalData, UpdateWorkflowApprovalData, ApprovalActionData } from "../types";
import { toast } from "sonner";
import workflowApprovalApi from "@/services/workforce/workflowApprovalService";
import { useTranslations } from '@/hooks/use-translations';

export function useWorkflowApprovalMutations() {
  const queryClient = useQueryClient();
  const { t } = useTranslations();

  const createApprovalMutation = useMutation({
    mutationFn: async (approvalData: CreateWorkflowApprovalData) => {
      if (!approvalData || typeof approvalData !== 'object') {
        throw new Error('Invalid approval data');
      }
      if (!approvalData.request_id || !approvalData.workflow_steps_id || !approvalData.approver_id) {
        throw new Error('Request ID, workflow steps ID, and approver ID are required');
      }

      const response = await workflowApprovalApi.createWorkflowApproval(approvalData);
      return response.data;
    },
    onSuccess: (data) => {
      if (!data) return;
      toast.success(t('workforce.approvals.created') || 'Approval created successfully');

      queryClient.setQueriesData(
        { queryKey: ["workflowApprovals"] },
        (oldData: any) => {
          if (!oldData || !oldData.pages) return oldData;

          const newPages = [...oldData.pages];
          if (newPages[0] && newPages[0].data) {
            newPages[0] = {
              ...newPages[0],
              data: [data.data || data, ...newPages[0].data],
              total: (newPages[0].total || 0) + 1
            };
          }

          return {
            ...oldData,
            pages: newPages
          };
        }
      );
    },
    onError: (error: any) => {
      const errorMessage = error?.response?.data?.message || error?.message || 'Failed to create approval';
      toast.error(t('workforce.approvals.createFailed') || errorMessage);
    },
  });

  const updateApprovalMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: UpdateWorkflowApprovalData }) => {
      if (!id || !data) {
        throw new Error('Invalid update data');
      }

      const response = await workflowApprovalApi.updateWorkflowApproval(id, data);
      return { id, data: response.data };
    },
    onSuccess: ({ id, data }) => {
      toast.success(t('workforce.approvals.updated') || 'Approval updated successfully');

      queryClient.setQueriesData(
        { queryKey: ["workflowApprovals"] },
        (oldData: any) => {
          if (!oldData || !oldData.pages) return oldData;

          const newPages = oldData.pages.map((page: any) => ({
            ...page,
            data: page.data?.map((approval: IWorkflowApproval) =>
              approval.workflow_approval_id === id ? { ...approval, ...data.data } : approval
            ) || []
          }));

          return {
            ...oldData,
            pages: newPages
          };
        }
      );
    },
    onError: (error: any) => {
      const errorMessage = error?.response?.data?.message || error?.message || 'Failed to update approval';
      toast.error(t('workforce.approvals.updateFailed') || errorMessage);
    },
  });

  const processApprovalMutation = useMutation({
    mutationFn: async ({ id, action }: { id: number; action: ApprovalActionData }) => {
      if (!id || !action || !action.approval_status) {
        throw new Error('Invalid approval action data');
      }

      const response = await workflowApprovalApi.processApproval(id, action);
      return { id, data: response.data };
    },
    onSuccess: ({ id, data }, { action }) => {
      const actionText = action.approval_status === 'APPROVED' ? 'approved' : 'rejected';
      toast.success(t(`workforce.approvals.${actionText}`) || `Approval ${actionText} successfully`);

      queryClient.setQueriesData(
        { queryKey: ["workflowApprovals"] },
        (oldData: any) => {
          if (!oldData || !oldData.pages) return oldData;

          const newPages = oldData.pages.map((page: any) => ({
            ...page,
            data: page.data?.map((approval: IWorkflowApproval) =>
              approval.workflow_approval_id === id ? { ...approval, ...data.data } : approval
            ) || []
          }));

          return {
            ...oldData,
            pages: newPages
          };
        }
      );
    },
    onError: (error: any) => {
      const errorMessage = error?.response?.data?.message || error?.message || 'Failed to process approval';
      toast.error(t('workforce.approvals.processFailed') || errorMessage);
    },
  });

  const deleteApprovalMutation = useMutation({
    mutationFn: async (id: number) => {
      if (!id) {
        throw new Error('Invalid approval ID');
      }

      await workflowApprovalApi.deleteWorkflowApproval(id);
      return id;
    },
    onSuccess: (id) => {
      toast.success(t('workforce.approvals.deleted') || 'Approval deleted successfully');

      queryClient.setQueriesData(
        { queryKey: ["workflowApprovals"] },
        (oldData: any) => {
          if (!oldData || !oldData.pages) return oldData;

          const newPages = oldData.pages.map((page: any) => ({
            ...page,
            data: page.data?.filter((approval: IWorkflowApproval) => approval.workflow_approval_id !== id) || [],
            total: Math.max(0, (page.total || 0) - 1)
          }));

          return {
            ...oldData,
            pages: newPages
          };
        }
      );
    },
    onError: (error: any) => {
      const errorMessage = error?.response?.data?.message || error?.message || 'Failed to delete approval';
      toast.error(t('workforce.approvals.deleteFailed') || errorMessage);
    },
  });

  return {
    createApproval: createApprovalMutation.mutate,
    updateApproval: updateApprovalMutation.mutate,
    processApproval: processApprovalMutation.mutate,
    deleteApproval: deleteApprovalMutation.mutate,
    isCreating: createApprovalMutation.isPending,
    isUpdating: updateApprovalMutation.isPending,
    isProcessing: processApprovalMutation.isPending,
    isDeleting: deleteApprovalMutation.isPending,
  };
}