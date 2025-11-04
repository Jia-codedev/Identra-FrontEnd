"use client";
import { useNavigationState } from "@/hooks/useNavigationState";
import React from "react";
import { useAuthNavigationSync } from "@/hooks/useAuthNavigation";
import { LogoFav } from "../svg/icons";
import { useLanguage } from "@/providers/language-provider";
import Link from "next/link";
import { getRouteFromKey } from "@/utils/routeFromKey";
import { usePathname } from "next/navigation";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import { motion } from "framer-motion";
import { useTranslations } from "@/hooks/use-translations";
function AppSidebar(props: React.HTMLAttributes<HTMLDivElement>) {
  const { SIDEBAR_LINKS, setActiveMenu, isLoading } = useNavigationState();
  const { isRTL } = useLanguage();
  const pathname = usePathname();
  const { t } = useTranslations();
  useAuthNavigationSync();
  return (
    <div
      className="border-r bg-primary text-white min-w-12 min-h-screen flex flex-col"
      {...props}
    >
      <div className="flex items-center justify-center h-16">
        <Link
          href={getRouteFromKey("mainMenu.workforceAnalytics.myInsights")}
          className="flex items-center justify-center h-16"
        >
          <LogoFav />
        </Link>
      </div>
      <nav className="flex-1 flex flex-col items-center space-y-4 mt-4">
        {isLoading
          ? Array.from({ length: 6 }).map((_, idx) => (
              <div
                key={`skeleton-${idx}`}
                className="w-8 h-8 rounded-lg bg-white/10 animate-pulse"
              />
            ))
          : SIDEBAR_LINKS.map((link, idx) => {
              const Icon = link.icon;
              const key = link.id || link.label || `sidebar-${idx}`;
              const isActive = !!(link.secondary || []).find(
                (s) => s.href && pathname?.startsWith(s.href)
              );
              if (!Icon) return null;
              return (
                <Tooltip key={key} delayDuration={200}>
                  <TooltipTrigger asChild>
                    <motion.button
                      className={
                        "flex items-center justify-center w-8 h-8 rounded-lg transition " +
                        (isActive
                          ? "bg-white text-primary font-bold"
                          : "bg-white/10 hover:bg-white/20 text-white")
                      }
                      transition={{
                        type: "spring",
                        stiffness: 400,
                        damping: 30,
                      }}
                      onClick={() =>
                        setActiveMenu(link.id, link.secondary || [])
                      }
                    >
                      <Icon className="text-lg" />
                    </motion.button>
                  </TooltipTrigger>
                  <TooltipContent side="right" className="text-xs">
                    {t(link.label) || link.label}
                  </TooltipContent>
                </Tooltip>
              );
            })}
      </nav>
    </div>
  );
}
export default AppSidebar;
