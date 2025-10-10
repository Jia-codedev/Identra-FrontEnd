"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Send, Eye } from "lucide-react";
import { ChronEmailSetting } from "../types";
import { useTranslations } from "@/hooks/use-translations";
import { GenericTable, TableColumn } from "@/components/common/GenericTable";

interface EmailSettingsTableProps {
  emailSettings: ChronEmailSetting[];
  selected: number[];
  page: number;
  pageSize: number;
  allChecked: boolean;
  onSelectAll: () => void;
  onSelectEmailSetting: (id: number) => void;
  onEditEmailSetting: (setting: ChronEmailSetting) => void;
  onDeleteEmailSetting: (id: number) => void;
  onTestEmail: (setting: ChronEmailSetting) => void;
  onViewEmailSetting: (setting: ChronEmailSetting) => void;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  isLoading?: boolean;
}

export const EmailSettingsTable: React.FC<EmailSettingsTableProps> = ({
  emailSettings,
  selected,
  page,
  pageSize,
  allChecked,
  onSelectAll,
  onSelectEmailSetting,
  onEditEmailSetting,
  onDeleteEmailSetting,
  onTestEmail,
  onViewEmailSetting,
  onPageChange,
  onPageSizeChange,
  isLoading = false,
}) => {
  const { t } = useTranslations();

  const columns: TableColumn<ChronEmailSetting>[] = [
    {
      key: "em_smtp_name",
      header: t("appSettings.alertPreferences.smtpName"),
      accessor: (item) => (
        <span className="font-medium">{item.em_smtp_name}</span>
      ),
    },
    {
      key: "em_host_name",
      header: t("appSettings.alertPreferences.hostName"),
      accessor: (item) => item.em_host_name || "-",
    },
    {
      key: "em_port_no",
      header: t("appSettings.alertPreferences.port"),
      accessor: (item) => item.em_port_no || "-",
    },
    {
      key: "em_from_email",
      header: t("appSettings.alertPreferences.fromEmail"),
      accessor: (item) => item.em_from_email || "-",
    },
    {
      key: "em_encryption",
      header: t("appSettings.alertPreferences.encryption"),
      accessor: (item) => 
        item.em_encryption ? (
          <Badge variant="outline">{item.em_encryption}</Badge>
        ) : (
          <span className="text-muted-foreground">-</span>
        ),
    },
    {
      key: "em_active_smtp_flag",
      header: t("common.status"),
      accessor: (item) => (
        <Badge variant={item.em_active_smtp_flag ? "default" : "secondary"}>
          {item.em_active_smtp_flag 
            ? t("appSettings.alertPreferences.active")
            : t("appSettings.alertPreferences.inactive")
          }
        </Badge>
      ),
    },
    {
      key: "extra_actions",
      header: "",
      accessor: (item) => (
        <div className="flex gap-1 justify-center">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onTestEmail(item)}
            title={t("appSettings.alertPreferences.sendTest")}
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      ),
      width: "w-24",
      className: "text-center",
    },
  ];

  const getItemId = (item: ChronEmailSetting) => item.em_id!;
  
  const getItemDisplayName = (item: ChronEmailSetting) => item.em_smtp_name || "";

  

  return (
    <GenericTable
      data={emailSettings}
      columns={columns}
      selected={selected}
      page={page}
      pageSize={pageSize}
      allChecked={allChecked}
      getItemId={getItemId}
      getItemDisplayName={getItemDisplayName}
      onSelectItem={(id) => onSelectEmailSetting(Number(id))}
      onSelectAll={onSelectAll}
      onEditItem={onEditEmailSetting}
      onDeleteItem={(id) => onDeleteEmailSetting(Number(id))}
      noDataMessage={t("appSettings.alertPreferences.noEmailSettingsFound")}
      isLoading={isLoading}
      onPageChange={onPageChange}
      onPageSizeChange={onPageSizeChange}
      
    />
  );
};