"use client";
import React, { useState } from "react";
import { FaSearch, FaDownload, FaLock } from "react-icons/fa";

const MonthlySchedule = () => {
  const daysInMonth = Array.from({ length: 31 }, (_, i) => i + 1);
  const groups = [
    {
      group: "ADMIN - ADMIN",
      members: [
        {
          role: "Advisor - Advisor",
          data: [
            { number: "DGS131", name: "Senior Advisor" },
            { number: "DGS131", name: "Junior Advisor" },
          ],
        },
      ],
    },
    {
      group: "Chairman Office",
      members: [
        {
          role: "Management",
          data: [
            { number: "DGS131", name: "Office Manager" },
            { number: "DGS131", name: "Assistant Manager" },
          ],
        },
      ],
    },
    {
      group: "Internal Auditor",
      members: [
        {
          role: "Audit Team",
          data: [
            { number: "DGS131", name: "Senior Auditor" },
            { number: "DGS131", name: "Junior Auditor" },
          ],
        },
      ],
    },
  ];

  const getRandomShift = () => {
    const shifts = ["Day", "Nor", "Nig", "Fri"];
    return shifts[Math.floor(Math.random() * shifts.length)];
  };

  const getShiftColor = (shift) => {
    const map = {
      Day: "bg-green-500",
      Nor: "bg-purple-500",
      Nig: "bg-red-500",
      Fri: "bg-purple-500",
    };
    return map[shift] || "bg-gray-300";
  };

  return (
    <div className="p-6 max-w-full mx-auto font-sans text-sm">
      {/* Tabs */}
      {/* <div className="flex gap-2 mb-3">
        {["Schedules", "Weekly Schedule", "Monthly Schedule", "Holidays", "Set Ramadan Dates"].map((tab) => (
          <button
            key={tab}
            className={`px-4 py-2 rounded ${
              tab === "Monthly Schedule"
                ? "bg-purple-600 text-white font-semibold"
                : "bg-gray-100 text-gray-700"
            }`}
          >
            {tab}
          </button>
        ))}
      </div> */}

      {/* Breadcrumb */}
      {/* <div className="text-sm text-purple-600 mb-4">Scheduling / <span className="text-gray-700">Monthly Schedule</span></div> */}

{/* Filters */}
<div className="bg-white rounded-lg shadow-sm p-4 mb-6">
  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
    <div>
      <label className="block text-sm font-medium mb-1">Organization <span className="text-red-500">*</span></label>
      <select className="w-full border px-4 py-2 rounded text-sm">
        <option>Choose any one</option>
      </select>
    </div>
    <div>
      <label className="block text-sm font-medium mb-1">Month <span className="text-red-500">*</span></label>
      <select className="w-full border px-4 py-2 rounded text-sm">
        <option>Choose month</option>
      </select>
    </div>
    <div>
      <label className="block text-sm font-medium mb-1">Year <span className="text-red-500">*</span></label>
      <select className="w-full border px-4 py-2 rounded text-sm">
        <option>Choose year</option>
      </select>
    </div>
    <div>
      <label className="block text-sm font-medium mb-1">Day</label>
      <select className="w-full border px-4 py-2 rounded text-sm">
        <option>Choose day</option>
      </select>
    </div>
    <div>
      <label className="block text-sm font-medium mb-1">Employee</label>
      <select className="w-full border px-4 py-2 rounded text-sm">
        <option>Choose employee</option>
      </select>
    </div>
    <div>
      <label className="block text-sm font-medium mb-1">Group</label>
      <select className="w-full border px-4 py-2 rounded text-sm">
        <option>Choose group</option>
      </select>
    </div>
    <div>
      <label className="block text-sm font-medium mb-1">Manager</label>
      <select className="w-full border px-4 py-2 rounded text-sm">
        <option>Choose manager</option>
      </select>
    </div>
    <div>
      <label className="block text-sm font-medium mb-1">Schedule</label>
      <select className="w-full border px-4 py-2 rounded text-sm">
        <option>Choose schedule</option>
      </select>
    </div>
  </div>

  <div className="flex items-center justify-between flex-wrap gap-4">
    <div>
      <input type="file" className="text-sm" />
    </div>
    <div className="flex gap-2 flex-wrap">
      <button className="flex items-center gap-1 bg-purple-50 text-purple-700 border px-3 py-1 rounded text-sm">
        <span className="text-base">⬇</span> Import
      </button>
      <button className="flex items-center gap-1 bg-purple-50 text-purple-700 border px-3 py-1 rounded text-sm">
        <span className="text-base">⬆</span> Export
      </button>
      <button className="bg-purple-50 text-purple-700 border px-3 py-1 rounded text-sm">Copy Roster</button>
      <button className="bg-purple-50 text-purple-700 border px-3 py-1 rounded text-sm">Copy</button>
      <button className="bg-purple-50 text-purple-700 border px-3 py-1 rounded text-sm">Paste</button>
    </div>
  </div>
</div>

      {/* Table */}
      <div className="overflow-x-auto border rounded">
        <table className="w-full text-sm border-collapse">
          <thead className="bg-gray-50">
            <tr className="border-b">
              <th className="p-2"><input type="checkbox" /></th>
              <th className="p-2">Number</th>
              <th className="p-2">Name</th>
              <th className="p-2">Version</th>
              <th className="p-2">Status</th>
              {daysInMonth.map((d) => (
                <th key={d} className="p-2 text-center">{d}</th>
              ))}
              <th className="p-2">Work hours</th>
            </tr>
          </thead>
          <tbody>
            {groups.map((group) => (
              <React.Fragment key={group.group}>
                <tr className="bg-indigo-200 text-left font-semibold text-indigo-900">
                  <td colSpan={35} className="px-4 py-2">{group.group}</td>
                </tr>
                {group.members.map((roleBlock, idx) => (
                  <React.Fragment key={idx}>
                    <tr className="bg-gray-100 text-sm font-medium">
                      <td colSpan={35} className="px-4 py-2">{roleBlock.role}</td>
                    </tr>
                    {roleBlock.data.map((row, i) => (
                      <tr key={i} className="border-b hover:bg-gray-50">
                        <td className="p-2"><input type="checkbox" /></td>
                        <td className="p-2">{row.number}</td>
                        <td className="p-2">{row.name}</td>
                        <td className="p-2">24.Jan.2021</td>
                        <td className="p-2 text-center text-purple-600"><FaLock /></td>
                        {daysInMonth.map((d) => {
                          const shift = getRandomShift();
                          return (
                            <td key={d} className="p-1 text-white text-center">
                              <span className={`px-2 py-1 rounded text-xs ${getShiftColor(shift)}`}>{shift}</span>
                            </td>
                          );
                        })}
                        <td className="p-2 text-center">17:00</td>
                      </tr>
                    ))}
                  </React.Fragment>
                ))}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination + Footer Actions */}
      <div className="flex justify-between items-center mt-6">
        <div className="flex items-center space-x-2">
          <select className="border rounded px-4 py-1 text-sm">
            <option>10</option>
            <option>25</option>
          </select>
          <span className="text-sm text-gray-500">Records per page</span>
        </div>
        <div className="flex gap-2">
          <button className="bg-purple-600 text-white px-4 py-1 rounded">Save</button>
          <button className="bg-green-600 text-white px-4 py-1 rounded">Finalize</button>
          <button className="bg-gray-300 text-gray-800 px-4 py-1 rounded">Un-finalize</button>
          <button className="bg-red-500 text-white px-4 py-1 rounded">Clear</button>
        </div>
      </div>
    </div>
  );
};

export default MonthlySchedule;
