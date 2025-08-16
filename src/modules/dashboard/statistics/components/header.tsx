"use client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DropdownMenuContent } from "@radix-ui/react-dropdown-menu";
import { ChevronDown, ChevronUp, SlashIcon, LogIn, LogOut } from "lucide-react";
import React, { useState } from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import Link from "next/link";
function DashboardHeader() {
  const [statistics, setStatistics] = useState<"self" | "team">("self");
  const [statisticsDropdownOpen, setStatisticsDropdownOpen] = useState(false);
  return (
    <Card className="bg-gradient-to-tr from-background shadow-none via-background/10 to-primary/5 rounded-2xl flex flex-col md:flex-row md:justify-between md:items-center p-6 ">
      <div className="flex flex-col md:flex-row md:items-center md:gap-6 w-full">
        {/* Dropdown and Breadcrumbs Row */}
        <div className="flex flex-col items-start gap-2 w-full">
          <DropdownMenu
            open={statisticsDropdownOpen}
            onOpenChange={setStatisticsDropdownOpen}
          >
            <DropdownMenuTrigger className="flex items-center gap-2 cursor-pointer text-lg md:text-xl font-semibold  transition-colors outline-0 ring-0">
              {statistics === "self" ? "My Insights" : "Team Insights"}
              {statisticsDropdownOpen ? (
                <ChevronUp size={20} />
              ) : (
                <ChevronDown size={20} />
              )}
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="start"
              className="w-48 bg-white border rounded-md p-2 mt-2 shadow-lg"
            >
              <div
                className="p-2 cursor-pointer hover:bg-primary/10 rounded hover:text-primary text-base"
                onClick={() => {
                  setStatistics("self");
                  setStatisticsDropdownOpen(false);
                }}
              >
                My Insights
              </div>
              <div
                className="p-2 cursor-pointer hover:bg-primary/10 rounded hover:text-primary text-base"
                onClick={() => {
                  setStatistics("team");
                  setStatisticsDropdownOpen(false);
                }}
              >
                Team Insights
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
          <Breadcrumb>
            <BreadcrumbList className="flex items-center text-muted-foreground text-xs md:text-sm">
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href="/">Workforce Analytics</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator>
                <SlashIcon className="w-4 h-4 mx-1" />
              </BreadcrumbSeparator>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href="/dashboard">
                    {statistics === "self"
                      ? "My Insights"
                      : "Team Insights"}
                  </Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </div>
      <div className="flex items-center gap-3 mt-6 md:mt-0">
        {/* punch in and punch out buttons with icons */}
        <Button
          variant="outline"
          className="rounded-full px-5 py-2 font-semibold shadow-sm border border-primary/30 hover:bg-red-50 hover:border-red-300 text-red-600 flex items-center gap-2 transition-colors group"
        >
          <LogOut className="w-5 h-5 text-red-500 group-hover:text-red-700 transition-colors" />
          <span className="hidden sm:inline">Punch Out</span>
        </Button>
        <Button className="rounded-full px-5 py-2 font-semibold shadow-primary/10 shadow-md bg-green-500 text-white hover:bg-green-600 flex items-center gap-2 transition-colors group">
          <LogIn className="w-5 h-5 text-white group-hover:text-gray-100 transition-colors" />
          <span className="hidden sm:inline">Punch In</span>
        </Button>
      </div>
    </Card>
  );
}

export default DashboardHeader;
