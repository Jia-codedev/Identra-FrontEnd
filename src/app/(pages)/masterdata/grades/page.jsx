"use client";
import React, { useState } from "react";
import { FaSearch } from "react-icons/fa";

const Grades = () => {
  const [grades, setGrades] = useState([
    { code: "Code", description: "Regular text column", updated: "Regular text column" },
    { code: "Multinational", description: "Regular text column", updated: "Regular text column" },
    { code: "France DE", description: "Regular text column", updated: "Regular text column" },
    { code: "France 32 Brand", description: "Regular text column", updated: "Regular text column" },
    { code: "France 32 Pro", description: "Regular text column", updated: "Regular text column" },
  ]);

  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false); // State to control modal visibility

  return (
    <div className="p-6 bg-white shadow-md rounded-lg w-full h-full">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800">Grades</h2>

        {/* Search and Add Button */}
        <div className="flex items-center space-x-2 ml-auto">
          {/* Search Bar */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search"
              className="pl-10 pr-4 py-2 border rounded-lg text-gray-600 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
            <FaSearch className="absolute left-3 top-3 text-gray-400" />
          </div>

          {/* ✅ Fixed Add Button (Now Opens Modal) */}
          <button 
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
            onClick={() => setIsModalOpen(true)} // <-- Fix: Open modal on click
          >
            + Add
          </button>
        </div>
      </div>

      {/* ✅ Modal */}
      {isModalOpen && (
  <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
    <div className="bg-white p-6 rounded-lg shadow-lg w-96">
      {/* Modal Header */}
      <h2 className="text-lg font-semibold">Grades</h2>
      <p className="text-sm text-gray-500">Select the grades of the employee</p>

      {/* Input Fields */}
      <div className="mt-4">
  <label className="block text-sm font-medium">Code *</label>
  <input
    type="text"
    placeholder="Enter code"
    className="w-full p-2 border border-purple-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
  />
</div>

<div className="mt-2">
  <label className="block text-sm font-medium">Description (English) *</label>
  <input
    type="text"
    placeholder="Enter Description"
    className="w-full p-2 border border-purple-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
  />
</div>

<div className="mt-2">
  <label className="block text-sm font-medium">Description (العربية) *</label>
  <input
    type="text"
    placeholder="Enter Description"
    className="w-full p-2 border border-purple-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
  />
</div>
      {/* Buttons */}
      <div className="mt-4 flex justify-between">
        <button className="px-4 py-2 bg-gray-300 rounded-lg" onClick={() => setIsModalOpen(false)}>
          Cancel
        </button>
        <button className="px-4 py-2 bg-purple-600 text-white rounded-lg">
          Save
        </button>
      </div>
    </div>
  </div>
)}

      {/* Table */}
      <div className="overflow-hidden bg-white rounded-lg shadow-md">
        <table className="w-full border-collapse">
          <thead className="bg-gray-100 border-b sticky top-0">
            <tr>
              <th className="p-3 text-left font-medium text-gray-600">
                <input type="checkbox" className="accent-purple-600" />
              </th>
              <th className="p-3 text-left font-medium text-gray-600">Code</th>
              <th className="p-3 text-left font-medium text-gray-600">Description</th>
              <th className="p-3 text-left font-medium text-gray-600">Updated</th>
              <th className="p-3 text-left font-medium text-gray-600"></th>
            </tr>
          </thead>

          <tbody>
            {grades.map((grade, index) => (
              <tr key={index} className="border-b hover:bg-gray-50 transition">
                <td className="p-3">
                  <input type="checkbox" className="accent-purple-600" />
                </td>
                <td className="p-3 text-purple-600 font-semibold">{grade.code}</td>
                <td className="p-3">{grade.description}</td>
                <td className="p-3">{grade.updated}</td>

                {/* Three Dots with Hover Modal */}
                <td className="p-3 text-right relative">
                  <span className="text-gray-400 cursor-pointer" onMouseEnter={() => setHoveredIndex(index)} onMouseLeave={() => setHoveredIndex(null)}>
                    ⋮
                  </span>

                  {hoveredIndex === index && (
                    <div className="absolute right-0 mt-2 w-32 bg-white border rounded-lg shadow-lg py-2 z-10"
                      onMouseEnter={() => setHoveredIndex(index)}
                      onMouseLeave={() => setHoveredIndex(null)}
                    >
                      <button className="block w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100">
                        ✏️ Edit
                      </button>
                      <button className="block w-full px-4 py-2 text-left text-red-600 hover:bg-gray-100">
                        🗑️ Delete
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-4">
        <button className="px-4 py-2 text-gray-600 border rounded-lg hover:bg-gray-100 transition">
          Previous
        </button>
        <span className="text-gray-600">Page 1</span>
        <button className="px-4 py-2 text-gray-600 border rounded-lg hover:bg-gray-100 transition">
          Next
        </button>
      </div>
    </div>
  );
};

export default Grades;
