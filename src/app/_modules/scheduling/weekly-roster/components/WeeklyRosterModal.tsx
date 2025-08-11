"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns";
import { CalendarDays, Clock, Users, X } from "lucide-react";
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
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { OptimizedParentScheduleSelect } from "@/app/_modules/scheduling/scheduletypes/components/OptimizedParentScheduleSelect";
import {
  IGroupSchedule,
  ICreateGroupSchedule,
  IUpdateGroupSchedule,
} from "@/services/scheduling/groupSchedules";
import employeeGroupApi from "@/services/employeemaster/employeeGroup";
import {
  EmployeeGroup,
  CreateWeeklyRosterRequest,
  WeeklyRosterData,
} from "../types";

// Form data type that matches the API structure
interface FormData {
  employee_group_id: number;
  from_date: Date;
  to_date: Date;
  monday_schedule_id: number | null;
  tuesday_schedule_id: number | null;
  wednesday_schedule_id: number | null;
  thursday_schedule_id: number | null;
  friday_schedule_id: number | null;
  saturday_schedule_id: number | null;
  sunday_schedule_id: number | null;
}

interface WeeklyRosterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (
    data: ICreateGroupSchedule | IUpdateGroupSchedule
  ) => Promise<void>;
  groupSchedule?: IGroupSchedule;
  mode: "create" | "edit";
  isLoading?: boolean;
}

const DAYS_OF_WEEK = [
  { key: "monday", label: "Monday", field: "monday_schedule_id" },
  { key: "tuesday", label: "Tuesday", field: "tuesday_schedule_id" },
  { key: "wednesday", label: "Wednesday", field: "wednesday_schedule_id" },
  { key: "thursday", label: "Thursday", field: "thursday_schedule_id" },
  { key: "friday", label: "Friday", field: "friday_schedule_id" },
  { key: "saturday", label: "Saturday", field: "saturday_schedule_id" },
  { key: "sunday", label: "Sunday", field: "sunday_schedule_id" },
] as const;

export function WeeklyRosterModal({
  isOpen,
  onClose,
  onSubmit,
  groupSchedule,
  mode,
  isLoading = false,
}: WeeklyRosterModalProps) {
  const { t } = useTranslations();
  const { currentLocale } = useLanguage();
  const isRTL = currentLocale === "ar";

  // Employee Groups state
  const [employeeGroups, setEmployeeGroups] = useState<EmployeeGroup[]>([]);
  const [employeeGroupSearch, setEmployeeGroupSearch] = useState("");
  const [isEmployeeGroupOpen, setIsEmployeeGroupOpen] = useState(false);
  const [isLoadingGroups, setIsLoadingGroups] = useState(false);

  // Calendar state
  const [startDateOpen, setStartDateOpen] = useState(false);
  const [endDateOpen, setEndDateOpen] = useState(false);

  // Form validation schema
  const formSchema = z
    .object({
      employee_group_id: z
        .number()
        .min(1, t("scheduling.weeklyRoster.validation.employeeGroupRequired")),
      from_date: z.date(),
      to_date: z.date(),
      monday_schedule_id: z.number().nullable(),
      tuesday_schedule_id: z.number().nullable(),
      wednesday_schedule_id: z.number().nullable(),
      thursday_schedule_id: z.number().nullable(),
      friday_schedule_id: z.number().nullable(),
      saturday_schedule_id: z.number().nullable(),
      sunday_schedule_id: z.number().nullable(),
    })
    .refine((data) => data.to_date >= data.from_date, {
      message: t("scheduling.weeklyRoster.validation.endDateAfterStartDate"),
      path: ["to_date"],
    });

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      employee_group_id: 0,
      from_date: new Date(),
      to_date: new Date(),
      monday_schedule_id: null,
      tuesday_schedule_id: null,
      wednesday_schedule_id: null,
      thursday_schedule_id: null,
      friday_schedule_id: null,
      saturday_schedule_id: null,
      sunday_schedule_id: null,
    },
  });

  // Load employee groups
  const loadEmployeeGroups = async (searchTerm: string = "") => {
    try {
      setIsLoadingGroups(true);
      const response = await employeeGroupApi.getEmployeeGroupsForDropdown(
        searchTerm
      );
      setEmployeeGroups(response.data.data);
    } catch (error) {
      console.error("Failed to load employee groups:", error);
    } finally {
      setIsLoadingGroups(false);
    }
  };

  // Load initial employee groups
  useEffect(() => {
    if (isOpen) {
      loadEmployeeGroups();
    }
  }, [isOpen]);

  // Debounced search for employee groups
  useEffect(() => {
    const timer = setTimeout(() => {
      if (isEmployeeGroupOpen) {
        loadEmployeeGroups(employeeGroupSearch);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [employeeGroupSearch, isEmployeeGroupOpen]);

  // Update form when groupSchedule changes
  useEffect(() => {
    if (groupSchedule && mode === "edit") {
      form.reset({
        employee_group_id: groupSchedule.employee_group_id,
        from_date: new Date(groupSchedule.from_date),
        to_date: new Date(groupSchedule.to_date),
        monday_schedule_id: groupSchedule.monday_schedule_id || null,
        tuesday_schedule_id: groupSchedule.tuesday_schedule_id || null,
        wednesday_schedule_id: groupSchedule.wednesday_schedule_id || null,
        thursday_schedule_id: groupSchedule.thursday_schedule_id || null,
        friday_schedule_id: groupSchedule.friday_schedule_id || null,
        saturday_schedule_id: groupSchedule.saturday_schedule_id || null,
        sunday_schedule_id: groupSchedule.sunday_schedule_id || null,
      });
    } else if (mode === "create") {
      form.reset({
        employee_group_id: 0,
        from_date: new Date(),
        to_date: new Date(),
        monday_schedule_id: null,
        tuesday_schedule_id: null,
        wednesday_schedule_id: null,
        thursday_schedule_id: null,
        friday_schedule_id: null,
        saturday_schedule_id: null,
        sunday_schedule_id: null,
      });
    }
  }, [groupSchedule, mode, form]);

  const handleClose = () => {
    form.reset();
    setEmployeeGroupSearch("");
    onClose();
  };

  const handleFormSubmit = async (data: FormData) => {
    try {
      // Validate required fields
      if (!data.employee_group_id || data.employee_group_id <= 0) {
        form.setError("employee_group_id", {
          message: t(
            "scheduling.weeklyRoster.validation.employeeGroupRequired"
          ),
        });
        return;
      }

      // Prepare data for API
      const submitData = {
        ...data,
        from_date: data.from_date.toISOString(),
        to_date: data.to_date.toISOString(),
        created_id: 1, // TODO: Get from user context
        last_updated_id: 1, // TODO: Get from user context
      };

      await onSubmit(submitData as ICreateGroupSchedule | IUpdateGroupSchedule);
      handleClose();
    } catch (error) {
      console.error("Failed to submit form:", error);
    }
  };

  const selectedEmployeeGroup = employeeGroups?.find(
    (group) => group.employee_group_id === form.watch("employee_group_id")
  );

  const getModalTitle = () => {
    return mode === "create"
      ? t("scheduling.weeklyRoster.addRoster")
      : t("scheduling.weeklyRoster.editRoster");
  };

  const getModalDescription = () => {
    return mode === "create"
      ? t("scheduling.weeklyRoster.addDescription")
      : t("scheduling.weeklyRoster.editDescription");
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-lg sm:text-xl">
            <CalendarDays className="h-5 w-5" />
            {getModalTitle()}
          </DialogTitle>
          <DialogDescription className="text-sm sm:text-base">
            {getModalDescription()}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleFormSubmit)}
            className="space-y-6"
          >
            <div className="grid gap-6">
              {/* Employee Group Selection */}
              <FormField
                control={form.control}
                name="employee_group_id"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel className="text-sm sm:text-base">
                      {t("scheduling.weeklyRoster.fields.employeeGroup")} *
                    </FormLabel>
                    <Popover
                      open={isEmployeeGroupOpen}
                      onOpenChange={setIsEmployeeGroupOpen}
                    >
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            role="combobox"
                            aria-expanded={isEmployeeGroupOpen}
                            className={cn(
                              "w-full justify-between text-sm sm:text-base h-10",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {selectedEmployeeGroup ? (
                              <div className="flex flex-col items-start">
                                <span className="font-medium">
                                  {isRTL
                                    ? selectedEmployeeGroup.group_name_arb
                                    : selectedEmployeeGroup.group_name_eng}
                                </span>
                                {selectedEmployeeGroup.group_code && (
                                  <span className="text-xs text-muted-foreground">
                                    {selectedEmployeeGroup.group_code}
                                  </span>
                                )}
                              </div>
                            ) : (
                              t("scheduling.weeklyRoster.selectEmployeeGroup")
                            )}
                            <Users className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-full p-0" align="start">
                        <div className="p-2">
                          <Input
                            placeholder={t("common.search")}
                            value={employeeGroupSearch}
                            onChange={(e) =>
                              setEmployeeGroupSearch(e.target.value)
                            }
                            className="h-8"
                          />
                        </div>
                        <div className="max-h-[200px] overflow-auto">
                          {isLoadingGroups ? (
                            <div className="p-4 text-center text-sm text-muted-foreground">
                              {t("common.loading")}
                            </div>
                          ) : !employeeGroups || employeeGroups.length === 0 ? (
                            <div className="p-4 text-center text-sm text-muted-foreground">
                              {t("common.noResults")}
                            </div>
                          ) : (
                            employeeGroups.map((group) => (
                              <Button
                                key={group.employee_group_id}
                                variant="ghost"
                                className="w-full justify-start h-auto p-2"
                                onClick={() => {
                                  field.onChange(group.employee_group_id);
                                  setIsEmployeeGroupOpen(false);
                                  setEmployeeGroupSearch("");
                                }}
                              >
                                <div className="flex flex-col items-start w-full">
                                  <span className="font-medium">
                                    {isRTL
                                      ? group.group_name_arb
                                      : group.group_name_eng}
                                  </span>
                                  {group.group_code && (
                                    <span className="text-xs text-muted-foreground">
                                      {group.group_code}
                                    </span>
                                  )}
                                </div>
                              </Button>
                            ))
                          )}
                        </div>
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Date Range */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Start Date */}
                <FormField
                  control={form.control}
                  name="from_date"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel className="text-sm sm:text-base">
                        {t("common.startDate")} *
                      </FormLabel>
                      <Popover
                        open={startDateOpen}
                        onOpenChange={setStartDateOpen}
                      >
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              className={cn(
                                "w-full pl-3 text-left font-normal text-sm sm:text-base h-10",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>{t("common.selectDate")}</span>
                              )}
                              <CalendarDays className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={(date) => {
                              field.onChange(date);
                              setStartDateOpen(false);
                            }}
                            disabled={(date) => date < new Date("1900-01-01")}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* End Date */}
                <FormField
                  control={form.control}
                  name="to_date"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel className="text-sm sm:text-base">
                        {t("common.endDate")} *
                      </FormLabel>
                      <Popover open={endDateOpen} onOpenChange={setEndDateOpen}>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              className={cn(
                                "w-full pl-3 text-left font-normal text-sm sm:text-base h-10",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>{t("common.selectDate")}</span>
                              )}
                              <CalendarDays className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={(date) => {
                              field.onChange(date);
                              setEndDateOpen(false);
                            }}
                            disabled={(date) => {
                              if (date < new Date("1900-01-01")) return true;
                              if (
                                form.watch("from_date") &&
                                date < form.watch("from_date")
                              )
                                return true;
                              return false;
                            }}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Weekly Schedule Assignment */}
              <Card>
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Clock className="h-4 w-4" />
                    {t("scheduling.weeklyRoster.fields.schedules")}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {DAYS_OF_WEEK.map((day) => (
                      <FormField
                        key={day.key}
                        control={form.control}
                        name={day.field as keyof FormData}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-medium">
                              {t(`scheduling.weeklyRoster.fields.${day.key}`)}
                            </FormLabel>
                            <FormControl>
                              <div className="w-full max-w-full overflow-hidden">
                                <OptimizedParentScheduleSelect
                                  value={Number(field.value) || undefined}
                                  onValueChange={(value: number | undefined) =>
                                    field.onChange(value || null)
                                  }
                                  placeholder={t(
                                    `scheduling.weeklyRoster.placeholders.select${day.label}Schedule`
                                  )}
                                />
                              </div>
                            </FormControl>
                            <FormMessage className="text-xs" />
                          </FormItem>
                        )}
                      />
                    ))}
                  </div>
                </CardContent>
              </Card>
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
                  : mode === "create"
                  ? t("common.create")
                  : t("common.update")}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
