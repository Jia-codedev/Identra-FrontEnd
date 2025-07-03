"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";


const LeavesAddPage = () => {
      const router = useRouter();


  const [formData, setFormData] = useState({
    code: "",
    descriptionEn: "",
    descriptionAr: "",
    workflow: "",
    needApproval: false,
    official: false,
    allowAttachment: false,
    mandatoryJustification: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form Data Submitted:", formData);
        router.push("./");

  };

    const handleCancel = () => {
    router.push("./");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="p-6 bg-white rounded-lg shadow-md max-w-6xl mx-auto font-sans"
    >
      <h2 className="text-xl font-semibold text-sky-600 mb-6">
        Manage Leaves
      </h2>

      {/* Grid layout for form */}
      <div className="grid grid-cols-2 gap-8">
        {/* Left Column */}
        <div className="space-y-4">
          {/* Code */}
          <div>
            <label className="block mb-1 font-medium">
              Code <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="code"
              value={formData.code}
              onChange={handleChange}
              placeholder="Enter the code"
              className="w-full border rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-sky-400"
              required
            />
          </div>

          {/* English Description */}
          <div>
            <label className="block mb-1 font-medium">
              Description (English) <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="descriptionEn"
              value={formData.descriptionEn}
              onChange={handleChange}
              placeholder="Enter the description in english"
              className="w-full border rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-sky-400"
              required
            />
          </div>

          {/* Attributes */}
          <div className="mt-6">
            <label className="block mb-2 font-medium">Leave attributes</label>
            <div className="flex gap-6 flex-wrap">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="needApproval"
                  checked={formData.needApproval}
                  onChange={handleChange}
                />
                Need Approval
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="official"
                  checked={formData.official}
                  onChange={handleChange}
                />
                Official
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="allowAttachment"
                  checked={formData.allowAttachment}
                  onChange={handleChange}
                />
                Allow Attachment
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="mandatoryJustification"
                  checked={formData.mandatoryJustification}
                  onChange={handleChange}
                />
                Mandatory Justification
              </label>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-4">
          {/* Workflow Dropdown */}
          <div>
            <label className="block mb-1 font-medium">
              Workflows <span className="text-red-500">*</span>
            </label>
            <select
              name="workflow"
              value={formData.workflow}
              onChange={handleChange}
              className="w-full border rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-sky-400"
              required
            >
              <option value="">Choose workflows</option>
              <option value="Employee Leaves">Employee Leaves</option>
              <option value="HR Approval">HR Approval</option>
              <option value="Payroll Adjustment">Payroll Adjustment</option>
            </select>
          </div>

          {/* Arabic Description */}
          <div>
            <label className="block mb-1 font-medium">
              Description (العربية) <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="descriptionAr"
              value={formData.descriptionAr}
              onChange={handleChange}
              placeholder="Enter the description in arabic"
              className="w-full border rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-sky-400"
              required
            />
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end mt-8 gap-4">
        <button
          type="button"
                    onClick={handleCancel}

          className="px-6 py-2 border rounded-full text-gray-700 hover:bg-gray-100"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-6 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-full"
        >
          Save
        </button>
      </div>
    </form>
  );
};

export default LeavesAddPage;
