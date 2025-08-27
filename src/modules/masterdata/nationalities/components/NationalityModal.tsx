"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from "@/components/ui/Input";;
import { Label } from '@/components/ui/label';
import { useTranslations } from '@/hooks/use-translations';
import { useLanguage } from '@/providers/language-provider';
import { INationality } from '../types';

interface NationalityModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: INationality) => void;
  nationality?: INationality | null;
  mode: 'add' | 'edit';
}

export const NationalityModal: React.FC<NationalityModalProps> = ({
  isOpen,
  onClose,
  onSave,
  nationality,
  mode,
}) => {
  const { t } = useTranslations();
  const { isRTL } = useLanguage();
  
  type NationalityFormFields = {
    citizenship_eng: string;
    citizenship_code: string;
    citizenship_arb: string;
  };

  const initialForm: NationalityFormFields = {
    citizenship_eng: '',
    citizenship_code: '',
    citizenship_arb: '',
  };
  
  const [formData, setFormData] = useState<NationalityFormFields>(initialForm);

  useEffect(() => {
    if (nationality && mode === 'edit') {
      setFormData({
        citizenship_eng: nationality.citizenship_eng || '',
        citizenship_code: nationality.citizenship_code || '',
        citizenship_arb: nationality.citizenship_arb || '',
      });
    } else {
      setFormData(initialForm);
    }
  }, [nationality, mode, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData as any);
  };

  const handleInputChange = (field: keyof NationalityFormFields, value: string | number) => {
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
                ? t('masterData.nationalities.addNationality')
                : t('masterData.nationalities.editNationality')
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
              <Label htmlFor="citizenship_code" className="text-sm font-medium">
                {t('masterData.nationalities.nationalityCode')} *
              </Label>
              <Input
                id="citizenship_code"
                value={formData.citizenship_code}
                onChange={(e) => handleInputChange('citizenship_code', e.target.value.toUpperCase())}
                placeholder={t('masterData.nationalities.enterNationalityCode')}
                required
                className="mt-1"
              />
            </div>
            {
              isRTL ? (
                <div>
                  <Label htmlFor="citizenship_arb" className="text-sm font-medium">
                    {t('masterData.nationalities.nationalityNameArabic')}
                  </Label>
                  <Input
                    id="citizenship_arb"
                    value={formData.citizenship_arb}
                    onChange={(e) => handleInputChange('citizenship_arb', e.target.value)}
                    placeholder={t('masterData.nationalities.enterNationalityNameArabic')}
                    className="mt-1"
                  />
                </div>
              ) : (
                <div>
                  <Label htmlFor="citizenship_eng" className="text-sm font-medium">
                    {t('masterData.nationalities.nationalityName')} *
                  </Label>
                  <Input
                    id="citizenship_eng"
                    value={formData.citizenship_eng}
                    onChange={(e) => handleInputChange('citizenship_eng', e.target.value)}
                    placeholder={t('masterData.nationalities.enterNationalityName')}
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
