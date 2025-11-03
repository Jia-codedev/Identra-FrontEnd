"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from "@/components/ui/Input";;
import { Label } from '@/components/ui/label';
import { useTranslations } from '@/hooks/use-translations';
import { useLanguage } from '@/providers/language-provider';
import { IGrade } from '../types';

interface GradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: IGrade) => void;
  grade?: IGrade | null;
  mode: 'add' | 'edit';
}

export const GradeModal: React.FC<GradeModalProps> = ({
  isOpen,
  onClose,
  onSave,
  grade,
  mode,
}) => {
  const { t } = useTranslations();
  const { isRTL } = useLanguage();
  type GradeFormFields = {
    grade_eng: string;
    grade_code: string;
    grade_arb: string;
  };

  const initialForm: GradeFormFields = {
    grade_eng: '',
    grade_code: '',
    grade_arb: '',
  };
  const [formData, setFormData] = useState<GradeFormFields>(initialForm);

  useEffect(() => {
    if (grade && mode === 'edit') {
      setFormData({
        grade_eng: grade.grade_eng || '',
        grade_code: grade.grade_code || '',
        grade_arb: grade.grade_arb || '',
      });
    } else {
      setFormData(initialForm);
    }
  }, [grade, mode, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData as any);
  };

  const handleInputChange = (field: keyof GradeFormFields, value: string | number) => {
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
                ? t('masterData.grade.addGrade')
                : t('masterData.grade.editGrade')
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
              <Label htmlFor="location_code" className="text-sm font-medium">
                {t('masterData.grade.gradeCode')} *
              </Label>
              <Input
                id="grade_code"
                value={formData.grade_code}
                onChange={(e) => handleInputChange('grade_code', e.target.value.toUpperCase())}
                placeholder={t('masterData.grade.enterGradeCode')}
                required
                className="mt-1"
              />
            </div>
            {
              isRTL ? (
                <div>
                  <Label htmlFor="location_arb" className="text-sm font-medium">
                    {t('masterData.grade.enterGradeName')}
                  </Label>
                  <Input
                    id="grade_arb"
                    value={formData.grade_arb}
                    onChange={(e) => handleInputChange('grade_arb', e.target.value)}
                    placeholder={t('masterData.grade.enterGradeNameArabic')}
                    className="mt-1"
                  />
                </div>
              ) : (
                <div>
                  <Label htmlFor="location_eng" className="text-sm font-medium">
                    {t('masterData.grade.enterGradeName')} *
                  </Label>
                  <Input
                    id="grade_eng"
                    value={formData.grade_eng}
                    onChange={(e) => handleInputChange('grade_eng', e.target.value)}
                    placeholder={t('masterData.grade.enterGradeName')}
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