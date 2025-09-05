"use client";

import React from "react";
import { useTranslations } from "@/hooks/use-translations";
import { GenericTable, TableColumn } from "@/components/common/GenericTable";
import { ISite } from "../types";

interface SitesTableProps {
  sites: ISite[];
  selected: number[];
  page: number;
  pageSize: number;
  allChecked: boolean;
  onSelectSite: (id: number) => void;
  onSelectAll: () => void;
  onEditSite: (site: ISite) => void;
  onDeleteSite: (id: number) => void;
  isLoading?: boolean;
}

export const SitesTable: React.FC<SitesTableProps> = ({
  sites,
  selected,
  page,
  pageSize,
  allChecked,
  onSelectSite,
  onSelectAll,
  onEditSite,
  onDeleteSite,
  isLoading = false,
}) => {
  const { t } = useTranslations();

  const columns: TableColumn<ISite>[] = [
    {
      key: "code",
      header: t("masterData.site.siteCode"),
      accessor: (item) => item.location_code || "",
    },
    {
      key: "name",
      header: t("masterData.site.siteName"),
      accessor: (item, isRTL) =>
        isRTL ? item.location_arb || "" : item.location_eng || "",
    },
    {
      key: "city",
      header: t("masterData.site.city") || "City",
      accessor: (item) => item.city || "",
    },
    {
      key: "country_code",
      header: t("masterData.site.countryCode") || "Country",
      accessor: (item) => item.country_code || "",
    },
    {
      key: "geolocation",
      header: t("masterData.site.geolocation") || "Geolocation",
      accessor: (item) => {
        if (item.geolocation === null || item.geolocation === undefined)
          return "";
        if (typeof item.geolocation === "string") return item.geolocation;
        try {
          return JSON.stringify(item.geolocation);
        } catch (e) {
          return String(item.geolocation);
        }
      },
    },
    {
      key: "radius",
      header: t("masterData.site.radius") || "Radius",
      accessor: (item) =>
        item.radius === null || item.radius === undefined
          ? ""
          : String(item.radius),
    },
  ];

  return (
    <GenericTable
      data={sites}
      columns={columns}
      selected={selected}
      page={page}
      pageSize={pageSize}
      allChecked={allChecked}
      getItemId={(item) => item.location_id}
      getItemDisplayName={(item, isRTL) =>
        isRTL ? item.location_arb || "" : item.location_eng || ""
      }
      onSelectItem={onSelectSite}
      onSelectAll={onSelectAll}
      onEditItem={onEditSite}
      onDeleteItem={onDeleteSite}
      onPageChange={(newPage) => {
        if (newPage > 0 && newPage <= Math.ceil(sites.length / pageSize)) {
        }
      }}
      onPageSizeChange={(newPageSize) => {
        if (newPageSize > 0) {
        }
      }}
      noDataMessage={t("masterData.site.noSitesFound")}
      isLoading={isLoading}
    />
  );
};
