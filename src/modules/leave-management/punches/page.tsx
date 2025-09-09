"use client";

import React, { useState, useEffect } from "react";
import { useTranslations } from "@/hooks/use-translations";
import { useLanguage } from "@/providers/language-provider";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Users, User } from "lucide-react";
import PunchesHeader from "./components/PunchesHeader";
import PunchesList from "./components/PunchesList";
import { CustomPagination } from "@/components/common/dashboard/Pagination";
import usePunchesTabs, { PunchesTabType } from "./hooks/usePunchesTabs";
import { EmployeeEventTransaction } from "@/services/leaveManagement/employeeEventTransactions";

type ViewMode = "table" | "grid";

export default function PunchesPage() {
  const { t } = useTranslations();
  const { isRTL } = useLanguage();
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<ViewMode>("table");

  const {
    // Tab state
    activeTab,
    handleTabChange,
    
    // Data
    data,
    total,
    teamMembers,
    
    // Pagination
    page,
    limit,
    
    // Selection
    selectedItems,
    
    // Loading states
    isLoading,
    isFetching,
    isError,
    error,
    
    // Actions
    handlePageChange,
    handleLimitChange,
    handleFiltersChange,
    handleSelectItem,
    handleSelectAll,
    clearSelection,
    refresh,
    
    // Computed values
    hasSelection,
    isAllSelected,
    
    // User info
    currentUserId,
  } = usePunchesTabs({
    initialPage: 1,
    initialLimit: 5,
  });

  useEffect(() => {
    handleFiltersChange({ search: searchTerm });
  }, [searchTerm, handleFiltersChange]); 

  const totalPages = Math.ceil(total / limit);

  if (error) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-start">
        <div className="w-full relative">
          <div className="rounded-2xl border py-4 border-border bg-background/90 p-4">
            <div className="text-center py-16">
              <h3 className="text-lg font-medium text-destructive">
                {t('attendance.errorLoading') || t('common.errorLoading') || 'Error loading event transactions'}
              </h3>
              <p className="text-sm text-muted-foreground mt-1">{error.message}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col items-center justify-start">
      <div className="w-full relative">
        <div className="rounded-2xl border py-4 border-border bg-background/90">
          <Tabs value={activeTab} onValueChange={(value) => handleTabChange(value as PunchesTabType)} className="w-full">
            {/* Header with Tabs */}
            <div className="px-4 py-4 border-b border-border">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
                <div className="flex-1">
                  <h1 className="text-3xl md:text-4xl font-bold text-primary tracking-tight leading-tight mb-1">
                    {t('punches.title') || 'Punches & Attendance'}
                  </h1>
                  <p className="text-base md:text-lg text-muted-foreground font-normal">
                    {activeTab === 'my-punches' 
                      ? (t('punches.myPunchesDescription') || 'View your own attendance records')
                      : (t('punches.teamPunchesDescription') || 'View attendance records of your team members')
                    }
                  </p>
                </div>
              </div>
              
              {/* Tab Navigation */}
              <TabsList className="grid w-full max-w-md grid-cols-2">
                <TabsTrigger value="my-punches" className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  {t('punches.myPunches') || 'My Punches'}
                </TabsTrigger>
                <TabsTrigger value="team-punches" className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  {t('punches.teamPunches') || 'Team Punches'}
                </TabsTrigger>
              </TabsList>
            </div>

            {/* Tab Content */}
            <TabsContent value="my-punches" className="mt-0">
              <PunchesHeader
                selectedCount={selectedItems.length}
                onRefresh={refresh}
                onFiltersChange={handleFiltersChange}
                search={searchTerm}
                onSearchChange={setSearchTerm}
                viewMode={viewMode}
                onViewModeChange={setViewMode}
              />

              <div className="px-4">
                <PunchesList
                  punches={data || []}
                  viewMode={viewMode}
                  selected={selectedItems}
                  allChecked={isAllSelected}
                  onSelectItem={handleSelectItem}
                  onSelectAll={handleSelectAll}
                  isLoading={isLoading}
                />

                {!isLoading && data.length > 0 && (
                  <div className="flex justify-center py-4">
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
              <PunchesHeader
                selectedCount={selectedItems.length}
                onRefresh={refresh}
                onFiltersChange={handleFiltersChange}
                search={searchTerm}
                onSearchChange={setSearchTerm}
                viewMode={viewMode}
                onViewModeChange={setViewMode}
              />

              <div className="px-4">
                {teamMembers.length === 0 && !isLoading ? (
                  <div className="text-center py-16">
                    <Users className="mx-auto h-12 w-12 text-muted-foreground" />
                    <h3 className="mt-2 text-sm font-medium text-foreground">
                      {t('attendance.noTeamMembers') || 'No team members found'}
                    </h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {t('attendance.noTeamMembersDesc') || 'You don\'t have any team members assigned to you.'}
                    </p>
                  </div>
                ) : (
                  <>
                    <PunchesList
                      punches={data || []}
                      viewMode={viewMode}
                      selected={selectedItems}
                      allChecked={isAllSelected}
                      onSelectItem={handleSelectItem}
                      onSelectAll={handleSelectAll}
                      isLoading={isLoading}
                    />

                    {!isLoading && data.length > 0 && (
                      <div className="flex justify-center py-4">
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
                  </>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
