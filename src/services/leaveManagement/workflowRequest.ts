import apiClient from '@/configs/api/Axios';

export interface WorkflowRequestResponse {
  request_id: number;
  workflow_id: number;
  transaction_id: number;
  requestor_id: number;
  request_date: string;
  current_status: string;
  action_remarks?: string;
  created_date: string;
  last_updated_date: string;
}

export interface WorkflowApprovalStep {
  step_order: number;
  step_description: string;
  approver_id: number;
  approver_name: string;
  status: string;
  is_final_step: boolean;
}

export interface InitiateWorkflowResponse {
  message: string;
  data: {
    workflow_request: WorkflowRequestResponse;
    current_step: {
      step_order: number;
      description: string;
      assigned_to: number;
      approver_name: string;
    };
    total_steps: number;
    all_approval_steps: WorkflowApprovalStep[];
    workflow_summary: {
      request_id: number;
      workflow_id: number;
      requestor_id: number;
      current_status: string;
      steps_created: number;
      active_step: number;
    };
  };
}

const workflowRequestApi = {
  // Get all workflow requests
  getAllWorkflowRequests: (params?: {
    workflow_id?: number;
    requestor_id?: number;
    current_status?: string;
    limit?: number;
    offset?: number;
  }) =>
    apiClient.get("/workflowRequest/all", { params }),

  // Get workflow request by ID
  getWorkflowRequestById: (id: number) =>
    apiClient.get(`/workflowRequest/${id}`),

  // Get workflow requests by requestor
  getWorkflowRequestsByRequestor: (requestorId: number) =>
    apiClient.get(`/workflowRequest/requestor/${requestorId}`),

  // Create a basic workflow request
  createWorkflowRequest: (data: {
    workflow_id: number;
    transaction_id: number;
    requestor_id: number;
    request_date?: string;
    current_status?: string;
    action_remarks?: string;
  }) =>
    apiClient.post("/workflowRequest/add", data),

  // Initiate workflow with all approval steps
  initiateWorkflow: (data: {
    workflow_id: number;
    transaction_id: number;
    requestor_id: number;
    request_date?: string;
    action_remarks?: string;
  }): Promise<{ data: InitiateWorkflowResponse }> =>
    apiClient.post("/workflowRequest/initiate", data),

  // Update workflow request
  updateWorkflowRequest: (id: number, data: {
    workflow_id?: number;
    transaction_id?: number;
    requestor_id?: number;
    request_date?: string;
    current_status?: string;
    action_remarks?: string;
  }) =>
    apiClient.put(`/workflowRequest/${id}`, data),

  // Update workflow status
  updateWorkflowStatus: (id: number, data: {
    current_status: string;
    action_remarks?: string;
  }) =>
    apiClient.put(`/workflowRequest/${id}/status`, data),

  // Delete workflow request
  deleteWorkflowRequest: (id: number) =>
    apiClient.delete(`/workflowRequest/${id}`),
};

export default workflowRequestApi;
