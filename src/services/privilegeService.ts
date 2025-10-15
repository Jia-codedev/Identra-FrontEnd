import apiClient from "@/configs/api/Axios";

type PrivilegeResponse = {
  success: boolean;
  data: Record<string, any>;
  message?: string;
};

class PrivilegeService {
  private lastRequestTime: number = 0;
  private lastRoleId: number | null = null;
  private pendingRequest: Promise<PrivilegeResponse> | null = null;
  private readonly MIN_REQUEST_INTERVAL = 1000;

  async getPrivilegesByRole(roleId?: number): Promise<Record<string, any>> {
    try {
      const now = Date.now();

      if (
        this.lastRoleId === roleId &&
        now - this.lastRequestTime < this.MIN_REQUEST_INTERVAL
      ) {
        if (this.pendingRequest) {
          return await this.pendingRequest;
        }

        const waitTime =
          this.MIN_REQUEST_INTERVAL - (now - this.lastRequestTime);
        await new Promise((resolve) => setTimeout(resolve, waitTime));
      }

      if (this.pendingRequest && this.lastRoleId === roleId) {
        return await this.pendingRequest;
      }

      this.lastRequestTime = Date.now();
      this.lastRoleId = roleId || null;
      this.pendingRequest = apiClient
        .get(`/secRolePrivilege?roleId=${roleId}`)
        .then((response) => {
          const { data } = response.data;
          return data;
        })
        .finally(() => {
          this.pendingRequest = null;
        });

      return await this.pendingRequest;
    } catch (error) {
      this.pendingRequest = null;

      if (error instanceof Error) {
        console.error("Error message:", error.message);
        console.error("Error stack:", error.stack);
      }
      throw error;
    }
  }
}

const privilegeService = new PrivilegeService();
export default privilegeService;
