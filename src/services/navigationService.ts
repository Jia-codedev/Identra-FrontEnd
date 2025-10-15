import React from "react";
import apiClient from "@/configs/api/Axios";
import {
  FiBarChart2,
  FiLayers,
  FiMapPin,
  FiUsers,
  FiCalendar,
  FiClock,
  FiCpu,
  FiShield,
  FiSettings,
  FiAlertCircle,
  FiBriefcase,
  FiHelpCircle,
  FiUser,
} from "react-icons/fi";

export interface NavigationModule {
  module_id: number;
  module_name: string;
  module_translation_key: string;
  module_route: string;
  module_icon: string;
  display_order: number;
  is_sidebar: number;
  sub_module_id?: number;
  sub_module_name?: string;
  submodule_translation_key?: string;
  submodule_route?: string;
}

export interface NavigationItem {
  id: string;
  label: string;
  labelKey?: string;
  icon: React.ComponentType<any>;
  href?: string;
  secondary: {
    label: string;
    labelKey: string;
    href: string;
  }[];
}

export interface NavigationResponse {
  success: boolean;
  data: NavigationModule[];
  message?: string;
}

class NavigationService {
  private lastRequestTime: number = 0;
  private lastRoleId: number | null = null;
  private pendingRequest: Promise<NavigationResponse> | null = null;
  private readonly MIN_REQUEST_INTERVAL = 1000;

  async getNavigationByRole(roleId: number): Promise<NavigationResponse> {
    try {
      const now = Date.now();

      if (
        this.lastRoleId === roleId &&
        now - this.lastRequestTime < this.MIN_REQUEST_INTERVAL
      ) {
        if (this.pendingRequest) {
          return await this.pendingRequest;
        }

        const waitTime =
          this.MIN_REQUEST_INTERVAL - (now - this.lastRequestTime);
        await new Promise((resolve) => setTimeout(resolve, waitTime));
      }

      if (this.pendingRequest && this.lastRoleId === roleId) {
        return await this.pendingRequest;
      }

      this.lastRequestTime = Date.now();
      this.lastRoleId = roleId;
      this.pendingRequest = apiClient
        .get(`/secRolePrivilege?roleId=${roleId}`)
        .then((response) => {
          return response.data;
        })
        .finally(() => {
          this.pendingRequest = null;
        });

      return await this.pendingRequest;
    } catch (error) {
      this.pendingRequest = null;

      if (error instanceof Error) {
        console.error("Error message:", error.message);
        console.error("Error stack:", error.stack);
      }
      throw error;
    }
  }

  transformNavigationData(backendData: any): {
    mainNav: NavigationItem[];
    sidebarNav: NavigationItem[];
    footerNav: NavigationItem[];
  } {
    const mainNav: NavigationItem[] = [];
    const sidebarNav: NavigationItem[] = [];
    const footerNav: NavigationItem[] = [];

    if (
      backendData &&
      typeof backendData === "object" &&
      !Array.isArray(backendData)
    ) {
      Object.entries(backendData).forEach(
        ([moduleName, moduleData]: [string, any]) => {
          if (!moduleData.allowed) return;

          const navItem: NavigationItem = {
            id: `navigation.${moduleName}`,
            label: this.formatModuleName(moduleName),
            icon: this.getIconComponent(this.getModuleIcon(moduleName)),
            href: `/${moduleName.toLowerCase().replace(/\s+/g, "-")}`,
            secondary: moduleData.subModules
              .filter((sub: any) => sub.allowed)
              .map((sub: any) => ({
                label: this.formatModuleName(sub.sub_module_name || ""),
                labelKey: `navigation.${sub.sub_module_name}` || "",
                href: sub.path
                  ? `/${sub.path}`
                  : `/${moduleName.toLowerCase().replace(/\s+/g, "-")}/${(
                      sub.sub_module_name || ""
                    )
                      .toLowerCase()
                      .replace(/\s+/g, "-")}`,
              })),
          };
          console.log(navItem);
          if (moduleData.is_sidebar) {
            sidebarNav.push(navItem);
          } else {
            mainNav.push(navItem);
          }
        }
      );
    } else {
      console.warn("⚠️ Unexpected data format:", backendData);
    }

    return {
      mainNav,
      sidebarNav,
      footerNav,
    };
  }

  private formatModuleName(name: string): string {
    return name
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  }

  private getModuleIcon(moduleName: string): string {
    const iconMap: { [key: string]: string } = {
      "workforce-analytics": "FiBarChart2",
      "enterprise-settings": "FiSettings",
      organization: "FiBriefcase",
      "employee-management": "FiUsers",
      "roster-management": "FiCalendar",
      "self-services": "FiUser",
      "devices-infrastructure": "FiCpu",
      "user-security": "FiShield",
      "app-settings": "FiSettings",
      "alert-centre": "FiAlertCircle",
      workforce: "FiUsers",
      "support-centre": "FiHelpCircle",
    };

    return iconMap[moduleName] || "FiLayers";
  }
  private getIconComponent(iconName: string) {
    const iconMap: { [key: string]: any } = {
      FiBarChart2: FiBarChart2,
      FiLayers: FiLayers,
      FiMapPin: FiMapPin,
      FiUsers: FiUsers,
      FiCalendar: FiCalendar,
      FiClock: FiClock,
      FiCpu: FiCpu,
      FiShield: FiShield,
      FiSettings: FiSettings,
      FiAlertCircle: FiAlertCircle,
      FiBriefcase: FiBriefcase,
      FiHelpCircle: FiHelpCircle,
      FiUser: FiUser,
    };

    const icon = iconMap[iconName];
    if (!icon) {
      console.warn(
        `⚠️ Icon "${iconName}" not found in iconMap, using default FiLayers`
      );
    }
    const result = icon || FiLayers;
    return result;
  }
}

const navigationService = new NavigationService();
export default navigationService;
