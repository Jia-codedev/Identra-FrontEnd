"use client";
import React, { useState } from "react";
import Link from "next/link";
import { FiSettings, FiBell } from "react-icons/fi"; // Importing icons
import { usePathname } from "next/navigation"; // Use usePathname instead of useRouter

const Navbar = () => {
  const [activeMenu, setActiveMenu] = useState("Dashboard");
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const pathname = usePathname(); // Get current URL path


  return (
    <nav className="bg-white shadow-md relative">
      {/* Top Navigation */}
      <div className="flex items-center justify-between px-6 py-3">
        {/* Left Side: Logo & Main Navigation */}
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-2">
            <img src="/logo.png" alt="Chronologix Logo" className="h-6" />
            <span className="text-lg font-semibold text-gray-800">Chronologix</span>
          </div>

          {/* Primary Navigation Links */}
          {["Dashboard", "Master Data", "Employee Master","Scheduling","WorkForce","Leave Tracker"].map((menu) => (
            <button
              key={menu}
              className={`px-3 py-2 rounded-lg font-semibold ${activeMenu === menu ? "bg-purple-600 text-white" : "text-gray-700 hover:text-purple-500"
                }`}
              onClick={() => setActiveMenu(menu)}
            >
              {menu}
            </button>
          ))}
        </div>

        {/* Right Side: Icons & Profile */}
        <div className="flex items-center space-x-4">
          {/* Settings Icon with Hover Dropdown */}
          <div
            className="relative"
            onMouseEnter={() => setIsSettingsOpen(true)}
            onMouseLeave={() => setIsSettingsOpen(false)}
          >
            <FiSettings className="text-gray-600 text-xl cursor-pointer hover:text-blue-500" />

            {/* Settings Dropdown Modal */}
            {isSettingsOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white shadow-lg rounded-lg py-2 border z-50">
                <Link href="/settings/app" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  Application Settings
                </Link>
                <Link href="/settings/notifications" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  Notification Settings
                </Link>
                <Link href="/settings/organizations" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  Organizations
                </Link>
                <Link href="/logs/employee" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  View Employee Logs
                </Link>
                <Link href="/logs/view" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  View Logs
                </Link>
                <Link href="/announcement" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  Announcement
                </Link>
                <Link href="/license" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  License
                </Link>
              </div>
            )}
          </div>

          {/* Notification Icon */}
          <FiBell className="text-gray-600 text-xl cursor-pointer hover:text-blue-500" />

          {/* Profile Picture with Hover Effect */}
          <div
            className="relative"
            onMouseEnter={() => setIsProfileOpen(true)}
            onMouseLeave={() => setIsProfileOpen(false)}
          >
            <img src="/user-avatar.png" alt="Profile" className="h-8 w-8 rounded-full border cursor-pointer" />

            {/* Profile Dropdown Modal */}
            {isProfileOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-lg py-2 border z-50">
                <div className="px-4 py-2 border-b">
                  <p className="text-sm font-medium text-gray-900">Janaki Alagappan</p>
                  <p className="text-xs text-gray-500">Janaki@demoapp.com</p>
                </div>
                <Link href="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  Profile
                </Link>
                <Link href="/security" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  Security
                </Link>
                <Link href="/language" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  Language
                </Link>
                <Link href="/appearance" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  Appearance
                </Link>
                <Link href="/support" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  Support
                </Link>
                <Link href="/logout" className="block px-4 py-2 text-sm text-red-600 hover:bg-gray-100">
                  Log out
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Secondary Navigation - Changes based on selected menu */}
      <div className="bg-gray-100 px-6 py-2 flex space-x-6 text-gray-600 text-sm">
        {activeMenu === "Dashboard" && (
          <>
            <Link href="/self-statistics" className="hover:text-blue-500">Self Statistics</Link>
            <Link href="/team-statistics" className="hover:text-blue-500">Team Statistics</Link>
            <Link href="/activity-monitor" className="hover:text-blue-500">Activity Monitor</Link>
            <Link href="/team-efficiency" className="hover:text-blue-500">Team Efficiency</Link>
            <Link href="/geo-tracking" className="hover:text-blue-500">Geo Tracking</Link>
          </>
        )}

        {activeMenu === "Master Data" && (
          <>
            <Link href="/masterdata/regions" className={`hover:text-purple-500 ${pathname === "/masterdata/regions" ? "text-purple-500 font-bold" : "" }`}>Regions</Link>
            <Link href="/masterdata/grades" className={`hover:text-purple-500 ${pathname === "/masterdata/grades" ? "text-purple-500 font-bold" : "" }`}>Grades</Link>
            <Link href="/masterdata/designations" className={`hover:text-purple-500 ${pathname === "/masterdata/designations" ? "text-purple-500 font-bold" : "" }`}>Designations</Link>
            <Link href="/masterdata/nationalities" className={`hover:text-purple-500 ${pathname === "/masterdata/nationalities" ? "text-purple-500 font-bold" : "" }`}>Nationalities</Link>
            <Link href="/masterdata/organizations" className={`hover:text-purple-500 ${pathname === "/masterdata/organizations" ? "text-purple-500 font-bold" : "" }`}>Organizations</Link>
            <Link href="/masterdata/organizationtypes" className={`hover:text-purple-500 ${pathname === "/masterdata/organizationtypes" ? "text-purple-500 font-bold" : "" }`}>Organization Types</Link>
            <Link href="/masterdata/organizationStructure" className={`hover:text-purple-500 ${pathname === "/masterdata/organizationStructure" ? "text-purple-500 font-bold" : "" }`}>Organization Structure</Link>
          </>
        )}
                {activeMenu === "Employee Master" && (
          <>
            <Link href="/employeemaster/workflow" className={`hover:text-purple-500 ${pathname === "/employeemaster/workflow" ? "text-purple-500 font-bold" : "" }`}>Work Flow</Link>
            <Link href="/employeemaster/employees" className={`hover:text-purple-500 ${pathname === "/employeemaster/employees" ? "text-purple-500 font-bold" : "" }`}>Employees</Link>
            <Link href="/employeemaster/employeetypes" className={`hover:text-purple-500 ${pathname === "/employeemaster/employeetypes" ? "text-purple-500 font-bold" : "" }`}>Employee Types</Link>
            <Link href="/employeemaster/employeegroups" className={`hover:text-purple-500 ${pathname === "/employeemaster/employeegroups" ? "text-purple-500 font-bold" : "" }`}>Employee Groups</Link>
          </>
        )}
        {activeMenu === "Scheduling" && (
          <>
            <Link href="/scheduling/reasons" className={`hover:text-purple-500 ${pathname === "/scheduling/reasons" ? "text-purple-500 font-bold" : "" }`}>Reasons</Link>
            <Link href="/scheduling/holidays" className={`hover:text-purple-500 ${pathname === "/scheduling/holidays" ? "text-purple-500 font-bold" : "" }`}>Holidays</Link>
            <Link href="/scheduling/ramadandates" className={`hover:text-purple-500 ${pathname === "/scheduling/ramadandates" ? "text-purple-500 font-bold" : "" }`}>Ramadan Dates</Link>
            <Link href="/scheduling/scheduletypes" className={`hover:text-purple-500 ${pathname === "/scheduling/scheduletypes" ? "text-purple-500 font-bold" : "" }`}>Schedule Types</Link>
            <Link href="/scheduling/monthlyroaster" className={`hover:text-purple-500 ${pathname === "/scheduling/monthlyroaster" ? "text-purple-500 font-bold" : "" }`}>Monthly Roaster</Link>
            <Link href="/scheduling/weeklyschedule" className={`hover:text-purple-500 ${pathname === "/scheduling/weeklyschedule" ? "text-purple-500 font-bold" : "" }`}>Weekly Schedule</Link>         
          </>
        )}
        {activeMenu === "WorkForce" && (
          <>
            <Link href="/workforce/approvals" className={`hover:text-purple-500 ${pathname === "/workforce/approvals" ? "text-purple-500 font-bold" : "" }`}>Approvals</Link>
            <Link href="/workforce/reports" className={`hover:text-purple-500 ${pathname === "/workforce/reports" ? "text-purple-500 font-bold" : "" }`}>Reports</Link>         

          </>
        )}
        {activeMenu === "Leave Tracker" && (
          <>
            <Link href="/leavetracker/leaves" className={`hover:text-purple-500 ${pathname === "/leavetracker/leaves" ? "text-purple-500 font-bold" : "" }`}>Leaves</Link>
            <Link href="/leavetracker/permissions" className={`hover:text-purple-500 ${pathname === "/leavetracker/permissions" ? "text-purple-500 font-bold" : "" }`}>Permissions</Link>
            <Link href="/leavetracker/punches" className={`hover:text-purple-500 ${pathname === "/leavetracker/punches" ? "text-purple-500 font-bold" : "" }`}>Punches</Link>
          </>
        )}

      </div>
    </nav>
  );
};

export default Navbar;
