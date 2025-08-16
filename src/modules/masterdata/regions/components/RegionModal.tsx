"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useTranslations } from '@/hooks/use-translations';
import { useLanguage } from '@/providers/language-provider';
import { IRegion } from '../types';

interface RegionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: IRegion) => void;
  region?: IRegion | null;
  mode: 'add' | 'edit';
}

export const RegionModal: React.FC<RegionModalProps> = ({
  isOpen,
  onClose,
  onSave,
  region,
  mode,
}) => {
  const { t } = useTranslations();
  const { isRTL } = useLanguage();
  type RegionFormFields = {
    location_eng: string;
    location_code: string;
    location_arb: string;
  };

  const initialForm: RegionFormFields = {
    location_eng: '',
    location_code: '',
    location_arb: '',
  };
  const [formData, setFormData] = useState<RegionFormFields>(initialForm);

  useEffect(() => {
    if (region && mode === 'edit') {
      setFormData({
        location_eng: region.location_eng || '',
        location_code: region.location_code || '',
        location_arb: region.location_arb || '',
      });
    } else {
      setFormData(initialForm);
    }
  }, [region, mode, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData as any);
  };

  const handleInputChange = (field: keyof RegionFormFields, value: string | number) => {
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
                ? t('masterData.regions.addRegion')
                : t('masterData.regions.editRegion')
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
                {t('masterData.regions.regionCode')} *
              </Label>
              <Input
                id="location_code"
                value={formData.location_code}
                onChange={(e) => handleInputChange('location_code', e.target.value.toUpperCase())}
                placeholder={t('masterData.regions.enterRegionCode')}
                required
                className="mt-1"
              />
            </div>
            {
              isRTL ? (
                <div>
                  <Label htmlFor="location_arb" className="text-sm font-medium">
                    {t('masterData.regions.regionNameArabic')}
                  </Label>
                  <Input
                    id="location_arb"
                    value={formData.location_arb}
                    onChange={(e) => handleInputChange('location_arb', e.target.value)}
                    placeholder={t('masterData.regions.enterRegionNameArabic')}
                    className="mt-1"
                  />
                </div>
              ) : (
                <div>
                  <Label htmlFor="location_eng" className="text-sm font-medium">
                    {t('masterData.regions.regionName')} *
                  </Label>
                  <Input
                    id="location_eng"
                    value={formData.location_eng}
                    onChange={(e) => handleInputChange('location_eng', e.target.value)}
                    placeholder={t('masterData.regions.enterRegionName')}
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