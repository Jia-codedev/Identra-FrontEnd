"use client";

import React, { useMemo, useState } from 'react';
import { MonthlyRosterHeader } from './components/MonthlyRosterHeader';
import { MonthlyRosterTable } from './components/MonthlyRosterTable';
import { MonthlyRosterAddModal } from './components/MonthlyRosterAddModal';
import { useMonthlyRoster } from './hooks/useMonthlyRoster';
import { MonthlyRosterFilters } from './types';
import { useMonthlyRosterMutations } from './hooks/useMutations';
import { toast } from 'sonner';

export default function MonthlyRosterPage() {
  const [filters, setFilters] = useState<MonthlyRosterFilters>({
    organization_id: undefined,
    month: undefined,
    year: undefined,
    employee_group_id: undefined,
  });
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const apiFilters = useMemo(() => {
    if (!filters.organization_id || !filters.month || !filters.year) return undefined;
    return {
      organization_id: filters.organization_id!,
      month: filters.month!,
      year: filters.year!,
      employee_group_id: filters.employee_group_id,
    };
  }, [filters]);

  const { data, isLoading, refetch } = useMonthlyRoster(apiFilters as any);
  const { createMutation, finalizeMutation, deleteMutation } = useMonthlyRosterMutations();

  console.log('Monthly Roster Page - filters:', filters);
  console.log('Monthly Roster Page - apiFilters:', apiFilters);
  console.log('Monthly Roster Page - data:', data);
  console.log('Monthly Roster Page - isLoading:', isLoading);

  const handleFinalize = async (row: any) => {
    try {
      await finalizeMutation.mutateAsync(row.schedule_roster_id);
      toast.success('Finalized');
      refetch();
    } catch (e) {
      toast.error('Failed to finalize');
    }
  };

  const handleDelete = async (row: any) => {
    try {
      await deleteMutation.mutateAsync(row.schedule_roster_id);
      toast.success('Deleted');
      refetch();
    } catch (e) {
      toast.error('Failed to delete');
    }
  };

  const handleAddRoster = () => {
    setIsAddModalOpen(true);
  };

  const handleAddSampleData = async () => {
    if (!filters.organization_id || !filters.month || !filters.year) {
      toast.error('Please select organization, month, and year first');
      return;
    }

    try {
      // First, get available schedules for this organization
      const schedulesResponse = await fetch(`/api/schedule?organization_id=${filters.organization_id}`);
      const schedulesData = await schedulesResponse.json();
      
      let availableSchedules = [];
      if (schedulesData.success && schedulesData.data && schedulesData.data.length > 0) {
        availableSchedules = schedulesData.data;
      } else {
        // Use default schedule IDs if no schedules are found
        availableSchedules = [
          { schedule_id: 1, schedule_code: 'REG' },
          { schedule_id: 2, schedule_code: 'OFF' }
        ];
      }

      // Create sample data for 3 employees
      const sampleEmployees = [101, 102, 103]; // Sample employee IDs
      const daysInMonth = new Date(filters.year!, filters.month!, 0).getDate();
      
      const regSchedule = availableSchedules.find((s: any) => s.schedule_code === 'REG') || availableSchedules[0];
      const offSchedule = availableSchedules.find((s: any) => s.schedule_code === 'OFF') || availableSchedules[1] || regSchedule;
      
      for (const employeeId of sampleEmployees) {
        const daySchedules: any = {};
        
        // Create sample roster for each day with actual schedule IDs
        for (let day = 1; day <= daysInMonth; day++) {
          // Random OFF days (20% chance), mostly REG schedule
          daySchedules[`D${day}`] = Math.random() > 0.8 ? offSchedule.schedule_id : regSchedule.schedule_id;
        }

        const sampleData = {
          employee_id: employeeId,
          from_date: `${filters.year}-${String(filters.month).padStart(2, '0')}-01`,
          to_date: `${filters.year}-${String(filters.month).padStart(2, '0')}-${String(daysInMonth).padStart(2, '0')}`,
          version_no: 1,
          manager_id: 1, // Sample manager ID
          ...daySchedules
        };

        await createMutation.mutateAsync(sampleData as any);
      }
      
      toast.success('Sample data created successfully');
      refetch();
    } catch (error) {
      console.error('Error creating sample data:', error);
      toast.error('Failed to create sample data');
    }
  };

  const handleCreateRoster = async (data: any) => {
    try {
      await createMutation.mutateAsync(data);
      toast.success('Monthly roster created successfully');
      setIsAddModalOpen(false);
      refetch();
    } catch (e) {
      toast.error('Failed to create monthly roster');
    }
  };

  return (
    <div className="p-6 space-y-4 border rounded-2xl">
      <MonthlyRosterHeader 
        filters={filters} 
        onFiltersChange={(f) => setFilters(prev => ({ ...prev, ...f }))} 
        onAddRoster={handleAddRoster}
        onAddSampleData={handleAddSampleData}
      />

      <MonthlyRosterTable
        data={(data as any) || []}
        isLoading={isLoading}
        onFinalize={handleFinalize}
        onDelete={handleDelete}
      />

      <MonthlyRosterAddModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleCreateRoster}
        isLoading={createMutation.isPending}
      />
    </div>
  );
}
