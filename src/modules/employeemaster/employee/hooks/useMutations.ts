import { useMutation, useQueryClient } from "@tanstack/react-query";
import { IEmployee } from "../types";
import { toast } from "sonner";
import employeeApi from "@/services/employeemaster/employee";
import { useTranslations } from '@/hooks/use-translations';

export function useEmployeeMutations() {
  const queryClient = useQueryClient();
  const { t } = useTranslations();

  const createEmployeeMutation = useMutation({
    mutationFn: async (employeeData: IEmployee) => {
      if (!employeeData || typeof employeeData !== 'object') {
        throw new Error('Invalid employee data');
      }
      if (!employeeData.emp_no || employeeData.emp_no.toString().trim() === '') {
        throw new Error('Employee number (emp_no) is required');
      }

      const response = await employeeApi.addEmployee(employeeData);
      return response.data;
    },
    onSuccess: (data) => {
      if (!data) return;
      toast.success(t('toast.success.created'));
      
      queryClient.setQueriesData(
        { queryKey: ["employees"] },
        (oldData: any) => {
          if (!oldData || !oldData.pages) return oldData;
          
          const newPages = [...oldData.pages];
          if (newPages[0] && newPages[0].data) {
            newPages[0] = {
              ...newPages[0],
              data: [data.data || data, ...newPages[0].data],
              total: (newPages[0].total || 0) + 1
            };
          }
          
          return {
            ...oldData,
            pages: newPages
          };
        }
      );
    },
    onError: (error: any) => {
      console.error("Error creating employee:", error);
      
      if (error?.status === 409 || error?.response?.status === 409) {
        const conflictMessage = error?.message || error?.response?.data?.message;
        if (conflictMessage?.toLowerCase().includes('emp_no') || conflictMessage?.toLowerCase().includes('employee number')) {
          toast.error(t('employee.errors.duplicateEmployeeNumber') || 'Employee number already exists. Please use a different employee number.');
        } else if (conflictMessage?.toLowerCase().includes('email')) {
          toast.error(t('employee.errors.duplicateEmail') || 'Email address already exists. Please use a different email.');
        } else if (conflictMessage?.toLowerCase().includes('card_number')) {
          toast.error(t('employee.errors.duplicateCardNumber') || 'Card number already exists. Please use a different card number.');
        } else {
          toast.error(conflictMessage || t('employee.errors.duplicateEntry') || 'Duplicate entry found. Please check your data and try again.');
        }
      } else {
        const errorMessage =
          error?.response?.data?.message ||
          error?.message ||
          t('toast.error.creating');
        toast.error(errorMessage);
      }
    },
  });

  const updateEmployeeMutation = useMutation({
    mutationFn: async ({
      id,
      employeeData,
    }: {
      id: number;
      employeeData: IEmployee;
    }) => {
      const response = await employeeApi.updateEmployee(id, employeeData);
      return { id, data: response.data };
    },
    onSuccess: ({ id, data }) => {
      toast.success(t('toast.success.updated'));
      
      queryClient.setQueryData(["employee", id], data.data || data);
      
      queryClient.setQueriesData(
        { queryKey: ["employees"] },
        (oldData: any) => {
          if (!oldData || !oldData.pages) return oldData;
          
          const updatedPages = oldData.pages.map((page: any) => ({
            ...page,
            data: page.data?.map((employee: IEmployee) => 
              employee.employee_id === id 
                ? { ...employee, ...(data.data || data) }
                : employee
            ) || []
          }));
          
          return {
            ...oldData,
            pages: updatedPages
          };
        }
      );
    },
    onError: (error: any) => {
      console.error("Error updating employee:", error);
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        t('toast.error.updating');
      toast.error(errorMessage);
    },
  });

  const deleteEmployeeMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await employeeApi.deleteEmployee(id);
      
      if (response.status === 400) {
        toast.error(response.data?.message || "Cannot delete employee");
        return null
      }
      if (response.status !== 200) {
        toast.error(response.data?.message || "Failed to delete employee");
        return null;
      }
      
      return { id, data: response.data };
    },
    onSuccess: (data) => {
      if (!data) return;
      const { id } = data;
      
      toast.success(t('toast.success.deleted'));
      
      queryClient.removeQueries({ queryKey: ["employee", id] });
      
      queryClient.setQueriesData(
        { queryKey: ["employees"] },
        (oldData: any) => {
          if (!oldData || !oldData.pages) return oldData;
          
          const updatedPages = oldData.pages.map((page: any) => ({
            ...page,
            data: page.data?.filter((employee: IEmployee) => 
              employee.employee_id !== id
            ) || [],
            total: Math.max(0, (page.total || 0) - 1)
          }));
          
          return {
            ...oldData,
            pages: updatedPages
          };
        }
      );
    },
    onError: (error: any) => {
      console.error("Error deleting employee:", error);
      const errorMessage = error?.message || t('toast.error.deleting');
      toast.error(errorMessage);
    },
  });

  const deleteEmployeesMutation = useMutation({
    mutationFn: async (ids: number[]) => {
      const response = await employeeApi.deleteEmployees(ids);
      
      if (response.status === 400) {
        toast.error(response.data?.message || "Cannot delete employees");
        return null;
      }
      
      if (response.status === 500) {
        toast.error(response.data?.message || "Failed to delete employees");
        return null;
      }
      
      if (response.status !== 200) {
        toast.error(response.data?.message || "Failed to delete employees");
        return null;
      }
      
      return { ids, data: response.data };
    },
    onSuccess: (data) => {
      if (!data) return;
      const { ids } = data;
      
      toast.success(`${ids.length} ${t('toast.success.deletedMultiple')}`);
      
      ids.forEach((id) => {
        queryClient.removeQueries({ queryKey: ["employee", id] });
      });
      
      queryClient.setQueriesData(
        { queryKey: ["employees"] },
        (oldData: any) => {
          if (!oldData || !oldData.pages) return oldData;
          
          const updatedPages = oldData.pages.map((page: any) => ({
            ...page,
            data: page.data?.filter((employee: IEmployee) => 
              !ids.includes(employee.employee_id!)
            ) || [],
            total: Math.max(0, (page.total || 0) - ids.length)
          }));
          
          return {
            ...oldData,
            pages: updatedPages
          };
        }
      );
    },
    onError: (error: any) => {
      console.error("Error deleting employees:", error);
      const errorMessage = error?.message || t('toast.error.deletingMultiple');
      toast.error(errorMessage);
    },
  });

  return {
    createEmployee: createEmployeeMutation.mutateAsync,
    updateEmployee: updateEmployeeMutation.mutateAsync,
    deleteEmployee: deleteEmployeeMutation.mutate,
    deleteEmployees: deleteEmployeesMutation.mutate,
    createEmployeeMutation,
    updateEmployeeMutation,
    deleteEmployeeMutation,
    deleteEmployeesMutation,
  };
}
