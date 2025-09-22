"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Combobox, type ComboboxOption } from '@/components/ui/combobox';
import employeeApi from '@/services/employeemaster/employee';
import { useTranslations } from '@/hooks/use-translations';

interface EmployeeComboboxProps {
  value?: number | null;
  onChange: (val: number | null) => void;
  placeholder?: string;
  className?: string;
  limit?: number;
  emptyMessage?: string;
}

export const EmployeeCombobox: React.FC<EmployeeComboboxProps> = ({
  value,
  onChange,
  placeholder,
  className,
  limit = 20,
  emptyMessage,
}) => {
  const { t } = useTranslations();
  const [options, setOptions] = useState<ComboboxOption[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const searchRef = useRef('');

  const load = React.useCallback(async (q: string) => {
    setIsLoading(true);
    try {
      let resp: any;
      if (q && q.length > 0) {
        resp = await employeeApi.getEmployees({ offset: 1, limit, search: q });
      } else {
        try {
          resp = await employeeApi.getEmployeesWithoutPagination();
        } catch (e) {
          resp = await employeeApi.getEmployees({ offset: 1, limit });
        }
      }

      const status = resp?.status;
      const raw = resp?.data;
      const data = raw?.data ?? raw;

      if (status !== 200 && status !== 201) {
        console.warn('EmployeeCombobox: unexpected response status', status, raw);
        setOptions([]);
        return;
      }

      if (Array.isArray(data)) {
        const opts = data.map((emp: any) => ({
          label: `${emp.firstname_eng || ''} ${emp.lastname_eng || ''} (${emp.emp_no || emp.employee_id || ''})`,
          value: String(emp.employee_id),
        }));
        setOptions(opts);
      } else {
        if (data && typeof data === 'object') {
          const single = data;
          if (single.employee_id) {
            setOptions([{ label: `${single.firstname_eng || ''} ${single.lastname_eng || ''} (${single.emp_no || single.employee_id || ''})`, value: String(single.employee_id) }]);
            return;
          }
        }
        setOptions([]);
      }
    } catch (e) {
      setOptions([]);
    } finally {
      setIsLoading(false);
    }
  }, [limit]);

  const debouncedSearch = React.useCallback((q: string) => {
    searchRef.current = q;
    const id = setTimeout(() => {
      if (searchRef.current === q) load(q);
    }, 300);
    return () => clearTimeout(id);
  }, [load]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      if (value && typeof value === 'number') {
        try {
          const resp = await employeeApi.getEmployeeById(Number(value));
          const status = resp?.status;
          const raw = resp?.data;
          const emp = raw?.data ?? raw;
          if (mounted) {
            if (status === 200 && emp) {
              setOptions([{ label: `${emp.firstname_eng || ''} ${emp.lastname_eng || ''} (${emp.emp_no || emp.employee_id || ''})`, value: String(emp.employee_id) }]);
            } else {
              console.warn('EmployeeCombobox preload: unexpected response', status, raw);
            }
          }
        } catch (e) {
          console.error('EmployeeCombobox preload error', e);
        }
      }
    })();
    return () => { mounted = false; };
  }, [value]);

  useEffect(() => { load(''); }, [load]);

  return (
    <Combobox
      options={options}
      value={value != null ? String(value) : null}
      onValueChange={(v) => onChange(v ? Number(v) : null)}
      placeholder={placeholder}
      onSearch={(q) => debouncedSearch(q)}
      isLoading={isLoading}
      disableLocalFiltering={true}
      className={className}
      emptyMessage={emptyMessage ?? t('common.noData')}
    />
  );
};

export default EmployeeCombobox;
