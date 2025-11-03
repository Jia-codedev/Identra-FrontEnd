import apiClient from "@/configs/api/Axios";

class WorkflowStepsApi {
  addStep(data: any) {
    return apiClient.post("/workflowTypeStep/add", data);
  }

  getStepsByWorkflow(workflowId: number) {
    return apiClient.get(`/workflowTypeStep/workflow/${workflowId}`);
  }

  getStepById(id: number) {
    return apiClient.get(`/workflowTypeStep/get/${id}`);
  }

  editStep(id: number, data: any) {
    return apiClient.put(`/workflowTypeStep/edit/${id}`, data);
  }

  deleteStep(id: number) {
    return apiClient.delete(`/workflowTypeStep/delete/${id}`);
  }
}

const workflowStepsApi = new WorkflowStepsApi();
export default workflowStepsApi;
