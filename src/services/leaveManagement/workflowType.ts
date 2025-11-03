import apiClient from '@/configs/api/Axios';

class WorkflowTypeApi {
  dropdown() {
    return apiClient.get('/workflowType/dropdown');
  }
}

const workflowTypeApi = new WorkflowTypeApi();
export default workflowTypeApi;
