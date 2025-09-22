"use client";

import React from "react";
import { useTranslations } from "@/hooks/use-translations";
import { useLanguage } from "@/providers/language-provider";
import { GenericTable, TableColumn } from "@/components/common/GenericTable";
import { Badge } from "@/components/ui/badge";

interface BiometricTerminal {
  id: number;
  device_id: number;
  device_no: string;
  device_name: string;
  device_status: boolean;
  status_text: string;
  created_date: string;
  last_updated_date: string;
  raw: any;
}

interface BiometricTerminalsListProps {
  biometricTerminals: BiometricTerminal[];
  selected: number[];
  allChecked: boolean;
  isLoading: boolean;
  onSelectItem: (id: number) => void;
  onSelectAll: () => void;
  onEditItem: (terminal: BiometricTerminal) => void;
  onDeleteItem: (id: number) => void;
}

export default function BiometricTerminalsList({
  biometricTerminals,
  selected,
  allChecked,
  isLoading,
  onSelectItem,
  onSelectAll,
  onEditItem,
  onDeleteItem,
}: BiometricTerminalsListProps) {
  const { t } = useTranslations();
  const { isRTL } = useLanguage();

  const formatDate = (dateString: string) => {
    if (!dateString) return "-";
    try {
      return new Date(dateString).toLocaleDateString();
    } catch {
      return "-";
    }
  };

  const columns: TableColumn<BiometricTerminal>[] = [
    {
      key: "device_no",
      header: t("biometricTerminals.terminalNumber"),
      accessor: (item) => item.device_no || "-",
      width: "15%",
    },
    {
      key: "device_name",
      header: t("biometricTerminals.terminalName"),
      accessor: (item) => item.device_name || "-",
      width: "25%",
    },
    {
      key: "device_status",
      header: t("biometricTerminals.status"),
      accessor: (item) => (
        <Badge variant={item.device_status ? "default" : "secondary"}>
          {item.device_status ? t("common.active") : t("common.inactive")}
        </Badge>
      ),
      width: "15%",
    },
  ];

  return (
    <div>
      <GenericTable
        data={biometricTerminals}
        columns={columns}
        selected={selected}
        page={1}
        pageSize={10}
        allChecked={allChecked}
        getItemId={(item: BiometricTerminal) => item.id}
        getItemDisplayName={(item: BiometricTerminal) =>
          `${item.device_name} (${item.device_no})`
        }
        onSelectItem={onSelectItem}
        onSelectAll={onSelectAll}
        onEditItem={onEditItem}
        onDeleteItem={onDeleteItem}
        noDataMessage={t("biometricTerminals.noTerminalsFound")}
        isLoading={isLoading}
        onPageChange={() => {}}
        onPageSizeChange={() => {}}
        showActions={true}
      />
    </div>
  );
}
