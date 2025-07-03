"use client";
import React, { useState } from "react";
import { FaSearch, FaPlus } from "react-icons/fa";
import { useRouter } from "next/navigation";

const ScheduleTypes = () => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div className="p-6 max-w-7xl mx-auto font-sans">
      {/* Tabs */}
      {/* <div className="flex gap-2 mb-6">
        {["Schedules", "Weekly Schedule", "Monthly Schedule", "Holidays", "Set Ramadan Dates"].map((tab, i) => (
          <button
            key={i}
            className={`px-4 py-2 rounded ${
              tab === "Schedules"
                ? "bg-blue-100 text-blue-700 font-semibold"
                : "bg-white border text-gray-500"
            }`}
          >
            {tab}
          </button>
        ))}
      </div> */}

      {/* Breadcrumb */}
      <div className="text-sm text-gray-600 font-medium mb-4">
        Scheduling / <span className="text-purple-700">Schedule Types</span>
      </div>

      {/* Search and Add */}
      <div className="flex justify-between items-center mb-4 flex-wrap gap-4">
        <div className="relative w-full sm:max-w-sm">
          <input
            type="text"
            placeholder="Search..."
            className="pl-10 pr-4 py-2 border rounded-full text-sm w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <FaSearch className="absolute left-3 top-2.5 text-gray-400" />
        </div>
        <button
          className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md flex items-center text-sm"
          onClick={() => router.push("./scheduletypes/scheduletypes-add")}
        >
          <FaPlus className="mr-2" /> Add
        </button>
      </div>

      {/* Table */}
      <div className="bg-white border rounded-lg shadow overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-gray-400 bg-gray-50">
            <tr>
              <th className="p-3"><input type="checkbox" /></th>
              <th className="p-3 font-medium">Code</th>
              <th className="p-3 font-medium">Color</th>
              <th className="p-3 font-medium">Organization</th>
              <th className="p-3 font-medium">In Time</th>
              <th className="p-3 font-medium">Out Time</th>
              <th className="p-3 font-medium">Inactive Date</th>
            </tr>
          </thead>
          <tbody>
            <tr className="text-center">
              <td colSpan="7" className="py-6 text-gray-400 font-medium">
                No Rows To Show
              </td>
            </tr>
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

export default ScheduleTypes;
