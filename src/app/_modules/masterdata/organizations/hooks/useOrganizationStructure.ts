import { useQuery } from "@tanstack/react-query";
import organizationsApi from "@/services/masterdata/organizations";
import { IOrganizationStructure } from "../types";

export function useOrganizationStructure() {
    return useQuery<{
        success: boolean;
        data: IOrganizationStructure[];
        total: number;
    }>({
        queryKey: ["organization-structure"],
        queryFn: async () => {
            const response = await organizationsApi.getOrganizationStructure();
            return response.data;
        },
    });
}
