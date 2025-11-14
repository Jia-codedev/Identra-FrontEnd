"use client";

import React, { useState, useEffect } from "react";
import { useTranslations } from "@/hooks/use-translations";
import { useLanguage } from "@/providers/language-provider";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Users, User, Search, RefreshCw } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/button";
import PunchesList from "./components/PunchesList";
import { CustomPagination } from "@/components/common/dashboard/Pagination";
import usePunchesTabs, { PunchesTabType } from "./hooks/usePunchesTabs";
import { useSubModulePrivileges } from "@/hooks/security/useSubModulePrivileges";

export default function PunchesPage() {
  const { t } = useTranslations();
  const { isRTL } = useLanguage();
  const [searchTerm, setSearchTerm] = useState("");

  const {
    activeTab,
    handleTabChange,

    data,
    total,
    teamMembers,

    page,
    limit,

    selectedItems,

    isLoading,
    error,

    handlePageChange,
    handleLimitChange,
    handleFiltersChange,
    handleSelectItem,
    handleSelectAll,
    refresh,
    isAllSelected,
  } = usePunchesTabs({
    initialPage: 1,
    initialLimit: 5,
  });

  const { canView, canCreate, canEdit, canDelete } = useSubModulePrivileges(
    "self-services",
    "attendance-logs"
  );
  console.log("Privileges:", { canView, canCreate, canEdit, canDelete });

  useEffect(() => {
    handleFiltersChange({ search: searchTerm });
  }, [searchTerm, handleFiltersChange]);

  const totalPages = Math.ceil(total / limit);

  if (error) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-start">
        <div className="w-full relative">
          <div className="py-4 border-border bg-background/90 p-4">
            <div className="text-center py-16">
              <h3 className="text-lg font-medium text-destructive">
                {t("leaveManagement.attendance.errorLoading") ||
                  t("common.errorLoading") ||
                  "Error loading event transactions"}
              </h3>
              <p className="text-sm text-muted-foreground mt-1">
                {error.message}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col items-center justify-start">
      <div className="w-full relative">
        <div className="py-4 border-border bg-background/90">
          <Tabs
            value={activeTab}
            onValueChange={(value) => handleTabChange(value as PunchesTabType)}
            className="w-full"
          >
            <div className="px-4 py-4 ">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
                <div className="flex-1">
                  <h1 className="text-3xl md:text-4xl font-bold text-primary tracking-tight leading-tight mb-1">
                    {t("leaveManagement.punches.title") ||
                      "Punches & Attendance"}
                  </h1>
                </div>

                {/* Search and Actions */}
                <div className="flex items-center gap-2">
                  <div
                    className={`flex items-center gap-0 bg-card/80 border border-border rounded-xl px-2 py-1 ${
                      isRTL ? "flex-row-reverse" : "flex-row"
                    }`}
                  >
                    <span
                      className={`${
                        isRTL ? "pr-2 pl-1" : "pl-2 pr-1"
                      } text-xl text-primary/80`}
                    >
                      <Search size={20} />
                    </span>
                    <Input
                      placeholder={
                        t("leaveManagement.punches.searchPlaceholder") ||
                        "Search by employee number..."
                      }
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="border-0 bg-transparent rounded-lg focus:ring-0 focus-visible:ring-0 shadow-none text-base px-2 w-64"
                    />
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={refresh}
                    className="px-3 py-2"
                  >
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Tab Navigation */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <TabsList className="grid w-full max-w-md grid-cols-2">
                  <TabsTrigger
                    value="my-punches"
                    className="flex items-center gap-2"
                  >
                    <User className="w-4 h-4" />
                    {t("leaveManagement.punches.myPunches") || "My Punches"}
                  </TabsTrigger>
                  <TabsTrigger
                    value="team-punches"
                    className="flex items-center gap-2"
                  >
                    <Users className="w-4 h-4" />
                    {t("leaveManagement.punches.teamPunches") || "Team Punches"}
                  </TabsTrigger>
                </TabsList>

                {selectedItems.length > 0 && (
                  <div className="text-sm text-primary font-medium">
                    {t("leaveManagement.common.selectedCount", {
                      count: selectedItems.length,
                    }) || `${selectedItems.length} records selected`}
                  </div>
                )}
              </div>
            </div>

            {/* Tab Content */}
            <TabsContent value="my-punches" className="mt-0">
              <div className="px-4 py-4 w-full">
                <PunchesList
                  punches={data || []}
                  selected={selectedItems}
                  allChecked={isAllSelected}
                  onSelectItem={handleSelectItem}
                  onSelectAll={handleSelectAll}
                  isLoading={isLoading}
                />

                {!isLoading && data.length > 0 && (
                  <div className="flex justify-center py-4 w-full">
                    <CustomPagination
                      currentPage={page}
                      totalPages={totalPages}
                      pageSize={limit}
                      onPageChange={handlePageChange}
                      pageSizeOptions={[5, 10, 20, 50]}
                      onPageSizeChange={handleLimitChange}
                    />
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="team-punches" className="mt-0">
              <div className="px-4 py-4 w-full">
                <PunchesList
                  punches={data || []}
                  selected={selectedItems}
                  allChecked={isAllSelected}
                  onSelectItem={handleSelectItem}
                  onSelectAll={handleSelectAll}
                  isLoading={isLoading}
                />

                {!isLoading && data.length > 0 && (
                  <div className="flex justify-center py-4 w-full">
                    <CustomPagination
                      currentPage={page}
                      totalPages={totalPages}
                      pageSize={limit}
                      onPageChange={handlePageChange}
                      pageSizeOptions={[5, 10, 20, 50]}
                      onPageSizeChange={handleLimitChange}
                    />
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
