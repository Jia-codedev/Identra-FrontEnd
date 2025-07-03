"use client";
import React, { useState } from "react";
import { FaFilePdf, FaFileExcel, FaFileWord, FaClipboardList } from "react-icons/fa";

const Reports = () => {
  const [form, setForm] = useState({
    report: "",
    manager: "",
    employeeType: "",
    fromDate: "",
    toDate: "",
    organization: "",
    employee: "",
    employeeGroup: "",
    includeInactive: false,
  });

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Breadcrumb */}
      <div className="text-sm text-gray-500 mb-4">
        <span className="text-purple-600 font-semibold">Reports</span> / Reports
      </div>

      {/* Main Card */}
      <div className="bg-white rounded-xl shadow p-8">
        {/* Title */}
        <h2 className="text-xl font-bold text-purple-600 mb-6">Reports</h2>

        {/* Form Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Left Column */}
          <div className="flex flex-col gap-4">
            <LabelledSelect label="Reports *" placeholder="Choose report" />
            <LabelledSelect label="Manager *" placeholder="Choose manager" />
            <LabelledSelect label="Employee Types *" placeholder="Choose employee type" />
            <LabelledInput label="From Date *" type="date" />
            <div className="flex items-center mt-2">
              <input
                type="checkbox"
                id="includeInactive"
                className="mr-2"
                checked={form.includeInactive}
                onChange={() =>
                  setForm((prev) => ({
                    ...prev,
                    includeInactive: !prev.includeInactive,
                  }))
                }
              />
              <label htmlFor="includeInactive" className="text-sm text-gray-600">
                Include Inactive Staff
              </label>
            </div>
          </div>

          {/* Right Column */}
          <div className="flex flex-col gap-4">
            <LabelledSelect label="Organization *" placeholder="Choose organization" />
            <LabelledSelect label="Employee *" placeholder="Choose employee" />
            <LabelledSelect label="Employee Group" placeholder="Choose employee group" />
            <LabelledInput label="To Date *" type="date" />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3 justify-start">
          <Button icon={<FaClipboardList />} color="purple" label="Show report" />
          <Button icon={<FaFileExcel />} color="green" label="Export to excel" />
          <Button icon={<FaFilePdf />} color="red" label="Export to PDF" />
          <Button icon={<FaFileWord />} color="blue" label="Export to word" />
        </div>
      </div>
    </div>
  );
};

export default Reports;

// --- Subcomponents for JSX ---

const LabelledSelect = ({ label, placeholder }) => (
  <div>
    <label className="block mb-1 text-sm text-gray-700 font-medium">{label}</label>
    <select className="w-full border border-gray-300 rounded-full px-4 py-2 text-sm focus:ring-2 focus:ring-purple-500 focus:outline-none">
      <option>{placeholder}</option>
    </select>
  </div>
);

const LabelledInput = ({ label, type = "text" }) => (
  <div>
    <label className="block mb-1 text-sm text-gray-700 font-medium">{label}</label>
    <input
      type={type}
      className="w-full border border-gray-300 rounded-full px-4 py-2 text-sm focus:ring-2 focus:ring-purple-500 focus:outline-none"
    />
  </div>
);

const Button = ({ icon, color, label }) => {
  const colors = {
    purple: "bg-purple-600 hover:bg-purple-700",
    green: "bg-green-500 hover:bg-green-600",
    red: "bg-red-500 hover:bg-red-600",
    blue: "bg-blue-500 hover:bg-blue-600",
  };

  return (
    <button
      className={`flex items-center gap-2 text-white px-4 py-2 rounded-md text-sm ${colors[color]} transition`}
    >
      {icon}
      {label}
    </button>
  );
};
