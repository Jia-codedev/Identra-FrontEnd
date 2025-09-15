"use client";
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useNavigation } from "@/hooks/use-navigation";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

interface DesktopNavProps {
  activeMenu: string;
  setActiveMenu: (menu: string) => void;
}

export const DesktopNav: React.FC<DesktopNavProps> = ({
  activeMenu,
  setActiveMenu,
}) => {
  const { NAV_LINKS } = useNavigation();

  return (
    <div className="hidden xl:flex items-center relative ml-8 flex-1 max-w-full overflow-hidden group">
      <ScrollArea className="w-full max-w-full" type="hover">
        <div className="flex items-center space-x-1 min-w-fit pb-2">
          {NAV_LINKS.map((menu) => {
            const Icon = menu.icon;
            const isActive = activeMenu === menu.label;
            const key = menu.id || menu.label || Math.random().toString(36).slice(2, 9);
            return (
              <div
                key={key}
                className="relative flex flex-col items-center px-1 flex-shrink-0"
              >
                <motion.button
                  className={cn(
                    "flex text-nowrap group/button w-auto items-center justify-center px-4 py-2 rounded-xl font-semibold transition-colors duration-200 cursor-pointer text-xs",
                    isActive
                      ? "bg-primary text-white shadow-lg"
                      : "dark:text-white text-foreground hover:bg-muted"
                  )}
                  transition={{
                    type: "spring",
                    stiffness: 220,
                    damping: 18,
                  }}
                  onClick={() => setActiveMenu(menu.label)}
                >
                  <Icon className="text-lg mr-2" />
                  <AnimatePresence>
                    <motion.span
                      className="text-xs overflow-hidden"
                      initial={{ width: 0, opacity: 0 }}
                      animate={{ width: "auto", opacity: 1 }}
                      exit={{ width: 0, opacity: 0 }}
                      transition={{ duration: 0.28, ease: "easeInOut" }}
                      key={menu.label || key}
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
