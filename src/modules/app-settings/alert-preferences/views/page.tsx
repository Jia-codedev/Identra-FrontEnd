"use client";
import React, { useState } from "react";
import { useTranslations } from "@/hooks/use-translations";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CustomPagination } from "@/components/common/dashboard/Pagination";

// Import hooks
import {
  useEmailSettings,
  useDbSettings,
  useEmailSettingMutations,
  useDbSettingMutations,
} from "../hooks";

// Import components
import {
  EmailSettingsTable,
  DbSettingsTable,
  EmailSettingsModal,
  DbSettingsModal,
} from "../components";
import { AppSettingsHeader } from "@/modules/app-settings/appSettings/components/AppSettingsHeader";

// Import types
import type {
  ChronEmailSetting,
  ChronDbSetting,
  CreateChronEmailSettingRequest,
  CreateChronDbSettingRequest,
} from "../types";

function AlertPreferencesPage() {
  const { t } = useTranslations();

  // Email Settings State
  const {
    emailSettings,
    selected: emailSelected,
    search: emailSearch,
    page: emailPage,
    pageCount: emailPageCount,
    pageSize: emailPageSize,
    pageSizeOptions: emailPageSizeOptions,
    allChecked: emailAllChecked,
    setSearch: setEmailSearch,
    setPage: setEmailPage,
    setPageSize: setEmailPageSize,
    selectEmailSetting,
    selectAll: selectAllEmail,
    isLoading: emailLoading,
  } = useEmailSettings();

  // Database Settings State
  const {
    dbSettings,
    selected: dbSelected,
    search: dbSearch,
    page: dbPage,
    pageCount: dbPageCount,
    pageSize: dbPageSize,
    pageSizeOptions: dbPageSizeOptions,
    allChecked: dbAllChecked,
    setSearch: setDbSearch,
    setPage: setDbPage,
    setPageSize: setDbPageSize,
    selectDbSetting,
    selectAll: selectAllDb,
    isLoading: dbLoading,
  } = useDbSettings();

  // Email Settings Mutations
  const {
    createEmailSetting,
    updateEmailSetting,
    deleteEmailSetting,
    deleteEmailSettings,
    sendTestEmail,
  } = useEmailSettingMutations();

  // Database Settings Mutations
  const { createDbSetting, updateDbSetting, deleteDbSetting } =
    useDbSettingMutations();

  // Modal States
  const [emailModalState, setEmailModalState] = useState<{
    isOpen: boolean;
    mode: "add" | "edit";
    emailSetting: ChronEmailSetting | null;
  }>({
    isOpen: false,
    mode: "add",
    emailSetting: null,
  });

  const [dbModalState, setDbModalState] = useState<{
    isOpen: boolean;
    mode: "add" | "edit";
    dbSetting: ChronDbSetting | null;
  }>({
    isOpen: false,
    mode: "add",
    dbSetting: null,
  });

  // Delete Dialog States
  const [emailDeleteDialog, setEmailDeleteDialog] = useState<{
    open: boolean;
    type: "single" | "bulk" | null;
    id?: number;
  }>({ open: false, type: null });

  const [dbDeleteDialog, setDbDeleteDialog] = useState<{
    open: boolean;
    type: "single" | "bulk" | null;
    id?: number;
  }>({ open: false, type: null });

  // Test Email Dialog
  const [testEmailDialog, setTestEmailDialog] = useState<{
    open: boolean;
    setting: ChronEmailSetting | null;
  }>({ open: false, setting: null });

  // Email Settings Handlers
  const handleAddEmailSetting = () => {
    setEmailModalState({
      isOpen: true,
      mode: "add",
      emailSetting: null,
    });
  };

  const handleEditEmailSetting = (emailSetting: ChronEmailSetting) => {
    setEmailModalState({
      isOpen: true,
      mode: "edit",
      emailSetting,
    });
  };

  const handleCloseEmailModal = () => {
    setEmailModalState({
      isOpen: false,
      mode: "add",
      emailSetting: null,
    });
  };

  const handleSaveEmailSetting = (data: CreateChronEmailSettingRequest) => {
    if (emailModalState.mode === "add") {
      createEmailSetting(data);
    } else if (
      emailModalState.mode === "edit" &&
      emailModalState.emailSetting?.em_id
    ) {
      updateEmailSetting({ id: emailModalState.emailSetting.em_id, data });
    }
    handleCloseEmailModal();
  };

  const handleDeleteEmailSetting = (id: number) => {
    setEmailDeleteDialog({ open: true, type: "single", id });
  };

  const handleDeleteSelectedEmail = () => {
    setEmailDeleteDialog({ open: true, type: "bulk" });
  };

  const handleConfirmEmailDelete = () => {
    if (emailDeleteDialog.type === "single" && emailDeleteDialog.id) {
      deleteEmailSetting(emailDeleteDialog.id);
    } else if (emailDeleteDialog.type === "bulk" && emailSelected.length > 0) {
      deleteEmailSettings(emailSelected);
    }
    setEmailDeleteDialog({ open: false, type: null });
  };

  const handleTestEmail = (setting: ChronEmailSetting) => {
    setTestEmailDialog({ open: true, setting });
  };

  const handleSendTestEmail = (email: string) => {
    sendTestEmail({ to: email });
    setTestEmailDialog({ open: false, setting: null });
  };

  // Database Settings Handlers
  const handleAddDbSetting = () => {
    setDbModalState({
      isOpen: true,
      mode: "add",
      dbSetting: null,
    });
  };

  const handleEditDbSetting = (dbSetting: ChronDbSetting) => {
    setDbModalState({
      isOpen: true,
      mode: "edit",
      dbSetting,
    });
  };

  const handleCloseDbModal = () => {
    setDbModalState({
      isOpen: false,
      mode: "add",
      dbSetting: null,
    });
  };

  const handleSaveDbSetting = (data: CreateChronDbSettingRequest) => {
    if (dbModalState.mode === "add") {
      createDbSetting(data);
    } else if (
      dbModalState.mode === "edit" &&
      dbModalState.dbSetting?.db_settings_id
    ) {
      updateDbSetting({ id: dbModalState.dbSetting.db_settings_id, data });
    }
    handleCloseDbModal();
  };

  const handleDeleteDbSetting = (id: number) => {
    setDbDeleteDialog({ open: true, type: "single", id });
  };

  const handleDeleteSelectedDb = () => {
    setDbDeleteDialog({ open: true, type: "bulk" });
  };

  const handleConfirmDbDelete = () => {
    if (dbDeleteDialog.type === "single" && dbDeleteDialog.id) {
      deleteDbSetting(dbDeleteDialog.id);
    }
    setDbDeleteDialog({ open: false, type: null });
  };

  const [activeTab, setActiveTab] = useState<"email" | "database">("email");

  return (
    <div className="w-full h-full flex flex-col p-4">
      <AppSettingsHeader
        search={activeTab === "email" ? emailSearch : dbSearch}
        onSearchChange={(v) =>
          activeTab === "email" ? setEmailSearch(v) : setDbSearch(v)
        }
        onAddAppSetting={() =>
          activeTab === "email" ? handleAddEmailSetting() : handleAddDbSetting()
        }
        selectedCount={activeTab === "email" ? emailSelected.length : dbSelected.length}
        onDeleteSelected={() =>
          activeTab === "email" ? handleDeleteSelectedEmail() : handleDeleteSelectedDb()
        }
        title={t("appSettings.alertPreferences.title")}
      />

      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="email">
            {t("appSettings.alertPreferences.emailSettings")}
          </TabsTrigger>
          <TabsTrigger value="database">
            {t("appSettings.alertPreferences.databaseSettings")}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="email" className="space-y-4">

          <EmailSettingsTable
            emailSettings={emailSettings}
            selected={emailSelected}
            page={emailPage}
            pageSize={emailPageSize}
            allChecked={emailAllChecked}
            onSelectAll={selectAllEmail}
            onSelectEmailSetting={selectEmailSetting}
            onEditEmailSetting={handleEditEmailSetting}
            onDeleteEmailSetting={handleDeleteEmailSetting}
            onTestEmail={handleTestEmail}
            onViewEmailSetting={handleEditEmailSetting}
            onPageChange={setEmailPage}
            onPageSizeChange={setEmailPageSize}
            isLoading={emailLoading}
          />

          <CustomPagination
            currentPage={emailPage}
            totalPages={emailPageCount}
            onPageChange={setEmailPage}
            pageSize={emailPageSize}
            pageSizeOptions={emailPageSizeOptions}
            onPageSizeChange={setEmailPageSize}
          />
        </TabsContent>

        <TabsContent value="database" className="space-y-4">

          <DbSettingsTable
            dbSettings={dbSettings}
            selected={dbSelected}
            page={dbPage}
            pageSize={dbPageSize}
            allChecked={dbAllChecked}
            onSelectAll={selectAllDb}
            onSelectDbSetting={selectDbSetting}
            onEditDbSetting={handleEditDbSetting}
            onDeleteDbSetting={handleDeleteDbSetting}
            onViewDbSetting={handleEditDbSetting}
            onPageChange={setDbPage}
            onPageSizeChange={setDbPageSize}
            isLoading={dbLoading}
          />

          <CustomPagination
            currentPage={dbPage}
            totalPages={dbPageCount}
            onPageChange={setDbPage}
            pageSize={dbPageSize}
            pageSizeOptions={dbPageSizeOptions}
            onPageSizeChange={setDbPageSize}
          />
        </TabsContent>
      </Tabs>

      {/* Email Settings Modal */}
      <EmailSettingsModal
        isOpen={emailModalState.isOpen}
        mode={emailModalState.mode}
        emailSetting={emailModalState.emailSetting}
        onClose={handleCloseEmailModal}
        onSave={handleSaveEmailSetting}
      />

      {/* Database Settings Modal */}
      <DbSettingsModal
        isOpen={dbModalState.isOpen}
        mode={dbModalState.mode}
        dbSetting={dbModalState.dbSetting}
        onClose={handleCloseDbModal}
        onSave={handleSaveDbSetting}
      />

      {/* Email Delete Confirmation Dialog */}
      <Dialog
        open={emailDeleteDialog.open}
        onOpenChange={(open) =>
          !open && setEmailDeleteDialog({ open: false, type: null })
        }
      >
        <DialogContent className="p-0">
          <DialogHeader className="p-2">
            <DialogTitle className="mb-1 p-2">
              {t("common.confirmDelete")}
            </DialogTitle>
            <div className="bg-black/5 p-4 rounded-lg dark:bg-white/5">
              <DialogDescription>
                {emailDeleteDialog.type === "single"
                  ? t("appSettings.alertPreferences.confirmDeleteEmail")
                  : t(
                      "appSettings.alertPreferences.confirmDeleteMultipleEmail",
                      { count: emailSelected.length }
                    )}
              </DialogDescription>
              <div className="flex justify-end space-x-2 mt-4">
                <Button
                  variant="outline"
                  onClick={() =>
                    setEmailDeleteDialog({ open: false, type: null })
                  }
                >
                  {t("common.cancel")}
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleConfirmEmailDelete}
                >
                  {t("common.delete")}
                </Button>
              </div>
            </div>
          </DialogHeader>
        </DialogContent>
      </Dialog>

      {/* Database Delete Confirmation Dialog */}
      <Dialog
        open={dbDeleteDialog.open}
        onOpenChange={(open) =>
          !open && setDbDeleteDialog({ open: false, type: null })
        }
      >
        <DialogContent className="p-0">
          <DialogHeader className="p-2">
            <DialogTitle className="mb-1 p-2">
              {t("common.confirmDelete")}
            </DialogTitle>
            <div className="bg-black/5 p-4 rounded-lg dark:bg-white/5">
              <DialogDescription>
                {dbDeleteDialog.type === "single"
                  ? t("appSettings.alertPreferences.confirmDeleteDb")
                  : t("appSettings.alertPreferences.confirmDeleteMultipleDb", {
                      count: dbSelected.length,
                    })}
              </DialogDescription>
              <div className="flex justify-end space-x-2 mt-4">
                <Button
                  variant="outline"
                  onClick={() => setDbDeleteDialog({ open: false, type: null })}
                >
                  {t("common.cancel")}
                </Button>
                <Button variant="destructive" onClick={handleConfirmDbDelete}>
                  {t("common.delete")}
                </Button>
              </div>
            </div>
          </DialogHeader>
        </DialogContent>
      </Dialog>

      {/* Test Email Dialog */}
      <Dialog
        open={testEmailDialog.open}
        onOpenChange={(open) =>
          !open && setTestEmailDialog({ open: false, setting: null })
        }
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {t("appSettings.alertPreferences.testEmail")}
            </DialogTitle>
            <DialogDescription>
              {t("appSettings.alertPreferences.testEmailDescription")}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                {t("appSettings.alertPreferences.recipientEmail")}
              </label>
              <input
                type="email"
                placeholder={t(
                  "appSettings.alertPreferences.recipientEmailPlaceholder"
                )}
                className="w-full px-3 py-2 border rounded-md"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    const email = (e.target as HTMLInputElement).value;
                    if (email) {
                      handleSendTestEmail(email);
                    }
                  }
                }}
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={() =>
                  setTestEmailDialog({ open: false, setting: null })
                }
              >
                {t("common.cancel")}
              </Button>
              <Button
                onClick={() => {
                  const input = document.querySelector(
                    'input[type="email"]'
                  ) as HTMLInputElement;
                  if (input?.value) {
                    handleSendTestEmail(input.value);
                  }
                }}
              >
                {t("appSettings.alertPreferences.sendTestButton")}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default AlertPreferencesPage;
