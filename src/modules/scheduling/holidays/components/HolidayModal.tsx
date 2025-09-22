"use client";

import React, { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/Textarea";
import { Switch } from "@/components/ui/switch";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useTranslations } from "@/hooks/use-translations";
import { useLanguage } from "@/providers/language-provider";
import { IHoliday, CreateHolidayRequest } from "../types";
import { Calendar as CalendarIcon, Save, X } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface HolidayModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: CreateHolidayRequest) => void;
  holiday: IHoliday | null;
  mode: "add" | "edit";
}

export const HolidayModal: React.FC<HolidayModalProps> = ({
  isOpen,
  onClose,
  onSave,
  holiday,
  mode,
}) => {
  const { t } = useTranslations();
  const { isRTL } = useLanguage();

  const holidaySchema = useMemo(
    () =>
      z
        .object({
          holiday_eng: isRTL
            ? z.string().optional()
            : z.string().min(1, "English name is required"),
          holiday_arb: isRTL
            ? z.string().min(1, "Arabic name is required")
            : z.string().optional(),
          remarks: z.string().optional(),
          from_date: z.date(),
          to_date: z.date(),
          recurring_flag: z.boolean(),
          public_holiday_flag: z.boolean(),
        })
        .refine(
          (data) => {
            if (!data.from_date || !data.to_date) return true;
            return data.from_date <= data.to_date;
          },
          {
            message: "End date must be after or equal to start date",
            path: ["to_date"],
          }
        ),
    [isRTL]
  );

  type DynamicHolidayFormValues = z.infer<typeof holidaySchema>;

  const form = useForm<DynamicHolidayFormValues>({
    resolver: zodResolver(holidaySchema),
    defaultValues: {
      holiday_eng: "",
      holiday_arb: "",
      remarks: "",
      from_date: undefined,
      to_date: undefined,
      recurring_flag: false,
      public_holiday_flag: false,
    },
  });

  useEffect(() => {
    if (isOpen) {
      if (mode === "edit" && holiday) {
        form.reset({
          holiday_eng: holiday.holiday_eng,
          holiday_arb: holiday.holiday_arb,
          remarks: holiday.remarks || "",
          from_date: new Date(holiday.from_date),
          to_date: new Date(holiday.to_date),
          recurring_flag: holiday.recurring_flag,
          public_holiday_flag: holiday.public_holiday_flag,
        });
      } else {
        form.reset({
          holiday_eng: "",
          holiday_arb: "",
          remarks: "",
          from_date: undefined,
          to_date: undefined,
          recurring_flag: false,
          public_holiday_flag: false,
        });
      }
    }
  }, [isOpen, mode, holiday, form]);

  const onSubmit = (data: DynamicHolidayFormValues) => {
    const submittedName = isRTL
      ? data.holiday_arb || ""
      : data.holiday_eng || "";

    const formattedData: CreateHolidayRequest = {
      from_date: data.from_date.toISOString(),
      to_date: data.to_date.toISOString(),
      holiday_eng: isRTL ? submittedName : data.holiday_eng || "",
      holiday_arb: isRTL ? data.holiday_arb || "" : submittedName,
      recurring_flag: data.recurring_flag,
      public_holiday_flag: data.public_holiday_flag,
      remarks: data.remarks || "",
    };

    onSave(formattedData);
  };

  const handleClose = () => {
    form.reset();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px] max-w-[95vw] p-2">
        <DialogHeader className="p-4">
          <DialogTitle className="flex items-center gap-2 text-lg sm:text-xl">
            <CalendarIcon size={20} />
            {mode === "add"
              ? t("scheduling.holidays.addHoliday")
              : t("scheduling.holidays.editHoliday")}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4  px-4"
          >
            <div className="grid grid-cols-1 gap-4">
              {isRTL ? (
                <FormField
                  control={form.control}
                  name="holiday_arb"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm sm:text-base">
                        {t("common.nameArb")}
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder={t("scheduling.holidays.enterArbName")}
                          {...field}
                          dir="rtl"
                          className="text-sm sm:text-base"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ) : (
                <FormField
                  control={form.control}
                  name="holiday_eng"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm sm:text-base">
                        {t("common.nameEng")}
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder={t("scheduling.holidays.enterEngName")}
                          {...field}
                          className="text-sm sm:text-base"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* From Date */}
              <FormField
                control={form.control}
                name="from_date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel className="text-sm sm:text-base">
                      {t("common.fromDate")}
                    </FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal text-sm sm:text-base h-9 sm:h-10",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>{t("common.pickDate")}</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent
                        className="w-auto p-0"
                        align="start"
                        sideOffset={4}
                      >
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) => date < new Date("1900-01-01")}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* To Date */}
              <FormField
                control={form.control}
                name="to_date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel className="text-sm sm:text-base">
                      {t("common.toDate")}
                    </FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal text-sm sm:text-base h-9 sm:h-10",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>{t("common.pickDate")}</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent
                        className="w-auto p-0"
                        align="start"
                        sideOffset={4}
                      >
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) => date < new Date("1900-01-01")}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Remarks */}
            <FormField
              control={form.control}
              name="remarks"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm sm:text-base">
                    {t("common.remarks")}
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder={t("scheduling.holidays.enterRemarks")}
                      className="resize-none text-sm sm:text-base"
                      rows={3}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Switches */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
              <FormField
                control={form.control}
                name="recurring_flag"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 sm:p-4">
                    <div className="space-y-0.5 flex-1 pr-3">
                      <FormLabel className="text-sm sm:text-base font-medium">
                        {t("scheduling.holidays.recurring")}
                      </FormLabel>
                      <div className="text-xs sm:text-sm text-muted-foreground">
                        {t("scheduling.holidays.recurringDesc")}
                      </div>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="public_holiday_flag"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 sm:p-4">
                    <div className="space-y-0.5 flex-1 pr-3">
                      <FormLabel className="text-sm sm:text-base font-medium">
                        {t("scheduling.holidays.publicHoliday")}
                      </FormLabel>
                      <div className="text-xs sm:text-sm text-muted-foreground">
                        {t("scheduling.holidays.publicHolidayDesc")}
                      </div>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                className="w-full sm:w-auto text-sm sm:text-base h-9 sm:h-10"
              >
                <X size={16} className="mr-2" />
                {t("common.cancel")}
              </Button>
              <Button
                type="submit"
                className="w-full sm:w-auto text-sm sm:text-base h-9 sm:h-10"
              >
                <Save size={16} className="mr-2" />
                {mode === "add" ? t("common.create") : t("common.update")}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
