import { useMutation, useQueryClient } from "@tanstack/react-query";
import { IAppSetting } from "../types";
import { toast } from "sonner";
import appSettingsApi from "@/services/settings/appSettings";
import { useTranslations } from '@/hooks/use-translations';

export function useAppSettingMutations() {
  const queryClient = useQueryClient();
  const { t } = useTranslations();

  const createAppSettingMutation = useMutation({
    mutationFn: async (appSettingData: IAppSetting) => {
      if (!appSettingData || typeof appSettingData !== 'object') {
        throw new Error('Invalid app setting data');
      }
      if (!appSettingData.version_name || appSettingData.version_name.trim() === '') {
        throw new Error('Version name is required');
      }

      const createData = {
        version_name: appSettingData.version_name,
        value: appSettingData.value || undefined,
        descr: appSettingData.descr || undefined,
        tab_no: appSettingData.tab_no || undefined,
      };

      const response = await appSettingsApi.createAppSetting(createData);
      return response.data;
    },
    onSuccess: (data) => {
      if (!data) return;
      toast.success(t('toast.success.created') || 'App setting created successfully');

      queryClient.setQueriesData(
        { queryKey: ["appSettings"] },
        (oldData: any) => {
          if (!oldData || !oldData.pages) return oldData;

          const newPages = [...oldData.pages];
          if (newPages[0] && newPages[0].data) {
            newPages[0] = {
              ...newPages[0],
              data: [data.data || data, ...newPages[0].data],
              total: (newPages[0].total || 0) + 1
            };
          }

          return {
            ...oldData,
            pages: newPages
          };
        }
      );
    },
    onError: (error: any) => {
      console.error("Error creating app setting:", error);

      if (error?.status === 409 || error?.response?.status === 409) {
        const conflictMessage = error?.message || error?.response?.data?.message;
        if (conflictMessage?.toLowerCase().includes('version_name') || conflictMessage?.toLowerCase().includes('version name')) {
          toast.error('Version name already exists. Please use a different version name.');
        } else {
          toast.error(conflictMessage || 'Duplicate entry found. Please check your data and try again.');
        }
      } else {
        const errorMessage =
          error?.response?.data?.message ||
          error?.message ||
          (t('toast.error.creating') || 'Error creating app setting');
        toast.error(errorMessage);
      }
    },
  });

  const updateAppSettingMutation = useMutation({
    mutationFn: async ({
      versionName,
      appSettingData,
    }: {
      versionName: string;
      appSettingData: Partial<IAppSetting>;
    }) => {
      const updateData = {
        version_name: appSettingData.version_name || versionName,
        value: appSettingData.value || undefined,
        descr: appSettingData.descr || undefined,
        tab_no: appSettingData.tab_no || undefined,
      };

      const response = await appSettingsApi.updateAppSetting(versionName, updateData);
      return { versionName, data: response.data };
    },
    onSuccess: ({ versionName, data }) => {
      toast.success(t('toast.success.updated') || 'App setting updated successfully');

      queryClient.setQueryData(["appSetting", versionName], data.data || data);

      queryClient.setQueriesData(
        { queryKey: ["appSettings"] },
        (oldData: any) => {
          if (!oldData || !oldData.pages) return oldData;

          const updatedPages = oldData.pages.map((page: any) => ({
            ...page,
            data: page.data?.map((setting: IAppSetting) =>
              setting.version_name === versionName
                ? { ...setting, ...(data.data || data) }
                : setting
            ) || []
          }));

          return {
            ...oldData,
            pages: updatedPages
          };
        }
      );
    },
    onError: (error: any) => {
      console.error("Error updating app setting:", error);
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        (t('toast.error.updating') || 'Error updating app setting');
      toast.error(errorMessage);
    },
  });

  const deleteAppSettingMutation = useMutation({
    mutationFn: async (versionName: string) => {
      await appSettingsApi.deleteAppSetting(versionName);
      return versionName;
    },
    onSuccess: (versionName) => {
      toast.success(t('toast.success.deleted') || 'App setting deleted successfully');

      queryClient.setQueriesData(
        { queryKey: ["appSettings"] },
        (oldData: any) => {
          if (!oldData || !oldData.pages) return oldData;

          const updatedPages = oldData.pages.map((page: any) => ({
            ...page,
            data: page.data?.filter((setting: IAppSetting) => setting.version_name !== versionName) || [],
            total: Math.max(0, (page.total || 0) - 1)
          }));

          return {
            ...oldData,
            pages: updatedPages
          };
        }
      );
    },
    onError: (error: any) => {
      console.error("Error deleting app setting:", error);
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        (t('toast.error.deleting') || 'Error deleting app setting');
      toast.error(errorMessage);
    },
  });

  const deleteAppSettingsMutation = useMutation({
    mutationFn: async (versionNames: string[]) => {
      await appSettingsApi.deleteAppSettings(versionNames);
      return versionNames;
    },
    onSuccess: (versionNames) => {
      toast.success(`${t('toast.success.deleted') || 'App settings deleted successfully'} (${versionNames.length})`);

      queryClient.setQueriesData(
        { queryKey: ["appSettings"] },
        (oldData: any) => {
          if (!oldData || !oldData.pages) return oldData;

          const updatedPages = oldData.pages.map((page: any) => ({
            ...page,
            data: page.data?.filter((setting: IAppSetting) => !versionNames.includes(setting.version_name)) || [],
            total: Math.max(0, (page.total || 0) - versionNames.length)
          }));

          return {
            ...oldData,
            pages: updatedPages
          };
        }
      );
    },
    onError: (error: any) => {
      console.error("Error deleting app settings:", error);
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        (t('toast.error.deleting') || 'Error deleting app settings');
      toast.error(errorMessage);
    },
  });

  return {
    createAppSetting: createAppSettingMutation.mutate,
    updateAppSetting: (versionName: string, appSettingData: Partial<IAppSetting>) =>
      updateAppSettingMutation.mutate({ versionName, appSettingData }),
    deleteAppSetting: deleteAppSettingMutation.mutate,
    deleteAppSettings: deleteAppSettingsMutation.mutate,
    isCreating: createAppSettingMutation.isPending,
    isUpdating: updateAppSettingMutation.isPending,
    isDeleting: deleteAppSettingMutation.isPending,
    isDeletingMultiple: deleteAppSettingsMutation.isPending,
  };
};