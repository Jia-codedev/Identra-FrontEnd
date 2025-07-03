import { 
    WeeklyScheduleDataType, 
    MonthlyRosterDataType,
    EmployeeScheduleDataType,
} from "@/lib/types/types";

export const weeklyschedule_columns = [
    "select",
    "from_date",
    "to_date",
    "sunday",
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
    "attachment",
    "actions",
];

export const  weeklyschedule_data: WeeklyScheduleDataType[] = [
   {
    "from_date": "26-07-2024",
    "to_date": "26-07-2024",
    "sunday": "Normal",
    "monday": "Normal",
    "tuesday": "Normal",
    "wednesday": "Normal",
    "thursday": "Normal",
    "friday": "Normal",
    "saturday": "Normal",
    "attachment": "Download",
   },
   {
    "from_date": "25-07-2024",
    "to_date": "25-07-2024",
    "sunday": "Normal",
    "monday": "Normal",
    "tuesday": "Normal",
    "wednesday": "Normal",
    "thursday": "Normal",
    "friday": "Normal",
    "saturday": "Normal",
    "attachment": "Download",
   },
   {
    "from_date": "24-07-2024",
    "to_date": "24-07-2024",
    "sunday": "Friday",
    "monday": "Friday",
    "tuesday": "Friday",
    "wednesday": "Friday",
    "thursday": "Friday",
    "friday": "🗴",
    "saturday": "🗴",
    "attachment": "Download",
   },
   {
    "from_date": "23-07-2024",
    "to_date": "23-07-2024",
    "sunday": "Normal",
    "monday": "Normal",
    "tuesday": "Normal",
    "wednesday": "Normal",
    "thursday": "Normal",
    "friday": "Normal",
    "saturday": "Normal",
    "attachment": "Download",
   },
];


export const monthlyRoaster_data = [
  {
    category: "ADMIN - ADMIN",
    subcategory: "A/ Executive Director Corporate Support Services Centre - A/ Executive Director Corporate Support Services Centre",
    rows: [
      {
        name: "Executive",
        number: "DGS78",
        version: "Normal",
        status: "Locked",
        schedule: ["Nor", "Nor", "Nor", "Nor", "Nig", "Nor", "Day", "Nor", "Nor", "Nor", "Nor", "Nor", "Nor", "Nor", "Nor"],
        work_hours: "170:00",
      },
    ],
  },
  {
    category: "ADMIN - ADMIN",
    subcategory: "Advisor - Advisor",
    rows: [
      {
        name: "Employee 61",
        number: "DGS131	",
        version: "Normal",
        status: "Locked",
        schedule: ["Nor", "Nor", "Nor", "Nor", "Nig", "Nor", "Day", "Nor", "Nor", "Nor", "Nor", "Nor", "Nor", "Nor", "Nor"],
        work_hours: "170:00",
      },
      {
        name: "Chairman",
        number: "ODGS1",
        version: "Normal",
        status: "Locked",
        schedule: ["Nor", "Nor", "Nor", "Nig", "3", "Day", "Nor", "Nor", "Nor", "Nor", "Nor", "Nor", "Nor", "Nor", "Nor","Nor", "Nor", "Nor", "Nig", "Nor", "Day", "Nor", "Nor", "Nor", "Nor", "Nor", "Nor", "Nor", "Nor", "Nor"],
        work_hours: "189:30",
      },
    ],
  },
];


  