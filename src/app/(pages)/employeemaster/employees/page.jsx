"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { FaSearch, FaPlus } from "react-icons/fa";

const Employees = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();

  const data = []; // Placeholder for future employee data

  return (
    <div className="p-6 bg-white shadow-md rounded-lg w-full max-w-7xl mx-auto font-sans">
      {/* Search and Add Buttons */}
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
            onClick={() => router.push("./employees/employees-add")}
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
              <th className="p-3 font-medium">Emp No</th>
              <th className="p-3 font-medium">Name</th>
              <th className="p-3 font-medium">Join Date</th>
              <th className="p-3 font-medium">Designation</th>
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
                  <td className="p-3">{item.empNo}</td>
                  <td className="p-3">{item.name}</td>
                  <td className="p-3">{item.joinDate}</td>
                  <td className="p-3">{item.designation}</td>
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
    </div>
  );
};

export default Employees;
