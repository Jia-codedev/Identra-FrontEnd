"use client";
import React, { useState } from "react";
import { FaPlus, FaSearch, FaDownload, FaPen } from "react-icons/fa";
import { useRouter } from "next/navigation";

const WeeklySchedule = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();

  const scheduleData = [
    {
      monday: "Normal",
      tuesday: "Normal",
      wednesday: "Normal",
      thursday: "Normal",
      friday: "Normal",
    },
    {
      monday: "Friday",
      tuesday: "Friday",
      wednesday: "Friday",
      thursday: "Friday",
      friday: "✖",
    },
    {
      monday: "Normal",
      tuesday: "Normal",
      wednesday: "Normal",
      thursday: "Normal",
      friday: "Normal",
    },
    {
      monday: "Normal",
      tuesday: "Normal",
      wednesday: "Normal",
      thursday: "Normal",
      friday: "Normal",
    },
  ];

  return (
    <div className="p-6 font-sans max-w-7xl mx-auto">
      {/* Tabs */}
      {/* <div className="flex gap-2 mb-2">
        {["Schedules", "Weekly Schedule", "Monthly Schedule", "Holidays", "Set Ramadan Dates"].map((tab, i) => (
          <button
            key={i}
            className={`px-4 py-2 rounded ${
              tab === "Weekly Schedule"
                ? "bg-purple-100 text-purple-700 font-semibold"
                : "bg-white border text-gray-500"
            }`}
          >
            {tab}
          </button>
        ))}
      </div> */}

      {/* Breadcrumb */}
      <div className="text-sm text-purple-600 font-medium mb-4">
        Scheduling / <span className="text-gray-700">Weekly Schedule</span>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-wrap justify-between items-center mb-4 gap-4">
        <div className="flex gap-4 flex-wrap">
          <select className="border px-4 py-2 rounded-full text-sm text-gray-500">
            <option>Choose organization</option>
          </select>
          <select className="border px-4 py-2 rounded-full text-sm text-gray-500">
            <option>Choose user</option>
          </select>
          <select className="border px-4 py-2 rounded-full text-sm text-gray-500">
            <option>Choose any group</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative">
            <input
              type="text"
              placeholder="Search..."
              className="pl-9 pr-4 py-2 border rounded-full text-sm text-gray-700"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <FaSearch className="absolute left-3 top-2.5 text-gray-400" />
          </div>
          <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md flex items-center text-sm"
                                onClick={() => router.push("./weeklyschedule/weeklyschedule-add")}

          >
            <FaPlus className="mr-1" /> Add
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow border overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-gray-400 bg-gray-50">
            <tr>
              <th className="p-3"><input type="checkbox" /></th>
              <th className="p-3 font-medium">Monday</th>
              <th className="p-3 font-medium">Tuesday</th>
              <th className="p-3 font-medium">Wednesday</th>
              <th className="p-3 font-medium">Thursday</th>
              <th className="p-3 font-medium">Friday</th>
              <th className="p-3 font-medium">Attachment</th>
              <th className="p-3 font-medium text-center"> </th>
            </tr>
          </thead>
          <tbody>
            {scheduleData.map((item, index) => (
              <tr key={index} className="border-t hover:bg-gray-50">
                <td className="p-3"><input type="checkbox" /></td>
                <td className="p-3 font-medium text-gray-800">{item.monday}</td>
                <td className="p-3 font-medium text-gray-800">{item.tuesday}</td>
                <td className="p-3 font-medium text-gray-800">{item.wednesday}</td>
                <td className="p-3 font-medium text-gray-800">{item.thursday}</td>
                <td className="p-3 font-medium text-gray-800">{item.friday}</td>
                <td className="p-3 text-purple-700 font-semibold cursor-pointer hover:underline">Download</td>
                <td className="p-3 text-center text-purple-700 cursor-pointer">
                  <FaPen className="inline-block" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-4 px-2">
        <div className="flex items-center space-x-2">
          <select className="border rounded px-4 py-1 text-sm">
            <option>10</option>
            <option>25</option>
            <option>50</option>
          </select>
          <span className="text-sm text-gray-500">Records per page</span>
        </div>
        <div className="flex items-center gap-2">
          <button className="bg-gray-100 text-gray-500 rounded px-2 py-1">&lt;</button>
          <button className="bg-purple-600 text-white rounded px-3 py-1">1</button>
          <button className="bg-gray-100 text-gray-500 rounded px-2 py-1">&gt;</button>
        </div>
      </div>
    </div>
  );
};

export default WeeklySchedule;
