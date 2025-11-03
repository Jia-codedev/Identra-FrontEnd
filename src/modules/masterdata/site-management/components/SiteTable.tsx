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
  canEdit: boolean;
  canDelete: boolean;
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
  canEdit,
  canDelete,
}) => {
  const { t } = useTranslations();

  const columns: TableColumn<ISite>[] = [
    {
      key: "code",
      header: t("masterData.sites.siteCode"),
      accessor: (item) => item.location_code || "",
    },
    {
      key: "name",
      header: t("masterData.sites.siteName"),
      accessor: (item, isRTL) =>
        isRTL ? item.location_arb || "" : item.location_eng || "",
    },
    {
      key: "geolocation",
      header: t("masterData.sites.geolocation") || "Geolocation",
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
      header: t("masterData.sites.radius") || "Radius",
      accessor: (item) =>
        item.radius === null || item.radius === undefined
          ? ""
          : String(item.radius),
    },
  ];

  return (
    <GenericTable
      canDelete={canDelete}
      canEdit={canEdit}
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
      onSelectItem={(id) => onSelectSite(Number(id))}
      onSelectAll={onSelectAll}
      onEditItem={onEditSite}
      onDeleteItem={(id) => onDeleteSite(Number(id))}
      onPageChange={(newPage) => {
        if (newPage > 0 && newPage <= Math.ceil(sites.length / pageSize)) {
        }
      }}
      onPageSizeChange={(newPageSize) => {
        if (newPageSize > 0) {
        }
      }}
      noDataMessage={t("masterData.sites.noSitesFound")}
      isLoading={isLoading}
    />
  );
};
