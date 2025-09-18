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
    <div className="w-full z-20 top-0 border-b flex gap-2 pt-2 flex-col justify-center items-center backdrop-blur-sm ">
      <div className="grid grid-cols-9 w-full gap-4 px-2 items-center group">
        <DesktopNav />
        <div
          className={`flex col-start-8 items-center justify-end col-span-2${
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
      <SecondaryNav activeMenuObj={activeMenuObj} />
    </div>
  );
};

export default Navbar;
