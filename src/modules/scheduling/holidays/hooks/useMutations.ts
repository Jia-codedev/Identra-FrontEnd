"use client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useTranslations } from "@/hooks/use-translations";
import holidaysApi from "@/services/scheduling/holidays";
import { CreateHolidayRequest, UpdateHolidayRequest } from "../types";

interface MutationProps {
  onClose?: () => void;
  search?: string;
  pageSize?: number;
}

interface CreateHolidayProps extends MutationProps {
  holidayData: CreateHolidayRequest;
}

interface UpdateHolidayProps extends MutationProps {
  id: number;
  holidayData: UpdateHolidayRequest;
}

export const useHolidayMutations = () => {
  const { t } = useTranslations();
  const queryClient = useQueryClient();

  const createHoliday = useMutation({
    mutationFn: ({ holidayData }: CreateHolidayProps) =>
      holidaysApi.addHoliday(holidayData),
    onSuccess: (data, { onClose }) => {
      queryClient.invalidateQueries({ queryKey: ["holidays"] });
      toast.success(t("messages.success.create"));
      onClose?.();
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || t("messages.error.create");
      toast.error(message);
    },
  });

  const updateHoliday = useMutation({
    mutationFn: ({ id, holidayData }: UpdateHolidayProps) =>
      holidaysApi.updateHoliday(id, holidayData),
    onSuccess: (data, { onClose }) => {
      queryClient.invalidateQueries({ queryKey: ["holidays"] });
      toast.success(t("messages.success.update"));
      onClose?.();
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || t("messages.error.update");
      toast.error(message);
    },
  });

  const deleteHoliday = useMutation({
    mutationFn: (id: number) => holidaysApi.deleteHoliday(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["holidays"] });
      toast.success(t("messages.success.delete"));
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || t("messages.error.delete");
      toast.error(message);
    },
  });

  return {
    createHoliday: (props: CreateHolidayProps) => createHoliday.mutate(props),
    updateHoliday: (props: UpdateHolidayProps) => updateHoliday.mutate(props),
    deleteHoliday: (id: number) => deleteHoliday.mutate(id),
    isCreating: createHoliday.isPending,
    isUpdating: updateHoliday.isPending,
    isDeleting: deleteHoliday.isPending,
  };
};
