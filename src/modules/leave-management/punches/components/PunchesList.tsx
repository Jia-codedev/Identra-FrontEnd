"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { GenericTable, TableColumn } from "@/components/common/GenericTable";
import { Clock, MapPin, Smartphone } from "lucide-react";
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
    case 'checkin':
      return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
    case 'checkout':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
    case 'absent':
      return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
    case 'late':
      return 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400';
    case 'manual':
      return 'bg-amber-100 text-amber-800 dark:bg-amber-900/20 dark:text-amber-400';
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
  time_in?: string;
  time_out?: string;
  check_in?: string; // Backwards compatibility
  check_out?: string; // Backwards compatibility
  break_start?: string;
  break_end?: string;
  total_work_hours?: number;
  overtime_hours?: number;
  overtime?: number;
  late?: number;
  early?: number;
  status?: string;
  location?: string;
  device_id?: string;
  created_date?: string;
  last_updated_date?: string;
  comment?: string;
  remarks?: string;
  // Event transaction specific fields
  transaction_id?: number;
  transaction_time?: string;
  transaction_type?: string; // IN/OUT
  reason?: string;
  user_entry_flag?: boolean;
  geolocation?: string;
}

interface PunchesListProps {
  punches: AttendanceRecord[];
  viewMode: ViewMode;
  selected?: number[];
  allChecked?: boolean;
  onSelectItem?: (id: number) => void;
  onSelectAll?: () => void;
  isLoading?: boolean;
}

export default function PunchesList({
  punches,
  viewMode,
  selected = [],
  allChecked = false,
  onSelectItem,
  onSelectAll,
  isLoading = false,
}: PunchesListProps) {
  const { t } = useTranslations();
  const { isRTL } = useLanguage();

  // Ensure punches is always an array and filter out invalid items
  const validPunches = Array.isArray(punches) 
    ? punches.filter(punch => punch && typeof punch === 'object' && punch.id !== undefined)
    : [];

  // Define table columns for GenericTable
  const columns: TableColumn<AttendanceRecord>[] = [
    {
      key: 'employee',
      header: t('leaveManagement.punches.columns.employee') || 'Employee',
      accessor: (punch: AttendanceRecord) => (
        <div>
          <div className="font-medium text-foreground">{punch.employee_name || t('common.notAvailable') || 'Unknown'}</div>
          <div className="text-sm text-muted-foreground">#{punch.employee_no}</div>
        </div>
      ),
    },
    {
      key: 'transaction',
      header: t('leaveManagement.punches.columns.transaction') || 'Transaction',
      accessor: (punch: AttendanceRecord) => (
        <div className="text-sm">
          <div className="font-medium text-foreground">{punch.transaction_type || punch.reason || 'Unknown'}</div>
          <div className="text-xs text-muted-foreground">
            {punch.transaction_time ? formatDateTime(punch.transaction_time) : formatDateTime(punch.Ddate)}
          </div>
        </div>
      ),
    },
    {
      key: 'time',
      header: t('leaveManagement.punches.columns.time') || 'Time',
      accessor: (punch: AttendanceRecord) => (
        <div className="text-sm">
          <div className="font-medium text-foreground">
            {punch.transaction_time ? formatTime(punch.transaction_time) : 
             formatTime(punch.time_in || punch.time_out || punch.check_in || punch.check_out || '')}
          </div>
          {punch.user_entry_flag && (
            <div className="text-xs text-amber-600">Manual Entry</div>
          )}
        </div>
      ),
    },
    {
      key: 'location',
      header: t('leaveManagement.punches.columns.location') || 'Location',
      accessor: (punch: AttendanceRecord) => (
        <div className="flex items-center text-sm text-muted-foreground">
          <MapPin className="w-3 h-3 mr-1" />
          {punch.geolocation || punch.location || t('common.notAvailable') || 'Unknown'}
        </div>
      ),
    },
    {
      key: 'device',
      header: t('leaveManagement.punches.columns.device') || 'Device',
      accessor: (punch: AttendanceRecord) => (
        <div className="flex items-center text-sm text-muted-foreground">
          <Smartphone className="w-3 h-3 mr-1" />
          {punch.device_id ? `Device ${punch.device_id}` : t('common.notAvailable') || 'N/A'}
        </div>
      ),
    },
    {
      key: 'status',
      header: t('leaveManagement.punches.columns.status') || 'Status',
      accessor: (punch: AttendanceRecord) => (
        <Badge className={getStatusColor(punch.status || '')}>
          {punch.status || t('common.notAvailable') || 'Unknown'}
        </Badge>
      ),
    },
  ];

  // Helper functions for GenericTable
  const getItemId = (punch: AttendanceRecord) => punch.id;
  const getItemDisplayName = (punch: AttendanceRecord) => punch.employee_name || `Employee ${punch.employee_no}`;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (validPunches.length === 0 && !isLoading) {
    return (
      <div className="text-center py-16">
        <Clock className="mx-auto h-12 w-12 text-muted-foreground" />
        <h3 className="mt-2 text-sm font-medium text-foreground">
          {t('leaveManagement.punches.noData') || 'No punches found'}
        </h3>
        <p className="mt-1 text-sm text-muted-foreground">
          {t('common.noDataFound') || 'No attendance records match your current filters.'}
        </p>
      </div>
    );
  }

  if (viewMode === 'table') {
    return (
      <GenericTable
        data={validPunches}
        columns={columns}
        selected={selected}
        page={1}
        pageSize={validPunches.length}
        allChecked={allChecked}
        getItemId={getItemId}
        getItemDisplayName={getItemDisplayName}
        onSelectItem={onSelectItem || (() => {})}
        onSelectAll={onSelectAll || (() => {})}
        noDataMessage={t('leaveManagement.punches.noData') || 'No punches found'}
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
        {validPunches.map((punch) => (
          <Card key={punch.id} className="hover:shadow-md transition-shadow border-border bg-card">
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-medium text-foreground">{punch.employee_name || t('common.notAvailable') || 'Unknown'}</h3>
                  <p className="text-sm text-muted-foreground">#{punch.employee_no}</p>
                </div>
                <div className="flex gap-1">
                  <Badge className={getStatusColor(punch.status || '')}>
                    {punch.status || t('common.notAvailable') || 'Unknown'}
                  </Badge>
                </div>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-2 text-muted-foreground" />
                    <span className="font-medium text-foreground">
                      {punch.transaction_time ? formatDateTime(punch.transaction_time) : formatDateTime(punch.Ddate)}
                    </span>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {punch.transaction_type || punch.reason || 'Transaction'}
                  </Badge>
                </div>
                
                <div className="text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{t('common.time') || 'Time'}:</span>
                    <span className="text-foreground font-medium">
                      {punch.transaction_time ? formatTime(punch.transaction_time) : 
                       formatTime(punch.time_in || punch.time_out || punch.check_in || punch.check_out || '')}
                    </span>
                  </div>
                  {punch.user_entry_flag && (
                    <div className="flex justify-between mt-1">
                      <span className="text-muted-foreground">{t('common.type') || 'Type'}:</span>
                      <span className="text-amber-600 font-medium text-xs">{t('common.manual') || 'Manual Entry'}</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center text-sm text-muted-foreground">
                  <MapPin className="w-4 h-4 mr-2" />
                  <span>{punch.geolocation || punch.location || t('common.notAvailable') || 'Unknown Location'}</span>
                </div>

                <div className="flex items-center text-sm text-muted-foreground">
                  <Smartphone className="w-4 h-4 mr-2" />
                  <span>
                    {punch.device_id ? `${t('common.device') || 'Device'}: ${punch.device_id}` : 
                     t('common.notAvailable') || 'No device info'}
                  </span>
                </div>

                {punch.remarks && (
                  <div className="text-sm">
                    <span className="text-muted-foreground">{t('common.remarks') || 'Remarks'}:</span>
                    <div className="text-foreground text-xs mt-1 p-2 bg-muted rounded">{punch.remarks}</div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
