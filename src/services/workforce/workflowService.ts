import apiClient from "@/configs/api/Axios";

class WorkflowApi {
    getWorkflows(
        { offset = 0, limit = 10, search = "" } = {} as {
            offset?: number;
            limit?: number;
            search?: string;
        }
    ) {
    return apiClient.get("/workflowType/all", {
            params: {
                offset,
                limit,
                ...(search && { name: search }),
            },
        });
    }

    getWorkflowById(id: number) {
    return apiClient.get(`/workflowType/get/${id}`);
    }

    addWorkflow(data: any) {
    return apiClient.post("/workflowType/add", data);
    }

    updateWorkflow(id: number, data: any) {
    return apiClient.put(`/workflowType/edit/${id}`, data);
    }

    deleteWorkflow(id: number) {
    return apiClient.delete(`/workflowType/delete/${id}`);
    }
}

const workflowApi = new WorkflowApi();
export default workflowApi;
