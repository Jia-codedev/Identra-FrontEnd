"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

const ScheduleTypesAdd = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("Normal");
  const [selectedColor, setSelectedColor] = useState("#000000");

  const tabs = ["Normal", "Ramadan", "Policy"];
  const colorOptions = [
    { label: "#0E6ECF", value: "#0E6ECF" },
    { label: "#00C875", value: "#00C875" },
    { label: "#DF2F4A", value: "#DF2F4A" },
    { label: "#9D50DD", value: "#9D50DD" },
    { label: "#000000", value: "#000000" },
  ];

  const renderFormFields = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Select label="Organization *" options={["Org A", "Org B"]} />
      <Select label="Schedule Location *" options={["Location A", "Location B"]} />
      <Input label="Code *" />

{/* Color Dropdown */}
<div>
  <label className="block mb-1 font-medium text-gray-700">
    Color <span className="text-red-500">*</span>
  </label>
  <div className="relative">
    <select
      value={selectedColor}
      onChange={(e) => setSelectedColor(e.target.value)}
      className="w-full border border-gray-300 rounded-full px-4 py-2 pr-10 appearance-none"
    >
      {colorOptions.map((color, idx) => (
        <option key={idx} value={color.value}>
          {color.label}
        </option>
      ))}
    </select>

    {/* Color swatch */}
    <span
      className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 rounded"
      style={{ backgroundColor: selectedColor }}
    ></span>
  </div>
</div>
      <Input label="In Time *" type="time" />
      <Input label="Out Time *" type="time" />
      <Input label="Required Work Hours" placeholder="Choose duration" />
      <Input label="Flexible (Minutes)" />
      <Input label="Grace In (Minutes)" />
      <Input label="Grace Out (Minutes)" />
      {activeTab === "Normal" && <Input label="Inactive Date" type="date" />}
      <div className="flex items-center gap-4 col-span-1 md:col-span-2">
        <Checkbox label="Open Shift" />
        <Checkbox label="Night Shift" />
      </div>
    </div>
  );

  const renderTabContent = () => {
    if (activeTab === "Normal" || activeTab === "Ramadan") {
      return (
        <form className="space-y-6">
          {renderFormFields()}
          <div className="flex justify-end gap-4 pt-6">
            <button
              type="button"
              onClick={() => router.push("./")}
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
        </form>
      );
} else if (activeTab === "Policy") {
  return (
    <form className="space-y-6">
      {/* Show On Report */}
      <div className="flex items-center gap-8">
        <span className="w-48 text-gray-700">Show On Report :</span>
        <label className="inline-flex items-center gap-2">
          <input type="radio" name="showOnReport" value="firstLast" className="w-4 h-4" />
          First IN/Last Out
        </label>
        <label className="inline-flex items-center gap-2">
          <input type="radio" name="showOnReport" value="all" className="w-4 h-4" />
          All Transactions
        </label>
      </div>

      {/* Email Notification */}
      <div className="flex items-center gap-8">
        <span className="w-48 text-gray-700">Email Notification :</span>
        <label className="inline-flex items-center gap-2">
          <input type="radio" name="emailNotification" value="firstLast" className="w-4 h-4" />
          First IN/Last Out
        </label>
        <label className="inline-flex items-center gap-2">
          <input type="radio" name="emailNotification" value="all" className="w-4 h-4" />
          All Transactions
        </label>
      </div>

      {/* Checkboxes */}
      <div className="space-y-4">
        {[
          "Calculate Worked Hours From Schedule Start Time",
          "Enable Default Overtime",
          "Enable Default Break Hours",
          "Override Schedule On Holiday",
          "Reduce Required Hours If Personal Permission Is Approved",
        ].map((label, idx) => (
          <label key={idx} className="flex items-center gap-2">
            <input type="checkbox" className="w-4 h-4" /> {label}
          </label>
        ))}
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end gap-4 pt-6">
        <button
          type="button"
          onClick={() => router.push("./")}
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
    </form>
  );
}
  }
return (
    <div className="max-w-5xl mx-auto bg-white p-6 shadow rounded-lg font-sans text-sm overflow-visible">
      <h2 className="text-xl font-semibold text-center mb-6 text-purple-700">
        Add Schedule Type
      </h2>

      {/* Tabs */}
      <div className="flex justify-center mb-6 space-x-4 border-b-0">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-2 rounded-full border ${
              activeTab === tab
                ? "bg-purple-600 text-white"
                : "bg-white text-gray-600 border-gray-300 hover:bg-purple-50"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Form Content */}
      {renderTabContent()}
    </div>
  );
};

// Input Component
const Input = ({ label, type = "text", placeholder = "" }) => (
  <div>
    <label className="block mb-1 font-medium text-gray-700">{label}</label>
    <input
      type={type}
      placeholder={placeholder}
      className="w-full border border-gray-300 rounded-md px-4 py-2"
    />
  </div>
);

// Select Component
const Select = ({ label, options = [] }) => (
  <div>
    <label className="block mb-1 font-medium text-gray-700">{label}</label>
    <select className="w-full border border-gray-300 rounded-md px-4 py-2">
      <option value="">Choose {label.toLowerCase()}</option>
      {options.map((opt, idx) => (
        <option key={idx} value={opt}>
          {opt}
        </option>
      ))}
    </select>
  </div>
);

// Checkbox Component
const Checkbox = ({ label }) => (
  <label className="inline-flex items-center text-gray-700">
    <input type="checkbox" className="mr-2" />
    {label}
  </label>
);

export default ScheduleTypesAdd;
