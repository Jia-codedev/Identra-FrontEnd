"use client";
import React from "react";
import useReports from "../hooks/useReports";
import ReportsFilters from "../components/ReportsFilters";
import PreviewTable from "../components/PreviewTable";
export default function WorkforceReportsPage() {
    return (
        <div className="p-4 space-y-4">
            <h1 className="text-xl font-semibold">Workforce Reports</h1>
            <ReportsContainer />
        </div>
    );
}

function ReportsContainer() {
    const {
        filters,
        onChange,
        hasAnyFilter,
        preview,
        previewLoading,
        handlePreview,
        exporting,
        handleExport,
        error,
    } = useReports();

    return (
        <>
            <ReportsFilters
                filters={filters}
                onChange={onChange}
                onPreview={handlePreview}
                onExport={handleExport}
                previewLoading={previewLoading}
                exporting={exporting}
                showWholeDataNote={!hasAnyFilter}
            />

            {error && (
                <div className="text-sm text-destructive" role="alert">
                    {error}
                </div>
            )}

            <div className="grid gap-4">
                {preview.length > 0 && <PreviewTable rows={preview} />}
            </div>
        </>
    );
}
