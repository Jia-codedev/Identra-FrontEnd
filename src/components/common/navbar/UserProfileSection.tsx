"use client";
import React, { useState } from "react";
import Link from "next/link";
import { FiSettings, FiBell } from "react-icons/fi";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { ModeToggle } from "@/components/ui/ThemeToggle";
import { LanguageSwitcher } from "@/components/common/LanguageSwitcher";
import { LogoutConfirmation } from "@/components/common/LogoutConfirmation";
import { useNavigation } from "@/hooks/use-navigation";

interface UserProfileSectionProps {
  user: {
    name: string;
    email: string;
    avatar?: string;
    initials: string;
    role: string;
  };
}

export const UserProfileSection: React.FC<UserProfileSectionProps> = ({
  user,
}) => {
  const { PROFILE_LINKS } = useNavigation();
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);

  const handleMenuClick = (href: string) => {
    if (href === "/logout") {
      setShowLogoutDialog(true);
    }
  };

  return (
    <div className="hidden sm:flex items-center space-x-3 ml-6">
      {/* Language Switcher */}
      <div className="flex items-center">
        <LanguageSwitcher />
      </div>

      {/* Theme Toggle */}
      <div className="flex items-center">
        <ModeToggle />
      </div>

      {/* Settings Dropdown */}
      {/* <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="p-1 rounded-md hover:bg-muted transition-colors">
            <FiSettings className="text-xl cursor-pointer text-muted-foreground hover:text-primary transition-colors" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>Settings</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {SETTINGS_LINKS.map((item) => (
            <DropdownMenuItem asChild key={item.href}>
              <Link href={item.href}>{item.label}</Link>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Notifications */}
      <button className="p-1 rounded-md hover:bg-muted transition-colors">
        <FiBell className="text-xl cursor-pointer text-muted-foreground hover:text-primary transition-colors" />
      </button>

      {/* User Profile Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            className="p-1 rounded-full hover:bg-muted transition-colors focus:outline-none focus:ring-2 focus:ring-primary/40"
            aria-label="Open user menu"
          >
            <Avatar className="cursor-pointer ring-2 ring-primary/40 hover:ring-primary transition-all w-9 h-9">
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback className="text-xs font-semibold bg-primary text-primary-foreground">
                {user.initials}
              </AvatarFallback>
            </Avatar>
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          className="w-56 shadow-lg rounded-lg p-0"
        >
          <div className="px-4 py-4 flex flex-col gap-2 bg-gradient-to-r from-primary/5 to-transparent rounded-t-lg">
            <span className="text-center text-xs uppercase text-primary font-medium tracking-wide">
              {user.role} Account
            </span>
            <span className="text-base font-semibold text-foreground truncate">
              {user.name}
            </span>
            <span className="text-xs text-muted-foreground truncate">
              {user.email}
            </span>
          </div>
          <DropdownMenuSeparator />
          <div className="p-2">
            {PROFILE_LINKS.map((link, idx) => (
              <DropdownMenuItem
                key={link.href || link.label || `profile-${idx}`}
                className={`flex items-center gap-2 px-4 py-2 text-sm hover:bg-muted transition-colors ${
                  link.className || ""
                }`}
                onClick={() => handleMenuClick(link.href)}
              >
                {link.href === "/logout" ? (
                  <span className="w-full text-left">{link.label}</span>
                ) : (
                  <Link href={link.href} className="w-full text-left">
                    {link.label}
                  </Link>
                )}
              </DropdownMenuItem>
            ))}
          </div>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Logout Confirmation Dialog */}
      <LogoutConfirmation
        isOpen={showLogoutDialog}
        onClose={() => setShowLogoutDialog(false)}
      />
    </div>
  );
};
