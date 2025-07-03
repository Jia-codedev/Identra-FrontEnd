"use client";
import React, { useState } from "react";
import { FaSearch, FaPlus } from "react-icons/fa";

const EmployeeGroups = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);

  const data = []; // Placeholder for table rows

  return (
    <div className="p-6 bg-white shadow-md rounded-lg w-full max-w-7xl mx-auto font-sans">
      {/* Search and Add Buttons on Right */}
      <div className="flex justify-end mb-4">
        <div className="flex items-center gap-3">
          <div className="relative w-64">
            <FaSearch className="absolute left-3 top-2.5 text-gray-400" />
            <input
              type="text"
              placeholder="Search..."
              className="pl-9 pr-3 py-2 border rounded-md w-full text-sm focus:outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md flex items-center text-sm"
          >
            <FaPlus className="mr-1" /> Add
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border rounded-lg overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-50 text-gray-400">
            <tr>
              <th className="p-3"><input type="checkbox" /></th>
              <th className="p-3 font-medium">Group Name</th>
              <th className="p-3 font-medium">Grouping</th>
              <th className="p-3 font-medium">From date</th>
              <th className="p-3 font-medium">To date</th>
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center py-6 text-gray-500">
                  No Rows To Show
                </td>
              </tr>
            ) : (
              data.map((item, index) => (
                <tr key={index} className="border-t hover:bg-gray-50">
                  <td className="p-3"><input type="checkbox" /></td>
                  <td className="p-3">{item.groupName}</td>
                  <td className="p-3">{item.grouping}</td>
                  <td className="p-3">{item.fromDate}</td>
                  <td className="p-3">{item.toDate}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

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
          <button className="p-1 rounded hover:bg-gray-100">&lt;</button>
          <button className="px-2 py-1 bg-purple-100 rounded text-purple-700">1</button>
          <button className="p-1 rounded hover:bg-gray-100">&gt;</button>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-start pt-20 z-50">
          <div className="bg-white rounded-xl w-full max-w-4xl p-8 relative">
            {/* Close */}
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl"
            >
              &times;
            </button>

            <h2 className="text-lg font-semibold text-center mb-6">Employee Group</h2>

            {/* Form */}
            <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Checkboxes */}
              <div className="col-span-2 flex gap-6 mb-2">
                <label className="inline-flex items-center gap-2 text-sm">
                  <input type="checkbox" />
                  Schedule Flag
                </label>
                <label className="inline-flex items-center gap-2 text-sm">
                  <input type="checkbox" />
                  Reporting Group
                </label>
              </div>

              {/* Group Name English */}
              <div>
                <label className="text-sm block mb-1 font-medium">
                  Group Name (English) <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  className="w-full border rounded-full px-4 py-2 text-sm"
                  placeholder="Enter group name"
                />
              </div>

              {/* Group Name Arabic */}
              <div>
                <label className="text-sm block mb-1 font-medium">
                  Group Name (العربية)
                </label>
                <input
                  type="text"
                  className="w-full border rounded-full px-4 py-2 text-sm"
                  placeholder="أدخل اسم الموقع"
                />
              </div>

              {/* From Date */}
              <div>
                <label className="text-sm block mb-1 font-medium">
                  From Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  className="w-full border rounded-full px-4 py-2 text-sm"
                />
              </div>

              {/* To Date */}
              <div>
                <label className="text-sm block mb-1 font-medium">
                  To Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  className="w-full border rounded-full px-4 py-2 text-sm"
                />
              </div>

              {/* Grouping */}
              <div>
                <label className="text-sm block mb-1 font-medium">
                  Grouping <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  className="w-full border rounded-full px-4 py-2 text-sm"
                  placeholder="Enter the group"
                />
              </div>
            </form>

            {/* Modal Buttons */}
            <div className="flex justify-end gap-4 mt-8">
              <button
                onClick={() => setShowModal(false)}
                className="px-6 py-2 border rounded-full text-gray-600 hover:bg-gray-100 text-sm"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-purple-600 text-white rounded-full hover:bg-purple-700 text-sm"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeGroups;
