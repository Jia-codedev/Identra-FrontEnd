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
      const resp = q && q.length > 0
        ? await employeeApi.getEmployees({ offset: 1, limit, search: q })
        : await employeeApi.getEmployees({ offset: 1, limit });

      const data = resp?.data?.data ?? resp?.data ?? [];
      if (Array.isArray(data)) {
        const opts = data.map((emp: any) => ({
          label: `${emp.firstname_eng || ''} ${emp.lastname_eng || ''} (${emp.emp_no || emp.employee_id || ''})`,
          value: emp.employee_id,
        }));
        setOptions(opts);
      } else {
        setOptions([]);
      }
    } catch (e) {
      setOptions([]);
    } finally {
      setIsLoading(false);
    }
  }, [limit]);

  // debounce
  const debouncedSearch = React.useCallback((q: string) => {
    searchRef.current = q;
    const id = setTimeout(() => {
      if (searchRef.current === q) load(q);
    }, 300);
    return () => clearTimeout(id);
  }, [load]);

  // preload selected
  useEffect(() => {
    let mounted = true;
    (async () => {
      if (value && typeof value === 'number') {
        try {
          const resp = await employeeApi.getEmployeeById(Number(value));
          const emp = resp?.data?.data ?? resp?.data;
          if (mounted && emp) {
            setOptions([{ label: `${emp.firstname_eng || ''} ${emp.lastname_eng || ''} (${emp.emp_no || emp.employee_id || ''})`, value: emp.employee_id }]);
          }
        } catch (e) {
          // ignore
        }
      }
    })();
    return () => { mounted = false; };
  }, [value]);

  // initial load
  useEffect(() => { load(''); }, [load]);

  return (
    <Combobox
      options={options}
      value={value ?? null}
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
