"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/label";
import { useTranslations } from "@/hooks/use-translations";
import { useLanguage } from "@/providers/language-provider";
import { ISite } from "../types";
import countriesApi, { ICountry } from "@/services/masterdata/countries";
import { Combobox } from "@/components/ui/combobox";

interface SiteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: ISite) => void;
  site?: ISite | null;
  mode: "add" | "edit";
}

export const SiteModal: React.FC<SiteModalProps> = ({
  isOpen,
  onClose,
  onSave,
  site,
  mode,
}) => {
  const { t } = useTranslations();
  const { isRTL } = useLanguage();
  type SiteFormFields = {
    location_eng: string;
    location_code: string;
    location_arb: string;
    city?: string;
    site_name?: string;
    country_code?: string;
    geolocation?: string;
    radius?: string;
  };

  const initialForm: SiteFormFields = {
    location_eng: "",
    location_code: "",
    location_arb: "",
    city: "",
    site_name: "",
    country_code: "",
    geolocation: "",
    radius: "",
  };
  const [formData, setFormData] = useState<SiteFormFields>(initialForm);
  const [countries, setCountries] = useState<ICountry[]>([]);
  const [loadingCountries, setLoadingCountries] = useState(false);

  useEffect(() => {
    if (site && mode === "edit") {
      setFormData({
        location_eng: site.location_eng || "",
        location_code: site.location_code || "",
        location_arb: site.location_arb || "",
        city: site.city || "",
        site_name: site.site_name || "",
        country_code: site.country_code || "",
        geolocation:
          typeof site.geolocation === "string"
            ? site.geolocation
            : site.geolocation
            ? JSON.stringify(site.geolocation)
            : "",
        radius:
          site.radius !== undefined && site.radius !== null
            ? String(site.radius)
            : "",
      });
    } else {
      setFormData(initialForm);
    }
  }, [site, mode, isOpen]);

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
    const payload: ISite = {
      // include id when editing so callers can use it if needed
      ...(site && site.location_id
        ? { location_id: site.location_id }
        : {}),
      location_code: String(formData.location_code || ""),
      location_eng: formData.location_eng || undefined,
      location_arb: formData.location_arb || undefined,
      city: formData.city || undefined,
      site_name: formData.site_name || undefined,
      country_code: formData.country_code || undefined,
      geolocation: formData.geolocation || undefined,
      // convert radius string to number if it's numeric, otherwise null
      radius:
        formData.radius === undefined || formData.radius === ""
          ? null
          : Number.isNaN(Number(formData.radius))
          ? null
          : Number(formData.radius),
    } as ISite;

    onSave(payload);
  };

  const handleInputChange = (
    field: keyof SiteFormFields,
    value: string | number
  ) => {
    // keep radius as string to avoid number input spinner
    if (field === "radius") {
      setFormData((prev) => ({ ...prev, [field]: String(value) }));
      return;
    }

    setFormData((prev) => ({ ...prev, [field]: value }));
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
              {mode === "add"
                ? t("masterData.sites.addSite")
                : t("masterData.sites.editSite")}
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

          <form
            onSubmit={handleSubmit}
            className="space-y-4 dark:bg-white/5 bg-black/5 rounded-xl p-2"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <Label htmlFor="location_code" className="text-sm font-medium">
                  {t("masterData.sites.siteCode")} *
                </Label>
                <Input
                  id="location_code"
                  value={formData.location_code}
                  onChange={(e) =>
                    handleInputChange(
                      "location_code",
                      e.target.value.toUpperCase()
                    )
                  }
                  placeholder={t("masterData.sites.enterSiteCode")}
                  required
                  className="mt-1"
                />
              </div>

              <div>
                {isRTL ? (
                  <>
                    <Label
                      htmlFor="location_arb"
                      className="text-sm font-medium"
                    >
                      {t("masterData.sites.siteNameArabic")}
                    </Label>
                    <Input
                      id="location_arb"
                      value={formData.location_arb}
                      onChange={(e) =>
                        handleInputChange("location_arb", e.target.value)
                      }
                      placeholder={t("masterData.sites.enterSiteNameArabic")}
                      className="mt-1"
                    />
                  </>
                ) : (
                  <>
                    <Label
                      htmlFor="location_eng"
                      className="text-sm font-medium"
                    >
                      {t("masterData.sites.siteName")} *
                    </Label>
                    <Input
                      id="location_eng"
                      value={formData.location_eng}
                      onChange={(e) =>
                        handleInputChange("location_eng", e.target.value)
                      }
                      placeholder={t("masterData.sites.enterSiteName")}
                      required
                      className="mt-1"
                    />
                  </>
                )}
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <Label htmlFor="city" className="text-sm font-medium">
                  {t("masterData.sites.city") || "City"}
                </Label>
                <Input
                  id="city"
                  value={formData.city}
                  onChange={(e) => handleInputChange("city", e.target.value)}
                  placeholder={t("masterData.sites.enterCity") || ""}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="site_name" className="text-sm font-medium">
                  {t("masterData.sites.site") || "Site"}
                </Label>
                <Input
                  id="site_name"
                  value={formData.site_name}
                  onChange={(e) =>
                    handleInputChange("site_name", e.target.value)
                  }
                  placeholder={t("masterData.sites.enterSite") || ""}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="country_code" className="text-sm font-medium">
                  {t("masterData.sites.countryCode") || "Country Code"}
                </Label>
                <div className="mt-1">
                  <Combobox
                    options={countries.map((c) => ({
                      label: `${c.country_code} - ${
                        c.country_eng || c.country_arb || c.country_code
                      }`,
                      value: c.country_code,
                    }))}
                    value={formData.country_code || null}
                    onValueChange={(val) =>
                      handleInputChange("country_code", val ?? "")
                    }
                    placeholder={
                      t("masterData.sites.selectCountry") || "Select country"
                    }
                    isLoading={loadingCountries}
                    emptyMessage={
                      t("masterData.sites.noCountriesFound") ||
                      "No countries found"
                    }
                    disableLocalFiltering={false}
                  />
                </div>
              </div>
              <div className="sm:col-span-2">
                <Label htmlFor="geolocation" className="text-sm font-medium">
                  {t("masterData.sites.geolocation") || "Geolocation"}
                </Label>
                <Input
                  id="geolocation"
                  value={formData.geolocation}
                  onChange={(e) =>
                    handleInputChange("geolocation", e.target.value)
                  }
                  placeholder={
                    t("masterData.sites.enterGeolocation") ||
                    "lng lat or lng, lat"
                  }
                  className="mt-1"
                />
              </div>
              <div className="sm:col-span-2">
                <Label htmlFor="radius" className="text-sm font-medium">
                  {t("masterData.sites.radius") || "Radius"}
                </Label>
                <Input
                  id="radius"
                  type="text"
                  value={formData.radius ?? ""}
                  onChange={(e) => handleInputChange("radius", e.target.value)}
                  placeholder={t("masterData.sites.enterRadius") || ""}
                  className="mt-1"
                />
              </div>
            </div>
            <div
              className={`flex gap-3 pt-4 ${
                isRTL ? "flex-row-reverse" : "flex-row"
              }`}
            >
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="flex-1"
              >
                {t("common.cancel")}
              </Button>
              <Button type="submit" className="flex-1">
                {t("common.save")}
              </Button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
