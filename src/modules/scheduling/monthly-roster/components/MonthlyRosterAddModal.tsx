"use client";

import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/Input";
// replaced custom comboboxes with SearchCombobox instances
import { SearchCombobox } from "@/components/ui/search-combobox";
import organizationsApi from "@/services/masterdata/organizations";
import employeeApi from "@/services/employeemaster/employee";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/Checkbox";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { useTranslations } from "@/hooks/use-translations";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { CreateMonthlyRosterRequest } from "@/services/scheduling/employeeMonthlyRoster";

interface MonthlyRosterAddModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateMonthlyRosterRequest) => void;
  isLoading?: boolean;
  initialData?: Partial<CreateMonthlyRosterRequest> | null;
}

export const MonthlyRosterAddModal: React.FC<MonthlyRosterAddModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  isLoading = false,
  initialData = null,
}) => {
  const { t } = useTranslations();
  const [formData, setFormData] = useState<Partial<CreateMonthlyRosterRequest>>(
    {
      employee_id: undefined,
      from_date: "",
      to_date: "",
      version_no: 1,
      finalize_flag: false,
    }
  );
  const [fromDate, setFromDate] = useState<Date>();
  const [toDate, setToDate] = useState<Date>();
  const [selectedOrganizationId, setSelectedOrganizationId] = useState<
    number | null
  >(null);
  const [orgOptions, setOrgOptions] = useState<
    { label: string; value: number }[]
  >([]);
  const [empOptions, setEmpOptions] = useState<
    { label: string; value: number }[]
  >([]);

  useEffect(() => {
    if (initialData) {
      setFormData((prev) => ({ ...prev, ...initialData }));
      if (initialData.from_date) {
        try {
          setFromDate(new Date(initialData.from_date));
        } catch {
          setFromDate(undefined);
        }
      }
      if (initialData.to_date) {
        try {
          setToDate(new Date(initialData.to_date));
        } catch {
          setToDate(undefined);
        }
      }
    } else {
      setFormData({
        employee_id: undefined,
        from_date: "",
        to_date: "",
        version_no: 1,
        finalize_flag: false,
      });
      setFromDate(undefined);
      setToDate(undefined);
      setSelectedOrganizationId(null);
    }
  }, [initialData, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.employee_id || !fromDate || !toDate) return;

    onSubmit({
      employee_id: formData.employee_id,
      from_date: fromDate.toISOString(),
      to_date: toDate.toISOString(),
      version_no: formData.version_no || 1,
      finalize_flag: formData.finalize_flag || false,
      manager_id: formData.manager_id,
    });
  };

  const handleClose = () => {
    setFormData(
      initialData
        ? initialData
        : {
            employee_id: undefined,
            from_date: "",
            to_date: "",
            version_no: 1,
            finalize_flag: false,
          }
    );
    setFromDate(undefined);
    setToDate(undefined);
    setSelectedOrganizationId(null);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {initialData
              ? t("scheduling.monthlyRoster.modal.edit")
              : t("scheduling.monthlyRoster.modal.add")}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="organization_id">
              {t("common.organization") || "Organization"}
            </Label>
            <SearchCombobox
              options={orgOptions}
              value={selectedOrganizationId ?? null}
              onValueChange={(val) => {
                const num = val === null ? null : Number(val);
                setSelectedOrganizationId(num);
                setFormData((prev) => ({
                  ...prev,
                  employee_id: undefined,
                  manager_id: undefined,
                }));
              }}
              onSearch={async (q: string) => {
                try {
                  const res =
                    await organizationsApi.getOrganizationDropdownList();
                  let data = res?.data?.data || res?.data || [];
                  if (Array.isArray(data)) {
                    const filtered = q
                      ? data.filter((org: any) =>
                          (org.organization_eng || "")
                            .toString()
                            .toLowerCase()
                            .includes(q.toLowerCase())
                        )
                      : data;
                    setOrgOptions(
                      filtered.map((o: any) => ({
                        label: o.organization_eng || o.organization_arb || "",
                        value: o.organization_id,
                      }))
                    );
                  } else {
                    setOrgOptions([]);
                  }
                } catch (e) {
                  setOrgOptions([]);
                }
              }}
              placeholder={
                t("common.selectOrganization") || "Select organization"
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="employee_id">{t("common.name")}</Label>
            <SearchCombobox
              options={empOptions}
              value={formData.employee_id ?? null}
              onValueChange={(val) =>
                setFormData((prev) => ({
                  ...prev,
                  employee_id: val === null ? undefined : Number(val),
                }))
              }
              onSearch={async (q: string) => {
                try {
                  const resp = await employeeApi.getEmployees({
                    offset: 1,
                    limit: 50,
                    ...(q ? { search: q } : {}),
                    ...(selectedOrganizationId
                      ? { organization_id: selectedOrganizationId }
                      : {}),
                  });
                  const raw = resp?.data;
                  const data = raw?.data ?? raw;
                  if (Array.isArray(data)) {
                    setEmpOptions(
                      data.map((emp: any) => ({
                        label: `${emp.firstname_eng || ""} ${
                          emp.lastname_eng || ""
                        } (${emp.emp_no || emp.employee_id || ""})`,
                        value: emp.employee_id,
                      }))
                    );
                  } else {
                    setEmpOptions([]);
                  }
                } catch (e) {
                  setEmpOptions([]);
                }
              }}
              placeholder={t("common.selectEmployee") || "Select employee"}
            />
          </div>

          <div className="space-y-2">
            <Label>{t("common.fromDate")}</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !fromDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {fromDate ? format(fromDate, "PPP") : t("common.pickDate")}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={fromDate}
                  onSelect={setFromDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <Label>{t("common.toDate")}</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !toDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {toDate ? format(toDate, "PPP") : t("common.pickDate")}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={toDate}
                  onSelect={setToDate}
                  disabled={(date) => (fromDate ? date < fromDate : false)}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <Label htmlFor="version_no">
              {t("scheduling.monthlyRoster.modal.versionNumber") ||
                "Version Number"}
            </Label>
            <Input
              id="version_no"
              type="number"
              value={formData.version_no || 1}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  version_no: parseInt(e.target.value) || 1,
                }))
              }
              min="1"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="manager_id">
              {t("scheduling.monthlyRoster.modal.manager") ||
                "Manager (Optional)"}
            </Label>
            <SearchCombobox
              options={empOptions}
              value={formData.manager_id ?? null}
              onValueChange={(val) =>
                setFormData((prev) => ({
                  ...prev,
                  manager_id: val === null ? undefined : Number(val),
                }))
              }
              onSearch={async (q: string) => {
                try {
                  const resp = await employeeApi.getEmployees({
                    offset: 1,
                    limit: 50,
                    ...(q ? { search: q } : {}),
                    ...(selectedOrganizationId
                      ? { organization_id: selectedOrganizationId }
                      : {}),
                  });
                  const raw = resp?.data;
                  const data = raw?.data ?? raw;
                  if (Array.isArray(data)) {
                    setEmpOptions(
                      data.map((emp: any) => ({
                        label: `${emp.firstname_eng || ""} ${
                          emp.lastname_eng || ""
                        } (${emp.emp_no || emp.employee_id || ""})`,
                        value: emp.employee_id,
                      }))
                    );
                  } else {
                    setEmpOptions([]);
                  }
                } catch (e) {
                  setEmpOptions([]);
                }
              }}
              placeholder="Select manager"
            />
          </div>

          <div className="flex items-center gap-2">
            <Checkbox
              checked={Boolean(formData.finalize_flag)}
              onCheckedChange={(v) => {
                setFormData((prev) => ({ ...prev, finalize_flag: Boolean(v) }));
              }}
            />
            <Label className="m-0">
              {t("scheduling.monthlyRoster.modal.finalize") ||
                "Finalize roster"}
            </Label>
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={handleClose}>
              {t("common.cancel")}
            </Button>
            <Button
              type="submit"
              disabled={
                isLoading || !formData.employee_id || !fromDate || !toDate
              }
            >
              {isLoading
                ? initialData
                  ? t("common.saving")
                  : t("common.saving")
                : initialData
                ? t("scheduling.monthlyRoster.modal.update")
                : t("scheduling.monthlyRoster.modal.create")}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
