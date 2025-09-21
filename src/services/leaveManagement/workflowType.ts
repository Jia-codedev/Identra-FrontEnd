import apiClient from '@/configs/api/Axios';

class WorkflowTypeApi {
  // Dropdown / minimal list
  dropdown() {
    return apiClient.get('/workflowType/dropdown');
  }
}

const workflowTypeApi = new WorkflowTypeApi();
export default workflowTypeApi;
