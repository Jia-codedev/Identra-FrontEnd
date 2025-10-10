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
  is_sidebar_menu: number;
  is_footer_menu: number;
  sub_module_id?: number;
  sub_module_name?: string;
  submodule_translation_key?: string;
  submodule_route?: string;
}

export interface NavigationItem {
  id: string;
  label: string;
  icon: React.ComponentType<any>; // React icon component that accepts props
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
  private readonly MIN_REQUEST_INTERVAL = 1000; // 1 second minimum between requests

  async getNavigationByRole(roleId: number): Promise<NavigationResponse> {
    try {
      const now = Date.now();
      
      // If this is the same roleId and we've made a request recently, return pending request or wait
      if (this.lastRoleId === roleId && (now - this.lastRequestTime) < this.MIN_REQUEST_INTERVAL) {
        if (this.pendingRequest) {
          console.log(`⏳ Returning existing request for roleId: ${roleId}`);
          return await this.pendingRequest;
        }
        
        const waitTime = this.MIN_REQUEST_INTERVAL - (now - this.lastRequestTime);
        console.log(`⏰ Rate limiting: waiting ${waitTime}ms before next request for roleId: ${roleId}`);
        await new Promise(resolve => setTimeout(resolve, waitTime));
      }

      // If there's already a pending request for this roleId, return it
      if (this.pendingRequest && this.lastRoleId === roleId) {
        console.log(`🔄 Reusing existing request for roleId: ${roleId}`);
        return await this.pendingRequest;
      }

      console.log(`🚀 Fetching navigation for roleId: ${roleId}`);
      this.lastRequestTime = Date.now();
      this.lastRoleId = roleId;

      // Create the request promise
      this.pendingRequest = apiClient.get(`/secRolePrivilege?roleId=${roleId}`)
        .then((response) => {
          console.log("Raw axios response:", response);
          console.log("Response data:", response.data);
          console.log("Response data type:", typeof response.data);
          console.log("Is response.data an array?", Array.isArray(response.data));
          return response.data;
        })
        .finally(() => {
          // Clear the pending request after completion
          this.pendingRequest = null;
        });

      return await this.pendingRequest;
    } catch (error) {
      // Clear pending request on error
      this.pendingRequest = null;
      
      console.error("Error fetching navigation by role:", error);
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
    console.log("🔄 Navigation service received data:", backendData);
    console.log("🔄 Type of backendData:", typeof backendData);

    const mainNav: NavigationItem[] = [];
    const sidebarNav: NavigationItem[] = [];
    const footerNav: NavigationItem[] = [];

    if (
      backendData &&
      typeof backendData === "object" &&
      !Array.isArray(backendData)
    ) {
      console.log("🔄 Processing tree structure data...");

      let totalModules = 0;
      let allowedModules = 0;
      let totalSubModules = 0;
      let allowedSubModules = 0;

      Object.entries(backendData).forEach(
        ([moduleName, moduleData]: [string, any]) => {
          totalModules++;
          console.log(`🔍 Processing module: ${moduleName}`, {
            allowed: moduleData?.allowed,
            subModulesCount: moduleData?.subModules?.length || 0,
          });

          if (moduleData && moduleData.subModules) {
            totalSubModules += moduleData.subModules.length;
            const moduleAllowedSubModules = moduleData.subModules.filter(
              (sub: any) => sub.allowed
            );
            allowedSubModules += moduleAllowedSubModules.length;

            console.log(
              `📊 Module ${moduleName}: ${moduleAllowedSubModules.length}/${moduleData.subModules.length} submodules allowed`
            );

            if (moduleData.allowed || moduleAllowedSubModules.length > 0) {
              allowedModules++;

              const navItem: NavigationItem = {
                id: moduleName,
                label: this.formatModuleName(moduleName),
                icon: this.getIconComponent(this.getModuleIcon(moduleName)),
                href: `/${moduleName.toLowerCase().replace(/\s+/g, "-")}`,
                secondary: moduleAllowedSubModules.map((sub: any) => ({
                  label: this.formatModuleName(sub.sub_module_name || ""),
                  labelKey: sub.sub_module_name || "",
                  href: sub.path
                    ? `/${sub.path}`
                    : `/${moduleName.toLowerCase().replace(/\s+/g, "-")}/${(sub.sub_module_name || "").toLowerCase().replace(/\s+/g, "-")}`,
                })),
              };

              // For now, put all in mainNav since we don't have is_sidebar_menu info
              mainNav.push(navItem);
              console.log(
                `✅ Added navigation item for ${moduleName} with ${navItem.secondary.length} sub-items`
              );
            } else {
              console.log(
                `❌ Skipped module ${moduleName} - no access permissions`
              );
            }
          }
        }
      );

      console.log(`📊 Navigation Summary:
        - Total modules: ${totalModules}
        - Allowed modules: ${allowedModules}
        - Total submodules: ${totalSubModules}
        - Allowed submodules: ${allowedSubModules}
        - Final nav items: ${mainNav.length}`);

      if (allowedModules === 0) {
        console.warn(
          "⚠️ No navigation items generated! User may not have permissions for any modules."
        );
        console.warn("💡 This could mean:");
        console.warn("   1. User role has no assigned privileges");
        console.warn(
          '   2. All modules/submodules are set to "allowed": false'
        );
        console.warn("   3. Database role privileges need to be configured");
      }
    } else if (Array.isArray(backendData)) {
      // Handle flat array format (fallback for old API responses)
      console.log("🔄 Processing flat array data...");
      this.transformFlatArrayData(backendData, mainNav, sidebarNav, footerNav);
    } else {
      console.warn("⚠️ Unexpected data format:", backendData);
    }

    console.log("✅ Final transformed navigation:", {
      mainNav: mainNav.length,
      sidebarNav: sidebarNav.length,
      footerNav: footerNav.length,
    });

    return {
      mainNav,
      sidebarNav,
      footerNav,
    };
  }

  /**
   * Format module name for display
   */
  private formatModuleName(name: string): string {
    return name
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  }

  /**
   * Get appropriate icon for module
   */
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

  /**
   * Transform flat array data (fallback method)
   */
  private transformFlatArrayData(
    dataArray: NavigationModule[],
    mainNav: NavigationItem[],
    sidebarNav: NavigationItem[],
    footerNav: NavigationItem[]
  ) {
    const moduleMap = new Map<
      number,
      {
        module: NavigationModule;
        subModules: NavigationModule[];
      }
    >();

    // Group modules and sub-modules
    dataArray.forEach((item) => {
      if (!moduleMap.has(item.module_id)) {
        moduleMap.set(item.module_id, {
          module: item,
          subModules: [],
        });
      }

      if (item.sub_module_id) {
        moduleMap.get(item.module_id)?.subModules.push(item);
      }
    });

    moduleMap.forEach(({ module, subModules }) => {
      const navItem: NavigationItem = {
        id: module.module_name,
        label: module.module_translation_key || module.module_name,
        icon: this.getIconComponent(module.module_icon),
        href: module.module_route,
        secondary: subModules.map((sub) => ({
          label: sub.submodule_translation_key || sub.sub_module_name || "",
          labelKey: sub.submodule_translation_key || "",
          href: sub.submodule_route || "",
        })),
      };

      // Categorize navigation items
      if (module.is_sidebar_menu === 1) {
        sidebarNav.push(navItem);
      } else if (module.is_footer_menu === 1) {
        footerNav.push(navItem);
      } else {
        mainNav.push(navItem);
      }
    });

    // Sort by display_order
    const sortByOrder = (a: NavigationItem, b: NavigationItem) => {
      const aModule = Array.from(moduleMap.values()).find(
        (m) => m.module.module_name === a.id
      );
      const bModule = Array.from(moduleMap.values()).find(
        (m) => m.module.module_name === b.id
      );
      return (
        (aModule?.module.display_order || 0) -
        (bModule?.module.display_order || 0)
      );
    };

    mainNav.sort(sortByOrder);
    sidebarNav.sort(sortByOrder);
    footerNav.sort(sortByOrder);
  }

  /**
   * Get React icon component by name
   */
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
    console.log(
      `🎨 Icon mapping: "${iconName}" -> ${result.name || "Component"}`
    );

    return result;
  }

  /**
   * Get all navigation menus (for admin/testing)
   */
  async getAllNavigation(): Promise<NavigationResponse> {
    try {
      const response = await apiClient.get("/navigation/all");
      return response.data;
    } catch (error) {
      console.error("Error fetching all navigation:", error);
      throw error;
    }
  }

  /**
   * Get main navigation menu
   */
  async getMainNavigation(): Promise<NavigationResponse> {
    try {
      const response = await apiClient.get("/navigation/main");
      return response.data;
    } catch (error) {
      console.error("Error fetching main navigation:", error);
      throw error;
    }
  }

  /**
   * Get sidebar navigation menu
   */
  async getSidebarNavigation(): Promise<NavigationResponse> {
    try {
      const response = await apiClient.get("/navigation/sidebar");
      return response.data;
    } catch (error) {
      console.error("Error fetching sidebar navigation:", error);
      throw error;
    }
  }

  /**
   * Get footer navigation menu
   */
  async getFooterNavigation(): Promise<NavigationResponse> {
    try {
      const response = await apiClient.get("/navigation/footer");
      return response.data;
    } catch (error) {
      console.error("Error fetching footer navigation:", error);
      throw error;
    }
  }
}

const navigationService = new NavigationService();
export default navigationService;
