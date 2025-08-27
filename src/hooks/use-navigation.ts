"use client";

import { useTranslations } from "./use-translations";
import { getRouteFromKey } from "@/utils/routeFromKey";
import {
  FiHome,
  FiDatabase,
  FiMap,
  FiUsers,
  FiCalendar,
  FiBriefcase,
  FiClock,
} from "react-icons/fi";

export const useNavigation = () => {
  const { t } = useTranslations();
  // Descriptor maps main-menu groups -> their navigation keys and icons
  const MENU_DESCRIPTOR = [
    {
      id: "workforce-analytics",
      titleKey: "mainMenu.workforceAnalytics.title",
      items: [
        {
          labelKey: "mainMenu.workforceAnalytics.items.myInsights",
          routeKey: "mainMenu.workforceAnalytics.myInsights",
        },
        {
          labelKey: "mainMenu.workforceAnalytics.items.teamInsights",
          routeKey: "mainMenu.workforceAnalytics.teamInsights",
        },
        {
          labelKey: "mainMenu.workforceAnalytics.items.activityLog",
          routeKey: "mainMenu.workforceAnalytics.activityLog",
        },
        {
          labelKey: "mainMenu.workforceAnalytics.items.productivityMetrics",
          routeKey: "mainMenu.workforceAnalytics.productivityMetrics",
        },
        {
          labelKey: "mainMenu.workforceAnalytics.items.geoAnalytics",
          routeKey: "mainMenu.workforceAnalytics.geoTracking",
        },
      ],
      icon: FiHome,
    },
    {
      id: "enterprise-settings",
      titleKey: "mainMenu.enterpriseSettings.title",
      items: [
        {
          labelKey: "mainMenu.enterpriseSettings.items.siteManagements",
          routeKey: "mainMenu.enterpriseSettings.siteManagements",
        },
        {
          labelKey: "mainMenu.enterpriseSettings.items.jobLevels",
          routeKey: "mainMenu.enterpriseSettings.jobLevels",
        },
        {
          labelKey: "mainMenu.enterpriseSettings.items.jobTitles",
          routeKey: "mainMenu.enterpriseSettings.jobTitles",
        },
        {
          labelKey: "mainMenu.enterpriseSettings.items.citizenshipInfo",
          routeKey: "mainMenu.enterpriseSettings.citizenshipInfo",
        },
      ],
      icon: FiDatabase,
    },
    {
      id: "organization",
      titleKey: "mainMenu.organization.title",
      items: [
        {
          labelKey: "mainMenu.organization.items.organizationType",
          routeKey: "mainMenu.organization.items.organizationType",
        },
        {
          labelKey: "mainMenu.organization.items.orgChart",
          routeKey: "mainMenu.organization.items.orgChart",
        },
        {
          labelKey: "mainMenu.organization.items.divisions",
          routeKey: "mainMenu.organization.items.divisions",
        },
      ],
      icon: FiMap,
    },
    {
      id: "employee-management",
      titleKey: "mainMenu.employeeManagement.title",
      items: [
        {
          labelKey: "mainMenu.employeeManagement.items.employeeDirectory",
          routeKey: "mainMenu.employeeManagement.employeeDirectory",
        },
        {
          labelKey: "mainMenu.employeeManagement.items.contractTypes",
          routeKey: "mainMenu.employeeManagement.contractTypes",
        },
        {
          labelKey: "mainMenu.employeeManagement.items.teamGrouping",
          routeKey: "mainMenu.employeeManagement.teamGrouping",
        },
      ],
      icon: FiUsers,
    },
    {
      id: "roster-management",
      titleKey: "mainMenu.rosterManagement.title",
      items: [
        {
          labelKey: "mainMenu.rosterManagement.items.reasons",
          routeKey: "mainMenu.rosterManagement.reasons",
        },
        {
          labelKey: "mainMenu.rosterManagement.items.holidayCalendar",
          routeKey: "mainMenu.rosterManagement.holidayCalendar",
        },
        {
          labelKey: "mainMenu.rosterManagement.items.ramadanHours",
          routeKey: "mainMenu.rosterManagement.ramadanHours",
        },
        {
          labelKey: "mainMenu.rosterManagement.items.shiftPatterns",
          routeKey: "mainMenu.rosterManagement.shiftPatterns",
        },
        {
          labelKey: "mainMenu.rosterManagement.items.monthlyRoster",
          routeKey: "mainMenu.rosterManagement.monthlyRoster",
        },
        {
          labelKey: "mainMenu.rosterManagement.items.weeklyRoster",
          routeKey: "mainMenu.rosterManagement.weeklyRoster",
        },
      ],
      icon: FiCalendar,
    },
    {
      id: "self-services",
      titleKey: "mainMenu.selfServices.title",
      items: [
        {
          labelKey: "mainMenu.selfServices.items.leaveManagement",
          routeKey: "navigation.leaves",
        },
        {
          labelKey: "mainMenu.selfServices.items.permissionManagement",
          routeKey: "navigation.permissions",
        },
        {
          labelKey: "mainMenu.selfServices.items.attendanceLogs",
          routeKey: "navigation.punches",
        },
        {
          labelKey: "mainMenu.selfServices.items.workflowAutomation",
          routeKey: "navigation.workFlow",
        },
        {
          labelKey: "mainMenu.selfServices.items.payrollLocking",
          routeKey: "navigation.payrollLocking",
        },
      ],
      icon: FiClock,
    },
    {
      id: "workforce",
      titleKey: "common.workforce",
      items: [
        { labelKey: "navigation.approvals", routeKey: "navigation.approvals" },
        { labelKey: "navigation.reports", routeKey: "navigation.reports" },
      ],
      icon: FiBriefcase,
    },
  ];

  const NAV_LINKS = MENU_DESCRIPTOR.map((g) => ({
    id: g.id,
    label: ((): string => {
      const val = t(g.titleKey);
      if (val && !val.includes(".")) return val; 
      const mm = t(`mainMenu.${g.id}.title`);
      if (mm && !mm.includes(".")) return mm;
      return g.id.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
    })(),
    icon: g.icon,
    secondary: g.items
      .map((it) => {
        const label = t(it.labelKey);
        const finalLabel =
          label && !label.includes(".")
            ? label
            : t(it.labelKey.replace(/^mainMenu\./, ""));
        // prefer an explicit routeKey when available to avoid collisions
        const keyForRoute = it.routeKey ?? it.labelKey;
        return { label: finalLabel, href: getRouteFromKey(keyForRoute) };
      })
      .filter((s) => !!s.label),
  }));

  const PROFILE_LINKS = [
    {
      label: t("mainMenu.profileIcon.items.myAccount"),
      href: "/profile/my-account",
    },
    { label: t("common.security"), href: "/user-security-settings" },
    { label: t("common.language"), href: "/language" },
    {
      label: t("mainMenu.profileIcon.items.themeLayout"),
      href: "/theme-layout",
    },
    { label: t("mainMenu.supportCentre.items.faqs"), href: "/support/faqs" },
    { label: t("common.logout"), href: "/", className: "text-red-600" },
  ];

  // const SETTINGS_LINKS = [
  //   { label: t("settings.applicationSettings"), href: "/settings/app-settings" },
  //   {
  //     label: t("settings.notificationSettings"),
  //     href: "/settings/alert-preferences",
  //   },
  //   { label: t("navigation.organizations"), href: "/settings/business-entity" },
  //   { label: t("settings.viewEmployeeLogs"), href: "/logs/employee-audit-trail" },
  //   { label: t("settings.viewLogs"), href: "/logs/system-logs" },
  //   { label: t("settings.announcement"), href: "/bulletins" },
  //   { label: t("settings.license"), href: "/license-management" },
  // ];

  return {
    NAV_LINKS,
    PROFILE_LINKS,
    // SETTINGS_LINKS,
  };
};
