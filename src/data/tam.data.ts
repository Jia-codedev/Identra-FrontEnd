import { 
    ReasonsDataType, 
    HolidaysDataType,
    SchedulesDataType,
    RamadanDatesDataType
} from "@/lib/types/types";

export const reasons_columns = [
    "select",
    "code",
    "description",
    "reason_mode",
    "promt_message",
    "deleteable",
    "normal_in",
    "normal_out",
    "web_punch",
    "geo_fence_required",
    "updated",
    "actions",
];

export const holidays_columns = [
    "select",
    "description",
    "from_date",
    "to_date",
    "recurring",
    "public_holiday",
    "updated",
    "actions",
];

export const schedules_columns = [
    "select",
    "code",
    "color",
    "organization",
    "in_time",
    "out_time",
    "inactive_date",
    "updated",
    "actions",
];

export const ramadandates_columns = [
    "select",
    "description",
    "from_date",
    "to_date",
    "updated",
    "actions",
];

export const  reasons_data: ReasonsDataType[] = [
    {
        "code": "66f3cee0772a60119b73e712",
        "description": "officia do",
        "reason_mode": "OUT",
        "promt_message": "$1,195.72",
        "deleteable": "NO",
        "normal_in": "YES",
        "normal_out": "NO",
        "web_punch": "NO",
        "geo_fence_required": "YES",
        "updated": "2014-04-20"
    },
    {
        "code": "66f3cee0ba6cb9404897e58d",
        "description": "esse nulla",
        "reason_mode": "OUT",
        "promt_message": "$2,631.30",
        "deleteable": "NO",
        "normal_in": "NO",
        "normal_out": "YES",
        "web_punch": "NO",
        "geo_fence_required": "YES",
        "updated": "2020-05-09"
    },
    {
        "code": "66f3cee086f6a5d500acd90d",
        "description": "ea ex",
        "reason_mode": "OUT",
        "promt_message": "$1,292.02",
        "deleteable": "NO",
        "normal_in": "YES",
        "normal_out": "YES",
        "web_punch": "YES",
        "geo_fence_required": "NO",
        "updated": "2020-01-20"
    },
    {
        "code": "66f3cee06ed61fa08ab310f7",
        "description": "officia nulla",
        "reason_mode": "OUT",
        "promt_message": "$3,974.61",
        "deleteable": "NO",
        "normal_in": "YES",
        "normal_out": "NO",
        "web_punch": "YES",
        "geo_fence_required": "YES",
        "updated": "2022-09-22"
    },
    {
        "code": "66f3cee0bda6ebbb34dda622",
        "description": "duis ad",
        "reason_mode": "IN",
        "promt_message": "$2,383.50",
        "deleteable": "NO",
        "normal_in": "NO",
        "normal_out": "NO",
        "web_punch": "NO",
        "geo_fence_required": "YES",
        "updated": "2014-01-04"
    },
    {
        "code": "66f3cee0bd590844899a2c3d",
        "description": "esse officia",
        "reason_mode": "OUT",
        "promt_message": "$2,381.74",
        "deleteable": "NO",
        "normal_in": "YES",
        "normal_out": "YES",
        "web_punch": "YES",
        "geo_fence_required": "YES",
        "updated": "2014-08-10"
    },
    {
        "code": "66f3cee095407b68063f40cf",
        "description": "nulla duis",
        "reason_mode": "IN",
        "promt_message": "$2,286.40",
        "deleteable": "NO",
        "normal_in": "NO",
        "normal_out": "YES",
        "web_punch": "NO",
        "geo_fence_required": "YES",
        "updated": "2019-03-06"
    },
    {
        "code": "66f3cee090e1d5bf9df052c7",
        "description": "occaecat ullamco",
        "reason_mode": "IN",
        "promt_message": "$2,548.60",
        "deleteable": "NO",
        "normal_in": "NO",
        "normal_out": "NO",
        "web_punch": "YES",
        "geo_fence_required": "NO",
        "updated": "2014-03-17"
    },
    {
        "code": "66f3cee0285e948668d6eb05",
        "description": "reprehenderit veniam",
        "reason_mode": "IN",
        "promt_message": "$3,333.79",
        "deleteable": "NO",
        "normal_in": "NO",
        "normal_out": "YES",
        "web_punch": "YES",
        "geo_fence_required": "NO",
        "updated": "2018-06-27"
    },
    {
        "code": "66f3cee051ef530928686fe6",
        "description": "dolor velit",
        "reason_mode": "IN",
        "promt_message": "$1,978.78",
        "deleteable": "NO",
        "normal_in": "YES",
        "normal_out": "NO",
        "web_punch": "NO",
        "geo_fence_required": "NO",
        "updated": "2014-03-14"
    }
];

export const holidays_data: HolidaysDataType[] = [

    {
        "description": "mollit non",
        "from_date": "2023-03-01",
        "to_date": "2024-06-27",
        "recurring": "NO",
        "public_holiday": "NO",
        "updated": "2024-07-30"
    },
    {
        "description": "laboris cupidatat",
        "from_date": "2023-08-15",
        "to_date": "2024-01-19",
        "recurring": "NO",
        "public_holiday": "NO",
        "updated": "2024-01-27"
    },
    {
        "description": "tempor quis",
        "from_date": "2024-02-02",
        "to_date": "2024-06-13",
        "recurring": "NO",
        "public_holiday": "NO",
        "updated": "2024-08-21"
    },
    {
        "description": "cupidatat aute",
        "from_date": "2023-03-12",
        "to_date": "2024-04-29",
        "recurring": "NO",
        "public_holiday": "NO",
        "updated": "2024-02-29"
    },
    {
        "description": "in culpa",
        "from_date": "2023-10-22",
        "to_date": "2024-02-22",
        "recurring": "NO",
        "public_holiday": "NO",
        "updated": "2024-07-29"
    },
    {
        "description": "officia incididunt",
        "from_date": "2023-12-26",
        "to_date": "2024-09-15",
        "recurring": "NO",
        "public_holiday": "YES",
        "updated": "2024-03-16"
    },
    {
        "description": "do est",
        "from_date": "2023-03-30",
        "to_date": "2024-04-10",
        "recurring": "NO",
        "public_holiday": "YES",
        "updated": "2024-05-17"
    },
    {
        "description": "irure duis",
        "from_date": "2024-01-15",
        "to_date": "2024-03-09",
        "recurring": "NO",
        "public_holiday": "NO",
        "updated": "2024-07-14"
    }
];

export const schedules_data: SchedulesDataType[] = [
    {
        "code": "Normal",
        "color": "#0E6ECF",
        "organization": "Org Demo",
        "in_time": "07:30",
        "out_time": "15:30",
        "inactive_date": "01-05-2024",
        "updated": "01-09-2024",
    },
    {
        "code": "Day",
        "color": "#00C875",
        "organization": "Org Demo",
        "in_time": "06:00",
        "out_time": "13:00",
        "inactive_date": "01-04-2024",
        "updated": "01-05-2024",
    },
    {
        "code": "Night",
        "color": "#DF2F4A",
        "organization": "Org Demo",
        "in_time": "22:00",
        "out_time": "06:00",
        "inactive_date": "01-03-2024",
        "updated": "31-05-2024",
    },
    {
        "code": "Friday",
        "color": "#9D50DD",
        "organization": "Org Demo",
        "in_time": "07:30",
        "out_time": "12:00",
        "inactive_date": "01-05-2024",
        "updated": "01-09-2024",
    }
];

export const ramadandates_data: RamadanDatesDataType[] = [
    {
        "description": "Ramadan 2024",
        "from_date": "01-05-2024",
        "to_date": "31-05-2024",
        "updated": "01-05-2024"
    },
];