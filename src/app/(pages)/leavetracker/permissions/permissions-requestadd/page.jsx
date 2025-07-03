"use client";
import React from "react";

const PermissionRequest = () => {
  return (
    <div className="p-6 bg-white shadow-md rounded-lg w-full h-full font-sans">
      <h2 className="text-2xl font-semibold text-purple-700 mb-6">My Permission Request</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block mb-1 text-sm font-medium">Employee *</label>
          <select className="w-full border px-4 py-2 rounded-xl">
            <option>Choose employee</option>
          </select>
        </div>

        <div>
          <label className="block mb-1 text-sm font-medium">Permission Types *</label>
          <select className="w-full border px-4 py-2 rounded-xl">
            <option>Choose permission types</option>
          </select>
        </div>

        <div>
          <label className="block mb-1 text-sm font-medium">From Date *</label>
          <input type="date" className="w-full border px-4 py-2 rounded-xl" />
        </div>

        <div>
          <label className="block mb-1 text-sm font-medium">To Date *</label>
          <input type="date" className="w-full border px-4 py-2 rounded-xl" />
        </div>

        <div>
          <label className="block mb-1 text-sm font-medium">From Time *</label>
          <input type="time" className="w-full border px-4 py-2 rounded-xl" />
        </div>

        <div>
          <label className="block mb-1 text-sm font-medium">To Time *</label>
          <input type="time" className="w-full border px-4 py-2 rounded-xl" />
        </div>

        <div className="md:col-span-2">
          <label className="block mb-1 text-sm font-medium">Justification</label>
          <textarea className="w-full border px-4 py-2 rounded-xl" rows={5} placeholder="Enter the justification" />
        </div>
      </div>

      <div className="flex justify-end mt-6 space-x-3">
        <button 
        onClick={() => router.back()}
        className="border border-gray-400 text-gray-700 px-6 py-2 rounded-xl hover:bg-gray-100">Cancel</button>
        <button className="bg-purple-600 text-white px-6 py-2 rounded-xl hover:bg-purple-700">Apply</button>
      </div>
    </div>
  );
};

export default PermissionRequest;
