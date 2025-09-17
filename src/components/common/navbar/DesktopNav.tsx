"use client";
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useNavigation } from "@/hooks/use-navigation";
import { useRouter } from "next/navigation";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { useUserNavBar } from "@/store/userNavBar";

export const DesktopNav: React.FC = () => {
  const { NAV_LINKS } = useNavigation();
  const activeMenuId = useUserNavBar((s) => s.activeMenuId);
  const router = useRouter();

  const setActiveFromStore = (id: string | null, links?: any[]) => {
    useUserNavBar.getState().setActiveMenu(id, links || []);
  };

  return (
    <div className="hidden xl:flex items-center relative flex-1 max-w-full overflow-hidden group">
      <ScrollArea className="w-full max-w-full" type="hover">
        <div className="flex items-center space-x-1 min-w-fit">
          {NAV_LINKS.map((menu, menuIndex) => {
            const Icon = menu.icon;
            const isActive = activeMenuId === menu.id;
            const key = menu.id || menu.label || `nav-${menuIndex}`;
            return (
              <div
                key={key}
                className="relative flex flex-col items-center px-1 flex-shrink-0"
              >
                <motion.button
                  className={cn(
                    "flex text-nowrap group/button w-auto items-center rounded-2xl justify-center px-4 py-2 font-semibold transition-colors duration-200 cursor-pointer text-xs",
                    isActive
                      ? "bg-primary/80 text-white"
                      : "hover:bg-muted"
                  )}
                  onClick={() => {
                    if (menu.href) {
                      router.push(menu.href);
                      return;
                    }
                    setActiveFromStore(menu.id, menu.secondary || []);
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
                      {menu.label}
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
    </div>
  );
};
