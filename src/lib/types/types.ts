'use client';
import { ReactNode } from 'react';

export type RegionsDataType = {
  code: string;
  description: string;
  updated: string;
};

export type NationalitiesDataType = {
  code: string;
  description: string;
  updated: string;
};

export type DesignationsDataType = {
  code: string;
  description: string;
  updated: string;
};

export type GradesDataType = {
  code: string;
  description: string;
  updated: string;
  overtime_eligible: string;
  senior_employee: string;
};

export type OrganizationTypesDataType = {
  description: string;
  updated: string;
}

export type DepartmentsDataType = {
  number: string;
  name: string;
  organization:  ReactNode;
  from_date: string;
  to_date: string;
  active:  ReactNode;
  created_by: string;
  updated: string;
}

export type EmployeeMasterEmployeesDataType = {
  number: string,
  name: string,
  join_date: string,
  manager: string,
  punch: string,
  active: string,
  designation: string,
  organization: string,
  manager_name: string,
}

export type EmployeeMasterGroupsDataType = {
  code: string;
  description: string;
  schedule:string;
  from_date:string;
  to_date:string;
  reporting_group:string;
  employee:string;
  members:string;
  updated: string;
}

export type EmployeeMasterGroupsMembersDataType = {
  number: string;
  name: string;
  designation: string;
  organization: string;
}

export type EmployeeMasterTypesDataType = {
  code: string;
  description: string;
  updated: string;
}

// TA Master Page DataTypes

export type ReasonsDataType = {
  code: string;
  description: string;
  reason_mode: string;
  promt_message: string;
  deleteable: string;
  normal_in: string;
  normal_out: string;
  web_punch: string;
  geo_fence_required: string;
  updated: string;
}

export type HolidaysDataType = {
  description: string;
  from_date: string;
  to_date: string;
  recurring: string;
  public_holiday: string;
  updated: string;
}

export type SchedulesDataType = {
  code: string;
  color: string;
  organization: string;
  in_time: string;
  out_time: string;
  inactive_date: string;
  updated: string;
}

export type RamadanDatesDataType = {
  description: string;
  from_date: string;
  to_date: string;
  updated: string;
}

// Scheduling Page DataTypes

export type WeeklyScheduleDataType = {
  from_date: string;
  to_date: string;
  sunday: string;
  monday: string;
  tuesday: string;
  wednesday: string;
  thursday: string;
  friday: string;
  saturday: string;
  attachment: string;
}

export type MonthlyRosterDataType = {
  name: string;
  number: number;
  version: string;
  status: string;
  work_hours: string;
}

export type EmployeeScheduleDataType = {
}

// Self Services Page DataTypes

export type WorkflowsDataType = {
  code: string;
  category: string;
  steps: string;
}

// Devices Page DataTypes

export type DevicesStatusDataType = {
  code: string;
  name: string;
  buildings: string;
  active: string;
}

// Security Page DataTypes

export type RolesDataType ={
  name: string;
  privileges: string;
  user: string;
  users: string;
}

export type PrivilegesDataType ={
  name: string;
  group: string;
  updated: string;
}

// Settings Page DataTypes

export type AllSettingsDataType = {
  name: string;
  value: string;
  deletable: string;
  description: string;
  updated_by: string;
  updated_date: string;
}

export type NotificationDataType = {
  description: string;
  subject: string;
  updated_by: string;
  updated_date: string;
}

// Alerts Page DataTypes

export type EmailDataType = {
  email: string;
  subject: string;
  email_body: string;
  status: string;
  cc_email: string;
  bcc_email: string;
  complete_violation: string;
  created_date: string;
  updated_date: string;
}
export type SmsDataType = {
  mobile_number: string;
  employee_id: string;
  subject: string;
  sms_content: string;
  status: string; 
  created_date: string;
  updated_date: string;
}