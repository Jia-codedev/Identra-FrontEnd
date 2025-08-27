"use client";

import React, { useEffect, useState, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useTranslations } from "@/hooks/use-translations";
import { useLanguage } from "@/providers/language-provider";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
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
import { Input } from "@/components/ui/Input"
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { IRamadanDate, CreateRamadanDateRequest, UpdateRamadanDateRequest } from "../types";

interface RamadanDateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateRamadanDateRequest | UpdateRamadanDateRequest) => void;
  ramadanDate?: IRamadanDate | null;
  isLoading?: boolean;
}

const RamadanDateModal: React.FC<RamadanDateModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  ramadanDate,
  isLoading = false,
}) => {
  const { t } = useTranslations();
  const { isRTL } = useLanguage();
  const [fromDateOpen, setFromDateOpen] = useState(false);
  const [toDateOpen, setToDateOpen] = useState(false);

  const formSchema = useMemo(() => z.object({
    ramadan_name_eng: isRTL ? z.string().optional() : z.string().min(1, "English name is required"),
    ramadan_name_arb: isRTL ? z.string().min(1, "Arabic name is required") : z.string().optional(),
    from_date: z.date({
      message: "From date is required",
    }),
    to_date: z.date({
      message: "To date is required",
    }),
    remarks: z.string().optional(),
  }).refine((data) => data.to_date >= data.from_date, {
    message: "To date must be after or equal to from date",
    path: ["to_date"],
  }), [isRTL]);

  type RamadanFormData = z.infer<typeof formSchema>;

  const form = useForm<RamadanFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      ramadan_name_eng: "",
      ramadan_name_arb: "",
      from_date: new Date(),
      to_date: new Date(),
      remarks: "",
    },
  });

  useEffect(() => {
    if (ramadanDate) {
      form.reset({
        ramadan_name_eng: ramadanDate.ramadan_name_eng,
        ramadan_name_arb: ramadanDate.ramadan_name_arb,
        from_date: new Date(ramadanDate.from_date),
        to_date: new Date(ramadanDate.to_date),
        remarks: ramadanDate.remarks || "",
      });
    } else {
      form.reset({
        ramadan_name_eng: "",
        ramadan_name_arb: "",
        from_date: new Date(),
        to_date: new Date(),
        remarks: "",
      });
    }
  }, [ramadanDate, form]);

  const handleSubmit = (data: RamadanFormData) => {
    // Handle the language-specific name submission like the holiday modal
    const submittedName = isRTL ? (data.ramadan_name_arb || '') : (data.ramadan_name_eng || '');
    
    const formattedData = {
      ramadan_name_eng: isRTL ? submittedName : (data.ramadan_name_eng || ''),
      ramadan_name_arb: isRTL ? (data.ramadan_name_arb || '') : submittedName,
      from_date: format(data.from_date, "yyyy-MM-dd"),
      to_date: format(data.to_date, "yyyy-MM-dd"),
      remarks: data.remarks,
    };

    onSubmit(formattedData);
  };

  const handleClose = () => {
    form.reset();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {ramadanDate 
              ? t("scheduling.ramadanDates.editRamadanDate")
              : t("scheduling.ramadanDates.addRamadanDate")
            }
          </DialogTitle>
          <DialogDescription>
            {ramadanDate
              ? t("scheduling.ramadanDates.editDescription")
              : t("scheduling.ramadanDates.addDescription")
            }
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              {/* Name Field - Language Specific */}
              {isRTL ? (
                <FormField
                  control={form.control}
                  name="ramadan_name_arb"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("scheduling.ramadanDates.fields.nameArb")}</FormLabel>
                      <FormControl>
                        <Input
                          placeholder={t("scheduling.ramadanDates.placeholders.nameArb")}
                          {...field}
                          dir="rtl"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ) : (
                <FormField
                  control={form.control}
                  name="ramadan_name_eng"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("scheduling.ramadanDates.fields.nameEng")}</FormLabel>
                      <FormControl>
                        <Input
                          placeholder={t("scheduling.ramadanDates.placeholders.nameEng")}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              {/* Date Range */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* From Date */}
                <FormField
                  control={form.control}
                  name="from_date"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>{t("scheduling.ramadanDates.fields.fromDate")}</FormLabel>
                      <Popover open={fromDateOpen} onOpenChange={setFromDateOpen}>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>{t("scheduling.ramadanDates.placeholders.selectDate")}</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={(date) => {
                              field.onChange(date);
                              setFromDateOpen(false);
                            }}
                            disabled={(date) =>
                              date < new Date("1900-01-01")
                            }
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
                      <FormLabel>{t("scheduling.ramadanDates.fields.toDate")}</FormLabel>
                      <Popover open={toDateOpen} onOpenChange={setToDateOpen}>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>{t("scheduling.ramadanDates.placeholders.selectDate")}</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={(date) => {
                              field.onChange(date);
                              setToDateOpen(false);
                            }}
                            disabled={(date) =>
                              date < new Date("1900-01-01")
                            }
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
                    <FormLabel>{t("scheduling.ramadanDates.fields.remarks")}</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder={t("scheduling.ramadanDates.placeholders.remarks")}
                        className="resize-none"
                        rows={3}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter className="gap-2 sm:gap-0">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={isLoading}
              >
                {t("common.cancel")}
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading 
                  ? t("common.saving")
                  : ramadanDate 
                    ? t("common.update")
                    : t("common.create")
                }
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default RamadanDateModal;
