export interface WorkflowRequest {
  request_id: number;
  workflow_id: number;
  transaction_id: number;
  requestor_id: number;
  request_date: string;
  current_status: string;
  action_remarks?: string;
  created_id: number;
  created_date: string;
  last_updated_id: number;
  last_updated_date: string;
  workflow_name_eng?: string;
  workflow_name_arb?: string;
  workflow_code?: string;
}

export interface WorkflowRequestInput {
  workflow_id: number;
  transaction_id: number;
  requestor_id: number;
  request_date?: string;
  current_status?: string;
  action_remarks?: string;
}
