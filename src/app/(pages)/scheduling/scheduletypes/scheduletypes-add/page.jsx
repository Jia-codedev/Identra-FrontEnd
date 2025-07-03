"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

const ScheduleTypesAdd = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("Normal");

  const tabs = ["Normal", "Ramadan", "Policy"];

  const renderFormFields = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Select label="Organization" options={["Org A", "Org B"]} />
      <Input label="Code" />
      <Input label="In Time" type="time" />
      <Input label="Out Time" type="time" />
      <Input label="Required Work Hours" />
      <Input label="Grace In (minutes)" />
      <Input label="Grace Out (minutes)" />
      <Input label="Inactive Date" type="date" />
      <Input label="Schedule Location" />
      <Input label="Color" type="color" />

      <div className="flex items-center gap-2 col-span-1 md:col-span-2">
        <Checkbox label="Flexible" />
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
          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={() => router.push("/scheduletypes")}
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
          <div>
            <label className="block mb-2 font-medium text-gray-700">Policy Details</label>
            <textarea
              rows={6}
              placeholder="Enter policy details..."
              className="w-full border rounded-md p-3 text-sm"
            />
          </div>
          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={() => router.push("/scheduletypes")}
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
  };

  return (
    <div className="max-w-5xl mx-auto bg-white p-6 shadow rounded-lg font-sans text-sm">
      <h2 className="text-xl font-semibold text-center mb-6 text-purple-700">Add Schedule Type</h2>

      {/* Tabs */}
      <div className="flex justify-center mb-8 space-x-4">
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

// Input component
const Input = ({ label, type = "text" }) => (
  <div>
    <label className="block mb-1 font-medium text-gray-700">{label}</label>
    <input
      type={type}
      className="w-full border border-gray-300 rounded-md px-4 py-2"
    />
  </div>
);

// Select dropdown
const Select = ({ label, options = [] }) => (
  <div>
    <label className="block mb-1 font-medium text-gray-700">{label}</label>
    <select className="w-full border border-gray-300 rounded-md px-4 py-2">
      <option value="">Select {label.toLowerCase()}</option>
      {options.map((opt, idx) => (
        <option key={idx} value={opt}>
          {opt}
        </option>
      ))}
    </select>
  </div>
);

// Checkbox
const Checkbox = ({ label }) => (
  <label className="inline-flex items-center text-gray-700 mr-4">
    <input type="checkbox" className="mr-2" />
    {label}
  </label>
);

export default ScheduleTypesAdd;
