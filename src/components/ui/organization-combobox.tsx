"use client";

import React, { useState, useEffect, useRef } from "react";
import { Combobox, type ComboboxOption } from "@/components/ui/combobox";
import organizationsApi from "@/services/masterdata/organizations";
import { useTranslations } from "@/hooks/use-translations";
import { useLanguage } from "@/providers/language-provider";

interface OrganizationComboboxProps {
  value?: number | null;
  onChange: (val: number | null) => void;
  placeholder?: string;
  className?: string;
  limit?: number;
  emptyMessage?: string;
}

export const OrganizationCombobox: React.FC<OrganizationComboboxProps> = ({
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
  const searchRef = useRef("");
  const { isRTL } = useLanguage();
  const load = React.useCallback(
    async (q: string) => {
      setIsLoading(true);
      try {
        let resp: any;
        resp = await organizationsApi.getOrganizations({
          offset: 1,
          limit,
          ...(q ? { search: q } : {}),
        });

        const status = resp?.status;
        const raw = resp?.data;
        const data = raw?.data ?? raw;

        if (status !== 200 && status !== 201) {
          console.warn(
            "OrganizationCombobox: unexpected response status",
            status,
            raw
          );
          setOptions([]);
          return;
        }

        if (Array.isArray(data)) {
          const opts = data.map((org: any) => ({
            label: !isRTL
              ? `${org.organization_eng || ""} ${
                  org.organization_code ? `(${org.organization_code})` : ""
                }`
              : `${org.organization_arb || ""} ${
                  org.organization_code ? `(${org.organization_code})` : ""
                }`,
            value: String(org.organization_id),
          }));
          setOptions(opts);
        } else {
          if (data && typeof data === "object") {
            const single = data;
            if (single.organization_id) {
              setOptions([
                {
                  label: !isRTL
                    ? `${single.organization_eng || ""} ${
                        single.organization_code
                          ? `(${single.organization_code})`
                          : ""
                      }`
                    : `${single.organization_arb || ""} ${
                        single.organization_code
                          ? `(${single.organization_code})`
                          : ""
                      }`,
                  value: String(single.organization_id),
                },
              ]);
              return;
            }
          }
          setOptions([]);
        }
      } catch (e) {
        console.error("OrganizationCombobox error", e);
        setOptions([]);
      } finally {
        setIsLoading(false);
      }
    },
    [limit, isRTL]
  );

  const debouncedSearch = React.useCallback(
    (q: string) => {
      searchRef.current = q;
      const id = setTimeout(() => {
        if (searchRef.current === q) load(q);
      }, 300);
      return () => clearTimeout(id);
    },
    [load]
  );

  useEffect(() => {
    let mounted = true;
    (async () => {
      if (value && typeof value === "number") {
        try {
          const resp = await organizationsApi.getOrganizationById(
            Number(value)
          );
          const status = resp?.status;
          const raw = resp?.data;
          const org = raw?.data ?? raw;
          if (mounted) {
            if (status === 200 && org) {
              setOptions((prev) => {
                const exists = prev.some(
                  (opt) => opt.value === String(org.organization_id)
                );
                if (exists) return prev;
                return [
                  {
                    label: !isRTL
                      ? `${org.organization_eng || ""} ${
                          org.organization_code
                            ? `(${org.organization_code})`
                            : ""
                        }`
                      : `${org.organization_arb || ""} ${
                          org.organization_code
                            ? `(${org.organization_code})`
                            : ""
                        }`,
                    value: String(org.organization_id),
                  },
                  ...prev,
                ];
              });
            } else {
              console.warn(
                "OrganizationCombobox preload: unexpected response",
                status,
                raw
              );
            }
          }
        } catch (e) {
          console.error("OrganizationCombobox preload error", e);
        }
      } else {
        if (mounted) {
          load("");
        }
      }
    })();
    return () => {
      mounted = false;
    };
  }, [value, load]);

  useEffect(() => {
    load("");
  }, [load]);

  return (
    <Combobox
      options={options}
      value={value != null ? String(value) : null}
      onValueChange={(v) => onChange(v ? Number(v) : null)}
      placeholder={placeholder}
      onSearch={(q) => debouncedSearch(q)}
      isLoading={isLoading}
      disableLocalFiltering={true}
      className={className}
      emptyMessage={emptyMessage ?? t("common.noData")}
    />
  );
};

export default OrganizationCombobox;
