"use client";
import React, { useState } from "react";
import { usePathname } from "next/navigation";
import { useTranslations } from "@/hooks/use-translations";
import { useNavigation } from "@/hooks/use-navigation";
import {
  NavbarLogo,
  DesktopNav,
  UserProfileSection,
  MobileMenuToggle,
  SecondaryNav,
  MobileDrawer,
} from "./navbar/index";
import { useUserStore } from "@/store/userStore";
import { useManualUserRefresh } from "@/hooks/use-user-refresh";
import { useLanguage } from "@/providers/language-provider";

const Navbar = () => {
  const { user } = useUserStore();
  const { isRTL } = useLanguage();
  const pathname = usePathname();
  const { t } = useTranslations();
  const { NAV_LINKS } = useNavigation();
  const { manualRefresh, isRefreshing } = useManualUserRefresh();

  const [activeMenu, setActiveMenu] = useState<string>("");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [expandedMenu, setExpandedMenu] = useState<string | null>(null);

  React.useEffect(() => {
    const currentLink = NAV_LINKS.find((link) =>
      link.secondary?.some((item) => pathname.startsWith(item.href))
    );
    setActiveMenu(currentLink ? currentLink.label : t("common.dashboard"));
  }, [pathname, t]);

  const activeMenuObj = NAV_LINKS.find((menu) => menu.label === activeMenu);

  const getUserDisplayName = () => {
    if (typeof user?.employeename === "object" && user.employeename) {
      return isRTL
        ? `${user.employeename.firstarb} ${user.employeename.lastarb}`
        : `${user.employeename.firsteng} ${user.employeename.lasteng}`;
    }
    return "user";
  };

  const getUserInitials = () => {
    if (typeof user?.employeename === "object" && user.employeename) {
      return isRTL
        ? `${user.employeename.firstarb?.[0] || ""}${
            user.employeename.lastarb?.[0] || ""
          }`.toUpperCase()
        : `${user.employeename.firsteng?.[0] || ""}${
            user.employeename.lasteng?.[0] || ""
          }`.toUpperCase();
    }
    return "U";
  };

  return (
    <nav className="p-2">
      <div className="w-full bg-background rounded-xl border border-border px-4 py-3 flex flex-col justify-center items-center transition-all backdrop-blur-sm">
        <div className="flex items-center justify-between w-full gap-4">
          <div className="flex items-center space-x-4 min-w-0 flex-1">
            <NavbarLogo />
            <DesktopNav activeMenu={activeMenu} setActiveMenu={setActiveMenu} />
          </div>

          <div
            className={`flex items-center flex-shrink-0${isRTL ? " flex-row-reverse" : ""}`}
          >
            <UserProfileSection
              user={{
                email: user?.email || "",
                name: getUserDisplayName(),
                role: user?.role || "user",
                initials: getUserInitials(),
              }}
            />
            <MobileMenuToggle
              mobileOpen={mobileOpen}
              setMobileOpen={setMobileOpen}
            />
          </div>
        </div>

        <SecondaryNav activeMenuObj={activeMenuObj} />
      </div>

      <MobileDrawer
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
        expandedMenu={expandedMenu}
        setExpandedMenu={setExpandedMenu}
        user={{
          email: user?.email || "",
          name: getUserDisplayName(),
          initials: getUserInitials(),
          role: user?.role || "user",
        }}
      />
    </nav>
  );
};

export default Navbar;
