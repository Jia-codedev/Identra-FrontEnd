"use client";
import React from "react";
import { useRouter } from "next/navigation";

const AddWeeklySchedule = () => {
  const router = useRouter();

  const weekdays = [
    "Sunday", "Monday", "Tuesday",
    "Wednesday", "Thursday", "Friday", "Saturday"
  ];

  return (
    <div className="p-6 max-w-5xl mx-auto bg-white rounded-xl shadow-md font-sans">
      <h2 className="text-xl font-semibold text-center text-purple-700 mb-6">
        Weekly Schedule
      </h2>

      <form className="grid grid-cols-2 gap-5">
        {/* From Date */}
        <div>
          <label className="text-sm font-medium text-gray-700 mb-1 block">
            From Date <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            className="w-full border border-purple-300 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        {/* To Date */}
        <div>
          <label className="text-sm font-medium text-gray-700 mb-1 block">
            To Date <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            className="w-full border border-purple-300 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        {/* Master Schedule */}
        <div className="col-span-2">
          <label className="text-sm font-medium text-gray-700 mb-1 block">
            Schedule <span className="text-red-500">*</span>
          </label>
          <select className="w-full border border-purple-300 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-700">
            <option>Choose schedule</option>
          </select>
        </div>

        {/* Weekday Dropdowns */}
        {weekdays.map((day, index) => (
          <div key={index}>
            <label className="text-sm font-medium text-gray-700 mb-1 block">
              {day}
            </label>
            <select className="w-full border border-purple-300 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-700">
              <option>Choose schedule</option>
            </select>
          </div>
        ))}

        {/* File Upload */}
        <div className="col-span-2">
          <label className="text-sm font-medium text-gray-700 mb-1 block">
            Attachment
          </label>
          <input
            type="file"
            className="text-sm border border-gray-300 px-3 py-2 rounded-md w-full"
          />
        </div>
      </form>

      {/* Buttons */}
      <div className="flex justify-end gap-4 mt-6">
        <button
          onClick={() => router.push("./")}
          className="px-6 py-2 border border-purple-300 text-purple-600 hover:bg-purple-50 rounded-full text-sm"
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
  );
};

export default AddWeeklySchedule;
