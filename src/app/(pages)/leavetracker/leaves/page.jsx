"use client";
import React, { useState } from "react";
import { FaSearch } from "react-icons/fa";
import { FaPlus } from "react-icons/fa";
import { useRouter } from "next/navigation"; // for app router

const LeaveTypes = () => {
  const [activeTab, setActiveTab] = useState("manage");
      const router = useRouter();

  const leaveTypes = [
    { code: "101", description: "Annual Leave", approval: true, official: true, attachment: false, justification: true, workflow: "Employee Leaves" },
    { code: "384", description: "Sick Leave", approval: false, official: true, attachment: false, justification: true, workflow: "Employee Leaves" },
    { code: "OG11", description: "Special leave", approval: true, official: true, attachment: true, justification: true, workflow: "Employee Leaves" },
    { code: "1412", description: "Medical Leave", approval: false, official: true, attachment: true, justification: true, workflow: "Employee Leaves" },
    { code: "7232", description: "Special leave", approval: true, official: true, attachment: false, justification: true, workflow: "Employee Leaves" },
    { code: "943", description: "Annual Leave", approval: true, official: true, attachment: false, justification: true, workflow: "Employee Leaves" },
    { code: "1201", description: "Vacation", approval: true, official: true, attachment: false, justification: true, workflow: "Employee Leaves" },
    { code: "104571", description: "Sick leave", approval: false, official: true, attachment: false, justification: true, workflow: "Employee Leaves" },
    { code: "3211", description: "Medical leave", approval: false, official: true, attachment: true, justification: true, workflow: "Employee Leaves" },
    { code: "7325", description: "Maternity leave", approval: true, official: true, attachment: true, justification: true, workflow: "Employee Leaves" },
  ];

  const renderCheck = (value) => (value ? "✓" : "✕");

  return (
    <div className="p-6 bg-white shadow-md rounded-lg w-full h-full font-sans">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-purple-700">Manage Leaves</h2>
        <div className="flex items-center space-x-2 ml-auto">
          <div className="relative">
            <input
              type="text"
              placeholder="Search..."
              className="pl-10 pr-4 py-2 border rounded-lg text-gray-600 focus:ring-2 focus:ring-purple-500 focus:outline-none"
            />
            <FaSearch className="absolute left-3 top-3 text-gray-400" />
          </div>
          <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center space-x-1"
                onClick={() => router.push('./leaves/leaves-add')}
            >
            <FaPlus />
            <span>Add</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b mb-4 text-sm font-medium">
        <button
          className={`px-4 py-2 border-b-2 ${activeTab === "manage" ? "border-purple-600 text-purple-600" : "text-gray-500 hover:text-purple-600"}`}
          onClick={() => setActiveTab("manage")}
        >
          Manage
        </button>
        <button
          className={`px-4 py-2 border-b-2 ${activeTab === "requests" ? "border-purple-600 text-purple-600" : "text-gray-500 hover:text-purple-600"}`}
          onClick={() => setActiveTab("requests")}
        >
          Requests
        </button>
      </div>

      {/* Table */}
      {activeTab === "manage" && (
        <div className="overflow-x-auto bg-white rounded-lg shadow-md">
          <table className="min-w-full text-sm text-left">
            <thead className="bg-gray-50 text-gray-600 font-medium">
              <tr>
                <th className="p-3">
                  <input type="checkbox" className="accent-purple-600" />
                </th>
                <th className="p-3">Code</th>
                <th className="p-3">Description</th>
                <th className="p-3">Need approval</th>
                <th className="p-3">Official ( For NON DOF employees )</th>
                <th className="p-3">Allow attachment</th>
                <th className="p-3">Justification</th>
                <th className="p-3">Workflows</th>
                <th className="p-3"></th>
              </tr>
            </thead>
            <tbody className="text-gray-700">
              {leaveTypes.map((item, index) => (
                <tr key={index} className="border-t hover:bg-gray-50 transition">
                  <td className="p-3">
                    <input type="checkbox" className="accent-purple-600" />
                  </td>
                  <td className="p-3">{item.code}</td>
                  <td className="p-3">{item.description}</td>
                  <td className="p-3">{renderCheck(item.approval)}</td>
                  <td className="p-3">{renderCheck(item.official)}</td>
                  <td className="p-3">{renderCheck(item.attachment)}</td>
                  <td className="p-3">{renderCheck(item.justification)}</td>
                  <td className="p-3 text-purple-600">{item.workflow}</td>
                  <td className="p-3 text-right">
                    <span className="cursor-pointer text-gray-400 hover:text-purple-600">🖉</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Requests tab content */}
      {activeTab === "requests" && (
        <div className="text-center py-10 text-gray-400">
          No requests to show.
        </div>
      )}
    </div>
  );
};

export default LeaveTypes;
