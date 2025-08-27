import React from "react";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/Checkbox";
import { EmployeeStepProps } from "./types";

export const EmployeeSettingsStep: React.FC<EmployeeStepProps> = ({
  formData,
  onInputChange,
  t,
}) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-4">
          <h4 className="text-sm font-medium text-foreground">
            {t("employeeMaster.employee.generalSettings")}
          </h4>
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="active_flag"
                checked={formData.active_flag}
                onCheckedChange={(checked) => onInputChange("active_flag", checked)}
              />
              <Label htmlFor="active_flag" className="text-sm">
                {t("employeeMaster.employee.activeFlag")}
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="local_flag"
                checked={formData.local_flag}
                onCheckedChange={(checked) => onInputChange("local_flag", checked)}
              />
              <Label htmlFor="local_flag" className="text-sm">
                {t("employeeMaster.employee.localFlag")}
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="manager_flag"
                checked={formData.manager_flag}
                onCheckedChange={(checked) => onInputChange("manager_flag", checked)}
              />
              <Label htmlFor="manager_flag" className="text-sm">
                {t("employeeMaster.employee.managerFlag")}
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="inpayroll_flag"
                checked={formData.inpayroll_flag}
                onCheckedChange={(checked) => onInputChange("inpayroll_flag", checked)}
              />
              <Label htmlFor="inpayroll_flag" className="text-sm">
                {t("employeeMaster.employee.inPayrollFlag")}
              </Label>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="text-sm font-medium text-foreground">
            {t("employeeMaster.employee.attendanceSettings")}
          </h4>
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="punch_flag"
                checked={formData.punch_flag}
                onCheckedChange={(checked) => onInputChange("punch_flag", checked)}
              />
              <Label htmlFor="punch_flag" className="text-sm">
                {t("employeeMaster.employee.punchFlag")}
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="web_punch_flag"
                checked={formData.web_punch_flag}
                onCheckedChange={(checked) => onInputChange("web_punch_flag", checked)}
              />
              <Label htmlFor="web_punch_flag" className="text-sm">
                {t("employeeMaster.employee.webPunchFlag")}
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="shift_flag"
                checked={formData.shift_flag}
                onCheckedChange={(checked) => onInputChange("shift_flag", checked)}
              />
              <Label htmlFor="shift_flag" className="text-sm">
                {t("employeeMaster.employee.shiftFlag")}
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="geofence_flag"
                checked={formData.geofence_flag}
                onCheckedChange={(checked) => onInputChange("geofence_flag", checked)}
              />
              <Label htmlFor="geofence_flag" className="text-sm">
                {t("employeeMaster.employee.geofenceFlag")}
              </Label>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-4">
          <h4 className="text-sm font-medium text-foreground">
            {t("employeeMaster.employee.reportSettings")}
          </h4>
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="on_reports_flag"
                checked={formData.on_reports_flag}
                onCheckedChange={(checked) => onInputChange("on_reports_flag", checked)}
              />
              <Label htmlFor="on_reports_flag" className="text-sm">
                {t("employeeMaster.employee.onReportsFlag")}
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="share_roster_flag"
                checked={formData.share_roster_flag}
                onCheckedChange={(checked) => onInputChange("share_roster_flag", checked)}
              />
              <Label htmlFor="share_roster_flag" className="text-sm">
                {t("employeeMaster.employee.shareRosterFlag")}
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="calculate_monthly_missed_hrs_flag"
                checked={formData.calculate_monthly_missed_hrs_flag}
                onCheckedChange={(checked) =>
                  onInputChange("calculate_monthly_missed_hrs_flag", checked)
                }
              />
              <Label htmlFor="calculate_monthly_missed_hrs_flag" className="text-sm">
                {t("employeeMaster.employee.calculateMonthlyMissedHrsFlag")}
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="exclude_from_integration_flag"
                checked={formData.exclude_from_integration_flag}
                onCheckedChange={(checked) =>
                  onInputChange("exclude_from_integration_flag", checked)
                }
              />
              <Label htmlFor="exclude_from_integration_flag" className="text-sm">
                {t("employeeMaster.employee.excludeFromIntegrationFlag")}
              </Label>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="text-sm font-medium text-foreground">
            {t("employeeMaster.employee.notificationSettings")}
          </h4>
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="email_notifications_flag"
                checked={formData.email_notifications_flag}
                onCheckedChange={(checked) =>
                  onInputChange("email_notifications_flag", checked)
                }
              />
              <Label htmlFor="email_notifications_flag" className="text-sm">
                {t("employeeMaster.employee.emailNotificationsFlag")}
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="include_email_flag"
                checked={formData.include_email_flag}
                onCheckedChange={(checked) => onInputChange("include_email_flag", checked)}
              />
              <Label htmlFor="include_email_flag" className="text-sm">
                {t("employeeMaster.employee.includeEmailFlag")}
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="open_shift_flag"
                checked={formData.open_shift_flag}
                onCheckedChange={(checked) => onInputChange("open_shift_flag", checked)}
              />
              <Label htmlFor="open_shift_flag" className="text-sm">
                {t("employeeMaster.employee.openShiftFlag")}
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="overtime_flag"
                checked={formData.overtime_flag}
                onCheckedChange={(checked) => onInputChange("overtime_flag", checked)}
              />
              <Label htmlFor="overtime_flag" className="text-sm">
                {t("employeeMaster.employee.overtimeFlag")}
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="check_inout_selfie_flag"
                checked={formData.check_inout_selfie_flag}
                onCheckedChange={(checked) =>
                  onInputChange("check_inout_selfie_flag", checked)
                }
              />
              <Label htmlFor="check_inout_selfie_flag" className="text-sm">
                {t("employeeMaster.employee.checkInOutSelfieFlag")}
              </Label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
