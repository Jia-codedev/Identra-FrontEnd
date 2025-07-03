"use client";
import React, { useState } from "react";
import { FaSearch } from "react-icons/fa";

const Approvals = () => {
  const [activeTab, setActiveTab] = useState("Verification");

  const data = [
    { number: "REQ1001", employee: "John Doe", type: "Paid" },
    { number: "REQ1002", employee: "Jane Smith", type: "Extra Hours" },
    { number: "REQ1003", employee: "Robert Brown", type: "Work From Home" },
    { number: "REQ1004", employee: "Emily Johnson", type: "Sick" },
    { number: "REQ1005", employee: "Michael Williams", type: "Personal" },
    { number: "REQ1006", employee: "Sarah Miller", type: "Unpaid" },
    { number: "REQ1007", employee: "David Wilson", type: "Weekend" },
    { number: "REQ1008", employee: "Jessica Davis", type: "Flexible" },
    { number: "REQ1009", employee: "Daniel Anderson", type: "Vacation" },
  ];

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Header Actions */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-white rounded-md text-gray-700 shadow-sm">
            Team Requests
          </button>
          <button className="px-4 py-2 bg-blue-100 text-blue-700 rounded-md shadow-sm">
            Approvals
          </button>
        </div>

        <div className="flex gap-2 items-center">
          <div className="relative w-64">
            <input
              type="text"
              placeholder="Search..."
              className="w-full pl-10 pr-4 py-2 rounded-full shadow-sm border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <FaSearch className="absolute left-3 top-2.5 text-gray-400" />
          </div>
          <button className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600">
            Approve
          </button>
          <button className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600">
            Reject
          </button>
        </div>
      </div>

      {/* Breadcrumb */}
      <div className="text-sm text-gray-500 mb-4">
        Manage Approvals / Approvals /{" "}
        <span className="text-purple-600">Verification</span>
      </div>

      {/* Main Card */}
      <div className="bg-white rounded-xl shadow p-6">
        {/* Title */}
        <h2 className="text-xl font-semibold text-purple-600 mb-4">
          Verification Approval
        </h2>

        {/* Tabs */}
        <div className="flex gap-6 mb-4 border-b text-sm">
          {["Verification", "Pending"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-2 ${
                activeTab === tab
                  ? "text-purple-600 border-b-2 border-purple-600 font-semibold"
                  : "text-gray-500"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-gray-400 text-left border-b">
                <th className="py-2 px-3">
                  <input type="checkbox" />
                </th>
                <th className="py-2 px-3">Number</th>
                <th className="py-2 px-3">Employee</th>
                <th className="py-2 px-3">Type</th>
              </tr>
            </thead>
            <tbody>
              {data.map((row, idx) => (
                <tr
                  key={idx}
                  className="border-b hover:bg-gray-50 transition-colors"
                >
                  <td className="py-2 px-3">
                    <input type="checkbox" />
                  </td>
                  <td className="py-2 px-3 text-blue-900 font-semibold">{row.number}</td>
                  <td className="py-2 px-3 text-blue-900 font-semibold">{row.employee}</td>
                  <td className="py-2 px-3 text-blue-900 font-semibold">{row.type}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Approvals;
