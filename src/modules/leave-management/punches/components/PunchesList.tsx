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

const getReasonColor = (reason: string) => {
  switch (reason?.toUpperCase()) {
    case 'IN':
      return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
    case 'OUT':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
    case 'BREAK_START':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
    case 'BREAK_END':
      return 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400';
    default:
      return 'bg-muted text-muted-foreground';
  }
};

const formatReason = (reason: string) => {
  switch (reason?.toUpperCase()) {
    case 'IN':
      return 'Check In';
    case 'OUT':
      return 'Check Out';
    case 'BREAK_START':
      return 'Break Start';
    case 'BREAK_END':
      return 'Break End';
    default:
      return reason || 'Unknown';
  }
};

type ViewMode = 'table' | 'grid';

interface EmployeeEventTransaction {
  transaction_id: number;
  employee_id: number;
  transaction_time: string;
  reason: string;
  remarks?: string | null;
  device_id?: number | null;
  user_entry_flag: boolean;
  created_id: number;
  created_date: string;
  last_updated_id: number;
  last_updated_date: string;
  geolocation?: string | null;
  employee_master?: {
    emp_no: string;
    firstname_eng: string;
    lastname_eng: string;
    firstname_arb: string;
    lastname_arb: string;
  };
}

interface PunchesListProps {
  punches: EmployeeEventTransaction[];
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

  // Ensure we have valid data and filter out any invalid entries
  const validPunches = Array.isArray(punches) ? 
    punches.filter(punch => punch && (punch.transaction_id || punch.employee_id)) : [];

  // Define table columns for GenericTable
  const columns: TableColumn<EmployeeEventTransaction>[] = [
    {
      key: 'employee',
      header: t('employee.name') || t('employee.employeeName') || 'Employee',
      accessor: (punch: EmployeeEventTransaction, isRTL?: boolean) => {
        const employeeName = punch.employee_master 
          ? `${punch.employee_master.firstname_eng} ${punch.employee_master.lastname_eng}`.trim()
          : 'Unknown Employee';
        const empNo = punch.employee_master?.emp_no || punch.employee_id.toString();
        
        return (
          <div>
            <div className="font-medium text-foreground">{employeeName}</div>
            <div className="text-sm text-muted-foreground">#{empNo}</div>
          </div>
        );
      },
    },
    {
      key: 'date',
      header: t('common.date') || 'Date',
      accessor: (punch: EmployeeEventTransaction, isRTL?: boolean) => (
        <div className="text-sm">
          <div className="font-medium text-foreground">{formatDateTime(punch.transaction_time)}</div>
        </div>
      ),
    },
    {
      key: 'reason',
      header: t('common.type') || 'Type',
      accessor: (punch: EmployeeEventTransaction, isRTL?: boolean) => (
        <Badge className={getReasonColor(punch.reason)}>
          {formatReason(punch.reason)}
        </Badge>
      ),
    },
    {
      key: 'time',
      header: t('common.time') || 'Time',
      accessor: (punch: EmployeeEventTransaction, isRTL?: boolean) => (
        <div className="text-sm text-muted-foreground">
          {formatTime(punch.transaction_time)}
        </div>
      ),
    },
    {
      key: 'device',
      header: t('common.device') || 'Device',
      accessor: (punch: EmployeeEventTransaction, isRTL?: boolean) => (
        <div className="flex items-center text-sm text-muted-foreground">
          <Smartphone className="w-3 h-3 mr-1" />
          {punch.device_id || (punch.user_entry_flag ? 'Manual Entry' : 'Unknown')}
        </div>
      ),
    },
    {
      key: 'location',
      header: t('common.location') || 'Location',
      accessor: (punch: EmployeeEventTransaction, isRTL?: boolean) => (
        <div className="flex items-center text-sm text-muted-foreground">
          <MapPin className="w-3 h-3 mr-1" />
          {punch.geolocation || t('common.notAvailable') || 'Unknown'}
        </div>
      ),
    },
  ];   
  const getItemId = (punch: EmployeeEventTransaction) => {
    const id = punch?.transaction_id || punch?.employee_id;
    return typeof id === 'number' ? id : parseInt(String(id)) || 0;
  };
  
  const getItemDisplayName = (punch: EmployeeEventTransaction, isRTL?: boolean) => {
    const employeeName = punch.employee_master 
      ? `${punch.employee_master.firstname_eng} ${punch.employee_master.lastname_eng}`.trim()
      : `Employee ${punch.employee_id}`;
    return employeeName;
  };

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
          {t('attendance.noRecords') || t('common.noResults') || 'No punches found'}
        </h3>
        <p className="mt-1 text-sm text-muted-foreground">
          {t('attendance.noRecordsDesc') || t('common.noDataFound') || 'No attendance records match your current filters.'}
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
        noDataMessage={t('attendance.noRecords') || t('common.noResults') || 'No punches found'}
        isLoading={isLoading}
        onPageChange={() => {}}
        showActions={false}
        onPageSizeChange={() => {}}
      />
    );
  }

  // Grid view
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {validPunches.map((punch) => {
          const punchId = getItemId(punch);
          const employeeName = punch.employee_master 
            ? `${punch.employee_master.firstname_eng} ${punch.employee_master.lastname_eng}`.trim()
            : 'Unknown Employee';
          const empNo = punch.employee_master?.emp_no || punch.employee_id.toString();
          
          return (
            <Card key={`event-transaction-${punchId}-${punch.transaction_time}`} className="hover:shadow-md transition-shadow border-border bg-card">
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-medium text-foreground">{employeeName}</h3>
                    <p className="text-sm text-muted-foreground">#{empNo}</p>
                  </div>
                  <div className="flex gap-1">
                    <Badge className={getReasonColor(punch.reason)}>
                      {formatReason(punch.reason)}
                    </Badge>
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm">
                    <Clock className="w-4 h-4 mr-2 text-muted-foreground" />
                    <span className="font-medium text-foreground">{formatDateTime(punch.transaction_time)}</span>
                  </div>
                  
                  <div className="grid grid-cols-1 gap-2 text-sm">
                    <div>
                      <span className="text-muted-foreground">{t('common.time') || 'Time'}:</span> 
                      <span className="text-foreground ml-1">{formatTime(punch.transaction_time)}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">{t('common.type') || 'Type'}:</span> 
                      <span className="text-foreground ml-1">{formatReason(punch.reason)}</span>
                    </div>
                  </div>

                  {punch.remarks && (
                    <div className="text-sm text-muted-foreground">
                      <span className="font-medium">{t('common.remarks') || 'Remarks'}:</span> 
                      <span className="text-foreground ml-1">{punch.remarks}</span>
                    </div>
                  )}

                  <div className="flex items-center text-sm text-muted-foreground">
                    <Smartphone className="w-4 h-4 mr-2" />
                    <span>{punch.device_id || (punch.user_entry_flag ? 'Manual Entry' : 'System')}</span>
                  </div>

                  {punch.geolocation && (
                    <div className="flex items-center text-sm text-muted-foreground">
                      <MapPin className="w-4 h-4 mr-2" />
                      <span>{punch.geolocation}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
