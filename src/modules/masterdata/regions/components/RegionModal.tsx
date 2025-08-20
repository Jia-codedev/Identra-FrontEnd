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
import countriesApi, { ICountry } from '@/services/masterdata/countries';
import { Combobox } from '@/components/ui/combobox';

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
    city?: string;
    region_name?: string;
    country_code?: string;
    geolocation?: string;
    // keep radius as string in the input to avoid number spinners
    radius?: string;
  };

  const initialForm: RegionFormFields = {
    location_eng: '',
    location_code: '',
    location_arb: '',
  city: '',
  region_name: '',
  country_code: '',
  geolocation: '',
  radius: '',
  };
  const [formData, setFormData] = useState<RegionFormFields>(initialForm);
  const [countries, setCountries] = useState<ICountry[]>([]);
  const [loadingCountries, setLoadingCountries] = useState(false);

  useEffect(() => {
    if (region && mode === 'edit') {
      setFormData({
        location_eng: region.location_eng || '',
        location_code: region.location_code || '',
        location_arb: region.location_arb || '',
  city: region.city || '',
  region_name: region.region_name || '',
  country_code: region.country_code || '',
  geolocation: typeof region.geolocation === 'string' ? region.geolocation : (region.geolocation ? JSON.stringify(region.geolocation) : ''),
  radius: region.radius !== undefined && region.radius !== null ? String(region.radius) : '',
      });
    } else {
      setFormData(initialForm);
    }
  }, [region, mode, isOpen]);

  useEffect(() => {
    let mounted = true;
    setLoadingCountries(true);
    countriesApi
      .getCountriesWithoutPagination()
      .then((res) => {
        if (!mounted) return;
        // API might wrap data in response.data
        const data = res?.data?.data || res?.data || [];
        setCountries(Array.isArray(data) ? data : []);
      })
      .catch(() => setCountries([]))
      .finally(() => mounted && setLoadingCountries(false));

    return () => {
      mounted = false;
    };
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload: IRegion = {
      // include id when editing so callers can use it if needed
      ...(region && region.location_id ? { location_id: region.location_id } : {}),
      location_code: String(formData.location_code || ''),
      location_eng: formData.location_eng || undefined,
      location_arb: formData.location_arb || undefined,
      city: formData.city || undefined,
      region_name: formData.region_name || undefined,
      country_code: formData.country_code || undefined,
      geolocation: formData.geolocation || undefined,
      // convert radius string to number if it's numeric, otherwise null
      radius:
        formData.radius === undefined || formData.radius === ''
          ? null
          : Number.isNaN(Number(formData.radius))
          ? null
          : Number(formData.radius),
    } as IRegion;

    onSave(payload);
  };

  const handleInputChange = (field: keyof RegionFormFields, value: string | number) => {
    // keep radius as string to avoid number input spinner
    if (field === 'radius') {
      setFormData(prev => ({ ...prev, [field]: String(value) }));
      return;
    }

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
          className="bg-background rounded-lg shadow-lg w-full max-w-2xl p-4"
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

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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

              <div>
                {isRTL ? (
                  <>
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
                  </>
                ) : (
                  <>
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
                  </>
                )}
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <Label htmlFor="city" className="text-sm font-medium">{t('masterData.regions.city') || 'City'}</Label>
                <Input
                  id="city"
                  value={formData.city}
                  onChange={(e) => handleInputChange('city', e.target.value)}
                  placeholder={t('masterData.regions.enterCity') || ''}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="region_name" className="text-sm font-medium">{t('masterData.regions.region') || 'Region'}</Label>
                <Input
                  id="region_name"
                  value={formData.region_name}
                  onChange={(e) => handleInputChange('region_name', e.target.value)}
                  placeholder={t('masterData.regions.enterRegion') || ''}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="country_code" className="text-sm font-medium">{t('masterData.regions.countryCode') || 'Country Code'}</Label>
                <div className="mt-1">
                  <Combobox
                    options={countries.map((c) => ({
                      label: `${c.country_code} - ${c.country_eng || c.country_arb || c.country_code}`,
                      value: c.country_code,
                    }))}
                    value={formData.country_code || null}
                    onValueChange={(val) => handleInputChange('country_code', val ?? '')}
                    placeholder={t('masterData.regions.selectCountry') || 'Select country'}
                    isLoading={loadingCountries}
                    emptyMessage={t('masterData.regions.noCountriesFound') || 'No countries found'}
                    disableLocalFiltering={false}
                  />
                </div>
              </div>
              <div className="sm:col-span-2">
                <Label htmlFor="geolocation" className="text-sm font-medium">{t('masterData.regions.geolocation') || 'Geolocation'}</Label>
                <Input
                  id="geolocation"
                  value={formData.geolocation}
                  onChange={(e) => handleInputChange('geolocation', e.target.value)}
                  placeholder={t('masterData.regions.enterGeolocation') || "lng lat or lng, lat"}
                  className="mt-1"
                />
              </div>
              <div className="sm:col-span-2">
                <Label htmlFor="radius" className="text-sm font-medium">{t('masterData.regions.radius') || 'Radius'}</Label>
                <Input
                  id="radius"
                  type="text"
                  value={formData.radius ?? ''}
                  onChange={(e) => handleInputChange('radius', e.target.value)}
                  placeholder={t('masterData.regions.enterRadius') || ''}
                  className="mt-1"
                />
              </div>
            </div>
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