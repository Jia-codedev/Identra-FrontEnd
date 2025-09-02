"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import workflowTypesApi from "@/services/leaveManagement/workflowTypes";

export default function useWorkflowMutations() {
  const queryClient = useQueryClient();

  const invalidateQueries = () => {
    queryClient.invalidateQueries({ queryKey: ["workflow-types"] });
    queryClient.invalidateQueries({ queryKey: ["workflow-steps"] });
    queryClient.invalidateQueries({ queryKey: ["workflow-requests"] });
  };

  // Workflow Type mutations
  const createWorkflowType = useMutation({
    mutationFn: workflowTypesApi.createWorkflowType,
    onSuccess: () => {
      invalidateQueries();
      toast.success("Workflow type created successfully");
    },
    onError: (error: any) => {
      toast.error(error?.message || "Failed to create workflow type");
    },
  });

  const updateWorkflowType = useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) =>
      workflowTypesApi.updateWorkflowType(id, data),
    onSuccess: () => {
      invalidateQueries();
      toast.success("Workflow type updated successfully");
    },
    onError: (error: any) => {
      toast.error(error?.message || "Failed to update workflow type");
    },
  });

  const deleteWorkflowType = useMutation({
    mutationFn: workflowTypesApi.deleteWorkflowType,
    onSuccess: () => {
      invalidateQueries();
      toast.success("Workflow type deleted successfully");
    },
    onError: (error: any) => {
      toast.error(error?.message || "Failed to delete workflow type");
    },
  });

  // Workflow Step mutations
  const createWorkflowStep = useMutation({
    mutationFn: workflowTypesApi.createWorkflowStep,
    onSuccess: () => {
      invalidateQueries();
      toast.success("Workflow step created successfully");
    },
    onError: (error: any) => {
      toast.error(error?.message || "Failed to create workflow step");
    },
  });

  const updateWorkflowStep = useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) =>
      workflowTypesApi.updateWorkflowStep(id, data),
    onSuccess: () => {
      invalidateQueries();
      toast.success("Workflow step updated successfully");
    },
    onError: (error: any) => {
      toast.error(error?.message || "Failed to update workflow step");
    },
  });

  const deleteWorkflowStep = useMutation({
    mutationFn: workflowTypesApi.deleteWorkflowStep,
    onSuccess: () => {
      invalidateQueries();
      toast.success("Workflow step deleted successfully");
    },
    onError: (error: any) => {
      toast.error(error?.message || "Failed to delete workflow step");
    },
  });

  // Workflow Request mutations
  const createWorkflowRequest = useMutation({
    mutationFn: workflowTypesApi.createWorkflowRequest,
    onSuccess: () => {
      invalidateQueries();
      toast.success("Workflow request created successfully");
    },
    onError: (error: any) => {
      toast.error(error?.message || "Failed to create workflow request");
    },
  });

  const updateWorkflowRequest = useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) =>
      workflowTypesApi.updateWorkflowRequest(id, data),
    onSuccess: () => {
      invalidateQueries();
      toast.success("Workflow request updated successfully");
    },
    onError: (error: any) => {
      toast.error(error?.message || "Failed to update workflow request");
    },
  });

  const deleteWorkflowRequest = useMutation({
    mutationFn: workflowTypesApi.deleteWorkflowRequest,
    onSuccess: () => {
      invalidateQueries();
      toast.success("Workflow request deleted successfully");
    },
    onError: (error: any) => {
      toast.error(error?.message || "Failed to delete workflow request");
    },
  });

  return {
    // Workflow Type mutations
    createWorkflowType,
    updateWorkflowType,
    deleteWorkflowType,

    // Workflow Step mutations
    createWorkflowStep,
    updateWorkflowStep,
    deleteWorkflowStep,

    // Workflow Request mutations
    createWorkflowRequest,
    updateWorkflowRequest,
    deleteWorkflowRequest,
  };
}
