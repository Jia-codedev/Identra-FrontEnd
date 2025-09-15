"use client";

import React, { useState, useEffect } from "react";
import { useTranslations } from "@/hooks/use-translations";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/Input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import useAccessZoneMutations from "../hooks/useAccessZoneMutations";
import { AccessZone } from "@/services/device-and-infra/accessZonesApi";

interface AccessZoneFormProps {
  zone?: AccessZone | null;
  onClose: (refresh?: boolean) => void;
}

export default function AccessZoneForm({ zone, onClose }: AccessZoneFormProps) {
  const { t } = useTranslations();
  const mutations = useAccessZoneMutations();

  const [formData, setFormData] = useState({
    zone_name: "",
    zone_description: "",
    zone_status: true,
    zone_type: "both",
    building_id: undefined as number | undefined,
    floor_level: undefined as number | undefined,
    capacity_limit: undefined as number | undefined,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (zone) {
      setFormData({
        zone_name: zone.zone_name || "",
        zone_description: zone.zone_description || "",
        zone_status: zone.zone_status ?? true,
        zone_type: zone.zone_type || "both",
        building_id: zone.building_id,
        floor_level: zone.floor_level,
        capacity_limit: zone.capacity_limit,
      });
    }
  }, [zone]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.zone_name.trim()) {
      newErrors.zone_name = t("accessZones.enterZoneName");
    }
    if (!formData.zone_type) {
      newErrors.zone_type = t("accessZones.selectZoneType");
    }
    if (formData.capacity_limit !== undefined && formData.capacity_limit < 0) {
      newErrors.capacity_limit = t("accessZones.invalidCapacity");
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      if (zone) {
        await mutations.updateAccessZone.mutateAsync({
          id: zone.zone_id,
          data: formData,
        });
      } else {
        await mutations.createAccessZone.mutateAsync(formData);
      }
      onClose(true);
    } catch (error) {
      console.error("Form submission error:", error);
    }
  };

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  return (
    <DialogContent className="sm:max-w-md">
      <DialogHeader>
        <DialogTitle>
          {zone ? t("accessZones.editZone") : t("accessZones.addZone")}
        </DialogTitle>
      </DialogHeader>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="zone_name" className="text-sm font-medium">
            {t("accessZones.zoneName")} <span className="text-destructive">*</span>
          </label>
          <Input
            id="zone_name"
            value={formData.zone_name}
            onChange={(e) => handleChange("zone_name", e.target.value)}
            placeholder={t("accessZones.enterZoneName")}
            className={errors.zone_name ? "border-destructive" : ""}
          />
          {errors.zone_name && (
            <p className="text-sm text-destructive">{errors.zone_name}</p>
          )}
        </div>

        <div className="space-y-2">
          <label htmlFor="zone_description" className="text-sm font-medium">
            {t("accessZones.description")}
          </label>
          <Input
            id="zone_description"
            value={formData.zone_description}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange("zone_description", e.target.value)}
            placeholder={t("accessZones.enterDescription")}
          />
          {errors.zone_description && (
            <span className="text-red-500 text-sm">{errors.zone_description}</span>
          )}
        </div>

        <div className="space-y-2">
          <label htmlFor="zone_type" className="text-sm font-medium">
            {t("accessZones.type")} <span className="text-destructive">*</span>
          </label>
          <Select
            value={formData.zone_type}
            onValueChange={(value) => handleChange("zone_type", value)}
          >
            <SelectTrigger className={errors.zone_type ? "border-destructive" : ""}>
              <SelectValue placeholder={t("accessZones.selectZoneType")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="entry">{t("accessZones.types.entry")}</SelectItem>
              <SelectItem value="exit">{t("accessZones.types.exit")}</SelectItem>
              <SelectItem value="both">{t("accessZones.types.both")}</SelectItem>
            </SelectContent>
          </Select>
          {errors.zone_type && (
            <p className="text-sm text-destructive">{errors.zone_type}</p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label htmlFor="floor_level" className="text-sm font-medium">
              {t("accessZones.floor")}
            </label>
            <Input
              id="floor_level"
              type="number"
              value={formData.floor_level || ""}
              onChange={(e) => handleChange("floor_level", e.target.value ? parseInt(e.target.value) : undefined)}
              placeholder={t("accessZones.enterFloor")}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="capacity_limit" className="text-sm font-medium">
              {t("accessZones.capacity")}
            </label>
            <Input
              id="capacity_limit"
              type="number"
              value={formData.capacity_limit || ""}
              onChange={(e) => handleChange("capacity_limit", e.target.value ? parseInt(e.target.value) : undefined)}
              placeholder={t("accessZones.enterCapacity")}
              className={errors.capacity_limit ? "border-destructive" : ""}
            />
            {errors.capacity_limit && (
              <p className="text-sm text-destructive">{errors.capacity_limit}</p>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="zone_status" className="text-sm font-medium">
            {t("common.status")}
          </label>
          <Select
            value={formData.zone_status.toString()}
            onValueChange={(value) => handleChange("zone_status", value === "true")}
          >
            <SelectTrigger>
              <SelectValue placeholder={t("common.selectStatus")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="true">{t("common.active")}</SelectItem>
              <SelectItem value="false">{t("common.inactive")}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <DialogFooter className="gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => onClose(false)}
            disabled={mutations.createAccessZone.isPending || mutations.updateAccessZone.isPending}
          >
            {t("common.cancel")}
          </Button>
          <Button
            type="submit"
            disabled={mutations.createAccessZone.isPending || mutations.updateAccessZone.isPending}
          >
            {mutations.createAccessZone.isPending || mutations.updateAccessZone.isPending
              ? t("common.saving")
              : zone
              ? t("common.update")
              : t("common.create")
            }
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
}