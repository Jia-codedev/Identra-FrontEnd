"use client";
import React, { useState } from "react";
import { FaSearch, FaPlus } from "react-icons/fa";
import { useRouter } from "next/navigation";

const mockPunches = [
  {
    number: "REC1010",
    employee: "Olivia Martinez",
    date: "2024-10-10",
    fromDate: "2024-10-12",
    toDate: "2024-10-15",
    fromTime: "09:00",
    toTime: "17:00",
  },
  {
    number: "REC1009",
    employee: "Daniel Anderson",
    date: "2024-09-05",
    fromDate: "2024-09-07",
    toDate: "2024-09-10",
    fromTime: "10:00",
    toTime: "18:00",
  },
  {
    number: "REC1008",
    employee: "Jessica Davis",
    date: "2024-08-23",
    fromDate: "2024-08-25",
    toDate: "2024-08-28",
    fromTime: "07:30",
    toTime: "15:30",
  },
  {
    number: "REC1007",
    employee: "David Wilson",
    date: "2024-07-08",
    fromDate: "2024-07-10",
    toDate: "2024-07-13",
    fromTime: "09:15",
    toTime: "17:15",
  },
  {
    number: "REC1006",
    employee: "Sarah Miller",
    date: "2024-06-15",
    fromDate: "2024-06-17",
    toDate: "2024-06-20",
    fromTime: "08:45",
    toTime: "16:45",
  },
  {
    number: "REC1005",
    employee: "Michael Williams",
    date: "2024-05-01",
    fromDate: "2024-05-03",
    toDate: "2024-05-06",
    fromTime: "09:30",
    toTime: "17:30",
  },
  {
    number: "REC1004",
    employee: "Emily Johnson",
    date: "2024-04-20",
    fromDate: "2024-04-22",
    toDate: "2024-04-24",
    fromTime: "11:00",
    toTime: "19:00",
  },
  {
    number: "REC1003",
    employee: "Robert Brown",
    date: "2024-03-12",
    fromDate: "2024-03-14",
    toDate: "2024-03-16",
    fromTime: "10:00",
    toTime: "18:00",
  },
];
const mockRequests = [
  {
    number: "ACT1001",
    employee: "John Doe",
    date: "2024-01-10",
    time: "09:30",
    reason: "Late",
    remarks: "Noted",
    actionBy: "Manager",
    actionDate: "2024-01-11",
  },
  {
    number: "ACT1002",
    employee: "Jane Smith",
    date: "2024-02-05",
    time: "14:15",
    reason: "Absent",
    remarks: "Warning",
    actionBy: "HR",
    actionDate: "2024-02-06",
  },
  {
    number: "ACT1003",
    employee: "Robert Brown",
    date: "2024-03-12",
    time: "10:00",
    reason: "Delay",
    remarks: "Noted",
    actionBy: "Supervisor",
    actionDate: "2024-03-13",
  },
  {
    number: "ACT1004",
    employee: "Emily Johnson",
    date: "2024-04-20",
    time: "11:45",
    reason: "Break",
    remarks: "Approved",
    actionBy: "Admin",
    actionDate: "2024-04-21",
  },
];


const Punches = () => {
  const [activeTab, setActiveTab] = useState("punches");
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
    const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const router = useRouter();

  const filteredPunches = mockPunches.filter((item) =>
    item.employee.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const filteredRequests = mockRequests.filter((item) => {
    const date = new Date(item.date);
    const from = fromDate ? new Date(fromDate) : null;
    const to = toDate ? new Date(toDate) : null;

    return (!from || date >= from) && (!to || date <= to);
  });


  return (
    <div className="p-6 bg-white shadow-md rounded-lg w-full max-w-6xl mx-auto font-sans relative">
      {/* Header + Search + Add */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-purple-800">My Punches</h2>
        <div className="flex items-center space-x-2">
          <div className="relative">
            <FaSearch className="absolute left-2 top-2.5 text-gray-400 text-sm" />
            <input
              type="text"
              placeholder="Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-7 pr-3 py-1.5 border rounded-md text-sm focus:outline-none"
            />
          </div>
          {activeTab === "punches" && (
            <button
              onClick={() => setShowModal(true)}
              className="bg-purple-600 text-white px-3 py-1.5 rounded-md text-sm flex items-center hover:bg-purple-700"
            >
              <FaPlus className="mr-1" /> Add
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b mb-4">
        <button
          onClick={() => setActiveTab("punches")}
          className={`py-2 px-4 text-sm font-medium ${
            activeTab === "punches"
              ? "text-purple-600 border-b-2 border-purple-600"
              : "text-gray-500"
          }`}
        >
          My Punches
        </button>
        <button
          onClick={() => setActiveTab("requests")}
          className={`py-2 px-4 text-sm font-medium ${
            activeTab === "requests"
              ? "text-purple-600 border-b-2 border-purple-600"
              : "text-gray-500"
          }`}
        >
          My Requests
        </button>
      </div>

      {/* Table */}
      {activeTab === "punches" ? (
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 text-gray-500">
              <tr>
                <th className="p-2"><input type="checkbox" /></th>
                <th className="p-2 font-medium">Number</th>
                <th className="p-2 font-medium">Employee</th>
                <th className="p-2 font-medium">Date</th>
                <th className="p-2 font-medium">From date</th>
                <th className="p-2 font-medium">To date</th>
                <th className="p-2 font-medium">From time</th>
                <th className="p-2 font-medium">To Time</th>
              </tr>
            </thead>
            <tbody>
              {filteredPunches.length > 0 ? (
                filteredPunches.map((item, i) => (
                  <tr
                    key={i}
                    className={`border-b ${
                      i === 2 ? "bg-purple-50" : "bg-white"
                    } hover:bg-gray-50`}
                  >
                    <td className="p-2"><input type="checkbox" /></td>
                    <td className="p-2">{item.number}</td>
                    <td className="p-2 font-semibold text-purple-900">{item.employee}</td>
                    <td className="p-2">{item.date}</td>
                    <td className="p-2">{item.fromDate}</td>
                    <td className="p-2">{item.toDate}</td>
                    <td className="p-2">{item.fromTime}</td>
                    <td className="p-2">{item.toTime}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="p-4 text-center text-gray-400">
                    No matching records
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {/* Pagination */}
          <div className="flex justify-between items-center mt-4 px-2">
            <div className="flex items-center space-x-2">
              <select className="border rounded px-2 py-1 text-sm">
                <option>10</option>
                <option>25</option>
                <option>50</option>
              </select>
              <span className="text-sm text-gray-500">Records per page</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-purple-600 font-medium">
              <button className="px-2">1</button>
              <button className="px-2">2</button>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-gray-400 text-sm text-center py-10">
      {/* Tab: My Requests */}
      {activeTab === "requests" && (
        <>
          {/* Date Filters */}
          <div className="flex gap-4 mb-4">
            <div>
              <label className="block text-sm text-gray-600">From Date: <span className="text-red-500">*</span></label>
              <input
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                className="border px-3 py-1 rounded-md text-sm"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600">To Date: <span className="text-red-500">*</span></label>
              <input
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                className="border px-3 py-1 rounded-md text-sm"
              />
            </div>
          </div>

          {/* Requests Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50 text-gray-500">
                <tr>
                  <th className="p-2"><input type="checkbox" /></th>
                  <th className="p-2 font-medium">Number</th>
                  <th className="p-2 font-medium">Employee</th>
                  <th className="p-2 font-medium">Date</th>
                  <th className="p-2 font-medium">Time</th>
                  <th className="p-2 font-medium">Reason</th>
                  <th className="p-2 font-medium">Remarks</th>
                  <th className="p-2 font-medium">Action By</th>
                  <th className="p-2 font-medium">Action Date</th>
                </tr>
              </thead>
              <tbody>
                {filteredRequests.length > 0 ? (
                  filteredRequests.map((item, i) => (
                    <tr
                      key={i}
                      className="border-b hover:bg-gray-50 bg-white"
                    >
                      <td className="p-2"><input type="checkbox" /></td>
                      <td className="p-2">{item.number}</td>
                      <td className="p-2 font-semibold text-purple-900">{item.employee}</td>
                      <td className="p-2">{item.date}</td>
                      <td className="p-2">{item.time}</td>
                      <td className="p-2">{item.reason}</td>
                      <td className="p-2">{item.remarks}</td>
                      <td className="p-2">{item.actionBy}</td>
                      <td className="p-2">{item.actionDate}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={9} className="p-4 text-center text-gray-400">
                      No records match the selected date range.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      )}
            </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-start pt-20 z-50">
          <div className="bg-white rounded-lg w-full max-w-4xl p-6 relative">
            {/* Close */}
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl"
            >
              &times;
            </button>

            <h3 className="text-lg font-semibold mb-4 text-purple-800">Employees</h3>

            {/* Form Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { label: "Name", placeholder: "Choose Employee" },
                { label: "Manager", placeholder: "Choose Manager" },
                { label: "Designation", placeholder: "Choose Designation" },
                { label: "Organization", placeholder: "Choose Organization" },
                { label: "Schedule Type", placeholder: "Choose Schedule Type" },
              ].map(({ label, placeholder }, idx) => (
                <div key={idx}>
                  <label className="block text-sm text-gray-700">
                    {label} <span className="text-red-500">*</span>
                  </label>
                  <select className="w-full border rounded-full px-4 py-2 mt-1 focus:outline-none text-sm text-gray-500">
                    <option disabled>{placeholder}</option>
                  </select>
                </div>
              ))}

              <div>
                <label className="block text-sm text-gray-700">
                  Join Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  className="w-full border rounded-full px-4 py-2 mt-1 focus:outline-none text-sm"
                />
              </div>
            </div>

            {/* Active Checkbox */}
            <div className="mt-4">
              <label className="flex items-center space-x-2">
                <input type="checkbox" />
                <span>Active</span>
              </label>
            </div>

            {/* Modal Buttons */}
            <div className="mt-6 flex space-x-4">
              <button className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-full text-sm hover:bg-purple-700">
                <FaSearch className="mr-1" /> Search
              </button>
              <button className="flex items-center px-4 py-2 bg-green-500 text-white rounded-full text-sm hover:bg-green-600">
                <FaPlus className="mr-1" /> Add
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 border rounded-full text-gray-600 text-sm hover:bg-gray-100"
              >
                Cancel
              </button>
            </div>

            {/* Empty Table */}
            <div className="mt-6 overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-gray-50 text-gray-400">
                  <tr>
                    <th className="p-2"><input type="checkbox" /></th>
                    <th className="p-2 font-medium">Number</th>
                    <th className="p-2 font-medium">Name</th>
                    <th className="p-2 font-medium">Designation</th>
                    <th className="p-2 font-medium">Organization</th>
                    <th className="p-2 font-medium">Schedule_type</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td colSpan={6} className="p-4 text-center text-gray-400">
                      No Rows To Show
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Modal Pagination */}
            <div className="mt-4 flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <select className="border rounded px-2 py-1 text-sm">
                  <option>5</option>
                </select>
                <span className="text-sm text-gray-500">Records per page</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-purple-600 font-medium">
                <button className="px-2">&lt;</button>
                <button className="px-2 bg-purple-100 rounded-full">1</button>
                <button className="px-2">&gt;</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Punches;
