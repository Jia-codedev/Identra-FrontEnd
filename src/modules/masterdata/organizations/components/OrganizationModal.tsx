"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useTranslations } from '@/hooks/use-translations';
import { useLanguage } from '@/providers/language-provider';
import { IOrganization } from '../types';
import organizationTypesApi from '@/services/masterdata/organizationTypes';
import regionsApi from '@/services/masterdata/regions';
import organizationsApi from '@/services/masterdata/organizations';

interface OrganizationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Partial<IOrganization>) => Promise<void>;
  organization?: IOrganization | null;
  mode: 'add' | 'edit';
  isLoading?: boolean;
}

export const OrganizationModal: React.FC<OrganizationModalProps> = ({
  isOpen,
  onClose,
  onSave,
  organization,
  mode,
  isLoading = false,
}) => {
  const { t } = useTranslations();
  const { isRTL } = useLanguage();

  type OrganizationFormFields = {
    organization_eng: string | undefined;
    organization_arb: string | undefined;
    organization_code: string;
    organization_type_id: number;
    parent_id?: number;
    location_id?: number;
  };

  const initialForm: OrganizationFormFields = {
    organization_eng: '',
    organization_arb: '',
    organization_code: '',
    organization_type_id: 0,
  };

  const [formData, setFormData] = useState<OrganizationFormFields>(initialForm);
  const [organizationTypes, setOrganizationTypes] = useState<{ label: string; value: number }[]>([]);
  const [locations, setLocations] = useState<{ label: string; value: number }[]>([]);
  const [parentOrganizations, setParentOrganizations] = useState<{ label: string; value: number }[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof OrganizationFormFields, string>>>({});
  const [dropdownsLoaded, setDropdownsLoaded] = useState(false);

  // Set form data when organization changes or dropdowns are loaded
  useEffect(() => {
    if (organization && mode === 'edit' && (dropdownsLoaded || !isOpen)) {
      setFormData({
        organization_eng: organization.organization_eng || '',
        organization_arb: organization.organization_arb || '',
        organization_code: organization.organization_code || '',
        organization_type_id: organization.organization_type_id || 0,
        parent_id: organization.parent_id,
        location_id: organization.location_id,
      });
    } else if (mode === 'add') {
      setFormData(initialForm);
    }
    setErrors({});
  }, [organization, mode, isOpen, dropdownsLoaded]);

  useEffect(() => {
    const fetchDropdownData = async () => {
      if (!isOpen) return;

      setIsLoadingData(true);
      setDropdownsLoaded(false);
      try {
        const [orgTypesRes, locationsRes, parentsRes] = await Promise.all([
          organizationTypesApi.getOrganizationTypesWithoutPagination(),
          regionsApi.getRegionsWithoutPagination(),
          organizationsApi.getOrganizationsWithoutPagination(),
        ]);

        if (orgTypesRes.data?.success) {
          setOrganizationTypes(
            orgTypesRes.data.data.map((ot: any) => ({
              label: isRTL ? ot.organization_type_arb || ot.organization_type_eng : ot.organization_type_eng,
              value: ot.organization_type_id,
            }))
          );
        }

        if (locationsRes?.success) {
          setLocations(
            locationsRes.data.map((loc: any) => ({
              label: isRTL ? loc.location_arb || loc.location_eng : loc.location_eng,
              value: loc.location_id,
            }))
          );
        }

        if (parentsRes.data?.success) {
          setParentOrganizations(
            parentsRes.data.data
              .filter((org: any) => mode === 'edit' ? org.organization_id !== organization?.organization_id : true)
              .map((org: any) => ({
                label: isRTL ? org.organization_arb || org.organization_eng : org.organization_eng,
                value: org.organization_id,
              }))
          );
        }

        setDropdownsLoaded(true);
      } catch (error) {
        console.error("Failed to fetch dropdown data", error);
      } finally {
        setIsLoadingData(false);
      }
    };

    fetchDropdownData();
  }, [isOpen, isRTL, mode, organization]);

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof OrganizationFormFields, string>> = {};

    if (!formData.organization_code.trim()) {
      newErrors.organization_code = t('validation.required');
    }
    if (!formData.organization_eng?.trim()) {
      newErrors.organization_eng = t('validation.required');
    }
    if (!formData.organization_type_id || formData.organization_type_id === 0) {
      newErrors.organization_type_id = t('validation.required');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const submitData = { ...formData };
      if (!submitData.parent_id) delete submitData.parent_id;
      if (!submitData.location_id) delete submitData.location_id;

      await onSave(submitData);
      onClose();
    } catch (error) {
      console.error('Failed to save organization:', error);
    }
  };

  const handleInputChange = (field: keyof OrganizationFormFields, value: string | number | undefined) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
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
          <div className="flex items-center justify-between mb-2 px-2">
            <h2 className="text-xl font-semibold text-foreground">
              {mode === 'add'
                ? t('masterData.organizations.addOrganization')
                : t('masterData.organizations.editOrganization')
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

          <form onSubmit={handleSubmit} className="space-y-4 bg-black/5 p-2 rounded-lg dark:bg-white/5">
            <div>
              <Label htmlFor="organization_code" className="text-sm font-medium">
                {t('masterData.organizations.organizationCode')} *
              </Label>
              <Input
                id="organization_code"
                value={formData.organization_code}
                onChange={(e) => handleInputChange('organization_code', e.target.value.toUpperCase())}
                placeholder={t('masterData.organizations.enterOrganizationCode')}
                className={`mt-1 ${errors.organization_code ? 'border-red-500' : ''}`}
                disabled={isLoading}
              />
              {errors.organization_code && (
                <p className="text-red-500 text-xs mt-1">{errors.organization_code}</p>
              )}
            </div>
            {
              isRTL ? (
                <div>
                  <Label htmlFor="organization_arb" className="text-sm font-medium">
                    {t('masterData.organizations.organizationNameArabic')}
                  </Label>
                  <Input
                    id="organization_arb"
                    value={formData.organization_arb}
                    onChange={(e) => handleInputChange('organization_arb', e.target.value)}
                    placeholder={t('masterData.organizations.enterOrganizationNameArabic')}
                  />
                  {errors[isRTL ? 'organization_arb' : 'organization_eng'] && (
                    <p className="text-red-500 text-xs mt-1">{errors[isRTL ? 'organization_arb' : 'organization_eng']}</p>
                  )}
                </div>
              ) : (
                <div>
                  <Label htmlFor={"organization_eng"} className="text-sm font-medium">
                    {t('masterData.organizations.organizationNameEnglish')}
                  </Label>
                  <Input
                    id={"organization_eng"}
                    value={formData.organization_eng}
                    onChange={(e) => handleInputChange('organization_eng', e.target.value)}
                    placeholder={t('masterData.organizations.enterOrganizationNameEnglish')}
                  />
                  {errors['organization_eng'] && (
                    <p className="text-red-500 text-xs mt-1">{errors['organization_eng']}</p>
                  )}
                </div>
              )
            }
            <div>
              <Label htmlFor="organization_type_id" className="text-sm font-medium">
                {t('masterData.organizations.organizationType')} *
              </Label>
              <Select
                value={formData.organization_type_id ? formData.organization_type_id.toString() : ""}
                onValueChange={(value) => handleInputChange('organization_type_id', parseInt(value))}
                disabled={isLoading || isLoadingData}
              >
                <SelectTrigger className={`w-full mt-1 ${errors.organization_type_id ? 'border-red-500' : ''}`}>
                  <SelectValue placeholder={isLoadingData ? t('common.loading') : t('masterData.organizations.selectOrganizationType')} />
                </SelectTrigger>
                <SelectContent>
                  {organizationTypes.map(option => (
                    <SelectItem key={option.value} value={option.value.toString()}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.organization_type_id && (
                <p className="text-red-500 text-xs mt-1">{errors.organization_type_id}</p>
              )}
            </div>
            <div>
              <Label htmlFor="parent_id" className="text-sm font-medium">
                {t('masterData.organizations.parentOrganization')}
              </Label>
              <Select
                value={formData.parent_id ? formData.parent_id.toString() : "0"}
                onValueChange={(value) => handleInputChange('parent_id', value === "0" ? undefined : parseInt(value))}
                disabled={isLoading || isLoadingData}
              >
                <SelectTrigger className="w-full mt-1">
                  <SelectValue placeholder={isLoadingData ? t('common.loading') : t('masterData.organizations.selectParentOrganization')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">
                    {t('masterData.organizations.root')}
                  </SelectItem>
                  {parentOrganizations.map(option => (
                    <SelectItem key={option.value} value={option.value.toString()}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="location_id" className="text-sm font-medium">
                {t('masterData.organizations.location')}
              </Label>
              <Select
                value={formData.location_id ? formData.location_id.toString() : ""}
                onValueChange={(value) => handleInputChange('location_id', value ? parseInt(value) : undefined)}
                disabled={isLoading || isLoadingData}
              >
                <SelectTrigger className="w-full mt-1">
                  <SelectValue placeholder={isLoadingData ? t('common.loading') : t('masterData.organizations.selectLocation')} />
                </SelectTrigger>
                <SelectContent>
                  {locations.map(option => (
                    <SelectItem key={option.value} value={option.value.toString()}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className={`flex gap-3 pt-4 ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="flex-1"
                disabled={isLoading}
              >
                {t('common.cancel')}
              </Button>
              <Button
                type="submit"
                className="flex-1"
                disabled={isLoading || isLoadingData}
              >
                {isLoading ? t('common.saving') : t('common.save')}
              </Button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
