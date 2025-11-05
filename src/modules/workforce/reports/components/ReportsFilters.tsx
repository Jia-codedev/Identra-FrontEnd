"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import type { Filters } from "../hooks/useReports";

type Props = {
  filters: Filters;
  onChange: (key: keyof Filters, value: string | number | undefined | null) => void;
  onPreview: () => void;
  onExport: () => void;
  previewLoading?: boolean;
  exporting?: boolean;
  showWholeDataNote?: boolean;
};

export default function ReportsFilters({
  filters,
  onChange,
  onPreview,
  onExport,
  previewLoading,
  exporting,
  showWholeDataNote,
}: Props) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <label className="flex flex-col gap-1">
          <span className="text-sm text-muted-foreground">Start date</span>
          <input
            type="date"
            className="border rounded-md h-9 px-3 bg-background"
            value={filters.startDate ?? ""}
            onChange={(e) => onChange("startDate", e.target.value || undefined)}
          />
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-sm text-muted-foreground">End date</span>
          <input
            type="date"
            className="border rounded-md h-9 px-3 bg-background"
            value={filters.endDate ?? ""}
            onChange={(e) => onChange("endDate", e.target.value || undefined)}
          />
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-sm text-muted-foreground">Employee ID</span>
          <input
            type="number"
            className="border rounded-md h-9 px-3 bg-background"
            value={filters.employeeId ?? ""}
            onChange={(e) =>
              onChange(
                "employeeId",
                e.target.value ? Number(e.target.value) : undefined
              )
            }
            placeholder="e.g. 123"
          />
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-sm text-muted-foreground">Organization ID</span>
          <input
            type="number"
            className="border rounded-md h-9 px-3 bg-background"
            value={filters.organizationId ?? ""}
            onChange={(e) =>
              onChange(
                "organizationId",
                e.target.value ? Number(e.target.value) : undefined
              )
            }
            placeholder="e.g. 456"
          />
        </label>

        <label className="flex flex-col gap-1 md:col-span-2">
          <span className="text-sm text-muted-foreground">Organization name</span>
          <input
            type="text"
            className="border rounded-md h-9 px-3 bg-background"
            value={filters.organization ?? ""}
            onChange={(e) => onChange("organization", e.target.value || undefined)}
            placeholder="Search English/Arabic name"
          />
        </label>
      </div>

      <div className="flex items-center gap-2">
        <Button onClick={onPreview} disabled={!!previewLoading} variant="outline">
          {previewLoading ? "Loading..." : "Preview (first 20)"}
        </Button>
        <Button onClick={onExport} disabled={!!exporting}>
          {exporting ? "Exporting..." : "Export CSV"}
        </Button>
        {showWholeDataNote && (
          <span className="text-xs text-muted-foreground">
            No filters applied — exporting the entire dataset.
          </span>
        )}
      </div>
    </div>
  );
}
