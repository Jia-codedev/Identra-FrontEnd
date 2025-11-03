export interface IWorkflowApproval {
  workflow_approval_id: number;
  request_id: number;
  workflow_steps_id: number;
  approver_id: number;
  approval_status: string;
  approval_date?: string | null;
  comments?: string | null;
  created_date: string;
  last_updated_date: string;
  created_id: number;
  last_updated_id: number;

  // Joined data
  transaction_id?: number | null;
  requestor_id?: number | null;
  request_status?: string | null;
  step_order?: number | null;
  step_eng?: string | null;
  step_arb?: string | null;
  is_final_step?: boolean | null;
  workflow_name_eng?: string | null;
  workflow_name_arb?: string | null;
  workflow_code?: string | null;
  emp_no?: string | null;
  firstname_eng?: string | null;
  lastname_eng?: string | null;
  firstname_arb?: string | null;
  lastname_arb?: string | null;
  transaction_time?: string | null;
}

export interface WorkflowApprovalState {
  approvals: IWorkflowApproval[];
  total: number;
  page: number;
  pageSize: number;
  isLoading: boolean;
  error: string | null;
}

export interface CreateWorkflowApprovalData {
  request_id: number;
  workflow_steps_id: number;
  approver_id: number;
  approval_status?: string;
  approval_date?: string;
  comments?: string;
}

export interface UpdateWorkflowApprovalData {
  request_id?: number;
  workflow_steps_id?: number;
  approver_id?: number;
  approval_status?: string;
  approval_date?: string;
  comments?: string;
}

export interface ApprovalActionData {
  approval_status: 'APPROVED' | 'REJECTED';
  comments?: string;
  approval_date?: string;
}