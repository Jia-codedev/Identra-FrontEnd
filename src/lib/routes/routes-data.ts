import { 
    DashboardIcon,
    CompanyMasterIcon,
    OrganizationIcon,
    EmployeeMasterIcon,
    TAMasterIcon,
    SchedulingIcon,
    SelfServicesIcon,
    DevicesIcon,
    ReportsIcon,
    SecurityIcon,
    SettingsIcon,
    AlertsIcon,
  } from '../svg/icons';
  
  export const sidebar_primary = [
    {
      name: "Dashboard",
      icon: DashboardIcon,
      subItems: ["Self Statistics", "Team Statistics"],
      linkTo: "/dashboard"
    },
    {
      name: "Company Master",
      icon: CompanyMasterIcon,
      subItems: ["Regions", "Nationalities", "Designations", "Grades"],
      linkTo: "/company-master"
    },
    {
      name: "Organization",
      icon: OrganizationIcon,
      subItems: ["Departments", "Organization Structure", "Organization Types"],
      linkTo: "/organization"
    },
    {
      name: "Employee Master",
      icon: EmployeeMasterIcon,
      subItems: ["Employees", "Employee Groups", "Employee Types"],
      linkTo: "/employee-master"
    },
    {
      name: "TA Master",
      icon: TAMasterIcon,
      subItems: ["Reasons", "Holidays", "Schedules", "Ramadan Dates"],
      linkTo: "/ta-master"
    },
    {
      name: "Scheduling",
      icon: SchedulingIcon,
      subItems: ["Weekly Schedule", "Monthly Roster", "Employee Schedule"],
      linkTo: "/scheduling"
    },
    {
      name: "Self Services",
      icon: SelfServicesIcon,
      subItems: [
        "Workflows",
        "Approvals",
        "Manage Permissions",
        "Manage Leaves",
        "Manage Movements",
      ],
      linkTo: "/self-services"
    }
  ]
    
    export const sidebar_secondary = [
      {
        name: "Devices",
        icon: DevicesIcon,
        subItems: ["Devices Status"],
        linkTo: "/devices"
      },
      {
        name: "Reports",
        icon: ReportsIcon,
        subItems: ["Standard Reports", "Reprocess Data"],
        linkTo: "/reports"
      },
      {
        name: "Security",
        icon: SecurityIcon,
        subItems: ["Roles", "Privileges"],
        linkTo: "/security"
      },
      {
        name: "Settings",
        icon: SettingsIcon,
        subItems: [
          "Application Setting",
          "Announcements",
          "Notification",
          "License"
        ],
        linkTo: "/settings"
      },
      {
        name: "Alerts",
        icon: AlertsIcon,
        subItems: ["Email", "SMS"],
        linkTo: "/alerts"
      }
    ]
    