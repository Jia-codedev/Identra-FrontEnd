"use client";
import React, { useState } from "react";
import { usePathname } from "next/navigation";
import { useTranslations } from "@/hooks/use-translations";
import { useNavigation } from "@/hooks/use-navigation";
import { DesktopNav, UserProfileSection, SecondaryNav } from "./navbar/index";
import { useUserStore } from "@/store/userStore";
import { useLanguage } from "@/providers/language-provider";
import { useUserNavBar } from "@/store/userNavBar";

const Navbar = () => {
  const { user } = useUserStore();
  const { isRTL } = useLanguage();
  const pathname = usePathname();
  const { t } = useTranslations();
  const { NAV_LINKS } = useNavigation();
  const [activeMenu, setActiveMenu] = useState<string>("");
  React.useEffect(() => {
    const storeActiveId = useUserNavBar.getState().activeMenuId;
    if (storeActiveId) {
      const storeMenu = NAV_LINKS.find((m) => m.id === storeActiveId);
      if (storeMenu) {
        setActiveMenu(storeMenu.label);
        return;
      }
    }
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
    <header className="w-full z-20 top-0 border-b bg-sidebar backdrop-blur-sm">
      <div className="w-full max-w-[1920px] mx-auto px-4 py-2 grid grid-cols-12 items-center gap-2 group">
        <div className="col-span-10 max-xl:col-span-9 min-w-0 overflow-hidden">
          <DesktopNav />
        </div>
        <div
          className={`col-span-2 max-xl:col-span-3 bg-sidebar flex items-center justify-end  ${
            isRTL ? " flex-row-reverse" : ""
          }`}
        >
          <UserProfileSection
            user={{
              email: user?.email || "",
              name: getUserDisplayName(),
              role: user?.role || "user",
              initials: getUserInitials(),
            }}
          />
        </div>
      </div>
      <div className="w-full max-w-[1920px] mx-auto px-4">
        <SecondaryNav activeMenuObj={activeMenuObj} />
      </div>
    </header>
  );
};

export default Navbar;
