import apiClient from "@/configs/api/Axios";

class WorkflowStepsApi {
  addStep(data: any) {
    return apiClient.post("/workflowTypeStep/add", data);
  }

  getStepsByWorkflow(workflowId: number) {
    return apiClient.get(`/workflowTypeStep/workflow/${workflowId}`);
  }

  deleteStep(id: number) {
    return apiClient.delete(`/workflowTypeStep/delete/${id}`);
  }
}

const workflowStepsApi = new WorkflowStepsApi();
export default workflowStepsApi;
