import apiClient from "@/configs/api/Axios";
import {
  IWorkflowApproval,
  CreateWorkflowApprovalData,
  UpdateWorkflowApprovalData,
  ApprovalActionData
} from "@/modules/workforce/approvals/types";

class WorkflowApprovalApi {
  // Get all workflow approvals with pagination and filters
  getWorkflowApprovals(params: {
    offset?: number;
    limit?: number;
    request_id?: number;
    approver_id?: number;
    approval_status?: string;
    employee_number?: string;
    employee_name?: string;
    from_date?: string;
    to_date?: string;
  } = {}) {
    return apiClient.get("/workflowApproval/all", { params });
  }

  // Get workflow approval by ID
  getWorkflowApprovalById(id: number) {
    return apiClient.get(`/workflowApproval/get/${id}`);
  }

  // Get approvals by approver
  getApprovalsByApprover(approverId: number, status?: string) {
    return apiClient.get(`/workflowApproval/approver/${approverId}`, {
      params: status ? { status } : {}
    });
  }

  // Get pending approvals by approver
  getPendingApprovalsByApprover(approverId: number) {
    return apiClient.get(`/workflowApproval/pending/${approverId}`);
  }

  // Create new workflow approval
  createWorkflowApproval(data: CreateWorkflowApprovalData) {
    return apiClient.post("/workflowApproval/add", data);
  }

  // Update workflow approval
  updateWorkflowApproval(id: number, data: UpdateWorkflowApprovalData) {
    return apiClient.put(`/workflowApproval/edit/${id}`, data);
  }

  // Process approval action (approve/reject)
  processApproval(id: number, data: ApprovalActionData) {
    return apiClient.put(`/workflowApproval/process/${id}`, data);
  }

  // Delete workflow approval
  deleteWorkflowApproval(id: number) {
    return apiClient.delete(`/workflowApproval/delete/${id}`);
  }

  // Get workflow steps progress
  getWorkflowStepsProgress(requestId: number) {
    return apiClient.get(`/workflowApproval/progress/${requestId}`);
  }
}

const workflowApprovalApi = new WorkflowApprovalApi();
export default workflowApprovalApi;