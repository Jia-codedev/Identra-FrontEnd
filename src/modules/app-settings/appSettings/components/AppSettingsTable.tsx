"use client";

import React from "react";
import { useTranslations } from "@/hooks/use-translations";
import { GenericTable, TableColumn } from "@/components/common/GenericTable";
import { IAppSetting } from "../types";

interface AppSettingsTableProps {
  appSettings: IAppSetting[];
  selected: string[];
  page: number;
  pageSize: number;
  allChecked: boolean;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  onSelectAppSetting: (id: string | number) => void;
  onSelectAll: () => void;
  onEditAppSetting: (appSetting: IAppSetting) => void;
  onDeleteAppSetting: (id: string | number) => void;
  isLoading?: boolean;
}

export const AppSettingsTable: React.FC<AppSettingsTableProps> = ({
  appSettings,
  selected,
  page,
  pageSize,
  allChecked,
  onSelectAppSetting,
  onSelectAll,
  onEditAppSetting,
  onDeleteAppSetting,
  isLoading,
  onPageChange,
  onPageSizeChange,
}) => {
  const { t } = useTranslations();

  const columns: TableColumn<IAppSetting>[] = [
    {
      key: "version_name",
      header: t("appSettings.versionName") || "Version Name",
      accessor: (item) => item.version_name,
    },
    {
      key: "value",
      header: t("appSettings.value") || "Value",
      accessor: (item) => item.value || "-",
    },
    {
      key: "descr",
      header: t("appSettings.description") || "Description",
      accessor: (item) => item.descr || "-",
    },
  ];

  return (
    <GenericTable<IAppSetting>
      data={appSettings}
      columns={columns}
      selected={selected}
      page={page}
      pageSize={pageSize}
      allChecked={allChecked}
      getItemId={(item) => item.version_name}
      getItemDisplayName={(item) => item.version_name}
      onSelectItem={onSelectAppSetting}
      onSelectAll={onSelectAll}
      onEditItem={onEditAppSetting}
      onDeleteItem={onDeleteAppSetting}
      onPageChange={onPageChange}
      onPageSizeChange={onPageSizeChange}
      noDataMessage={
        t("appSettings.noAppSettingsFound") || "No app settings found"
      }
      isLoading={isLoading}
      showActions={true}
    />
  );
};
