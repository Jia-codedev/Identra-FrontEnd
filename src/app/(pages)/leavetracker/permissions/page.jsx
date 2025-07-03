"use client";
import React, { useState } from "react";
import { FaSearch, FaPlus, FaEdit } from "react-icons/fa";
import { useRouter } from "next/navigation";

const Permissions = () => {
  const [activeTab, setActiveTab] = useState("manage");
  const [selectedRow, setSelectedRow] = useState(null);
  const router = useRouter();

  const leaveTypes = [
    { description: "Short break during work hours", reason: "Break", minPerDay: 15 },
    { description: "Medical emergency leave", reason: "Health", minPerDay: 30 },
    { description: "Permission for official meeting", reason: "Meeting", minPerDay: 20 },
    { description: "Personal work outside office", reason: "Personal", minPerDay: 25 },
    { description: "Family-related emergency", reason: "Emergency", minPerDay: 60 },
  ];

  const permissionRequests = [
    {
      number: "REC1001",
      employee: "John Doe",
      date: "2024-01-10",
      fromDate: "2024-01-12",
      toDate: "2024-01-15",
      fromTime: "09:00",
      toTime: "17:00",
      justification: "Approved",
    },
    {
      number: "REC1002",
      employee: "Jane Smith",
      date: "2024-02-05",
      fromDate: "2024-02-07",
      toDate: "2024-02-10",
      fromTime: "08:30",
      toTime: "16:30",
      justification: "Pending",
    },
    {
      number: "REC1003",
      employee: "Robert Brown",
      date: "2024-03-12",
      fromDate: "2024-03-14",
      toDate: "2024-03-16",
      fromTime: "10:00",
      toTime: "18:00",
      justification: "Rejected",
    },
  ];

  return (
    <div className="p-6 bg-white shadow-md rounded-lg w-full h-full font-sans">
      {/* Top Tab Section */}
      <div className="space-y-4 mb-6">
        {/* Breadcrumb */}
        {/* <div className="text-sm text-gray-500 font-medium">
          <span className="text-gray-400">Self Services / Permissions / </span>
          <span className="text-blue-600 font-semibold">Requests</span>
        </div> */}

        {/* Filter Row */}
        <div className="flex flex-wrap items-center justify-between gap-3 bg-gray-50 p-4 rounded-lg shadow-sm">
          {/* Left Filters */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Status Filter */}
            <div className="flex items-center bg-white rounded-full px-3 py-1 shadow-sm border">
              <label className="mr-2 text-sm text-gray-600 font-medium">Status :</label>
              <select className="outline-none text-sm text-gray-600 bg-transparent">
                <option>Choose status</option>
                <option>Approved</option>
                <option>Pending</option>
                <option>Rejected</option>
              </select>
            </div>

            {/* From Date */}
            <div className="flex items-center bg-white rounded-full px-3 py-1 shadow-sm border">
              <label className="mr-2 text-sm text-gray-600 font-medium">From Date :</label>
              <input type="date" className="outline-none text-sm text-gray-600 bg-transparent" />
            </div>

            {/* To Date */}
            <div className="flex items-center bg-white rounded-full px-3 py-1 shadow-sm border">
              <label className="mr-2 text-sm text-gray-600 font-medium">To Date :</label>
              <input type="date" className="outline-none text-sm text-gray-600 bg-transparent" />
            </div>
          </div>

          {/* Right Controls */}
          <div className="flex items-center gap-3">
            {/* Search */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search..."
                className="pl-10 pr-4 py-2 rounded-full shadow-sm border text-sm text-gray-600 focus:ring-2 focus:ring-purple-400 focus:outline-none"
              />
              <FaSearch className="absolute left-3 top-2.5 text-gray-400" />
            </div>

            {/* Add Button */}
            <button
      onClick={() => {
        if (activeTab === "requests") {
          router.push("./permissions/permissions-requestadd");
        } else {
          router.push("./permissions/permissions-manageadd");
        }
      }}
              className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-full text-sm font-semibold flex items-center space-x-2"
            >
              <FaPlus />
              <span>Add</span>
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b mb-4 text-sm font-medium">
        <button
          className={`px-4 py-2 border-b-2 ${
            activeTab === "manage"
              ? "border-purple-600 text-purple-600"
              : "text-gray-500 hover:text-purple-600"
          }`}
          onClick={() => setActiveTab("manage")}
        >
          Manage
        </button>
        <button
          className={`px-4 py-2 border-b-2 ${
            activeTab === "requests"
              ? "border-purple-600 text-purple-600"
              : "text-gray-500 hover:text-purple-600"
          }`}
          onClick={() => setActiveTab("requests")}
        >
          Requests
        </button>
      </div>

      {/* Manage Table */}
      {activeTab === "manage" && (
        <div className="overflow-x-auto bg-white rounded-lg shadow-md">
          <table className="min-w-full text-sm text-left border-separate border-spacing-y-1">
            <thead className="text-purple-600 font-semibold">
              <tr>
                <th className="px-4 py-2">
                  <input type="checkbox" className="accent-purple-600" />
                </th>
                <th className="px-4 py-2">Description</th>
                <th className="px-4 py-2">Reason</th>
                <th className="px-4 py-2">Min Per Day</th>
                <th className="px-4 py-2 text-right">Edit</th>
              </tr>
            </thead>
            <tbody>
              {leaveTypes.map((item, index) => (
                <tr
                  key={index}
                  onClick={() => setSelectedRow(index)}
                  className={`transition hover:bg-purple-50 ${
                    selectedRow === index ? "bg-purple-50" : ""
                  }`}
                >
                  <td className="px-4 py-3">
                    <input type="checkbox" className="accent-purple-600" />
                  </td>
                  <td className="px-4 py-3 text-gray-900">{item.description}</td>
                  <td className="px-4 py-3 text-purple-700 font-medium">{item.reason}</td>
                  <td className="px-4 py-3 text-purple-700 font-medium">{item.minPerDay}</td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        router.push(`./leaves/leaves-edit?id=${index}`);
                      }}
                      className="text-purple-600 hover:text-purple-800"
                      title="Edit"
                    >
                      <FaEdit />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Requests Table */}
      {activeTab === "requests" && (
        <div className="overflow-x-auto bg-white rounded-lg shadow-md">
          <table className="min-w-full text-sm text-left border-separate border-spacing-y-1">
            <thead className="text-purple-600 font-semibold">
              <tr>
                <th className="px-4 py-2">
                  <input type="checkbox" className="accent-purple-600" />
                </th>
                <th className="px-4 py-2">Number</th>
                <th className="px-4 py-2">Employee</th>
                <th className="px-4 py-2">Date</th>
                <th className="px-4 py-2">From Date</th>
                <th className="px-4 py-2">To Date</th>
                <th className="px-4 py-2">From Time</th>
                <th className="px-4 py-2">To Time</th>
                <th className="px-4 py-2">Justification</th>
              </tr>
            </thead>
            <tbody>
              {permissionRequests.map((item, index) => (
                <tr key={index} className="transition hover:bg-purple-50">
                  <td className="px-4 py-3">
                    <input type="checkbox" className="accent-purple-600" />
                  </td>
                  <td className="px-4 py-3">{item.number}</td>
                  <td className="px-4 py-3">{item.employee}</td>
                  <td className="px-4 py-3">{item.date}</td>
                  <td className="px-4 py-3">{item.fromDate}</td>
                  <td className="px-4 py-3">{item.toDate}</td>
                  <td className="px-4 py-3">{item.fromTime}</td>
                  <td className="px-4 py-3">{item.toTime}</td>
                  <td className="px-4 py-3 font-semibold text-gray-700">
                    {item.justification}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Permissions;
