import { useState, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import employeeApi from '@/services/employeemaster/employee';
import { debounce } from 'lodash';

export function useEmployeeValidation() {
  const [empNoToCheck, setEmpNoToCheck] = useState<string>('');
  const [emailToCheck, setEmailToCheck] = useState<string>('');

  // Check employee number existence
  const empNoQuery = useQuery({
    queryKey: ['checkEmployeeNumber', empNoToCheck],
    queryFn: () => employeeApi.checkEmployeeNumberExists(empNoToCheck),
    enabled: !!empNoToCheck && empNoToCheck.length > 0,
    retry: false,
    staleTime: 30 * 1000, // 30 seconds
  });

  // Check email existence
  const emailQuery = useQuery({
    queryKey: ['checkEmail', emailToCheck],
    queryFn: () => employeeApi.checkEmailExists(emailToCheck),
    enabled: !!emailToCheck && emailToCheck.length > 0,
    retry: false,
    staleTime: 30 * 1000, // 30 seconds
  });

  // Debounced functions to avoid too many API calls
  const debouncedCheckEmpNo = useCallback(
    debounce((empNo: string) => {
      if (empNo && empNo.trim()) {
        setEmpNoToCheck(empNo.trim());
      } else {
        setEmpNoToCheck('');
      }
    }, 500),
    []
  );

  const debouncedCheckEmail = useCallback(
    debounce((email: string) => {
      if (email && email.trim() && email.includes('@')) {
        setEmailToCheck(email.trim());
      } else {
        setEmailToCheck('');
      }
    }, 500),
    []
  );

  const checkEmployeeNumber = useCallback((empNo: string) => {
    debouncedCheckEmpNo(empNo);
  }, [debouncedCheckEmpNo]);

  const checkEmail = useCallback((email: string) => {
    debouncedCheckEmail(email);
  }, [debouncedCheckEmail]);

  const clearValidation = useCallback(() => {
    setEmpNoToCheck('');
    setEmailToCheck('');
  }, []);

  return {
    checkEmployeeNumber,
    checkEmail,
    clearValidation,
    empNoExists: empNoQuery.data?.data?.exists === true,
    emailExists: emailQuery.data?.data?.exists === true,
    isCheckingEmpNo: empNoQuery.isLoading,
    isCheckingEmail: emailQuery.isLoading,
    empNoError: empNoQuery.error,
    emailError: emailQuery.error,
  };
}
