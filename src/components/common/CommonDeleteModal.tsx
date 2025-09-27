"use client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface CommonDeleteModalProps {
  open: boolean;
  dialogTitle: string;
  dialogDescription: string;
  cancelText: string;
  confirmText: string;
  handleCancelDelete: () => void;
  handleConfirmDelete: () => void;
}

export const CommonDeleteModal: React.FC<CommonDeleteModalProps> = ({
  open = false,
  dialogTitle = "",
  dialogDescription = "",
  cancelText = "",
  confirmText = "",
  handleCancelDelete,
  handleConfirmDelete,
}) => {
  return (
    <Dialog open={open} onOpenChange={(open) => !open && handleCancelDelete()}>
      <DialogContent className="p-0">
        <DialogHeader className="p-2">
          <DialogTitle className="mb-1 p-2">{dialogTitle}</DialogTitle>
          <div className="bg-black/5 p-4 rounded-lg dark:bg-white/5">
            <DialogDescription>{dialogDescription} </DialogDescription>
            <div className="flex justify-end space-x-2 mt-4">
              <Button variant="outline" onClick={handleCancelDelete}>
                {cancelText}
              </Button>
              <Button variant="destructive" onClick={handleConfirmDelete}>
                {confirmText}
              </Button>
            </div>
          </div>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};
