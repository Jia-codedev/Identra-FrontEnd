"use client";

import React, { useState, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/Input";
import { Checkbox } from "@/components/ui/Checkbox";
import { Search, Loader2 } from "lucide-react";
import { useTranslations } from "@/hooks/use-translations";
import { useLanguage } from "@/providers/language-provider";
import { ScrollArea } from "@/components/ui/scroll-area";

interface AddMembersDialogProps {
  isOpen: boolean;
  onClose: () => void;
  availableEmployees: any[];
  onAddMembers: (userIds: number[]) => void;
  isLoading: boolean;
}

export const AddMembersDialog: React.FC<AddMembersDialogProps> = ({
  isOpen,
  onClose,
  availableEmployees,
  onAddMembers,
  isLoading,
}) => {
  const { t } = useTranslations();
  const { isRTL } = useLanguage();
  const [search, setSearch] = useState("");
  const [selectedEmployees, setSelectedEmployees] = useState<number[]>([]);

  const filteredEmployees = useMemo(() => {
    if (!search) return availableEmployees;

    const searchLower = search.toLowerCase();
    return availableEmployees.filter((user) => {
      const employee = user.employee_master;
      if (!employee) return false;

      const empNo = employee.emp_no?.toLowerCase() || "";
      const firstNameEng = employee.firstname_eng?.toLowerCase() || "";
      const lastNameEng = employee.lastname_eng?.toLowerCase() || "";
      const firstNameArb = employee.firstname_arb?.toLowerCase() || "";
      const lastNameArb = employee.lastname_arb?.toLowerCase() || "";

      return (
        empNo.includes(searchLower) ||
        firstNameEng.includes(searchLower) ||
        lastNameEng.includes(searchLower) ||
        firstNameArb.includes(searchLower) ||
        lastNameArb.includes(searchLower)
      );
    });
  }, [availableEmployees, search]);

  const handleToggleEmployee = (employeeId: number) => {
    setSelectedEmployees((prev) =>
      prev.includes(employeeId)
        ? prev.filter((id) => id !== employeeId)
        : [...prev, employeeId]
    );
  };

  const handleToggleAll = () => {
    if (selectedEmployees.length === filteredEmployees.length) {
      setSelectedEmployees([]);
    } else {
      setSelectedEmployees(
        filteredEmployees
          .filter((user) => user.user_id)
          .map((user) => user.user_id)
      );
    }
  };

  const handleAdd = () => {
    if (selectedEmployees.length > 0) {
      onAddMembers(selectedEmployees);
      setSelectedEmployees([]);
      setSearch("");
      onClose();
    }
  };

  const handleClose = () => {
    setSelectedEmployees([]);
    setSearch("");
    onClose();
  };

  const allChecked =
    filteredEmployees.length > 0 &&
    filteredEmployees.every((user) => selectedEmployees.includes(user.user_id));

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>
            {t("security.roles.addMembers") || "Add Members"}
          </DialogTitle>
          <DialogDescription>
            {t("security.roles.addMembersDescription") ||
              "Select employees to add as members to this role"}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder={
                t("security.roles.searchEmployees") || "Search employees..."
              }
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>

          {/* Select All */}
          <div className="flex items-center gap-2 p-2 border-b">
            <Checkbox checked={allChecked} onCheckedChange={handleToggleAll} />
            <span className="text-sm font-medium">
              {t("common.selectAll") || "Select All"} (
              {selectedEmployees.length}/{filteredEmployees.length})
            </span>
          </div>

          {/* Employee List */}
          <ScrollArea className="h-[400px] pr-4">
            {isLoading ? (
              <div className="flex items-center justify-center h-32">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : filteredEmployees.length === 0 ? (
              <div className="flex items-center justify-center h-32 text-muted-foreground">
                {t("security.roles.noEmployeesAvailable") ||
                  "No employees available"}
              </div>
            ) : (
              <div className="space-y-2">
                {filteredEmployees.map((user) => {
                  const userId = user.user_id;
                  const employee = user.employee_master;
                  if (!userId || !employee) return null;

                  const isChecked = selectedEmployees.includes(userId);
                  const fullName = isRTL
                    ? `${employee.firstname_arb || ""} ${
                        employee.lastname_arb || ""
                      }`.trim()
                    : `${employee.firstname_eng || ""} ${
                        employee.lastname_eng || ""
                      }`.trim();

                  return (
                    <div
                      key={employee.employee_id}
                      className="flex items-center gap-3 p-3 rounded-lg border hover:bg-accent/50 cursor-pointer transition-colors"
                      onClick={() => handleToggleEmployee(userId)}
                    >
                      <Checkbox
                        checked={isChecked}
                        onCheckedChange={() => handleToggleEmployee(userId)}
                      />
                      <div className="flex-1">
                        <div className="font-medium">{fullName}</div>
                        <div className="text-sm text-muted-foreground">
                          {employee.emp_no}
                        </div>
                      </div>
                      {employee.organizations && (
                        <div className="text-xs text-muted-foreground">
                          {employee.organizations.organization_name_eng}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </ScrollArea>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            {t("common.cancel") || "Cancel"}
          </Button>
          <Button
            onClick={handleAdd}
            disabled={selectedEmployees.length === 0 || isLoading}
          >
            {t("common.add") || "Add"} ({selectedEmployees.length})
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
