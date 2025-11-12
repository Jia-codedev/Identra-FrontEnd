"use client";

import React from "react";
import { useTranslations } from "@/hooks/use-translations";
import { useLanguage } from "@/providers/language-provider";
import { GenericTable, TableColumn } from "@/components/common/GenericTable";
import { Badge } from "@/components/ui/badge";

interface Building {
  id: number;
  building_id: number;
  building_name: string;
  building_code: string;
  building_address: string;
  building_description: string;
  building_status: boolean;
  building_type: string;
  building_type_text: string;
  total_floors: number;
  total_area: number;
  contact_person: string;
  contact_phone: string;
  contact_email: string;
  city: string;
  country: string;
  postal_code: string;
  status_text: string;
  created_date: string;
  last_updated_date: string;
  raw: any;
}

interface BuildingsListProps {
  buildings: Building[];
  selected: number[];
  allChecked: boolean;
  isLoading: boolean;
  page: number;
  pageSize: number;
  onSelectItem: (id: string | number) => void;
  onSelectAll: () => void;
  onEditItem: (building: Building) => void;
  onDeleteItem: (id: string | number) => void;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  canEdit: boolean;
  canDelete: boolean;
}

export default function BuildingsList({
  buildings,
  selected,
  allChecked,
  isLoading,
  page,
  pageSize,
  onSelectItem,
  onSelectAll,
  onEditItem,
  onDeleteItem,
  onPageChange,
  onPageSizeChange,
  canEdit,
  canDelete,
}: BuildingsListProps) {
  const { t } = useTranslations();
  const { isRTL } = useLanguage();

  const getBuildingTypeBadgeVariant = (type: string) => {
    switch (type) {
      case "office":
        return "default";
      case "warehouse":
        return "secondary";
      case "factory":
        return "outline";
      case "residential":
        return "default";
      case "mixed":
        return "secondary";
      default:
        return "outline";
    }
  };

  const getStatusBadgeVariant = (status: boolean) => {
    return status ? "default" : "secondary";
  };

  const columns: TableColumn<Building>[] = [
    {
      key: "building_name",
      header: t("buildings.buildingName"),
      accessor: (building: Building) => (
        <div className="flex flex-col">
          <span className="font-medium">{building.building_name}</span>
          <span className="text-sm text-muted-foreground">
            {building.building_code}
          </span>
        </div>
      ),
    },
    {
      key: "building_type",
      header: t("buildings.type"),
      accessor: (building: Building) => (
        <Badge variant={getBuildingTypeBadgeVariant(building.building_type)}>
          {building.building_type_text}
        </Badge>
      ),
    },
    {
      key: "building_address",
      header: t("buildings.address"),
      accessor: (building: Building) => (
        <div className="flex flex-col max-w-xs">
          <span className="truncate">{building.building_address}</span>
          <span className="text-sm text-muted-foreground">
            {building.city}, {building.country}
          </span>
        </div>
      ),
    },
    {
      key: "total_floors",
      header: t("buildings.floors"),
      accessor: (building: Building) => (
        <div className="text-center">
          <span className="font-medium">{building.total_floors}</span>
          <span className="text-sm text-muted-foreground block">
            {t("buildings.floors")}
          </span>
        </div>
      ),
    },
    {
      key: "total_area",
      header: t("buildings.area"),
      accessor: (building: Building) => (
        <div className="text-center">
          <span className="font-medium">
            {building.total_area ? building.total_area.toLocaleString() : "-"}
          </span>
          <span className="text-sm text-muted-foreground block">
            {building.total_area ? "sq ft" : ""}
          </span>
        </div>
      ),
    },
    {
      key: "contact_person",
      header: t("buildings.contact"),
      accessor: (building: Building) => (
        <div className="flex flex-col">
          <span className="font-medium">{building.contact_person || "-"}</span>
          <span className="text-sm text-muted-foreground">
            {building.contact_phone || ""}
          </span>
        </div>
      ),
    },
    {
      key: "building_status",
      header: t("common.status"),
      accessor: (building: Building) => (
        <Badge variant={getStatusBadgeVariant(building.building_status)}>
          {building.status_text}
        </Badge>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <GenericTable<Building>
        canEdit={canEdit}
        canDelete={canDelete}
        data={buildings}
        columns={columns}
        selected={selected}
        page={page}
        pageSize={pageSize}
        allChecked={allChecked}
        isLoading={isLoading}
        onSelectItem={onSelectItem}
        onSelectAll={onSelectAll}
        onEditItem={onEditItem}
        onDeleteItem={onDeleteItem}
        onPageChange={onPageChange}
        onPageSizeChange={onPageSizeChange}
        noDataMessage={t("buildings.noBuildingsFound")}
        getItemId={(building: Building) => building.id}
        getItemDisplayName={(building: Building) => building.building_name}
      />
    </div>
  );
}
