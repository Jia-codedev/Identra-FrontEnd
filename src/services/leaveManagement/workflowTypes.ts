import apiClient from '@/configs/api/Axios';

export interface WorkflowType {
  workflow_id: number;
  workflow_code: string;
  workflow_name_eng?: string;
  workflow_name_arb?: string;
  description?: string;
  created_date?: string;
  last_updated_date?: string;
  is_active?: boolean;
}

export interface WorkflowTypeStep {
  step_id: number;
  workflow_id: number;
  step_number: number;
  step_name_eng?: string;
  step_name_arb?: string;
  approver_level?: number;
  is_final_step?: boolean;
  created_date?: string;
  last_updated_date?: string;
  is_active?: boolean;
}

export interface WorkflowRequest {
  request_id: number;
  workflow_id: number;
  request_type: string;
  requestor_employee_id: number;
  current_step_id?: number;
  status: string;
  request_data?: any;
  created_date?: string;
  last_updated_date?: string;
}

const workflowTypesApi = {
  // Workflow Types
  getAllWorkflowTypes: () =>
    apiClient.get("/workflowType/all"),

  getWorkflowTypeById: (id: number) =>
    apiClient.get(`/workflowType/get/${id}`),

  createWorkflowType: (data: Partial<WorkflowType>) =>
    apiClient.post("/workflowType/add", data),

  updateWorkflowType: (id: number, data: Partial<WorkflowType>) =>
    apiClient.put(`/workflowType/edit/${id}`, data),

  deleteWorkflowType: (id: number) =>
    apiClient.delete(`/workflowType/delete/${id}`),

  searchWorkflowTypes: (params: { code?: string; name?: string; limit?: number; offset?: number }) =>
    apiClient.get("/workflowType/search", { params }),

  // Workflow Type Steps
  getAllWorkflowSteps: () =>
    apiClient.get("/workflowTypeStep/all"),

  getWorkflowStepById: (id: number) =>
    apiClient.get(`/workflowTypeStep/get/${id}`),

  getWorkflowStepsByWorkflowId: (workflowId: number) =>
    apiClient.get(`/workflowTypeStep/workflow/${workflowId}`),

  createWorkflowStep: (data: Partial<WorkflowTypeStep>) =>
    apiClient.post("/workflowTypeStep/add", data),

  updateWorkflowStep: (id: number, data: Partial<WorkflowTypeStep>) =>
    apiClient.put(`/workflowTypeStep/edit/${id}`, data),

  deleteWorkflowStep: (id: number) =>
    apiClient.delete(`/workflowTypeStep/delete/${id}`),

  // Workflow Requests (if needed later)
  getAllWorkflowRequests: () =>
    apiClient.get("/workflowRequest/all"),

  getWorkflowRequestById: (id: number) =>
    apiClient.get(`/workflowRequest/${id}`),

  createWorkflowRequest: (data: Partial<WorkflowRequest>) =>
    apiClient.post("/workflowRequest/add", data),

  // Initiate workflow - creates request with all approval steps
  initiateWorkflow: (data: {
    workflow_id: number;
    transaction_id: number;
    requestor_id: number;
    request_date?: string;
    action_remarks?: string;
  }) =>
    apiClient.post("/workflowRequest/initiate", data),

  updateWorkflowRequest: (id: number, data: Partial<WorkflowRequest>) =>
    apiClient.put(`/workflowRequest/${id}`, data),

  deleteWorkflowRequest: (id: number) =>
    apiClient.delete(`/workflowRequest/${id}`),
};

export default workflowTypesApi;
