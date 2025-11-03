"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye } from "lucide-react";
import { ChronDbSetting } from "../types";
import { useTranslations } from "@/hooks/use-translations";
import { GenericTable, TableColumn } from "@/components/common/GenericTable";

interface DbSettingsTableProps {
  dbSettings: ChronDbSetting[];
  selected: number[];
  page: number;
  pageSize: number;
  allChecked: boolean;
  onSelectAll: () => void;
  onSelectDbSetting: (id: number) => void;
  onEditDbSetting: (setting: ChronDbSetting) => void;
  onDeleteDbSetting: (id: number) => void;
  onViewDbSetting: (setting: ChronDbSetting) => void;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  isLoading?: boolean;
}

export const DbSettingsTable: React.FC<DbSettingsTableProps> = ({
  dbSettings,
  selected,
  page,
  pageSize,
  allChecked,
  onSelectAll,
  onSelectDbSetting,
  onEditDbSetting,
  onDeleteDbSetting,
  onViewDbSetting,
  onPageChange,
  onPageSizeChange,
  isLoading = false,
}) => {
  const { t } = useTranslations();

  const columns: TableColumn<ChronDbSetting>[] = [
    {
      key: "db_databasetype",
      header: t("appSettings.alertPreferences.databaseType"),
      accessor: (item) => (
        <Badge variant="outline">{item.db_databasetype}</Badge>
      ),
    },
    {
      key: "db_databasename",
      header: t("appSettings.alertPreferences.databaseName"),
      accessor: (item) => (
        <span className="font-medium">{item.db_databasename}</span>
      ),
    },
    {
      key: "db_host_name",
      header: t("appSettings.alertPreferences.hostName"),
      accessor: (item) => item.db_host_name || "-",
    },
    {
      key: "db_port_no",
      header: t("appSettings.alertPreferences.port"),
      accessor: (item) => item.db_port_no || "-",
    },
    {
      key: "db_username",
      header: t("appSettings.alertPreferences.username"),
      accessor: (item) => item.db_username || "N/A",
    },
    {
      key: "connect_db_flag",
      header: t("appSettings.alertPreferences.connectionStatus"),
      accessor: (item) => (
        <Badge variant={item.connect_db_flag ? "default" : "secondary"}>
          {item.connect_db_flag
            ? t("appSettings.alertPreferences.connected")
            : t("appSettings.alertPreferences.disconnected")}
        </Badge>
      ),
    },
  ];

  const getItemId = (item: ChronDbSetting) => item.db_settings_id!;

  const getItemDisplayName = (item: ChronDbSetting) =>
    item.db_databasename || "";

  

  return (
    <GenericTable
      data={dbSettings}
      columns={columns}
      selected={selected}
      page={page}
      pageSize={pageSize}
      allChecked={allChecked}
      getItemId={getItemId}
      getItemDisplayName={getItemDisplayName}
      onSelectItem={(id) => onSelectDbSetting(Number(id))}
      onSelectAll={onSelectAll}
      onEditItem={onEditDbSetting}
      onDeleteItem={(id) => onDeleteDbSetting(Number(id))}
      noDataMessage={t("appSettings.alertPreferences.noDbSettingsFound")}
      isLoading={isLoading}
      onPageChange={onPageChange}
      onPageSizeChange={onPageSizeChange}
      
    />
  );
};
