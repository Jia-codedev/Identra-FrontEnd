"use client";

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import EmployeeCombobox from '@/components/ui/employee-combobox';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { CreateMonthlyRosterRequest } from '@/services/scheduling/employeeMonthlyRoster';

interface MonthlyRosterAddModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateMonthlyRosterRequest) => void;
  isLoading?: boolean;
}

export const MonthlyRosterAddModal: React.FC<MonthlyRosterAddModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  isLoading = false,
}) => {
  const [formData, setFormData] = useState<Partial<CreateMonthlyRosterRequest>>({
    employee_id: undefined,
    from_date: '',
    to_date: '',
    version_no: 1,
    finalize_flag: false,
  });
  const [fromDate, setFromDate] = useState<Date>();
  const [toDate, setToDate] = useState<Date>();

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
    setFormData({
      employee_id: undefined,
      from_date: '',
      to_date: '',
      version_no: 1,
      finalize_flag: false,
    });
    setFromDate(undefined);
    setToDate(undefined);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Monthly Roster</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="employee_id">Employee</Label>
            <EmployeeCombobox
              value={formData.employee_id ?? null}
              onChange={(v) => setFormData(prev => ({ ...prev, employee_id: v ?? undefined }))}
              placeholder="Select employee"
            />
          </div>

          <div className="space-y-2">
            <Label>From Date</Label>
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
                  {fromDate ? format(fromDate, "PPP") : "Pick a date"}
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
            <Label>To Date</Label>
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
                  {toDate ? format(toDate, "PPP") : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={toDate}
                  onSelect={setToDate}
                  disabled={(date) => fromDate ? date < fromDate : false}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <Label htmlFor="version_no">Version Number</Label>
            <Input
              id="version_no"
              type="number"
              value={formData.version_no || 1}
              onChange={(e) => setFormData(prev => ({ ...prev, version_no: parseInt(e.target.value) || 1 }))}
              min="1"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="manager_id">Manager (Optional)</Label>
            <EmployeeCombobox
              value={formData.manager_id ?? null}
              onChange={(v) => setFormData(prev => ({ ...prev, manager_id: v ?? undefined }))}
              placeholder="Select manager"
            />
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading || !formData.employee_id || !fromDate || !toDate}>
              {isLoading ? 'Creating...' : 'Create Roster'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
