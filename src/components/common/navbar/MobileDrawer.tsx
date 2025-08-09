"use client";
import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { FiX } from "react-icons/fi";
import { ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { LanguageSwitcher } from "@/components/common/LanguageSwitcher";
import { LogoutConfirmation } from "@/components/common/LogoutConfirmation";
import { usePathname } from "next/navigation";
import { useNavigation } from "@/hooks/use-navigation";
import { useLanguage } from "@/providers/language-provider";

interface MobileDrawerProps {
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
  expandedMenu: string | null;
  setExpandedMenu: (menu: string | null) => void;
  user: {
    name: string;
    email: string;
    avatar?: string;
    initials: string;
    role: string;
  };
}

export const MobileDrawer: React.FC<MobileDrawerProps> = ({
  mobileOpen,
  setMobileOpen,
  expandedMenu,
  setExpandedMenu,
  user,
}) => {
  const pathname = usePathname();
  const { isRTL } = useLanguage();
  const { NAV_LINKS, PROFILE_LINKS, SETTINGS_LINKS } = useNavigation();
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);

  const handleLinkClick = (href: string) => {
    if (href === "/logout") {
      setShowLogoutDialog(true);
    } else {
      setMobileOpen(false);
    }
  };

  return (
    <AnimatePresence mode="wait">
      {mobileOpen && (
        <motion.div
          className="fixed inset-0 bg-background/10 backdrop-blur z-50"
          onClick={() => setMobileOpen(false)}
        >
          <motion.div
            initial={{ x: isRTL ? "100%" : "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: isRTL ? "100%" : "-100%" }}
            transition={{ type: "tween" }}
            className="w-64 max-w-[80vw] h-full p-4 flex flex-col space-y-4 bg-background text-foreground shadow-xl z-[1201] overflow-y-scroll scrollbar-hide"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              className="self-end mb-2 text-2xl cursor-pointer"
              onClick={() => setMobileOpen(false)}
              aria-label="Close menu"
            >
              <FiX />
            </button>

            {/* Profile Section */}
            <div className="flex items-center space-x-2 mb-2">
              <Avatar className="ring-2 ring-primary/30 w-8 h-8 text-xs">
                <AvatarImage src={user.avatar} alt="Profile" />
                <AvatarFallback>{user.initials}</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium text-foreground">{user.name}</p>
                <p className="text-xs text-muted-foreground">{user.email}</p>
              </div>
            </div>

            {/* Navigation Links */}
            <div className="flex flex-col space-y-1">
              {NAV_LINKS.map((menu) => {
                const Icon = menu.icon;
                const isExpanded = expandedMenu === menu.label;
                return (
                  <div key={menu.label}>
                    <button
                      className={cn(
                        "flex items-center justify-between w-full px-2 py-2 rounded-md font-semibold text-sm transition-colors text-left",
                        isExpanded
                          ? "bg-primary/10 text-primary"
                          : "text-muted-foreground hover:bg-muted"
                      )}
                      onClick={() =>
                        setExpandedMenu(isExpanded ? null : menu.label)
                      }
                    >
                      <span className="flex items-center">
                        <Icon className="text-lg mr-2" />
                        {menu.label}
                      </span>
                      <span className="ml-auto text-xs">
                        {menu.secondary && menu.secondary.length > 0 ? (
                          isExpanded ? (
                            <ChevronUp size={14} />
                          ) : (
                            <ChevronDown size={14} />
                          )
                        ) : null}
                      </span>
                    </button>

                    {/* Secondary Links */}
                    <AnimatePresence mode="wait">
                      {isExpanded && menu.secondary && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{
                            height: "auto",
                            opacity: 1,
                          }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="ml-6 flex flex-col space-y-1 mt-1 overflow-hidden"
                        >
                          {menu.secondary.map((item: any) => (
                            <Link
                              key={item.href}
                              href={item.href}
                              className={cn(
                                "block px-2 py-1 rounded text-xs font-medium transition-all text-nowrap hover:text-primary text-muted-foreground",
                                pathname === item.href
                                  ? "bg-primary text-primary-foreground font-bold"
                                  : "hover:bg-muted"
                              )}
                              onClick={() => setMobileOpen(false)}
                            >
                              {item.label}
                            </Link>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>

            {/* Profile Links */}
            <div className="flex flex-col pt-2 border-t border-border space-y-1">
              {PROFILE_LINKS.map((link) => (
                <div
                  key={link.href}
                  className={cn(
                    "px-2 py-1 text-xs rounded hover:bg-muted cursor-pointer",
                    link.className || ""
                  )}
                  onClick={() => handleLinkClick(link.href)}
                >
                  {link.href === "/logout" ? (
                    <span>{link.label}</span>
                  ) : (
                    <Link href={link.href} onClick={() => setMobileOpen(false)}>
                      {link.label}
                    </Link>
                  )}
                </div>
              ))}
            </div>

            {/* Settings Links */}
            <div className="flex flex-col pt-2 border-t border-border space-y-1">
              {SETTINGS_LINKS.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="px-2 py-1 text-xs rounded hover:bg-muted"
                  onClick={() => setMobileOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
            </div>

            {/* Language Switcher */}
            <div className="flex flex-col pt-2 border-t border-border">
              <LanguageSwitcher variant="mobile" />
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Logout Confirmation Dialog */}
      <LogoutConfirmation 
        isOpen={showLogoutDialog}
        onClose={() => setShowLogoutDialog(false)}
      />
    </AnimatePresence>
  );
};
