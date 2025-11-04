"use client";
import { useCallback, useMemo, useState } from "react";
import reportsApi, { type NewReportFilters } from "@/services/settings/reports";

export type Filters = NewReportFilters;

export function useReports() {
  const [filters, setFilters] = useState<Filters>({});
  const [exporting, setExporting] = useState(false);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<any[]>([]);

  const hasAnyFilter = useMemo(() => Object.keys(filters).length > 0, [filters]);

  const onChange = useCallback(
    (key: keyof Filters, value: string | number | undefined | null) => {
      setFilters((prev) => ({ ...prev, [key]: value ?? undefined }));
    },
    []
  );

  const handlePreview = useCallback(async () => {
    setPreviewLoading(true);
    setError(null);
    try {
      const res = await reportsApi.getNewReport(filters);
      setPreview(Array.isArray(res.data?.data) ? res.data.data.slice(0, 20) : []);
    } catch (e: any) {
      setError(e?.response?.data?.message || e?.message || "Failed to load data");
    } finally {
      setPreviewLoading(false);
    }
  }, [filters]);

  const handleExport = useCallback(async () => {
    setExporting(true);
    setError(null);
    try {
      const res = await reportsApi.exportNewReportCSV(filters);
      const blob = new Blob([res.data], { type: "text/csv;charset=utf-8" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      const filenameParts: string[] = ["daily_move_report"];
      if (filters.startDate && filters.endDate)
        filenameParts.push(`${filters.startDate}_to_${filters.endDate}`);
      if (filters.organizationId)
        filenameParts.push(`org${filters.organizationId}`);
      if (filters.employeeId) filenameParts.push(`emp${filters.employeeId}`);
      a.href = url;
      a.download = `${filenameParts.join("_")}.csv`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (e: any) {
      setError(e?.response?.data?.message || e?.message || "Failed to export CSV");
    } finally {
      setExporting(false);
    }
  }, [filters]);

  return {
    filters,
    setFilters,
    onChange,
    hasAnyFilter,
    preview,
    previewLoading,
    handlePreview,
    exporting,
    handleExport,
    error,
    setError,
  };
}

export default useReports;
