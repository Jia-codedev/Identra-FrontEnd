"use client";

import React, { useState, useEffect, useMemo } from "react";
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
import { Input } from "@/components/ui/Input";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { SearchCombobox } from "@/components/ui/search-combobox";
import schedulesApi from "@/services/scheduling/schedules";
import { OrganizationSchedule, OrganizationScheduleCreate } from "../types";
import organizationsApi from "@/services/masterdata/organizations";

interface FormData {
  organization_id: number;
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
  onSubmit: (data: OrganizationScheduleCreate) => Promise<void>;
  groupSchedule?: OrganizationSchedule;
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

const DAY_TRANSLATION_KEYS: Record<
  string,
  { fieldKey: string; placeholderKey: string }
> = {
  monday: {
    fieldKey: "scheduling.weeklyRoster.fields.monday",
    placeholderKey: "scheduling.weeklyRoster.placeholders.selectMondaySchedule",
  },
  tuesday: {
    fieldKey: "scheduling.weeklyRoster.fields.tuesday",
    placeholderKey:
      "scheduling.weeklyRoster.placeholders.selectTuesdaySchedule",
  },
  wednesday: {
    fieldKey: "scheduling.weeklyRoster.fields.wednesday",
    placeholderKey:
      "scheduling.weeklyRoster.placeholders.selectWednesdaySchedule",
  },
  thursday: {
    fieldKey: "scheduling.weeklyRoster.fields.thursday",
    placeholderKey:
      "scheduling.weeklyRoster.placeholders.selectThursdaySchedule",
  },
  friday: {
    fieldKey: "scheduling.weeklyRoster.fields.friday",
    placeholderKey: "scheduling.weeklyRoster.placeholders.selectFridaySchedule",
  },
  saturday: {
    fieldKey: "scheduling.weeklyRoster.fields.saturday",
    placeholderKey:
      "scheduling.weeklyRoster.placeholders.selectSaturdaySchedule",
  },
  sunday: {
    fieldKey: "scheduling.weeklyRoster.fields.sunday",
    placeholderKey: "scheduling.weeklyRoster.placeholders.selectSundaySchedule",
  },
};

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

  const [organizations, setOrganizations] = useState<any[]>([]);
  const [organizationSearch, setOrganizationSearch] = useState("");

  const [startDateOpen, setStartDateOpen] = useState(false);
  const [endDateOpen, setEndDateOpen] = useState(false);

  const formSchema = z
    .object({
      organization_id: z
        .number()
        .min(1, t("scheduling.weeklyRoster.validation.organizationRequired")),
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
      organization_id: 0,
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

  const loadOrganizations = async (searchTerm: string = "") => {
    try {
      const response = await organizationsApi.getOrganizationDropdownList();
      const orgData = response?.data?.data || response?.data || [];

      if (Array.isArray(orgData)) {
        const filteredOrgs = searchTerm
          ? orgData.filter((org: any) =>
              (isRTL ? org.organization_arb : org.organization_eng)
                ?.toLowerCase()
                .includes(searchTerm.toLowerCase())
            )
          : orgData;
        setOrganizations(filteredOrgs);
      }
    } catch (error) {
      console.error("Failed to load organizations:", error);
      setOrganizations([]);
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadOrganizations();
    }
  }, [isOpen]);

  useEffect(() => {
    const timer = setTimeout(() => {
      loadOrganizations(organizationSearch);
    }, 300);

    return () => clearTimeout(timer);
  }, [organizationSearch]);

  useEffect(() => {
    if (groupSchedule && mode === "edit") {
      form.reset({
        organization_id: groupSchedule.organization_id,
        from_date: new Date(groupSchedule.from_date),
        to_date: groupSchedule.to_date
          ? new Date(groupSchedule.to_date)
          : new Date(),
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
        organization_id: 0,
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
    setOrganizationSearch("");
    onClose();
  };

  const handleFormSubmit = async (data: FormData) => {
    try {
      if (!data.organization_id || data.organization_id <= 0) {
        form.setError("organization_id", {
          message: t("scheduling.weeklyRoster.validation.organizationRequired"),
        });
        return;
      }

      const submitData = {
        ...data,
        from_date: data.from_date.toISOString(),
        to_date: data.to_date.toISOString(),
        created_id: 1,
        last_updated_id: 1,
      };

      await onSubmit(submitData as any);
      handleClose();
    } catch (error) {
      console.error("Failed to submit form:", error);
    }
  };

  const organizationOptions = useMemo(() => {
    return organizations.map((org: any) => ({
      label: (isRTL ? org.organization_arb : org.organization_eng) ?? "",
      value: org.organization_id,
    }));
  }, [organizations, isRTL]);

  // Day schedule searchable combobox component
  const DayScheduleSearchCombobox: React.FC<{
    value?: number | null;
    onValueChange: (val: number | null) => void;
    placeholder?: string;
    organizationId?: number;
    disabled?: boolean;
  }> = ({ value, onValueChange, placeholder, organizationId, disabled }) => {
    const [options, setOptions] = useState<{ label: string; value: number }[]>(
      []
    );
    const [search, setSearch] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
      let mounted = true;
      const timer = setTimeout(async () => {
        try {
          setIsLoading(true);
          const res = await schedulesApi.getSchedulesForDropdown({
            status_flag: true,
            organization_id: organizationId,
          });
          let data = res?.data?.data || res?.data || [];

          if (Array.isArray(data)) {
            // client-side filter by search
            if (search) {
              data = data.filter((sch: any) =>
                (sch.schedule_code || "")
                  .toString()
                  .toLowerCase()
                  .includes(search.toLowerCase())
              );
            }

            const mapped = data.slice(0, 100).map((sch: any) => ({
              label: `${sch.schedule_code}${
                sch.in_time && sch.out_time
                  ? ` — ${sch.in_time}–${sch.out_time}`
                  : ""
              }`,
              value: sch.schedule_id,
            }));

            if (mounted) setOptions(mapped);
          }
        } catch (err) {
          if (mounted) setOptions([]);
        } finally {
          if (mounted) setIsLoading(false);
        }
      }, 300);

      return () => {
        mounted = false;
        clearTimeout(timer);
      };
    }, [search, organizationId]);

    return (
      <SearchCombobox
        className="relative"
        options={options}
        value={value ?? null}
        onValueChange={(val) =>
          onValueChange(val === null ? null : Number(val))
        }
        placeholder={placeholder}
        disabled={disabled}
        onSearch={(q) => setSearch(q)}
        isLoading={isLoading}
        emptyMessage={"No schedules found"}
      />
    );
  };

  const getModalTitle = () => {
    return mode === "create"
      ? t("scheduling.weeklyRoster.addRoster")
      : t("scheduling.weeklyRoster.editRoster");
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[900px] min-w-[60vw] w-full max-h-[90vh] ">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-lg sm:text-xl">
            <CalendarDays className="h-5 w-5" />
            {getModalTitle()}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleFormSubmit)}
            className="space-y-6"
          >
            <div className="grid gap-6">
              <FormField
                control={form.control}
                name="organization_id"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel className="text-sm font-medium">
                      {t("scheduling.weeklyRoster.fields.organization")} *
                    </FormLabel>
                    <FormControl>
                      <SearchCombobox
                        onSearch={(searchTerm: string) => {
                          setOrganizationSearch(searchTerm);
                        }}
                        onValueChange={(val: string | number | null) =>
                          field.onChange(val)
                        }
                        options={organizationOptions}
                        value={field.value ?? ""}
                        placeholder={t(
                          "scheduling.weeklyRoster.selectOrganization"
                        )}
                        disabled={isLoading}
                      />
                    </FormControl>
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
                      <FormLabel className="text-sm font-medium">
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
                      <FormLabel className="text-sm font-medium">
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
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 items-start">
                    {DAYS_OF_WEEK.map((day) => (
                      <FormField
                        key={day.key}
                        control={form.control}
                        name={day.field as keyof FormData}
                        render={({ field }) => (
                          <FormItem>
                            <div className="p-3 border rounded-lg bg-muted/5 min-h-[88px]">
                              <div className="flex items-center justify-between mb-2">
                                <FormLabel className="text-sm font-medium m-0">
                                  {t(DAY_TRANSLATION_KEYS[day.key].fieldKey)}
                                </FormLabel>
                              </div>
                              <FormControl>
                                <div className="w-full relative">
                                  <DayScheduleSearchCombobox
                                    value={
                                      typeof field.value === "number"
                                        ? field.value
                                        : null
                                    }
                                    onValueChange={(v) => field.onChange(v)}
                                    placeholder={t(
                                      DAY_TRANSLATION_KEYS[day.key]
                                        .placeholderKey
                                    )}
                                    organizationId={
                                      form.watch("organization_id") || undefined
                                    }
                                    disabled={isLoading}
                                  />
                                </div>
                              </FormControl>
                              <FormMessage className="text-xs mt-2" />
                            </div>
                          </FormItem>
                        )}
                      />
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-x-2 flex flex-col">
              <Button
                className="w-full"
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={isLoading}
              >
                {t("common.cancel")}
              </Button>
              <Button
                className="w-full mt-2"
                type="submit"
                disabled={isLoading}
              >
                {isLoading
                  ? t("common.saving")
                  : mode === "create"
                  ? t("common.create")
                  : t("common.update")}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
