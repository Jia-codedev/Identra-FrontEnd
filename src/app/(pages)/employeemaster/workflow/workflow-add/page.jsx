"use client";
import React from "react";

const WorkflowAddPage = () => {
  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <h2 className="text-lg font-semibold mb-4">Generate the workflows</h2>

      {/* Header Inputs */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <input
          type="text"
          placeholder="Enter Code"
          className="col-span-1 p-2 border rounded"
        />
        <select className="col-span-1 p-2 border rounded">
          <option>Choose any Levels</option>
        </select>
        <select className="col-span-1 p-2 border rounded">
          <option>Choose any Category</option>
        </select>
        <button className="bg-purple-600 text-white px-4 py-2 rounded">
          Generate
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-100 text-gray-600">
            <tr>
              <th className="p-2">Type</th>
              <th className="p-2">Value</th>
              <th className="p-2">On Success</th>
              <th className="p-2">On Failure</th>
              <th className="p-2">Status Text</th>
            </tr>
          </thead>
          <tbody>
            {[1, 2].map((_, i) => (
              <tr key={i} className="border-b">
                <td className="p-2">
                  <select className="w-full border rounded p-2">
                    <option>Choose any Levels</option>
                  </select>
                </td>
                <td className="p-2">
                  <select className="w-full border rounded p-2">
                    <option>Choose any Value</option>
                  </select>
                </td>
                <td className="p-2">
                  <select className="w-full border rounded p-2">
                    <option>Step 2</option>
                  </select>
                </td>
                <td className="p-2">
                  <input
                    type="text"
                    defaultValue="Rejected"
                    className="w-full border rounded p-2"
                  />
                </td>
                <td className="p-2">
                  <input
                    type="text"
                    placeholder="Enter sample text"
                    className="w-full border rounded p-2"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end mt-6 gap-2">
        <button className="px-4 py-2 bg-gray-200 rounded-md">Cancel</button>
        <button className="px-4 py-2 bg-purple-600 text-white rounded-md">
          Save
        </button>
      </div>
    </div>
  );
};

export default WorkflowAddPage;
