"use client";

import React from "react";
import { useTranslations } from "@/hooks/use-translations";
import { useLanguage } from "@/providers/language-provider";
import { GenericTable, TableColumn } from "@/components/common/GenericTable";
import { Badge } from "@/components/ui/badge";

interface AccessZone {
  id: number;
  zone_id: number;
  zone_name: string;
  zone_description: string;
  zone_status: boolean;
  zone_type: string;
  zone_type_text: string;
  building_name: string;
  floor_level: number;
  capacity_limit: number;
  status_text: string;
  created_date: string;
  last_updated_date: string;
  raw: any;
}

interface AccessZonesListProps {
  accessZones: AccessZone[];
  selected: number[];
  allChecked: boolean;
  isLoading: boolean;
  onSelectItem: (id: number) => void;
  onSelectAll: () => void;
  onEditItem: (zone: AccessZone) => void;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;

  onDeleteItem: (id: number) => void;
}

export default function AccessZonesList({
  accessZones,
  selected,
  allChecked,
  isLoading,
  onSelectItem,
  onSelectAll,
  onEditItem,
  onPageChange,
  onPageSizeChange,
  onDeleteItem,
}: AccessZonesListProps) {
  const { t } = useTranslations();
  const { isRTL } = useLanguage();

  const getZoneTypeBadgeVariant = (type: string) => {
    switch (type) {
      case "entry":
        return "default";
      case "exit":
        return "secondary";
      case "both":
        return "outline";
      default:
        return "secondary";
    }
  };

  const columns: TableColumn<AccessZone>[] = [
    {
      key: "zone_name",
      header: t("accessZones.zoneName"),
      accessor: (item) => item.zone_name || "-",
      width: "20%",
    },
    {
      key: "zone_description",
      header: t("accessZones.description"),
      accessor: (item) => item.zone_description || "-",
      width: "25%",
    },
    {
      key: "zone_type",
      header: t("accessZones.type"),
      accessor: (item) => (
        <Badge variant={getZoneTypeBadgeVariant(item.zone_type)}>
          {item.zone_type_text}
        </Badge>
      ),
      width: "15%",
    },
    {
      key: "building_name",
      header: t("accessZones.building"),
      accessor: (item) => item.building_name || "-",
      width: "15%",
    },
    {
      key: "floor_level",
      header: t("accessZones.floor"),
      accessor: (item) =>
        item.floor_level ? `Floor ${item.floor_level}` : "-",
      width: "10%",
    },
    {
      key: "zone_status",
      header: t("accessZones.status"),
      accessor: (item) => (
        <Badge variant={item.zone_status ? "default" : "secondary"}>
          {item.zone_status ? t("common.active") : t("common.inactive")}
        </Badge>
      ),
      width: "15%",
    },
  ];

  return (
    <div>
      <GenericTable
        data={accessZones}
        columns={columns}
        selected={selected}
        page={1}
        pageSize={10}
        allChecked={allChecked}
        getItemId={(item: AccessZone) => item.id}
        getItemDisplayName={(item: AccessZone) =>
          `${item.zone_name} (${item.building_name})`
        }
        onSelectItem={(id) => onSelectItem(Number(id))}
        onSelectAll={onSelectAll}
        onEditItem={onEditItem}
        onDeleteItem={(id) => onDeleteItem(Number(id))}
        noDataMessage={t("accessZones.noZonesFound")}
        isLoading={isLoading}
        onPageChange={onPageChange}
        onPageSizeChange={onPageSizeChange}
        showActions={true}
      />
    </div>
  );
}
