"use client";

import React from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useTranslations } from '@/hooks/use-translations';

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
}) => {
  const { t } = useTranslations();

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent
        className='p-2 gap-2'
      >
        <AlertDialogTitle
          className='px-2 '
        >{title}</AlertDialogTitle>
        <div className="p-2 bg-black/5 rounded-lg dark:bg-white/5 space-y-4">
          <AlertDialogDescription>{description}</AlertDialogDescription>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={onClose}>{t('common.cancel')}</AlertDialogCancel>
            <AlertDialogAction onClick={onConfirm}>{t('common.confirm')}</AlertDialogAction>
          </AlertDialogFooter>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
};
