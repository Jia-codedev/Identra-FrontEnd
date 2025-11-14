"use client";

import React from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useTranslations } from "@/hooks/use-translations";
import { Trash2 } from "lucide-react";

interface DeleteManyLeaveTypesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  selectedCount: number;
  isLoading?: boolean;
}

const DeleteManyLeaveTypesDialog: React.FC<DeleteManyLeaveTypesDialogProps> = ({
  open,
  onOpenChange,
  onConfirm,
  selectedCount,
  isLoading = false,
}) => {
  const { t } = useTranslations();

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0 w-10 h-10 bg-destructive/10 rounded-full flex items-center justify-center">
              <Trash2 className="w-5 h-5 text-destructive" />
            </div>
            <div>
              <AlertDialogTitle className="text-lg font-semibold">
                {t("leaveManagement.leaveTypes.actions.deleteMany") || "Delete Leave Types"}
              </AlertDialogTitle>
            </div>
          </div>
        </AlertDialogHeader>

        <AlertDialogDescription className="text-sm text-muted-foreground ml-13">
          {t("leaveManagement.leaveTypes.messages.deleteManyConfirm") ||
            `Are you sure you want to delete ${selectedCount} leave type${selectedCount > 1 ? 's' : ''}? This action cannot be undone.`}
        </AlertDialogDescription>

        <AlertDialogFooter className="gap-2 sm:gap-3">
          <AlertDialogCancel
            disabled={isLoading}
            className="flex-1 sm:flex-none"
          >
            {t("common.cancel") || "Cancel"}
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            disabled={isLoading}
            className="flex-1 sm:flex-none bg-destructive hover:bg-destructive/90"
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                {t("common.deleting") || "Deleting..."}
              </div>
            ) : (
              <>
                <Trash2 className="w-4 h-4 mr-2" />
                {t("common.delete") || "Delete"} {selectedCount}
              </>
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteManyLeaveTypesDialog;