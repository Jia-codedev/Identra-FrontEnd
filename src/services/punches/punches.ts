import apiClient from "@/configs/api/Axios";

export interface EmployeeEventTransactions {
  transaction_time: Date;
  reason: "IN" | "OUT";
  remarks?: string | null;
  device_id?: number | null;
  user_entry_flag: boolean;
  created_id: number;
  created_date?: Date;
  geolocation?: string | null;
}

const serverTime = apiClient
  .get("/systime")
  .then((res) => new Date(res.data.time));

class EmployeeEventTransactionApi {
  punch(data: EmployeeEventTransactions) {
    return apiClient.post("/employeeEventTransactions/add", {
      ...data,
      transaction_time: serverTime,
    });
  }
}

const employeeEventTransactionApi = new EmployeeEventTransactionApi();
export default employeeEventTransactionApi;
