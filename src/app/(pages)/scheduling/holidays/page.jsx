"use client";
import React, { useState } from "react";
import { FaSearch } from "react-icons/fa";

const Holidays = () => {
  const [holidays, setHolidays] = useState([
    { HolidayName: "Code", FromDate: "Regular text column", ToDate: "Regular text column", PublicHoliday: "Holidayname" },
    { HolidayName: "Multinational", FromDate: "Regular text column", ToDate: "Regular text column", PublicHoliday: "Holidayname" },
    { HolidayName: "France DE", FromDate: "Regular text column", ToDate: "Regular text column", PublicHoliday: "Holidayname" },
    { HolidayName: "France 32 Brand", FromDate: "Regular text column", ToDate: "Regular text column", PublicHoliday: "Holidayname" },
    { HolidayName: "France 32 Pro", FromDate: "Regular text column", ToDate: "Regular text column", PublicHoliday: "Holidayname" },
  ]);

const [hoveredIndex, setHoveredIndex] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="p-6 bg-white shadow-md rounded-lg w-full h-full">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800">Holidays</h2>
        <div className="flex items-center space-x-2 ml-auto">
          <div className="relative">
            <input
              type="text"
              placeholder="Search"
              className="pl-10 pr-4 py-2 border rounded-lg text-gray-600 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
            <FaSearch className="absolute left-3 top-3 text-gray-400" />
          </div>
          <button
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
            onClick={() => setIsModalOpen(true)}
          >
            + Add
          </button>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white rounded-2xl p-8 shadow-xl w-full max-w-4xl">
            <h2 className="text-2xl font-semibold text-center mb-6">Holidays</h2>

            {/* Switches */}
            <div className="flex items-center gap-6 mb-6 justify-center">
              <label className="inline-flex items-center gap-2 text-sm">
                <input type="checkbox" className="accent-blue-600" /> Recurring
              </label>
              <label className="inline-flex items-center gap-2 text-sm">
                <input type="checkbox" className="accent-blue-600" /> Public Holiday
              </label>
            </div>

            {/* Form Grid */}
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Holiday (English) <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Enter description in english"
                  className="w-full p-3 border rounded-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Holiday (العربية) <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Enter description in arabic"
                  className="w-full p-3 border rounded-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  From Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  className="w-full p-3 border rounded-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  To Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  className="w-full p-3 border rounded-full"
                />
              </div>

              <div className="col-span-2">
                <label className="block text-sm font-medium mb-1">Remarks</label>
                <input
                  type="text"
                  placeholder="Enter the remark"
                  className="w-full p-3 border rounded-full"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end mt-8 gap-4">
              <button
                className="px-6 py-2 bg-gray-200 rounded-full"
                onClick={() => setIsModalOpen(false)}
              >
                Cancel
              </button>
              <button className="px-6 py-2 bg-blue-600 text-white rounded-full">
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
              <th className="p-3 text-left font-medium text-gray-600">Holiday Name</th>
              <th className="p-3 text-left font-medium text-gray-600">From Date</th>
              <th className="p-3 text-left font-medium text-gray-600">To Date</th>
              <th className="p-3 text-left font-medium text-gray-600">Public Holiday</th>
              <th className="p-3 text-left font-medium text-gray-600"></th>
            </tr>
          </thead>

          <tbody>
            {holidays.map((holiday, index) => (
              <tr key={index} className="border-b hover:bg-gray-50 transition">
                <td className="p-3">
                  <input type="checkbox" className="accent-purple-600" />
                </td>
                <td className="p-3 text-purple-600 font-semibold">{holiday.HolidayName}</td>
                <td className="p-3">{holiday.FromDate}</td>
                <td className="p-3">{holiday.ToDate}</td>
                <td className="p-3">{holiday.PublicHoliday}</td>
                <td className="p-3 text-right relative">
                  <span
                    className="text-gray-400 cursor-pointer"
                    onMouseEnter={() => setHoveredIndex(index)}
                    onMouseLeave={() => setHoveredIndex(null)}
                  >
                    ⋮
                  </span>
                  {hoveredIndex === index && (
                    <div
                      className="absolute right-0 mt-2 w-32 bg-white border rounded-lg shadow-lg py-2 z-10"
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

export default Holidays;
