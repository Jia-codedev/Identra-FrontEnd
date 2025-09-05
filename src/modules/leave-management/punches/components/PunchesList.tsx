"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { GenericTable, TableColumn } from "@/components/common/GenericTable";
import { Clock, MapPin, Smartphone, Edit, Trash2 } from "lucide-react";
import { useTranslations } from "@/hooks/use-translations";
import { useLanguage } from "@/providers/language-provider";

const formatDateTime = (dateString: string) => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return date.toLocaleString();
};

const formatTime = (timeString: string) => {
  if (!timeString) return 'N/A';
  const date = new Date(timeString);
  return date.toLocaleTimeString();
};

const getStatusColor = (status: string) => {
  switch (status?.toLowerCase()) {
    case 'present':
      return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
    case 'absent':
      return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
    case 'late':
      return 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400';
    case 'half day':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
    default:
      return 'bg-muted text-muted-foreground';
  }
};

type ViewMode = 'table' | 'grid';

interface AttendanceRecord {
  id: number;
  employee_id: number;
  employee_no: string;
  employee_name?: string;
  Ddate: string;
  check_in?: string;
  check_out?: string;
  break_start?: string;
  break_end?: string;
  total_work_hours?: number;
  overtime_hours?: number;
  status?: string;
  location?: string;
  device_id?: string;
  created_date?: string;
  last_updated_date?: string;
}

interface PunchesListProps {
  punches: AttendanceRecord[];
  viewMode: ViewMode;
  selected?: number[];
  allChecked?: boolean;
  onSelectItem?: (id: number) => void;
  onSelectAll?: () => void;
  onEdit?: (punch: AttendanceRecord) => void;
  onDelete?: (id: number) => void;
  isLoading?: boolean;
}

export default function PunchesList({
  punches,
  viewMode,
  selected = [],
  allChecked = false,
  onSelectItem,
  onSelectAll,
  onEdit,
  onDelete,
  isLoading = false,
}: PunchesListProps) {
  const { t } = useTranslations();
  const { isRTL } = useLanguage();

  // Define table columns for GenericTable
  const columns: TableColumn<AttendanceRecord>[] = [
    {
      key: 'employee',
      header: t('punches.employee') || 'Employee',
      accessor: (punch: AttendanceRecord) => (
        <div>
          <div className="font-medium text-foreground">{punch.employee_name || t('common.unknown') || 'Unknown'}</div>
          <div className="text-sm text-muted-foreground">#{punch.employee_no}</div>
        </div>
      ),
    },
    {
      key: 'date',
      header: t('punches.date') || 'Date',
      accessor: (punch: AttendanceRecord) => (
        <div className="text-sm">
          <div className="font-medium text-foreground">{formatDateTime(punch.Ddate)}</div>
        </div>
      ),
    },
    {
      key: 'checkIn',
      header: t('punches.checkIn') || 'Check In',
      accessor: (punch: AttendanceRecord) => (
        <div className="text-sm text-muted-foreground">
          {formatTime(punch.check_in || '')}
        </div>
      ),
    },
    {
      key: 'checkOut',
      header: t('punches.checkOut') || 'Check Out',
      accessor: (punch: AttendanceRecord) => (
        <div className="text-sm text-muted-foreground">
          {formatTime(punch.check_out || '')}
        </div>
      ),
    },
    {
      key: 'break',
      header: t('punches.break') || 'Break',
      accessor: (punch: AttendanceRecord) => (
        <div className="text-sm text-muted-foreground">
          {punch.break_start && punch.break_end ? 
            `${formatTime(punch.break_start)} - ${formatTime(punch.break_end)}` : 
            'N/A'
          }
        </div>
      ),
    },
    {
      key: 'workHours',
      header: t('punches.workHours') || 'Work Hours',
      accessor: (punch: AttendanceRecord) => (
        <div className="text-sm">
          <div className="font-medium text-foreground">{punch.total_work_hours || 0}h</div>
          {punch.overtime_hours && punch.overtime_hours > 0 && (
            <div className="text-xs text-primary">+{punch.overtime_hours}h {t('punches.overtime') || 'OT'}</div>
          )}
        </div>
      ),
    },
    {
      key: 'location',
      header: t('punches.location') || 'Location',
      accessor: (punch: AttendanceRecord) => (
        <div className="flex items-center text-sm text-muted-foreground">
          <MapPin className="w-3 h-3 mr-1" />
          {punch.location || t('common.unknown') || 'Unknown'}
        </div>
      ),
    },
    {
      key: 'status',
      header: t('punches.status') || 'Status',
      accessor: (punch: AttendanceRecord) => (
        <Badge className={getStatusColor(punch.status || '')}>
          {punch.status || t('common.unknown') || 'Unknown'}
        </Badge>
      ),
    },
  ];

  // Helper functions for GenericTable
  const getItemId = (punch: AttendanceRecord) => punch.id;
  const getItemDisplayName = (punch: AttendanceRecord) => punch.employee_name || `Employee ${punch.employee_no}`;

  // Custom actions component
  const renderActions = (punch: AttendanceRecord) => (
    <div className="flex items-center justify-center gap-2">
      {onEdit && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onEdit(punch)}
          className="p-1 h-8 w-8"
          title={t('common.edit') || 'Edit'}
        >
          <Edit className="w-4 h-4" />
        </Button>
      )}
      {onDelete && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onDelete(punch.id)}
          className="p-1 h-8 w-8 text-destructive hover:text-destructive"
          title={t('common.delete') || 'Delete'}
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      )}
    </div>
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (punches.length === 0) {
    return (
      <div className="text-center py-16">
        <Clock className="mx-auto h-12 w-12 text-muted-foreground" />
        <h3 className="mt-2 text-sm font-medium text-foreground">
          {t('punches.noPunchesFound') || 'No punches found'}
        </h3>
        <p className="mt-1 text-sm text-muted-foreground">
          {t('punches.noPunchesDescription') || 'No attendance records match your current filters.'}
        </p>
      </div>
    );
  }

  if (viewMode === 'table') {
    return (
      <GenericTable
        data={punches}
        columns={columns}
        selected={selected}
        page={1}
        pageSize={punches.length}
        allChecked={allChecked}
        getItemId={getItemId}
        getItemDisplayName={getItemDisplayName}
        onSelectItem={onSelectItem || (() => {})}
        onSelectAll={onSelectAll || (() => {})}
        onEditItem={onEdit}
        onDeleteItem={onDelete}
        actions={renderActions}
        noDataMessage={t('punches.noPunchesFound') || 'No punches found'}
        isLoading={isLoading}
        onPageChange={() => {}}
        onPageSizeChange={() => {}}
      />
    );
  }

  // Grid view
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {punches.map((punch) => (
          <Card key={punch.id} className="hover:shadow-md transition-shadow border-border bg-card">
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-medium text-foreground">{punch.employee_name || t('common.unknown') || 'Unknown'}</h3>
                  <p className="text-sm text-muted-foreground">#{punch.employee_no}</p>
                </div>
                <div className="flex gap-1">
                  <Badge className={getStatusColor(punch.status || '')}>
                    {punch.status || t('common.unknown') || 'Unknown'}
                  </Badge>
                </div>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center text-sm">
                  <Clock className="w-4 h-4 mr-2 text-muted-foreground" />
                  <span className="font-medium text-foreground">{formatDateTime(punch.Ddate)}</span>
                </div>
                
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-muted-foreground">{t('punches.in') || 'In'}:</span> <span className="text-foreground">{formatTime(punch.check_in || '')}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">{t('punches.out') || 'Out'}:</span> <span className="text-foreground">{formatTime(punch.check_out || '')}</span>
                  </div>
                </div>

                {punch.break_start && punch.break_end && (
                  <div className="text-sm text-muted-foreground">
                    <span className="font-medium">{t('punches.break') || 'Break'}:</span> <span className="text-foreground">{formatTime(punch.break_start)} - {formatTime(punch.break_end)}</span>
                  </div>
                )}

                <div className="flex items-center justify-between text-sm">
                  <div>
                    <span className="text-muted-foreground">{t('punches.work') || 'Work'}:</span> <span className="text-foreground">{punch.total_work_hours || 0}h</span>
                  </div>
                  {punch.overtime_hours && punch.overtime_hours > 0 && (
                    <div className="text-primary">
                      <span className="font-medium">{t('punches.overtime') || 'OT'}:</span> {punch.overtime_hours}h
                    </div>
                  )}
                </div>

                <div className="flex items-center text-sm text-muted-foreground">
                  <MapPin className="w-4 h-4 mr-2" />
                  <span>{punch.location || t('punches.unknownLocation') || 'Unknown Location'}</span>
                </div>

                {punch.device_id && (
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Smartphone className="w-4 h-4 mr-2" />
                    <span>{t('punches.device') || 'Device'}: {punch.device_id}</span>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-border">
                {onEdit && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onEdit(punch)}
                    className="p-1 h-8 w-8"
                    title={t('common.edit') || 'Edit'}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                )}
                {onDelete && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDelete(punch.id)}
                    className="p-1 h-8 w-8 text-destructive hover:text-destructive"
                    title={t('common.delete') || 'Delete'}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
