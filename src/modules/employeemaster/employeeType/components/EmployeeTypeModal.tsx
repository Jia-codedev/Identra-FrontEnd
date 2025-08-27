"use client";
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from "@/components/ui/Input";;
import { Label } from '@/components/ui/label';
import { useTranslations } from '@/hooks/use-translations';
import { useLanguage } from '@/providers/language-provider';
import { IEmployeeType } from '../types';

interface EmployeeTypeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: IEmployeeType) => void;
  employeeType?: IEmployeeType | null;
  mode: 'add' | 'edit';
}

export const EmployeeTypeModal: React.FC<EmployeeTypeModalProps> = ({
  isOpen,
  onClose,
  onSave,
  employeeType,
  mode,
}) => {
  const { t } = useTranslations();
  const { isRTL } = useLanguage();
  type EmployeeTypeFormFields = {
    employee_type_eng: string;
    employee_type_code: string;
    employee_type_arb: string;
  };

  const initialForm: EmployeeTypeFormFields = {
    employee_type_eng: '',
    employee_type_code: '',
    employee_type_arb: '',
  };
  const [formData, setFormData] = useState<EmployeeTypeFormFields>(initialForm);

  useEffect(() => {
    if (employeeType && mode === 'edit') {
      setFormData({
        employee_type_eng: employeeType.employee_type_eng || '',
        employee_type_code: employeeType.employee_type_code || '',
        employee_type_arb: employeeType.employee_type_arb || '',
      });
    } else {
      setFormData(initialForm);
    }
  }, [employeeType, mode, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData as any);
  };

  const handleInputChange = (field: keyof EmployeeTypeFormFields, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="bg-background rounded-lg shadow-lg w-full max-w-md p-2"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between mb-6 px-2">
            <h2 className="text-xl font-semibold text-foreground">
              {mode === 'add'
                ? t('employeeMaster.employeeTypes.addEmployeeType')
                : t('employeeMaster.employeeTypes.editEmployeeType')
              }
            </h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="h-8 w-8"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 dark:bg-white/5 bg-black/5 rounded-xl p-2">
            <div>
              <Label htmlFor="employee_type_code" className="text-sm font-medium">
                {t('employeeMaster.employeeTypes.employeeTypeCode')} *
              </Label>
              <Input
                id="employee_type_code"
                value={formData.employee_type_code}
                onChange={(e) => handleInputChange('employee_type_code', e.target.value.toUpperCase())}
                placeholder={t('employeeMaster.employeeTypes.enterEmployeeTypeCode')}
                required
                className="mt-1"
              />
            </div>
            {
              isRTL ? (
                <div>
                  <Label htmlFor="employee_type_arb" className="text-sm font-medium">
                    {t('employeeMaster.employeeTypes.employeeTypeNameArabic')}
                  </Label>
                  <Input
                    id="employee_type_arb"
                    value={formData.employee_type_arb}
                    onChange={(e) => handleInputChange('employee_type_arb', e.target.value)}
                    placeholder={t('employeeMaster.employeeTypes.enterEmployeeTypeNameArabic')}
                    className="mt-1"
                  />
                </div>
              ) : (
                <div>
                  <Label htmlFor="employee_type_eng" className="text-sm font-medium">
                    {t('employeeMaster.employeeTypes.employeeTypeName')} *
                  </Label>
                  <Input
                    id="employee_type_eng"
                    value={formData.employee_type_eng}
                    onChange={(e) => handleInputChange('employee_type_eng', e.target.value)}
                    placeholder={t('employeeMaster.employeeTypes.enterEmployeeTypeName')}
                    required
                    className="mt-1"
                  />
                </div>
              )
            }
            <div className={`flex gap-3 pt-4 ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="flex-1"
              >
                {t('common.cancel')}
              </Button>
              <Button type="submit" className="flex-1">
                {t('common.save')}
              </Button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};