import sitesApi from "@/services/masterdata/site";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ISite } from "../types";
import { toast } from "sonner";
import { useTranslations } from "@/hooks/use-translations";
import { isAxiosError } from "axios";

export function useSiteMutations() {
  const queryClient = useQueryClient();
  const { t } = useTranslations();

  const createSiteMutation = useMutation({
    mutationFn: async ({
      siteData,
      onClose,
      search,
      pageSize,
    }: {
      siteData: ISite;
      onClose: () => void;
      search: string;
      pageSize: number;
    }) => {
      const data = await sitesApi.addSite(siteData);
      if (data.status !== 201) {
        toast.error(data.data?.message || t("toast.error.creating"));
        return null;
      }
      onClose();
      let updatedSiteData = data?.data?.data || data?.data || undefined;
      return { data: updatedSiteData, onClose, search, pageSize };
    },
    onSuccess: (data) => {
      if (!data) return;
      toast.success(t("toast.success.created"));
      // Invalidate all `sites` queries so they refetch
      queryClient.invalidateQueries({ predicate: (query) => Array.isArray(query.queryKey) && query.queryKey[0] === "sites" });
      // Also try to update any matching cached list (same search + pageSize) by prepending the new site
      const newSite = data.data;
      const queries = queryClient.getQueriesData({ predicate: (query: any) => Array.isArray(query.queryKey) && query.queryKey[0] === "sites" });
      queries.forEach(([queryKey, queryData]: any) => {
        const searchKey = queryKey[1] ?? "";
        const pageSizeKey = queryKey[2] ?? 5;
        if (searchKey !== (data.search ?? "") || pageSizeKey !== (data.pageSize ?? 5)) return;
        if (!queryData || !queryData.pages) return;
        const firstPage = queryData.pages[0] || { data: [] };
        const newFirstPage = { ...firstPage, data: [newSite, ...(firstPage.data || [])] };
        const newQueryData = { ...queryData, pages: [newFirstPage, ...queryData.pages.slice(1)] };
        queryClient.setQueryData(queryKey, newQueryData);
      });
    },
    onError: (error) => {
      console.error("Error creating site:", error);
    },
  });

  const deleteSiteMutation = useMutation({
    mutationFn: async (id: number) => {
      return await sitesApi.deleteSite(id);
    },
    onSuccess: () => {
      toast.success(t("toast.success.deleted"));
      queryClient.invalidateQueries({ queryKey: ["sites"] });
      queryClient.invalidateQueries({ predicate: (query) => Array.isArray(query.queryKey) && query.queryKey[0] === "sites" });
    },
    onError: (error) => {
      if (isAxiosError(error) && error.response?.status === 409) {
        const serverMessage = (error.response?.data as any)?.message;
        toast.error(serverMessage || "This site cannot be deleted because it's associated with other records.");
      } else {
        const serverMessage = isAxiosError(error) ? (error.response?.data as any)?.message : undefined;
        toast.error(serverMessage || t("toast.error.deleting"));
      }
      console.debug(
        "deleteSite error:",
        isAxiosError(error) ? error.response?.data ?? error.message : error?.message ?? error
      );
    },
  });

  const updateSiteMutation = useMutation({
    mutationFn: async ({
      id,
      siteData,
      onClose,
      search,
      pageSize,
    }: {
      id: number;
      siteData: ISite;
      onClose: () => void;
      search: string;
      pageSize: number;
    }) => {
      try {
        const data = await sitesApi.updateSite(id, siteData);
        if (data.status !== 200) {
          const msg = data?.data?.message;
          // Throw so onError receives it
          throw new Error(msg || t("toast.error.updating"));
        }
        onClose();
        let updatedSiteData = data?.data?.data || data?.data || undefined;
        return { data: updatedSiteData, onClose, search, pageSize };
      } catch (err: any) {
        // Rethrow original Axios error so onError can inspect status/response
        throw err;
      }
    },
    onSuccess: (data) => {
      if (!data) return;
      toast.success(t("toast.success.updated"));
      // Invalidate all `sites` queries so UI refetches
      queryClient.invalidateQueries({ predicate: (q: any) => Array.isArray(q.queryKey) && q.queryKey[0] === "sites" });
      // Optimistically update any matching cached lists for the same search/pageSize
      const updatedSite = data.data;
      const cached = queryClient.getQueriesData({ predicate: (q: any) => Array.isArray(q.queryKey) && q.queryKey[0] === "sites" });
      cached.forEach(([queryKey, queryData]: any) => {
        if (!Array.isArray(queryKey)) return;
        const searchKey = queryKey[1] ?? "";
        const pageSizeKey = queryKey[2] ?? 5;
        if (searchKey !== (data.search ?? "") || pageSizeKey !== (data.pageSize ?? 5)) return;
        if (!queryData || !queryData.pages) return;
        const updatedPages = queryData.pages.map((p: any) => ({
          ...p,
          data: Array.isArray(p.data)
            ? p.data.map((site: ISite) => (site.location_id === updatedSite.location_id ? updatedSite : site))
            : [],
        }));
        queryClient.setQueryData(queryKey, { ...queryData, pages: updatedPages });
      });
    },
    onError: (error) => {
      const safeStringify = (v: any) => {
        try {
          return JSON.stringify(v, (_k, val) => (typeof val === 'bigint' ? String(val) : val));
        } catch (e) {
          return String(v);
        }
      };

      if (isAxiosError(error)) {
        const status = error.response?.status;
        const url = error.config?.url;
        const requestData = error.config?.data;
        const responseData = error.response?.data;
        const serverMessage = (responseData as any)?.message || error.message || undefined;
        const logObj = {
          status,
          url,
          requestData: requestData ? safeStringify(requestData) : undefined,
          responseData: responseData ? safeStringify(responseData) : undefined,
        };
        toast.error(serverMessage || t("toast.error.updating") || 'Update failed');
        console.error("Error updating site:", logObj);
      } else {
        const msg = (error as any)?.message || String(error) || 'Unknown error';
        toast.error(msg || t("toast.error.updating") || 'Update failed');
        console.error("Error updating site:", msg, error?.stack || undefined);
      }
    },
  });

  const deleteSitesMutation = useMutation({
    mutationFn: async (ids: number[]) => {
      return await sitesApi.deleteSites(ids);
    },
    onSuccess: (data) => {
      if (!data) return;
      toast.success(t("toast.success.deletedMultiple"));
      queryClient.invalidateQueries({ queryKey: ["sites"] });
      queryClient.invalidateQueries({
        predicate: (query) =>
          Array.isArray(query.queryKey) && query.queryKey[0] === "sites",
      });
    },
    onError: (error) => {
      if (isAxiosError(error) && error.response?.status === 409) {
        const serverMessage = (error.response?.data as any)?.message;
        toast.error(
          serverMessage ||
            "Some sites cannot be deleted as they are associated with other records."
        );
      } else {
        const serverMessage = isAxiosError(error)
          ? (error.response?.data as any)?.message
          : undefined;
        toast.error(serverMessage || t("toast.error.deletingMultiple"));
      }
      console.debug(
        "deleteSites error:",
        isAxiosError(error)
          ? error.response?.data ?? error.message
          : error?.message ?? error
      );
    },
  });

  return {
    createSite: createSiteMutation.mutate,
    updateSite: updateSiteMutation.mutate,
    deleteSite: deleteSiteMutation.mutate,
    deleteSites: deleteSitesMutation.mutate,
  };
}

export const useRegionMutations = () => {
  return {
    createRegion: ({
      regionData,
      onClose,
      search,
      pageSize,
    }: {
      regionData: ISite;
      onClose: () => void;
      search: string;
      pageSize: number;
    }) => {},
    updateRegion: ({
      id,
      regionData,
      onClose,
      search,
      pageSize,
    }: {
      id: number;
      regionData: ISite;
      onClose: () => void;
      search: string;
      pageSize: number;
    }) => {},
    deleteRegion: (id: number) => {},
    deleteRegions: (ids: number[]) => {},
  };
};
