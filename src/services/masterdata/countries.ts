import apiClient from "@/configs/api/Axios";

interface ICountry {
  country_id: number;
  country_code: string;
  country_eng?: string;
  country_arb?: string;
  country_flag_url?: string;
  created_id?: number;
  created_date?: Date;
  last_updated_id?: number;
  last_updated_date?: Date;
}

class CountriesApi {
  getCountries(
    { offset = 0, limit = 10, search="" } = {} as {
      offset?: number;
      limit?: number;
      name?: string;
      code?: string;
      search?: string;
    }
  ) {
    return apiClient.get("/countries/all", {
      params: {
        offset,
        limit,
        search,
      },
    });
  }

  getCountryById(id: number) {
    return apiClient.get(`/countries/get/${id}`);
  }

  getCountriesWithoutPagination() {
    return apiClient.get("/countries/all");
  }

  addCountry(data: Partial<ICountry>) {
    return apiClient.post("/countries/add", data);
  }

  updateCountry(id: number, data: Partial<ICountry>) {
    return apiClient.put(`/countries/edit/${id}`, data);
  }

  deleteCountry(id: number) {
    return apiClient.delete(`/countries/delete/${id}`);
  }

  deleteCountries(ids: number[]) {
    return apiClient.delete("/countries/delete", { data: { ids } });
  }
}

const countriesApi = new CountriesApi();
export default countriesApi;
export type { ICountry };
