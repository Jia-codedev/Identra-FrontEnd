"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { FiSettings, FiBell, FiChevronDown } from "react-icons/fi";
import { usePathname } from "next/navigation";

const LANGS = [
  { code: "en", label: "English", dir: "ltr" as const },
  { code: "ar", label: "العربية", dir: "rtl" as const },
];

const Navbar = () => {
  const [activeMenu, setActiveMenu] = useState("Dashboard");
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [lang, setLang] = useState<"en" | "ar">("en");

  const pathname = usePathname();

  // read saved language once
  useEffect(() => {
    const saved = (typeof window !== "undefined" && localStorage.getItem("lang")) as
      | "en"
      | "ar"
      | null;
    if (saved && (saved === "en" || saved === "ar")) {
      setLang(saved);
    }
  }, []);

  // reflect language to <html> tag
  useEffect(() => {
    if (typeof document !== "undefined") {
      const meta = LANGS.find((l) => l.code === lang) ?? LANGS[0];
      document.documentElement.lang = meta.code;
      document.documentElement.dir = meta.dir;
      localStorage.setItem("lang", meta.code);
    }
  }, [lang]);

  const currentLang = LANGS.find((l) => l.code === lang)!;

  return (
    <nav className="bg-white shadow-md relative">
      {/* Top Navigation */}
      <div className="flex items-center justify-between px-6 py-3">
        {/* Left Side: Logo & Main Navigation */}
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-2">
            {/* replace with your logo path */}
            <img src="/logo.png" alt="Chronologix Logo" className="h-6" />
            <span className="text-lg font-semibold text-gray-800">
              Chronologix
            </span>
          </div>

          {/* Primary Navigation Links */}
          {[
            "Dashboard",
            "Master Data",
            "Employee Master",
            "Scheduling",
            "WorkForce",
            "Leave Tracker",
          ].map((menu) => (
            <button
              key={menu}
              className={`px-3 py-2 rounded-lg font-semibold ${activeMenu === menu
                ? "bg-purple-600 text-white"
                : "text-gray-700 hover:text-purple-500"
                }`}
              onClick={() => setActiveMenu(menu)}
            >
              {menu}
            </button>
          ))}
        </div>

        {/* Right Side: Language, Icons & Profile */}
        <div className="flex items-center space-x-4">
          {/* Language Switcher */}
          <div className="relative">
            <button
              className="flex items-center space-x-1 text-sm text-gray-700 hover:text-blue-600"
              onClick={() => setIsLangOpen(!isLangOpen)}
            >
              <img
                src={lang === "en" ? "/usa.png" : "/uae.png"}
                alt={currentLang.label}
                className="w-5 h-5 rounded-full"
              />
              <span className="ml-1">{currentLang.label}</span>
              <FiChevronDown className="text-xs" />
            </button>

            {isLangOpen && (
              <div
                className="absolute right-0 mt-2 w-40 rounded-md border bg-white py-2 shadow-lg z-50"
                onMouseLeave={() => setIsLangOpen(false)}
              >
                {LANGS.map((l) => (
                  <button
                    key={l.code}
                    onClick={() => {
                      setLang(l.code as "en" | "ar");
                      setIsLangOpen(false);
                    }}
                    className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-100 ${lang === l.code ? "text-purple-600 font-medium" : "text-gray-700"
                      }`}
                  >
                    {l.code === "en" ? "🇺🇸 " : "🇸🇦 "}
                    {l.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Settings */}
          <div
            className="relative"
            onMouseEnter={() => setIsSettingsOpen(true)}
            onMouseLeave={() => setIsSettingsOpen(false)}
          >
            <FiSettings className="text-gray-600 text-xl cursor-pointer hover:text-blue-500" />

            {isSettingsOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white shadow-lg rounded-lg py-2 border z-50">
                <Link
                  href="/settings/app"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Application Settings
                </Link>
                <Link
                  href="/settings/notifications"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Notification Settings
                </Link>
                <Link
                  href="/settings/organizations"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Organizations
                </Link>
                <Link
                  href="/logs/employee"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  View Employee Logs
                </Link>
                <Link
                  href="/logs/view"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  View Logs
                </Link>
                <Link
                  href="/announcement"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Announcement
                </Link>
                <Link
                  href="/license"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  License
                </Link>
              </div>
            )}
          </div>

          {/* Notifications */}
          <FiBell className="text-gray-600 text-xl cursor-pointer hover:text-blue-500" />

          {/* Profile */}
          <div className="relative">
            <img
              src="/user-avatar.png"
              alt="Profile"
              className="h-8 w-8 rounded-full border cursor-pointer"
              onClick={() => setIsProfileOpen((prev) => !prev)} // Toggle on click
            />

            {isProfileOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-lg py-2 border z-50">
                <div className="px-4 py-2 border-b">
                  <p className="text-sm font-medium text-gray-900">
                    Janaki Alagappan
                  </p>
                  <p className="text-xs text-gray-500">Janaki@demoapp.com</p>
                </div>
                <Link
                  href="/profile"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Profile
                </Link>
                <Link
                  href="/security"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Security
                </Link>
                <Link
                  href="/appearance"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Appearance
                </Link>
                <Link
                  href="/support"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Support
                </Link>
                <Link
                  href="/logout"
                  className="block px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                >
                  Log out
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Secondary Navigation */}
      <div className="bg-gray-100 px-6 py-2 flex space-x-6 text-gray-600 text-sm">
        {activeMenu === "Dashboard" && (
          <>
            <Link href="/self-statistics" className="hover:text-blue-500">
              Self Statistics
            </Link>
            <Link href="/team-statistics" className="hover:text-blue-500">
              Team Statistics
            </Link>
            <Link href="/activity-monitor" className="hover:text-blue-500">
              Activity Monitor
            </Link>
            <Link href="/team-efficiency" className="hover:text-blue-500">
              Team Efficiency
            </Link>
            <Link href="/geo-tracking" className="hover:text-blue-500">
              Geo Tracking
            </Link>
          </>
        )}

        {activeMenu === "Master Data" && (
          <>
            <NavItem href="/masterdata/regions" pathname={pathname}>
              Regions
            </NavItem>
            <NavItem href="/masterdata/grades" pathname={pathname}>
              Grades
            </NavItem>
            <NavItem href="/masterdata/designations" pathname={pathname}>
              Designations
            </NavItem>
            <NavItem href="/masterdata/nationalities" pathname={pathname}>
              Nationalities
            </NavItem>
            <NavItem href="/masterdata/organizations" pathname={pathname}>
              Organizations
            </NavItem>
            <NavItem href="/masterdata/organizationtypes" pathname={pathname}>
              Organization Types
            </NavItem>
            <NavItem
              href="/masterdata/organizationStructure"
              pathname={pathname}
            >
              Organization Structure
            </NavItem>
          </>
        )}

        {activeMenu === "Employee Master" && (
          <>
            <NavItem href="/employeemaster/employees" pathname={pathname}>
              Employees
            </NavItem>
            <NavItem href="/employeemaster/employeetypes" pathname={pathname}>
              Employee Types
            </NavItem>
            <NavItem href="/employeemaster/employeegroups" pathname={pathname}>
              Employee Groups
            </NavItem>
          </>
        )}

        {activeMenu === "Scheduling" && (
          <>
            <NavItem href="/scheduling/reasons" pathname={pathname}>
              Reasons
            </NavItem>
            <NavItem href="/scheduling/holidays" pathname={pathname}>
              Holidays
            </NavItem>
            <NavItem href="/scheduling/ramadandates" pathname={pathname}>
              Ramadan Dates
            </NavItem>
            <NavItem href="/scheduling/scheduletypes" pathname={pathname}>
              Schedule Types
            </NavItem>
            <NavItem href="/scheduling/monthlyroaster" pathname={pathname}>
              Monthly Roaster
            </NavItem>
            <NavItem href="/scheduling/weeklyschedule" pathname={pathname}>
              Weekly Schedule
            </NavItem>
          </>
        )}

        {activeMenu === "WorkForce" && (
          <>
            <NavItem href="/workforce/approvals" pathname={pathname}>
              Approvals
            </NavItem>
            <NavItem href="/workforce/reports" pathname={pathname}>
              Reports
            </NavItem>
          </>
        )}

        {activeMenu === "Leave Tracker" && (
          <>
            <NavItem href="/leavetracker/leaves" pathname={pathname}>
              Leaves
            </NavItem>
            <NavItem href="/leavetracker/permissions" pathname={pathname}>
              Permissions
            </NavItem>
            <NavItem href="/leavetracker/punches" pathname={pathname}>
              Punches
            </NavItem>
            <NavItem href="/leavetracker/workflow" pathname={pathname}>
              Work Flow
            </NavItem>
          </>
        )}
      </div>
    </nav>
  );
};

const NavItem = ({
  href,
  pathname,
  children,
}: {
  href: string;
  pathname: string | null;
  children: React.ReactNode;
}) => (
  <Link
    href={href}
    className={`hover:text-purple-500 ${pathname === href ? "text-purple-500 font-bold" : ""
      }`}
  >
    {children}
  </Link>
);

export default Navbar;
