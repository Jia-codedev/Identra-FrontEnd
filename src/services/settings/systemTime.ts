import apiClient from "@/configs/api/Axios";

class SystemTimeApi {
  getServerTime() {
    return apiClient.get("/systime/");
  }

  getServerTimeWithTimezone() {
    return apiClient.get("/systime/autozone");
  }
}

const systemTimeApi = new SystemTimeApi();
export default systemTimeApi;