"use client";
import React, { useState } from "react";
import { FaSearch } from "react-icons/fa";
import { useRouter } from "next/navigation"; // for app router


const Workflow = () => {
  const [workflow, setWorkflow] = useState([
    { code: "Marketplace", category: "Permissions", steps: 1 },
    { code: "Venus DS", category: "Leaves", steps: 2 },
    { code: "Venus DS", category: "Leaves", steps: 2 },
    { code: "Venus DS", category: "Permissions", steps: 2 },
    { code: "Venus DS", category: "Missing movements", steps: 3 },
    { code: "Marketplace", category: "Missing movements", steps: 1 },
    { code: "Venus 3D Asset", category: "Missing movements", steps: 3 },
    { code: "Venus 3D Pro", category: "Missing movements", steps: 2 },
  ]);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();


  return (
    <div className="p-6 bg-white min-h-screen rounded-lg">
      {/* Title and Controls */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-800">
          Work Flows 
        </h2>
        <div className="flex items-center gap-2">
          {/* Search */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search"
              className="pl-10 pr-4 py-2 border rounded-md text-sm text-gray-600 border-gray-300"
            />
            <FaSearch className="absolute left-3 top-3 text-gray-400 text-sm" />
          </div>

          {/* Add Button */}
          <button
            className="px-4 py-2 bg-purple-600 text-white rounded-md text-sm hover:bg-purple-700"
      onClick={() => router.push('./workflow/workflow-add')}
          >
            + Add
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-white border rounded-md">
        <table className="w-full text-sm text-left text-gray-700">
          <thead className="bg-gray-50 border-b text-gray-500">
            <tr>
              <th className="p-3">
                <input type="checkbox" className="accent-purple-600" />
              </th>
              <th className="p-3 font-medium">Code</th>
              <th className="p-3 font-medium">Category</th>
              <th className="p-3 font-medium">Steps</th>
              <th className="p-3 text-right"></th>
            </tr>
          </thead>
          <tbody>
            {workflow.map((row, index) => (
              <tr
                key={index}
                className="hover:bg-gray-50 transition border-b"
              >
                <td className="p-3">
                  <input type="checkbox" className="accent-purple-600" />
                </td>
                <td className="p-3 text-purple-600 font-medium">{row.code}</td>
                <td className="p-3">{row.category}</td>
                <td className="p-3">{row.steps}</td>
                <td className="p-3 relative text-right">
                  <span
                    className="cursor-pointer text-gray-500"
                    onMouseEnter={() => setHoveredIndex(index)}
                    onMouseLeave={() => setHoveredIndex(null)}
                  >
                    ⋮
                  </span>
                  {hoveredIndex === index && (
                    <div
                      className="absolute right-0 mt-2 w-32 bg-white border rounded-md shadow-lg z-10"
                      onMouseEnter={() => setHoveredIndex(index)}
                      onMouseLeave={() => setHoveredIndex(null)}
                    >
                      <button className="block w-full px-4 py-2 text-left hover:bg-gray-100">
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
      <div className="flex justify-between items-center mt-4 text-sm text-gray-600">
        <button className="px-4 py-2 border rounded-md hover:bg-gray-100">← Previous</button>
        <div className="flex items-center gap-2">
          {[1, 2, 3, 4, 5].map((num) => (
            <button
              key={num}
              className={`w-8 h-8 rounded-md ${
                num === 1 ? "bg-purple-100 text-purple-700 font-semibold" : "hover:bg-gray-100"
              }`}
            >
              {num}
            </button>
          ))}
          <span>...</span>
          <button className="w-8 h-8 hover:bg-gray-100 rounded-md">10</button>
        </div>
        <button className="px-4 py-2 border rounded-md hover:bg-gray-100">Next →</button>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
          <div className="bg-white p-6 rounded-lg shadow-md w-96">
            <h3 className="text-lg font-semibold mb-2">Workflow</h3>
            <p className="text-sm text-gray-500 mb-4">Select the Workflow of the employee</p>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium">Code *</label>
                <input className="w-full border border-purple-500 p-2 rounded-md" placeholder="Enter Code" />
              </div>
              <div>
                <label className="block text-sm font-medium">Description (English) *</label>
                <input className="w-full border border-purple-500 p-2 rounded-md" placeholder="Enter Description" />
              </div>
              <div>
                <label className="block text-sm font-medium">Description (العربية) *</label>
                <input className="w-full border border-purple-500 p-2 rounded-md" placeholder="Enter Description" />
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <button
                className="px-4 py-2 bg-gray-200 rounded-md"
                onClick={() => setIsModalOpen(false)}
              >
                Cancel
              </button>
              <button className="px-4 py-2 bg-purple-600 text-white rounded-md">Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Workflow;
