"use client";

import React, { useState, useEffect } from "react";
import { useTranslations } from "@/hooks/use-translations";
import { useLanguage } from "@/providers/language-provider";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar } from "@/components/ui/calendar";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { format } from "date-fns";
import { ISchedule, CreateScheduleRequest } from "../types";
import {
  Clock,
  Building2,
  MapPin,
  Palette,
  Settings,
  Calendar as CalendarIcon,
  Moon,
  Star,
  Calculator,
  Zap,
  Coffee,
  Shield,
  TrendingDown,
} from "lucide-react";
import { OptimizedOrganizationSelect } from "./OptimizedOrganizationSelect";
import { OptimizedLocationSelect } from "./OptimizedLocationSelect";
import { OptimizedParentScheduleSelect } from "./OptimizedParentScheduleSelect";

interface ScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: CreateScheduleRequest) => void;
  schedule: ISchedule | null;
  mode: "add" | "edit";
  isLoading?: boolean;
}

const scheduleSchema = z.object({
  organization_id: z.number().min(1, "Organization is required"),
  schedule_code: z
    .string()
    .min(1, "Schedule code is required")
    .max(50, "Schedule code must be 50 characters or less"),
  in_time: z.string().optional(),
  out_time: z.string().optional(),
  flexible_min: z.number().min(0).max(999).optional(),
  grace_in_min: z.number().min(0).max(999).optional(),
  grace_out_min: z.number().min(0).max(999).optional(),
  open_shift_flag: z.boolean().optional(),
  night_shift_flag: z.boolean().optional(),
  sch_color: z.string().optional(),
  ramadan_flag: z.boolean().optional(),
  sch_parent_id: z.number().optional(),
  required_work_hours: z.string().optional(),
  status_flag: z.boolean().optional(),
  calculate_worked_hrs_flag: z.boolean().optional(),
  default_overtime_flag: z.boolean().optional(),
  default_break_hrs_flag: z.boolean().optional(),
  override_schedule_on_holiday_flag: z.boolean().optional(),
  reduce_required_hrs_flag: z.boolean().optional(),
  schedule_location: z.number().optional(),
  inactive_date: z.string().optional(),
});

type ScheduleFormData = z.infer<typeof scheduleSchema>;

// Custom transform function for form data
const transformFormData = (data: any): ScheduleFormData => {
  // Helper function to safely convert values
  const safeTransform = (value: any, fieldName: string) => {
    if (
      value === null ||
      value === undefined ||
      value === "" ||
      value === "none"
    ) {
      return undefined;
    }

    // If it's already a number, return it
    if (typeof value === "number") {
      return value;
    }

    // If it's a string, try to parse it
    if (typeof value === "string") {
      const parsed = parseInt(value, 10);
      return isNaN(parsed) ? undefined : parsed;
    }

    // If it's an object, it might be a React event or invalid data
    if (typeof value === "object") {
      console.warn(`${fieldName} received object value:`, value);
      return undefined;
    }

    return undefined;
  };

  return {
    ...data,
    sch_parent_id: safeTransform(data.sch_parent_id, "sch_parent_id"),
    schedule_location: safeTransform(
      data.schedule_location,
      "schedule_location"
    ),
  };
};

export const ScheduleModal: React.FC<ScheduleModalProps> = ({
  isOpen,
  onClose,
  onSave,
  schedule,
  mode,
  isLoading = false,
}) => {
  const { t } = useTranslations();
  const { isRTL } = useLanguage();
  const [activeTab, setActiveTab] = useState("basic");
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const queryClient = useQueryClient();

  const {
    control,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ScheduleFormData>({
    // Temporarily disable zodResolver to handle validation manually
    // resolver: zodResolver(scheduleSchema),
    mode: "onChange",
    defaultValues: {
      organization_id: 1, // Set a default organization ID
      schedule_code: "",
      in_time: "",
      out_time: "",
      flexible_min: 0,
      grace_in_min: 0,
      grace_out_min: 0,
      open_shift_flag: false,
      night_shift_flag: false,
      sch_color: "#6B7280",
      ramadan_flag: false,
      required_work_hours: "08:00:00",
      status_flag: true,
      calculate_worked_hrs_flag: true,
      default_overtime_flag: false,
      default_break_hrs_flag: false,
      override_schedule_on_holiday_flag: false,
      reduce_required_hrs_flag: false,
    },
  });

  // Watch form values for real-time updates
  const watchedValues = watch();

  useEffect(() => {
    if (schedule && mode === "edit") {
      reset({
        organization_id: schedule.organization_id,
        schedule_code: schedule.schedule_code,
        in_time: schedule.in_time
          ? new Date(schedule.in_time).toTimeString().slice(0, 5)
          : "",
        out_time: schedule.out_time
          ? new Date(schedule.out_time).toTimeString().slice(0, 5)
          : "",
        flexible_min: schedule.flexible_min || 0,
        grace_in_min: schedule.grace_in_min || 0,
        grace_out_min: schedule.grace_out_min || 0,
        open_shift_flag: schedule.open_shift_flag || false,
        night_shift_flag: schedule.night_shift_flag || false,
        sch_color: schedule.sch_color || "#6B7280",
        ramadan_flag: schedule.ramadan_flag || false,
        sch_parent_id: schedule.sch_parent_id,
        required_work_hours: schedule.required_work_hours || "08:00:00",
        status_flag: schedule.status_flag ?? true,
        calculate_worked_hrs_flag: schedule.calculate_worked_hrs_flag ?? true,
        default_overtime_flag: schedule.default_overtime_flag || false,
        default_break_hrs_flag: schedule.default_break_hrs_flag || false,
        override_schedule_on_holiday_flag:
          schedule.override_schedule_on_holiday_flag || false,
        reduce_required_hrs_flag: schedule.reduce_required_hrs_flag || false,
        schedule_location: schedule.schedule_location,
        inactive_date: schedule.inactive_date ? schedule.inactive_date : "",
      });
    } else if (mode === "add") {
      reset({
        organization_id: 1, // Set a default organization ID
        schedule_code: "",
        in_time: "",
        out_time: "",
        flexible_min: 0,
        grace_in_min: 0,
        grace_out_min: 0,
        open_shift_flag: false,
        night_shift_flag: false,
        sch_color: "#6B7280",
        ramadan_flag: false,
        required_work_hours: "08:00:00",
        status_flag: true,
        calculate_worked_hrs_flag: true,
        default_overtime_flag: false,
        default_break_hrs_flag: false,
        override_schedule_on_holiday_flag: false,
        reduce_required_hrs_flag: false,
        schedule_location: undefined,
        inactive_date: "",
        sch_parent_id: undefined,
      });
    }
  }, [schedule, mode, reset, isOpen]);

  // Refresh dropdown data when modal opens
  useEffect(() => {
    if (isOpen) {
      setRefreshTrigger((prev) => prev + 1);
    }
  }, [isOpen]);

  const onSubmit = (rawData: any) => {
    const hasObjectValues =
      typeof rawData.sch_parent_id === "object" ||
      typeof rawData.schedule_location === "object";

    let dataToUse = rawData;
    if (hasObjectValues) {
      dataToUse = watchedValues;
    }

    // Use the same transform logic that works in the test
    const transformedValues = transformFormData(dataToUse);

    // Test validation using the same logic as the working test
    const validationResult = scheduleSchema.safeParse(transformedValues);

    if (!validationResult.success) {
      return;
    }

    const formattedData = {
      ...validationResult.data,
      in_time: validationResult.data.in_time
        ? `1970-01-01T${validationResult.data.in_time}:00.000Z`
        : undefined,
      out_time: validationResult.data.out_time
        ? `1970-01-01T${validationResult.data.out_time}:00.000Z`
        : undefined,
      inactive_date: validationResult.data.inactive_date
        ? validationResult.data.inactive_date
        : undefined,
    };

    onSave(formattedData as CreateScheduleRequest);

    if (mode === "add") {
      queryClient.invalidateQueries({
        queryKey: ["parent-schedules-search"],
        exact: false, // This will invalidate all queries that start with this key
      });
    }
  };

  const colorOptions = [
    "#6B7280",
    "#EF4444",
    "#F97316",
    "#EAB308",
    "#22C55E",
    "#06B6D4",
    "#3B82F6",
    "#8B5CF6",
    "#EC4899",
    "#F59E0B",
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[95vh] overflow-y-auto">
        <DialogHeader className="pb-4 border-b">
          <DialogTitle className="flex items-center gap-3 text-xl">
            <div className="p-2 rounded-lg bg-primary/10">
              <Clock className="h-6 w-6 text-primary" />
            </div>
            {mode === "add"
              ? t("scheduling.schedules.addSchedule")
              : t("scheduling.schedules.editSchedule")}
          </DialogTitle>
        </DialogHeader>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-6 pt-4"
          onSubmitCapture={(e) => {}}
        >
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-3 mb-6">
              <TabsTrigger value="basic" className="flex items-center gap-2">
                <Building2 className="h-4 w-4" />
                {t("scheduling.schedules.basicInfo")}
              </TabsTrigger>
              <TabsTrigger value="timing" className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                {t("scheduling.schedules.timingSettings")}
              </TabsTrigger>
              <TabsTrigger value="advanced" className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                {t("scheduling.schedules.advancedSettings")}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="basic" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Organization */}
                <div className="space-y-2">
                  <Label
                    htmlFor="organization_id"
                    className="flex items-center gap-2"
                  >
                    <Building2 className="h-4 w-4" />
                    {t("common.organization")} *
                  </Label>
                  <Controller
                    name="organization_id"
                    control={control}
                    render={({ field }) => (
                      <OptimizedOrganizationSelect
                        value={field.value}
                        onValueChange={field.onChange}
                        placeholder={t(
                          "scheduling.schedules.selectOrganization"
                        )}
                        error={errors.organization_id?.message}
                      />
                    )}
                  />
                </div>

                {/* Schedule Code */}
                <div className="space-y-2">
                  <Label htmlFor="schedule_code">
                    {t("scheduling.schedules.scheduleCode")} *
                  </Label>
                  <Controller
                    name="schedule_code"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        placeholder={t(
                          "scheduling.schedules.enterScheduleCode"
                        )}
                        maxLength={50}
                      />
                    )}
                  />
                  {errors.schedule_code && (
                    <p className="text-sm text-destructive">
                      {errors.schedule_code.message}
                    </p>
                  )}
                </div>

                {/* Schedule Color */}
                <div className="space-y-2">
                  <Label
                    htmlFor="sch_color"
                    className="flex items-center gap-2"
                  >
                    <Palette className="h-4 w-4" />
                    {t("scheduling.schedules.scheduleColor")}
                  </Label>
                  <div className="p-3 rounded-lg border bg-card">
                    <div className="flex flex-wrap gap-2 mb-3">
                      {colorOptions.map((color) => (
                        <button
                          key={color}
                          type="button"
                          className={`w-10 h-10 rounded-full border-2 transition-all hover:scale-110 ${
                            watchedValues.sch_color === color
                              ? "border-primary ring-2 ring-primary/20"
                              : "border-muted-foreground/20 hover:border-muted-foreground/40"
                          }`}
                          style={{ backgroundColor: color }}
                          onClick={() => setValue("sch_color", color)}
                          title={color}
                        />
                      ))}
                    </div>
                    <Controller
                      name="sch_color"
                      control={control}
                      render={({ field }) => (
                        <Input
                          {...field}
                          type="color"
                          className="w-full h-10"
                        />
                      )}
                    />
                  </div>
                </div>

                {/* Location */}
                <div className="space-y-2">
                  <Label
                    htmlFor="schedule_location"
                    className="flex items-center gap-2"
                  >
                    <MapPin className="h-4 w-4" />
                    {t("common.location")}
                  </Label>
                  <Controller
                    name="schedule_location"
                    control={control}
                    render={({ field }) => (
                      <OptimizedLocationSelect
                        value={field.value}
                        onValueChange={(value) => {
                          field.onChange(value);
                        }}
                        placeholder={t("scheduling.schedules.selectLocation")}
                      />
                    )}
                  />
                </div>
              </div>

              {/* Status Switches */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-center justify-between p-3 rounded-lg border bg-card">
                  <Label
                    htmlFor="status_flag"
                    className="flex items-center gap-2 font-medium"
                  >
                    <Settings className="h-4 w-4" />
                    {t("common.active")}
                  </Label>
                  <Controller
                    name="status_flag"
                    control={control}
                    render={({ field }) => (
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    )}
                  />
                </div>

                <div className="flex items-center justify-between p-3 rounded-lg border bg-card">
                  <Label
                    htmlFor="ramadan_flag"
                    className="flex items-center gap-2 font-medium"
                  >
                    <Star className="h-4 w-4" />
                    {t("scheduling.schedules.ramadanSchedule")}
                  </Label>
                  <Controller
                    name="ramadan_flag"
                    control={control}
                    render={({ field }) => (
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    )}
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="timing" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* In Time */}
                <div className="space-y-2">
                  <Label htmlFor="in_time">
                    {t("scheduling.schedules.inTime")}
                  </Label>
                  <Controller
                    name="in_time"
                    control={control}
                    render={({ field }) => (
                      <Input {...field} type="time" placeholder="09:00" />
                    )}
                  />
                </div>

                {/* Out Time */}
                <div className="space-y-2">
                  <Label htmlFor="out_time">
                    {t("scheduling.schedules.outTime")}
                  </Label>
                  <Controller
                    name="out_time"
                    control={control}
                    render={({ field }) => (
                      <Input {...field} type="time" placeholder="17:00" />
                    )}
                  />
                </div>

                {/* Required Work Hours */}
                <div className="space-y-2">
                  <Label htmlFor="required_work_hours">
                    {t("scheduling.schedules.requiredWorkHours")}
                  </Label>
                  <Controller
                    name="required_work_hours"
                    control={control}
                    render={({ field }) => (
                      <Input {...field} placeholder="08:00:00" />
                    )}
                  />
                </div>

                {/* Flexible Minutes */}
                <div className="space-y-2">
                  <Label htmlFor="flexible_min">
                    {t("scheduling.schedules.flexibilityMinutes")}
                  </Label>
                  <Controller
                    name="flexible_min"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        type="number"
                        min="0"
                        max="999"
                        onChange={(e) =>
                          field.onChange(
                            e.target.value ? parseInt(e.target.value) : 0
                          )
                        }
                      />
                    )}
                  />
                </div>

                {/* Grace In Minutes */}
                <div className="space-y-2">
                  <Label htmlFor="grace_in_min">
                    {t("scheduling.schedules.graceInMinutes")}
                  </Label>
                  <Controller
                    name="grace_in_min"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        type="number"
                        min="0"
                        max="999"
                        onChange={(e) =>
                          field.onChange(
                            e.target.value ? parseInt(e.target.value) : 0
                          )
                        }
                      />
                    )}
                  />
                </div>

                {/* Grace Out Minutes */}
                <div className="space-y-2">
                  <Label htmlFor="grace_out_min">
                    {t("scheduling.schedules.graceOutMinutes")}
                  </Label>
                  <Controller
                    name="grace_out_min"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        type="number"
                        min="0"
                        max="999"
                        onChange={(e) =>
                          field.onChange(
                            e.target.value ? parseInt(e.target.value) : 0
                          )
                        }
                      />
                    )}
                  />
                </div>
              </div>

              {/* Shift Type Switches */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-center justify-between p-3 rounded-lg border bg-card">
                  <Label
                    htmlFor="open_shift_flag"
                    className="flex items-center gap-2 font-medium"
                  >
                    <Clock className="h-4 w-4" />
                    {t("scheduling.schedules.openShift")}
                  </Label>
                  <Controller
                    name="open_shift_flag"
                    control={control}
                    render={({ field }) => (
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    )}
                  />
                </div>

                <div className="flex items-center justify-between p-3 rounded-lg border bg-card">
                  <Label
                    htmlFor="night_shift_flag"
                    className="flex items-center gap-2 font-medium"
                  >
                    <Moon className="h-4 w-4" />
                    {t("scheduling.schedules.nightShift")}
                  </Label>
                  <Controller
                    name="night_shift_flag"
                    control={control}
                    render={({ field }) => (
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    )}
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="advanced" className="space-y-4">
              {/* Parent Schedule */}
              <div className="space-y-2">
                <Label htmlFor="sch_parent_id">
                  {t("scheduling.schedules.parentSchedule")}
                </Label>
                <Controller
                  name="sch_parent_id"
                  control={control}
                  render={({ field }) => (
                    <OptimizedParentScheduleSelect
                      value={field.value}
                      onValueChange={(value) => {
                        field.onChange(value);
                      }}
                      placeholder={t(
                        "scheduling.schedules.selectParentSchedule"
                      )}
                      organizationId={watchedValues.organization_id}
                      excludeScheduleId={schedule?.schedule_id}
                      refreshTrigger={refreshTrigger}
                    />
                  )}
                />
              </div>

              {/* Inactive Date */}
              <div className="space-y-2">
                <Label htmlFor="inactive_date">
                  {t("scheduling.schedules.inactiveDate")}
                </Label>
                <Controller
                  name="inactive_date"
                  control={control}
                  render={({ field }) => (
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={`w-full justify-start text-left font-normal ${
                            !field.value && "text-muted-foreground"
                          }`}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {field.value ? (
                            format(new Date(field.value), "PPP")
                          ) : (
                            <span>{t("common.pickDate")}</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={
                            field.value ? new Date(field.value) : undefined
                          }
                          onSelect={(date) => {
                            field.onChange(date ? date.toISOString() : "");
                          }}
                          disabled={(date) => date < new Date()}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  )}
                />
              </div>

              {/* Advanced Flags */}
              <div className="grid grid-cols-1 gap-4">
                <div className="flex items-center justify-between p-3 rounded-lg border bg-card">
                  <Label
                    htmlFor="calculate_worked_hrs_flag"
                    className="flex items-center gap-2 font-medium"
                  >
                    <Calculator className="h-4 w-4" />
                    {t("scheduling.schedules.calculateWorkedHours")}
                  </Label>
                  <Controller
                    name="calculate_worked_hrs_flag"
                    control={control}
                    render={({ field }) => (
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    )}
                  />
                </div>

                <div className="flex items-center justify-between p-3 rounded-lg border bg-card">
                  <Label
                    htmlFor="default_overtime_flag"
                    className="flex items-center gap-2 font-medium"
                  >
                    <Zap className="h-4 w-4" />
                    {t("scheduling.schedules.defaultOvertime")}
                  </Label>
                  <Controller
                    name="default_overtime_flag"
                    control={control}
                    render={({ field }) => (
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    )}
                  />
                </div>

                <div className="flex items-center justify-between p-3 rounded-lg border bg-card">
                  <Label
                    htmlFor="default_break_hrs_flag"
                    className="flex items-center gap-2 font-medium"
                  >
                    <Coffee className="h-4 w-4" />
                    {t("scheduling.schedules.defaultBreakHours")}
                  </Label>
                  <Controller
                    name="default_break_hrs_flag"
                    control={control}
                    render={({ field }) => (
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    )}
                  />
                </div>

                <div className="flex items-center justify-between p-3 rounded-lg border bg-card">
                  <Label
                    htmlFor="override_schedule_on_holiday_flag"
                    className="flex items-center gap-2 font-medium"
                  >
                    <Shield className="h-4 w-4" />
                    {t("scheduling.schedules.overrideScheduleOnHoliday")}
                  </Label>
                  <Controller
                    name="override_schedule_on_holiday_flag"
                    control={control}
                    render={({ field }) => (
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    )}
                  />
                </div>

                <div className="flex items-center justify-between p-3 rounded-lg border bg-card">
                  <Label
                    htmlFor="reduce_required_hrs_flag"
                    className="flex items-center gap-2 font-medium"
                  >
                    <TrendingDown className="h-4 w-4" />
                    {t("scheduling.schedules.reduceRequiredHours")}
                  </Label>
                  <Controller
                    name="reduce_required_hrs_flag"
                    control={control}
                    render={({ field }) => (
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    )}
                  />
                </div>
              </div>
            </TabsContent>
          </Tabs>

          {/* Form Actions */}
          <div className="flex justify-end space-x-3 pt-6 border-t bg-muted/30 -mx-6 px-6 -mb-6 pb-6 rounded-b-lg">
            <Button type="button" variant="outline" onClick={onClose} size="lg">
              {t("common.cancel")}
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || isLoading}
              size="lg"
              className="min-w-[120px] cursor-pointer"
            >
              {isSubmitting || isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  {t("common.saving")}
                </div>
              ) : mode === "add" ? (
                t("common.add")
              ) : (
                t("common.save")
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
