"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

const ManageAdd = () => {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1); // Step 1 = Basic, 2 = Setup, etc.

  const stepLabels = ["Basic", "Setup", "Restrictions", "Policy"];

  // Collecting form data (example)
  const [formData, setFormData] = useState({
    reason: "",
    descriptionEn: "",
    descriptionAr: "",
    commentsEn: "",
    commentsAr: "",
    // add other fields as needed
  });

  const handleContinue = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else {
      router.back();
    }
  };

  const handleSave = () => {
    // Here you'd typically POST this data to an API
    console.log("Submitting form:", formData);

    // Show confirmation / toast / or redirect
    alert("Permission successfully created!");
    router.push("./"); // Or redirect to listing page
  };

  return (
    <div className="p-6 bg-white shadow-md rounded-lg w-full max-w-6xl mx-auto font-sans">
      {/* Breadcrumb */}
      <div className="text-sm text-gray-500 font-medium mb-4">
        <span className="text-gray-400">Leave Tracker / Permissions / Manage / </span>
        <span className="text-purple-600 font-semibold">Add</span>
      </div>

      {/* Stepper */}
      <div className="flex items-center space-x-4 mb-8">
        {stepLabels.map((label, index) => {
          const stepNumber = index + 1;
          const isCompleted = currentStep > stepNumber;
          const isCurrent = currentStep === stepNumber;

          return (
            <div key={index} className="flex items-center space-x-2">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-white ${
                  isCompleted
                    ? "bg-green-500"
                    : isCurrent
                    ? "bg-purple-600"
                    : "bg-gray-300"
                }`}
              >
                {stepNumber}
              </div>
              <div className={`text-sm font-semibold ${isCurrent ? "text-purple-600" : "text-gray-500"}`}>
                {label}
                <div className="text-xs">
                  {isCompleted ? (
                    <span className="text-green-600">Completed</span>
                  ) : isCurrent ? (
                    <span className="text-purple-500">In progress</span>
                  ) : null}
                </div>
              </div>
              {index < stepLabels.length - 1 && <div className="w-6 h-1 bg-gray-300 rounded-full" />}
            </div>
          );
        })}
      </div>
      {/* Step 1 Content: Basic */}
      {currentStep === 1 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block mb-1 font-medium text-gray-700">
              Reason <span className="text-red-500">*</span>
            </label>
            <select className="w-full border rounded px-4 py-2 focus:outline-none">
              <option>Choose reason</option>
            </select>

            <label className="block mt-4 mb-1 font-medium text-gray-700">
              Description (English) <span className="text-red-500">*</span>
            </label>
            <input type="text" className="w-full border rounded px-4 py-2" placeholder="Enter the description" />

            <label className="block mt-4 mb-1 font-medium text-gray-700">Permission Comments (English)</label>
            <textarea className="w-full border rounded px-4 py-2 h-28" placeholder="Enter the comments" />
          </div>

          <div>
            <label className="block mb-1 font-medium text-gray-700">
              Code <span className="text-red-500">*</span>
            </label>
            <input type="text" className="w-full border rounded px-4 py-2" value="Personal permission" readOnly />

            <label className="block mt-4 mb-1 font-medium text-gray-700">
              Description (العربية) <span className="text-red-500">*</span>
            </label>
            <input type="text" className="w-full border rounded px-4 py-2" placeholder="Enter the description" />

            <label className="block mt-4 mb-1 font-medium text-gray-700">Permission Comments (العربية)</label>
            <textarea className="w-full border rounded px-4 py-2 h-28" placeholder="Enter the comments" />
          </div>
        </div>
      )}

      {/* Step 2 Content: Setup */}
      {currentStep === 2 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block mb-1 font-medium text-gray-700">Workflows <span className="text-red-500">*</span></label>
            <select className="w-full border rounded px-4 py-2">
              <option>Choose workflows</option>
            </select>

            <label className="block mt-4 mb-1 font-medium text-gray-700">Group</label>
            <select className="w-full border rounded px-4 py-2">
              <option>Choose group</option>
            </select>

            <label className="block mt-4 mb-1 font-medium text-gray-700">Gender</label>
            <select className="w-full border rounded px-4 py-2">
              <option>Choose gender</option>
            </select>

            <label className="block mt-4 mb-1 font-medium text-gray-700">Valid From</label>
            <input type="date" className="w-full border rounded px-4 py-2" />
          </div>

          <div>
            <label className="block mb-1 font-medium text-gray-700">Organization</label>
            <select className="w-full border rounded px-4 py-2">
              <option>Choose organization</option>
            </select>

            <label className="block mt-4 mb-1 font-medium text-gray-700">Employee</label>
            <select className="w-full border rounded px-4 py-2">
              <option>Choose employee</option>
            </select>

            <label className="block mt-4 mb-1 font-medium text-gray-700">Citizenship</label>
            <select className="w-full border rounded px-4 py-2">
              <option>Choose citizenship</option>
            </select>

            <label className="block mt-4 mb-1 font-medium text-gray-700">Valid Till</label>
            <input type="date" className="w-full border rounded px-4 py-2" />
          </div>
        </div>
      )}

{/* Step 3 Content: Restrictions */}
{currentStep === 3 && (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    <div>
      <label className="block mb-1 font-medium text-gray-700">
        Max. Minutes Per Day <span className="text-red-500">*</span>
      </label>
      <input
        type="number"
        className="w-full border rounded-full px-4 py-2"
        placeholder="Enter the minutes"
      />

      <label className="block mt-4 mb-1 font-medium text-gray-700">
        Max. Minutes Per Month <span className="text-red-500">*</span>
      </label>
      <input
        type="number"
        className="w-full border rounded-full px-4 py-2"
        placeholder="Enter the minutes"
      />

      <label className="block mt-4 mb-1 font-medium text-gray-700">
        Min. Permission Time <span className="text-red-500">*</span>
      </label>
      <input
        type="text"
        className="w-full border rounded-full px-4 py-2"
        placeholder="Enter the time"
      />
    </div>

    <div>
      <label className="block mb-1 font-medium text-gray-700">
        Max. No. Of Permissions Per Day <span className="text-red-500">*</span>
      </label>
      <input
        type="number"
        className="w-full border rounded-full px-4 py-2"
        placeholder="Enter the count"
      />

      <label className="block mt-4 mb-1 font-medium text-gray-700">
        Max. No. Of Permissions Per Month <span className="text-red-500">*</span>
      </label>
      <input
        type="number"
        className="w-full border rounded-full px-4 py-2"
        placeholder="Enter the count"
      />

      <label className="block mt-4 mb-1 font-medium text-gray-700">
        Max. Permission Time <span className="text-red-500">*</span>
      </label>
      <input
        type="text"
        className="w-full border rounded-full px-4 py-2"
        placeholder="Enter the time"
      />
    </div>
  </div>
)}
{/* Step 4 Content: Policy */}
{currentStep === 4 && (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    {/* Left: Permission Attributes */}
    <div>
      <h3 className="font-semibold mb-4">Permission Attributes:</h3>
      <div className="grid grid-cols-2 gap-4">
        <label className="flex items-center space-x-2">
          <input type="checkbox" />
          <span>Group Apply</span>
        </label>
        <label className="flex items-center space-x-2">
          <input type="checkbox" />
          <span>Medical Pass Attachment</span>
        </label>
        <label className="flex items-center space-x-2">
          <input type="checkbox" />
          <span>Official</span>
        </label>
        <label className="flex items-center space-x-2">
          <input type="checkbox" />
          <span>Mandatory Comments</span>
        </label>
        <label className="flex items-center space-x-2">
          <input type="checkbox" />
          <span>Mandatory Attachment</span>
        </label>
        <label className="flex items-center space-x-2">
          <input type="checkbox" />
          <span>Apply Ramadan Restriction</span>
        </label>
      </div>
    </div>

    {/* Right: Permission Types */}
    <div>
      <h3 className="font-semibold mb-4">Permission Types:</h3>
      <div className="flex flex-col space-y-4">
        <label className="flex items-center space-x-2">
          <input type="radio" name="permissionType" />
          <span>By Minutes Permission</span>
        </label>
        <label className="flex items-center space-x-2">
          <input type="radio" name="permissionType" />
          <span>By From Time / To Time Permissions</span>
        </label>
        <label className="flex items-center space-x-2">
          <input type="radio" name="permissionType" />
          <span>By Weekdays Permissions</span>
        </label>
        <label className="flex items-center space-x-2">
          <input type="radio" name="permissionType" />
          <span>By Full Day Permissions</span>
        </label>
      </div>
    </div>
  </div>
)}
      {/* Action Buttons */}
      <div className="flex justify-end space-x-4 mt-8">
        <button
          onClick={handleBack}
          className="px-6 py-2 border border-gray-300 rounded-full text-gray-600 hover:bg-gray-100"
        >
          Back
        </button>

        {currentStep < 4 ? (
          <button
            onClick={handleContinue}
            className="px-6 py-2 bg-purple-600 text-white rounded-full hover:bg-purple-700"
          >
            Continue
          </button>
        ) : (
          <button
            onClick={handleSave}
            className="px-6 py-2 bg-green-600 text-white rounded-full hover:bg-green-700"
          >
            Save
          </button>
        )}
      </div>
    </div>
  );
};

export default ManageAdd;
