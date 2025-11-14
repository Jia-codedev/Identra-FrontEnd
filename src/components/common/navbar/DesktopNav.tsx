"use client";
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useNavigationState } from "@/hooks/useNavigationState";
import { usePathname } from "next/navigation";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { useTranslations } from "@/hooks/use-translations";

interface DesktopNavProps {
  NAV_LINKS: {
    id: string;
    label: string;
    labelKey?: string;
    href?: string;
    secondary?: {
      label: string;
      labelKey?: string;
      href: string;
    }[];
    icon?: React.ComponentType<any>;
  }[];
}

export const DesktopNav: React.FC<DesktopNavProps> = ({ NAV_LINKS }) => {
  const { t } = useTranslations();
  const pathname = usePathname();
  const { activeMenuId, setActiveMenu } = useNavigationState();
  // Determine which menu corresponds to the current route (route-based active)
  const routeActiveMenuId = React.useMemo(() => {
    if (!NAV_LINKS || NAV_LINKS.length === 0) return null;
    const found = NAV_LINKS.find(
      (link) =>
        // check secondary links for a matching/current route
        (link.secondary &&
          link.secondary.some((s) => pathname?.startsWith(s.href))) ||
        // or menu-level link equals current path
        (link.href && pathname?.startsWith(link.href))
    );
    return found?.id ?? null;
  }, [NAV_LINKS, pathname]);
  return (
    <ScrollArea className="w-full overflow-x-auto" type="hover">
      <div className="flex flex-row items-center gap-1 min-w-fit">
        {NAV_LINKS.map((menu, menuIndex) => {
          const Icon = menu.icon;
          const isActive = activeMenuId === menu.id; // user-selected (store) active
          const isRouteActive = routeActiveMenuId === menu.id; // current route active
          const key = menu.id || menu.label || `nav-${menuIndex}`;
          const label = t(menu.id);
          if (!Icon) {
            console.warn(
              `⚠️ Navigation item "${menu.label}" has undefined icon, skipping render`
            );
            return null;
          }

          return (
            <div
              key={key}
              className="relative flex flex-col items-center px-1 flex-shrink-0"
            >
              <motion.button
                className={cn(
                  "flex text-nowrap group/button w-auto items-center rounded-2xl justify-center px-4 py-2 font-semibold transition-colors duration-200 cursor-pointer text-xs",
                  isActive && !isRouteActive
                    ? "bg-secondary/80"
                    : // route-based active gets a different, lighter emphasis
                    isRouteActive
                    ? "text-white bg-primary font-semibold"
                    : "hover:bg-muted"
                )}
                onClick={() => {
                  setActiveMenu(menu.id, menu.secondary || []);
                }}
              >
                <Icon className="text-lg mr-2" />
                <AnimatePresence>
                  <motion.span
                    className="text-xs overflow-hidden"
                    initial={{ width: 0, opacity: 0 }}
                    animate={{ width: "auto", opacity: 1 }}
                    exit={{ width: 0, opacity: 0 }}
                    transition={{ duration: 0.28, ease: "easeInOut" }}
                    key={`${menu.label || key}-label`}
                  >
                    {label}
                  </motion.span>
                </AnimatePresence>
              </motion.button>
            </div>
          );
        })}
      </div>
      <ScrollBar
        orientation="horizontal"
        className="opacity-0 hover:opacity-100 group-hover:opacity-100 transition-opacity duration-300 h-2"
      />
    </ScrollArea>
  );
};
