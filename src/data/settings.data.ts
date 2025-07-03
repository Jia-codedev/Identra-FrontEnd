import { 
    AllSettingsDataType,
    NotificationDataType
} from "@/lib/types/types";

export const settings_columns = [
    "select",
    "name",
    "value",
    "deletable",
    "description",
    "updated_by",
    "updated_date",
    "actions",
];

export const notification_columns = [
    "select",
    "description",
    "description(العربية)",
    "subject",
    "updated_by",
    "updated_date",
    "actions",
];


export const  settings_data: AllSettingsDataType[] = [
    {
        "name": "TIME_ZONE",
        "value": "4",
        "deletable": "🗴",
        "description": "",
        "updated_by": "ADMIN",
        "updated_date": "21-11-2013"
    },
    {
        "name": "SHOW_ABSENT",
        "value": "FALSE",
        "deletable": "🗴",
        "description": "If SHOW_ABSENT is false then system will not show ABSENT for OPEN SHIFT SCHEDULE.",
        "updated_by": "ADMIN",
        "updated_date": "31-03-2014"
    },
    {
        "name": "MIN_PUNCH_DURATION",
        "value": "1",
        "deletable": "🗴",
        "description": "No.of minutes between consecutive punches for the same employee to count as duplicate",
        "updated_by": "ADMIN",
        "updated_date": "21-11-2013"
    },
    {
        "name": "MIN_PERM_HOURS_PER_DAY",
        "value": "30",
        "deletable": "🗴",
        "description": "MAX_PERM_HOURS_PER_DAY",
        "updated_by": "ADMIN",
        "updated_date": "12-03-2017"
    },
    {
        "name": "MIN_OT_PER_DAY",
        "value": "30",
        "deletable": "🗴",
        "description": "Minimum overtime work hours per day to get overtime",
        "updated_by": "ADMIN",
        "updated_date": "12-03-2017"
    },
];

export const notification_data: NotificationDataType[] = [
    {
        "description" : "Dear {EmployeeName},You were recorded in TIMECHECK attendance system as early out on {date} by {time} minutes, please Click here to take necessary action for the same.Regards,HC Department Note: This is an automated email notification generated from the system. Please do not respond to this email address. If further assistance is required, please contact HC Department",
        "subject": "TAMS - Early Violation Notification",
        "updated_by": "ADMIN",
        "updated_date": "10-08-2022",
    },
    {
        "description" : "Dear {EmployeeName}, You were recorded in TIMECHECK attendance system as late in on {date} by {time} minutes, please Click here to take necessary action for the same. Regards, HC Department Note: This is an automated email notification generated from the system. Please do not respond to this email address. If further assistance is required, please contact HC Department .",
        "subject": "TAMS - Late Violation Notification",
        "updated_by": "ADMIN",
        "updated_date": "10-08-2022",
    },
];