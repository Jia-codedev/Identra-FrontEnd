"use client";
import React, { useState, useRef, useEffect } from "react";
import { usePathname } from "next/navigation";
import { useTranslations } from "@/hooks/use-translations";
import { useNavigationState } from "@/hooks/useNavigationState";
import { DesktopNav, UserProfileSection, SecondaryNav } from "./navbar/index";
import { useUserStore } from "@/store/userStore";
import { useLanguage } from "@/providers/language-provider";
import { useAuthNavigationSync } from "@/hooks/useAuthNavigation";

const Navbar = () => {
  const { user } = useUserStore();
  const { isRTL } = useLanguage();
  const pathname = usePathname();
  const { t } = useTranslations();
  const { NAV_LINKS, activeMenuId: storeActiveId, setActiveMenu } =
    useNavigationState();
  useAuthNavigationSync();
  const [activeMenuId, setActiveMenuId] = useState<string>("");
  const headerRef = useRef<HTMLElement | null>(null);
  useEffect(() => {
    const setNavbarHeightVar = () => {
      const height = headerRef.current?.getBoundingClientRect().height;
      if (typeof height === "number") {
        document.documentElement.style.setProperty(
          "--navbar-height",
          `${Math.ceil(height)}px`
        );
      }
    };

    setNavbarHeightVar();

    window.addEventListener("resize", setNavbarHeightVar);
    return () => window.removeEventListener("resize", setNavbarHeightVar);
  }, []);
  React.useEffect(() => {
    // If store already has an active id (user clicked previously), prefer it.
    if (storeActiveId) {
      setActiveMenuId(storeActiveId);
      return;
    }

    // When NAV_LINKS become available (e.g. after login/navigation load),
    // determine the correct active menu from the current pathname and
    // update both local and global (store) state so other components
    // reflect the selection without requiring a full page refresh.
    if (NAV_LINKS && NAV_LINKS.length > 0) {
      const currentLink = NAV_LINKS.find((link) =>
        link.secondary?.some((item) => pathname.startsWith(item.href))
      );

      const newActiveId = currentLink ? currentLink.id : NAV_LINKS[0]?.id ?? "";
      setActiveMenuId(newActiveId);
      // update the global store so components that read from store update too
      const secondary = currentLink?.secondary || NAV_LINKS.find((m) => m.id === newActiveId)?.secondary || [];
      setActiveMenu(newActiveId, secondary);
    }
  }, [NAV_LINKS, pathname, t, storeActiveId, setActiveMenu]);

  const activeMenuObj = NAV_LINKS.find((menu) => menu.id === activeMenuId);

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
    <header
      ref={headerRef}
      className="w-full z-20 top-0 border-b bg-sidebar backdrop-blur-sm"
    >
      <div className="w-full max-w-[1920px] mx-auto px-4 py-2 grid grid-cols-12 items-center gap-2 group">
        <div className="col-span-10 max-xl:col-span-9 min-w-0 overflow-hidden">
          <DesktopNav NAV_LINKS={NAV_LINKS} />
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
