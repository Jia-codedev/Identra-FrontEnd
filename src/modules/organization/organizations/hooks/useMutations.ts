import { useMutation, useQueryClient } from "@tanstack/react-query";
import { IOrganization } from "../types";
import { toast } from "sonner";
import organizationsApi from "@/services/masterdata/organizations";
import { useTranslations } from "@/hooks/use-translations";

export function useOrganizationMutations() {
  const queryClient = useQueryClient();
  const { t } = useTranslations();
  // Helpers to update all queries whose key starts with ['organizations']
  const addCreatedOrganizationToCache = (createdOrg: any) => {
    // get all queries that match the organizations key prefix
    const queries = queryClient.getQueriesData({ queryKey: ["organizations"] });
    queries.forEach(([queryKey, oldData]: any) => {
      if (!oldData) return;

      // infinite query shape (React Query): { pages: [{ data: [...] }, ...], pageParams: [...] }
      if (oldData.pages && Array.isArray(oldData.pages)) {
        const firstPage = oldData.pages[0] || { data: [] };
        const newFirstPage = {
          ...firstPage,
          data: [createdOrg, ...(firstPage.data || [])],
        };
        const newData = {
          ...oldData,
          pages: [newFirstPage, ...oldData.pages.slice(1)],
        };
        queryClient.setQueryData(queryKey as any, newData);
        return;
      }

      // plain array
      if (Array.isArray(oldData)) {
        queryClient.setQueryData(queryKey as any, [createdOrg, ...oldData]);
        return;
      }

      // object with data array: { data: [...], meta: {...} }
      if (oldData.data && Array.isArray(oldData.data)) {
        queryClient.setQueryData(queryKey as any, {
          ...oldData,
          data: [createdOrg, ...oldData.data],
        });
        return;
      }
    });
  };

  const replaceUpdatedOrganizationInCache = (updatedOrg: any) => {
    const queries = queryClient.getQueriesData({ queryKey: ["organizations"] });
    const updatedId = updatedOrg.organization_id ?? updatedOrg.id;
    queries.forEach(([queryKey, oldData]: any) => {
      if (!oldData) return;

      if (oldData.pages && Array.isArray(oldData.pages)) {
        const updatedPages = oldData.pages.map((page: any) => ({
          ...page,
          data: Array.isArray(page.data)
            ? page.data.map((organization: any) => {
                const orgId = organization.organization_id ?? organization.id;
                return orgId === updatedId
                  ? { ...organization, ...updatedOrg }
                  : organization;
              })
            : page.data,
        }));
        queryClient.setQueryData(queryKey as any, {
          ...oldData,
          pages: updatedPages,
        });
        return;
      }

      if (Array.isArray(oldData)) {
        const newArr = oldData.map((organization: any) => {
          const orgId = organization.organization_id ?? organization.id;
          return orgId === updatedId
            ? { ...organization, ...updatedOrg }
            : organization;
        });
        queryClient.setQueryData(queryKey as any, newArr);
        return;
      }

      if (oldData.data && Array.isArray(oldData.data)) {
        const newDataArr = oldData.data.map((organization: any) => {
          const orgId = organization.organization_id ?? organization.id;
          return orgId === updatedId
            ? { ...organization, ...updatedOrg }
            : organization;
        });
        queryClient.setQueryData(queryKey as any, {
          ...oldData,
          data: newDataArr,
        });
        return;
      }
    });
  };
  const createOrganizationMutation = useMutation({
    mutationFn: async ({
      organizationData,
      onClose,
      search,
      pageSize,
    }: {
      organizationData: IOrganization;
      onClose: () => void;
      search: string;
      pageSize: number;
    }) => {
      const data = await organizationsApi.addOrganization(organizationData);
      if (data.status !== 201) {
        toast.error(data.data?.message || t("toast.error.general"));
        return null;
      }
      onClose();
      let updatedOrganizationData = undefined;
      if (data && data.data && data.data.data) {
        updatedOrganizationData = data.data.data;
      } else if (data && data.data) {
        updatedOrganizationData = data.data;
      } else {
        updatedOrganizationData = undefined;
      }
      return { data: updatedOrganizationData, onClose, search, pageSize };
    },
    onSuccess: (data) => {
      if (!data) return;
      toast.success(t("toast.success.created"));
      // update all cached organizations queries so the created record appears in UI
      if (data.data) addCreatedOrganizationToCache(data.data);
    },
    onError: (error) => {
      console.error("Error creating region:", error);
    },
  });
  const updateOrganizationMutation = useMutation({
    mutationFn: async ({
      id,
      organizationData,
      onClose,
      search,
      pageSize,
    }: {
      id: number;
      organizationData: IOrganization;
      onClose: () => void;
      search: string;
      pageSize: number;
    }) => {
      const data = await organizationsApi.updateOrganization(
        id,
        organizationData
      );
      if (data.status !== 200) {
        toast.error(data.data?.message || t("toast.error.general"));
        return null;
      }
      onClose();
      let updatedOrganizationData = undefined;
      if (data && data.data && data.data.data) {
        updatedOrganizationData = data.data.data;
      } else if (data && data.data) {
        updatedOrganizationData = data.data;
      } else {
        updatedOrganizationData = undefined;
      }
      return { data: updatedOrganizationData, onClose, search, pageSize };
    },
    onSuccess: (data) => {
      if (!data) return;
      toast.success(t("toast.success.updated"));
      // update all cached organizations queries so the updated record shows across views
      if (data.data) replaceUpdatedOrganizationInCache(data.data);
    },
    onError: (error) => {
      console.error("Error updating organization:", error);
    },
  });
  const deleteOrganizationMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await organizationsApi.deleteOrganization(id);
      if (response?.status === 409) {
        toast.error(
          response.data?.message || t("toast.error.foreignKeyConstraint")
        );
        return null;
      }
      if (response?.status !== 200) {
        toast.error(response.data?.message || t("toast.error.general"));
        return null;
      }
      return response;
    },
    onSuccess: (data) => {
      if (!data) return;
      toast.success(t("toast.success.deleted"));
      queryClient.invalidateQueries({ queryKey: ["organizations"] });
    },
    onError: (error) => {
      toast.error(t("toast.error.general"));
      console.error("Error deleting organization:", error);
    },
  });
  const deleteOrganizationsMutation = useMutation({
    mutationFn: async (ids: number[]) => {
      const response = await organizationsApi.deleteOrganizations(ids);
      if (response?.status === 409) {
        toast.error(
          response.data?.message || t("toast.error.foreignKeyConstraint")
        );
        return null;
      }
      if (response?.status !== 200) {
        toast.error(response.data?.message || t("toast.error.general"));
        return null;
      }
      return response;
    },
    onSuccess: (data) => {
      if (!data) return;
      toast.success(t("toast.success.deletedMultiple"));
      queryClient.invalidateQueries({ queryKey: ["organizations"] });
    },
    onError: (error) => {
      toast.error(t("toast.error.general"));
      console.error("Error deleting organizations:", error);
    },
  });
  return {
    createOrganization: createOrganizationMutation.mutate,
    updateOrganization: updateOrganizationMutation.mutate,
    deleteOrganization: deleteOrganizationMutation.mutate,
    deleteOrganizations: deleteOrganizationsMutation.mutate,
  };
}
