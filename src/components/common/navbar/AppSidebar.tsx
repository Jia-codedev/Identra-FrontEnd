"use client";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { useNavigation } from "@/hooks/use-navigation";
import React, { useEffect } from "react";
import { useUserNavBar } from "@/store/userNavBar";
import { LogoIcon } from "../svg/icons";
import { useLanguage } from "@/providers/language-provider";
import Link from "next/link";
import { getRouteFromKey } from "@/utils/routeFromKey";
import { usePathname } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

function AppSidebar({ ...props }) {
  const { setOpen } = useSidebar();
  useEffect(() => {
    setOpen(false);
  }, [setOpen]);
  const { SIDEBAR_LINKS, FOOTER_LINKS } = useNavigation();
  const { isRTL } = useLanguage();
  const pathname = usePathname();
  return (
    <Sidebar
      className="border-r-white/10 bg-primary text-white"
      collapsible="icon"
      side={isRTL ? "right" : "left"}
      {...props}
    >
      <SidebarHeader className="">
        <Link
          href={getRouteFromKey("mainMenu.workforceAnalytics.myInsights")}
          className="flex items-center justify-center h-16"
        >
          <LogoIcon />
        </Link>
      </SidebarHeader>
      <SidebarContent className="mx-auto flex">
        <SidebarMenuItem className="mx-auto space-y-4">
          {SIDEBAR_LINKS.map((link, idx) => {
            const Icon = link.icon;
            const key = link.id || link.label || `sidebar-${idx}`;
            const isActive = !!(link.secondary || []).find(
              (s) => s.href && pathname?.startsWith(s.href)
            );
            return (
              <SidebarMenuButton
                key={key}
                tooltip={link.label}
                className={
                  isActive
                    ? "bg-white hover:bg-white text-primary hover:text-accent "
                    : "bg-white/10 hover:bg-white/20 text-white"
                }
                onClick={() => {
                  useUserNavBar
                    .getState()
                    .setActiveMenu(link.id, link.secondary || []);
                }}
              >
                <Icon className="text-lg mr-2" />
              </SidebarMenuButton>
            );
          })}
        </SidebarMenuItem>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenuItem className="mx-auto space-y-4">
          {FOOTER_LINKS.map((link, idx) => {
            const Icon = link.icon;
            const key = link.id || link.label || `sidebar-footer-${idx}`;
            const isActive = !!(link.secondary || []).find(
              (s) => s.href && pathname?.startsWith(s.href)
            );
            return (
              <DropdownMenu key={key}>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuButton
                    tooltip={link.label}
                    className={"text-white bg-white/10 hover:bg-white/20"}
                  >
                    <Icon className="text-lg mr-2 text-white" />
                  </SidebarMenuButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="start">
                  <DropdownMenuGroup>
                    {link.secondary.map((subLink, subIdx) => {
                      return (
                        <DropdownMenuItem key={subIdx}>
                          <Link href={subLink.href}>{subLink.label}</Link>
                        </DropdownMenuItem>
                      );
                    })}
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            );
          })}
        </SidebarMenuItem>
      </SidebarFooter>
    </Sidebar>
  );
}
export default AppSidebar;
