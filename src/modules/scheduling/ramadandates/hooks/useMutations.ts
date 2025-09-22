"use client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useTranslations } from "@/hooks/use-translations";
import {
  CreateRamadanDateRequest,
  UpdateRamadanDateRequest,
  IRamadanDate,
} from "../types";
import ramadanDatesApi from "@/services/scheduling/ramadandates";

export const useCreateRamadanDate = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslations();

  return useMutation({
    mutationKey: ["createRamadanDate"],
    mutationFn: (data: CreateRamadanDateRequest) =>
      ramadanDatesApi.addRamadanDate(data),
    onMutate: async (variables: CreateRamadanDateRequest) => {
      await queryClient.cancelQueries({ queryKey: ["ramadanDates"] });

      const previousData = queryClient.getQueriesData({ queryKey: ["ramadanDates"] });

      queryClient.setQueriesData(
        { queryKey: ["ramadanDates"] },
        (old: any) => {
          if (!old || !old.success || !Array.isArray(old.data)) return old;
          
          const optimisticRamadanDate: IRamadanDate = {
            ramadan_id: Date.now(),
            ramadan_name_eng: variables.ramadan_name_eng,
            ramadan_name_arb: variables.ramadan_name_arb,
            remarks: variables.remarks,
            from_date: variables.from_date,
            to_date: variables.to_date,
            created_date: new Date().toISOString(),
          };

          return {
            ...old,
            data: [optimisticRamadanDate, ...old.data],
          };
        }
      );

      return { previousData };
    },
    onSuccess: (response: any, variables: CreateRamadanDateRequest) => {
      queryClient.setQueriesData(
        { queryKey: ["ramadanDates"] },
        (old: any) => {
          if (!old || !old.success || !Array.isArray(old.data)) return old;
          
          const realRamadanDate: IRamadanDate = response?.data?.data || response?.data || {
            ramadan_id: response?.data?.ramadan_id || Date.now(),
            ramadan_name_eng: variables.ramadan_name_eng,
            ramadan_name_arb: variables.ramadan_name_arb,
            remarks: variables.remarks,
            from_date: variables.from_date,
            to_date: variables.to_date,
            created_date: new Date().toISOString(),
          };

          const updatedData = old.data.map((item: IRamadanDate, index: number) => 
            index === 0 ? realRamadanDate : item
          );

          return {
            ...old,
            data: updatedData,
          };
        }
      );

      toast.success(t("scheduling.ramadanDates.created"));
    },
    onError: (error: any, variables: CreateRamadanDateRequest, context: any) => {
      if (context?.previousData) {
        context.previousData.forEach(([queryKey, data]: [any, any]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }

      const errorMessage = error?.response?.data?.message || t("common.error");
      toast.error(errorMessage);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["ramadanDates"] });
    },
  });
};

export const useUpdateRamadanDate = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslations();

  return useMutation({
    mutationKey: ["updateRamadanDate"],
    mutationFn: ({ id, data }: { id: number; data: UpdateRamadanDateRequest }) =>
      ramadanDatesApi.updateRamadanDate(id, data),
    onMutate: async ({ id, data }: { id: number; data: UpdateRamadanDateRequest }) => {
      await queryClient.cancelQueries({ queryKey: ["ramadanDates"] });

      const previousData = queryClient.getQueriesData({ queryKey: ["ramadanDates"] });

      queryClient.setQueriesData(
        { queryKey: ["ramadanDates"] },
        (old: any) => {
          if (!old || !old.success || !Array.isArray(old.data)) return old;
          
          return {
            ...old,
            data: old.data.map((item: IRamadanDate) => 
              item.ramadan_id === id
                ? {
                    ...item,
                    ramadan_name_eng: data.ramadan_name_eng,
                    ramadan_name_arb: data.ramadan_name_arb,
                    remarks: data.remarks,
                    from_date: data.from_date,
                    to_date: data.to_date,
                    updated_date: new Date().toISOString(),
                  }
                : item
            ),
          };
        }
      );

      return { previousData };
    },
    onSuccess: () => {
      toast.success(t("scheduling.ramadanDates.updated"));
    },
    onError: (error: any, variables: any, context: any) => {
      if (context?.previousData) {
        context.previousData.forEach(([queryKey, data]: [any, any]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }

      const errorMessage = error?.response?.data?.message || t("common.error");
      toast.error(errorMessage);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["ramadanDates"] });
    },
  });
};

export const useDeleteRamadanDate = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslations();

  return useMutation({
    mutationKey: ["deleteRamadanDate"],
    mutationFn: (id: number) =>
      ramadanDatesApi.deleteRamadanDate(id),
    onMutate: async (id: number) => {
      await queryClient.cancelQueries({ queryKey: ["ramadanDates"] });

      const previousData = queryClient.getQueriesData({ queryKey: ["ramadanDates"] });

      queryClient.setQueriesData(
        { queryKey: ["ramadanDates"] },
        (old: any) => {
          if (!old || !old.success || !Array.isArray(old.data)) return old;
          
          return {
            ...old,
            data: old.data.filter((item: IRamadanDate) => item.ramadan_id !== id),
          };
        }
      );

      return { previousData };
    },
    onSuccess: () => {
      toast.success(t("scheduling.ramadanDates.deleted"));
    },
    onError: (error: any, variables: any, context: any) => {
      if (context?.previousData) {
        context.previousData.forEach(([queryKey, data]: [any, any]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }

      const errorMessage = error?.response?.data?.message || t("common.error");
      toast.error(errorMessage);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["ramadanDates"] });
    },
  });
};

export const useRamadanDateMutations = () => {
  return {
    createRamadanDate: useCreateRamadanDate(),
    updateRamadanDate: useUpdateRamadanDate(),
    deleteRamadanDate: useDeleteRamadanDate(),
  };
};
