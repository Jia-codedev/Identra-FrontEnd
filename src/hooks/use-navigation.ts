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
  FiCpu,
  FiShield,
  FiSettings,
  FiAlertCircle,
  FiHelpCircle,
  FiBarChart2,
  FiLayers,
  FiMapPin,
} from "react-icons/fi";

export const useNavigation = () => {
  const { t } = useTranslations();
  // Main navigation menu descriptor
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
      icon: FiBarChart2,
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
      icon: FiLayers,
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
          labelKey: "mainMenu.organization.items.organizations",
          routeKey: "mainMenu.organization.items.organizations",
        },
      ],
      icon: FiMapPin,
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
          labelKey: "mainMenu.selfServices.items.leaveTypes",
          routeKey: "navigation.leaveTypes",
        },
        {
          labelKey: "mainMenu.selfServices.items.permissionTypes",
          routeKey: "navigation.permissionTypes",
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
      ],
      icon: FiClock,
    },
  ];

  const SIDEBAR_MENUS = [
    {
      id: "devices-and-infrastructure",
      titleKey: "mainMenu.devicesAndInfrastructure.title",
      items: [
        {
          labelKey:
            "mainMenu.devicesAndInfrastructure.items.biometricTerminals",
          routeKey: "mainMenu.devicesAndInfrastructure.biometricTerminals",
        },
        {
          labelKey: "mainMenu.devicesAndInfrastructure.items.accessZones",
          routeKey: "mainMenu.devicesAndInfrastructure.accessZones",
        },
        {
          labelKey: "mainMenu.devicesAndInfrastructure.items.buildings",
          routeKey: "mainMenu.devicesAndInfrastructure.buildings",
        },
      ],
      icon: FiCpu,
    },
    {
      id: "user-security-settings",
      titleKey: "mainMenu.userSecuritySettings.title",
      items: [
        {
          labelKey: "mainMenu.userSecuritySettings.items.rolesManagement",
          routeKey: "mainMenu.userSecuritySettings.rolesManagement",
        },
        {
          labelKey: "mainMenu.userSecuritySettings.items.accessPermissions",
          routeKey: "mainMenu.userSecuritySettings.accessPermissions",
        },
        {
          labelKey: "mainMenu.userSecuritySettings.items.sessionMonitor",
          routeKey: "mainMenu.userSecuritySettings.sessionMonitor",
        },
        {
          labelKey: "mainMenu.userSecuritySettings.items.activitySummary",
          routeKey: "mainMenu.userSecuritySettings.activitySummary",
        },
      ],
      icon: FiShield,
    },
    {
      id: "application-settings",
      titleKey: "mainMenu.applicationSettings.title",
      items: [
        {
          labelKey: "mainMenu.applicationSettings.items.appSettings",
          routeKey: "mainMenu.applicationSettings.appSettings",
        },
        {
          labelKey: "mainMenu.applicationSettings.items.appConfiguration",
          routeKey: "mainMenu.applicationSettings.appConfiguration",
        },
        {
          labelKey: "mainMenu.applicationSettings.items.alertPreferences",
          routeKey: "mainMenu.applicationSettings.alertPreferences",
        },
        {
          labelKey: "mainMenu.applicationSettings.items.auditTrail",
          routeKey: "mainMenu.applicationSettings.auditTrail",
        },
      ],
      icon: FiSettings,
    },
    {
      id: "alert-centre",
      titleKey: "mainMenu.alertCentre.title",
      items: [
        {
          labelKey: "mainMenu.alertCentre.items.emailAlerts",
          routeKey: "mainMenu.alertCentre.emailAlerts",
        },
        {
          labelKey: "mainMenu.alertCentre.items.smsAlerts",
          routeKey: "mainMenu.alertCentre.smsAlerts",
        },
        {
          labelKey: "mainMenu.alertCentre.items.bulletins",
          routeKey: "mainMenu.alertCentre.bulletins",
        },
      ],
      icon: FiAlertCircle,
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

  // Sidebar footer descriptor
  const SIDEBAR_FOOTER = [
    {
      id: "support-centre",
      titleKey: "mainMenu.supportCentre.title",
      items: [
        {
          labelKey: "mainMenu.supportCentre.items.faqs",
          routeKey: "mainMenu.supportCentre.faqs",
        },
        {
          labelKey: "mainMenu.supportCentre.items.userManual",
          routeKey: "mainMenu.supportCentre.userManual",
        },
        {
          labelKey: "mainMenu.supportCentre.items.licenseManagement",
          routeKey: "mainMenu.supportCentre.licenseManagement",
        },
      ],
      icon: FiHelpCircle,
    },
  ];

  // Helper to get a readable label from translation or fallback
  const getLabel = (titleKey: string, fallback: string) => {
    const val = t(titleKey);
    if (val && !val.includes(".")) return val;
    const mm = t(`mainMenu.${fallback}.title`);
    if (mm && !mm.includes(".")) return mm;
    return fallback.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
  };

  const getItemLabel = (labelKey: string) => {
    const label = t(labelKey);
    if (label && !label.includes(".")) return label;
    return t(labelKey.replace(/^mainMenu\./, ""));
  };

  const NAV_LINKS = MENU_DESCRIPTOR.map((g) => ({
    id: g.id,
    label: getLabel(g.titleKey, g.id),
    icon: g.icon,
    href:
      g.id === "workforce-analytics"
        ? getRouteFromKey("mainMenu.workforceAnalytics.myInsights")
        : undefined,
    secondary: g.items
      .map((it) => {
        const finalLabel = getItemLabel(it.labelKey);
        const keyForRoute = it.routeKey ?? it.labelKey;
        return {
          label: finalLabel,
          labelKey: it.labelKey,
          href: getRouteFromKey(keyForRoute),
        };
      })
      .filter((s) => !!s.label),
  }));
  const SIDEBAR_LINKS = SIDEBAR_MENUS.map((g) => ({
    id: g.id,
    label: getLabel(g.titleKey, g.id),
    icon: g.icon,
    secondary: g.items
      .map((it) => {
        const finalLabel = getItemLabel(it.labelKey);
        const keyForRoute = it.routeKey ?? it.labelKey;
        return {
          label: finalLabel,
          labelKey: it.labelKey,
          href: getRouteFromKey(keyForRoute),
        };
      })
      .filter((s) => !!s.label),
  }));

  const FOOTER_LINKS = SIDEBAR_FOOTER.map((g) => ({
    id: g.id,
    label: getLabel(g.titleKey, g.id),
    icon: g.icon,
    secondary: g.items
      .map((it) => {
        const finalLabel = getItemLabel(it.labelKey);
        const keyForRoute = it.routeKey ?? it.labelKey;
        return {
          label: finalLabel,
          labelKey: it.labelKey,
          href: getRouteFromKey(keyForRoute),
        };
      })
      .filter((s) => !!s.label),
  }));

  const PROFILE_LINKS = [
    {
      label: t("mainMenu.profileIcon.items.myAccount"),
      href: "/profile/my-account",
    },
    {
      label: t("mainMenu.profileIcon.items.themeLayout"),
      href: "/theme-layout",
    },
    { label: t("settings.updatePassword"), href: "/updated-password" },
    { label: t("common.logout"), href: "/logout", className: "text-red-600" },
  ];

  return {
    NAV_LINKS,
    PROFILE_LINKS,
    SIDEBAR_LINKS,
    FOOTER_LINKS,
  };
};
