import { 
    EmailDataType, 
    SmsDataType,
} from "@/lib/types/types";

export const email_columns = [
    "select",
    "email",
    "subject",
    "email_body",
    "status",
    "CC_email",
    "BCC_email",
    "complete_violation",
    "created_date",
    "updated_date"
];

export const sms_columns = [
    "select",
    "mobile_number",
    "employee_id",
    "subject",
    "sms_content",
    "status",
    "created_date",
    "updated_date"
];


export const  email_data: EmailDataType[] = [
    {
        "email" : "ADMIN@timecheck.biz",
        "subject": "Permission Notification",
        "email_body": "Dear Employee102,Employee58 has applied in TIMECHECK attendance system for manual movement for 18-07-2024 please Click here to take necessary action for the same.Regards,HR DepartmentTime And Attendance System",
        "status": "Sent",
        "cc_email": "",
        "bcc_email": "",
        "complete_violation": "<i class='icon-remove'></i>",
        "created_date" : "03-09-2024 08:42",
        "updated_date": "03-09-2024 08:42",
    },
    {
        "email" : "ADMIN@timecheck.biz",
        "subject": "Permission Notification",
        "email_body": "Dear ADMIN, ADMIN has applied in TIMECHECK attendance system for  Permission for 06-09-2024, please <a href='https://ta.dgs.gov.ae/Approval/Pending-Approval' target='_blank'>Click here</a> to take necessary action for the same.  Regards, HR Department Time And Attendance System Note: This is an automated email notification generated from the system. Please do not respond to this email address. If further assistance is required, please contact HR Department .",
        "status": "Unsent",
        "cc_email": "",
        "bcc_email": "",
        "complete_violation": "<i class='icon-remove'></i>",
        "created_date" : "05-09-2024 05:23",
        "updated_date": "05-09-2024 05:23",
    },
    {
        "email" : "Employee79@timecheck.biz",
        "subject": "Permission Notification",
        "email_body": "Dear Employee79, Employee56 has applied in TIMECHECK attendance system for  Permission for 21-09-2024, please <a href='https://ta.dgs.gov.ae/Approval/Pending-Approval' target='_blank'>Click here</a> to take necessary action for the same.  Regards, HR Department Time And Attendance System Note: This is an automated email notification generated from the system. Please do not respond to this email address. If further assistance is required, please contact HR Department .",
        "status": "Unsent",
        "cc_email": "",
        "bcc_email": "",
        "complete_violation": "<i class='icon-remove'></i>",
        "created_date" : "16-09-2024 11:43",
        "updated_date": "16-09-2024 11:43",
    },
    {
        "email" : "Employee56@timecheck.biz",
        "subject": "Permission Notification",
        "email_body": "Dear Employee56,\nYour Permission request for 21-09-2024 has been approved by ADMIN.\nRegards,\nHC Department\nNote: This is an automated email notification generated from the system. Please do not respond to this email address. If further assistance is required, please contact HC Department",
        "status": "Unsent",
        "cc_email": "hr.dgs@dgs.gov.ae",
        "bcc_email": "",
        "complete_violation": "<i class='icon-remove'></i>",
        "created_date" : "19-09-2024 10:43",
        "updated_date": "19-09-2024 10:43",
    },
];

export const sms_data: SmsDataType[] = [
  {
    "mobile_number": "0509152184",
    "employee_id": "ODGS37",
    "subject": "Employee Attendance Update",
    "sms_content": "Hello Admin,<br>Employee Employee37 (ODGS37) has just clocked in at [Time] on [Date]. Please review the attendance records for more details.",
    "status": "Delivered",
    "created_date": "20-09-2024 10:43",
    "updated_date": "20-09-2024 10:43",
  }
];
