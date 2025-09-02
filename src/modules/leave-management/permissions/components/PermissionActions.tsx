"use client";

import React, { useState } from 'react';
import { useTranslations } from '@/hooks/use-translations';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal, Edit, Trash2, Check, X } from 'lucide-react';
import usePermissionMutations from '../hooks/useMutations';

interface Props {
  permission: any;
  onEdit: () => void;
  onRefresh: () => void;
}

const PermissionActions: React.FC<Props> = ({ permission, onEdit, onRefresh }) => {
  const { t } = useTranslations();
  const [loading, setLoading] = useState(false);
  const mutations = usePermissionMutations();

  const handleApprove = async () => {
    setLoading(true);
    try {
      await mutations.approve.mutateAsync({ id: permission.id });
      onRefresh();
    } catch (error) {
      // Error handling is done in the mutation
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async () => {
    setLoading(true);
    try {
      await mutations.reject.mutateAsync({ id: permission.id });
      onRefresh();
    } catch (error) {
      // Error handling is done in the mutation
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this permission?')) {
      return;
    }
    
    setLoading(true);
    try {
      await mutations.remove.mutateAsync(permission.id);
      onRefresh();
    } catch (error) {
      // Error handling is done in the mutation
    } finally {
      setLoading(false);
    }
  };

  const canApprove = permission.status?.toLowerCase() === 'pending';
  const canEdit = permission.status?.toLowerCase() !== 'approved';

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" disabled={loading}>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {canEdit && (
          <DropdownMenuItem onClick={onEdit}>
            <Edit className="h-4 w-4 mr-2" />
            {t('common.edit')}
          </DropdownMenuItem>
        )}
        {canApprove && (
          <>
            <DropdownMenuItem onClick={handleApprove}>
              <Check className="h-4 w-4 mr-2" />
              {t('leaveManagement.permissions.actionsMenu.approve')}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleReject}>
              <X className="h-4 w-4 mr-2" />
              {t('leaveManagement.permissions.actionsMenu.reject')}
            </DropdownMenuItem>
          </>
        )}
        <DropdownMenuItem onClick={handleDelete} className="text-red-600">
          <Trash2 className="h-4 w-4 mr-2" />
          {t('common.delete')}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default PermissionActions;
