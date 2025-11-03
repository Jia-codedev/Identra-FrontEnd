"use client";

import React, { useState } from "react";
import { useThemeColor } from "@/app/providers/ThemeProvider";
// Preset color palette
const presetColors = [
  "#5b21b6", // Purple
  "#2563eb", // Blue
  "#0ea5e9", // Sky Blue
  "#10b981", // Green
  "#f97316", // Orange
  "#ef4444", // Red
  "#9333ea", // Violet
  "#111827", // Black
];

export default function AppearancePage() {
  const { primary, setPrimary } = useThemeColor(); // Get and set theme color from provider
  const [local, setLocal] = useState(primary);

  const handleSave = () => {
    setPrimary(local);
  };

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-lg shadow p-6 space-y-6">
      <h1 className="text-xl font-semibold text-primary">Appearance</h1>

      {/* Color Picker Section */}
      <section className="space-y-3">
        <h2 className="text-sm font-medium text-gray-700">Brand / Primary Color</h2>

        <div className="flex items-center gap-3">
          {/* Color Input */}
          <input
            type="color"
            value={local}
            onChange={(e) => setLocal(e.target.value)}
            className="h-10 w-16 rounded cursor-pointer border"
          />

          {/* Text Input */}
          <input
            type="text"
            value={local}
            onChange={(e) => setLocal(e.target.value)}
            className="border rounded px-3 py-2 text-sm w-40"
            placeholder="#5b21b6"
          />
        </div>

        {/* Preset Colors */}
        <div className="flex flex-wrap gap-2 mt-2">
          {presetColors.map((c) => (
            <button
              key={c}
              onClick={() => setLocal(c)}
              style={{ backgroundColor: c }}
              className={`h-8 w-8 rounded-full border-2 ${
                local === c ? "border-black" : "border-white"
              } shadow hover:scale-105 transition`}
              aria-label={`Set color to ${c}`}
            />
          ))}
        </div>
      </section>

      {/* Preview Section */}
      <section className="space-y-2">
        <h2 className="text-sm font-medium text-gray-700">Preview</h2>
        <button className="bg-primary text-white rounded-full px-4 py-2">
          Primary Button
        </button>
      </section>

      {/* Save / Reset */}
      <div className="flex justify-end gap-3 pt-4">
        <button
          className="px-4 py-2 border rounded-full text-gray-600"
          onClick={() => setLocal(primary)}
        >
          Reset
        </button>
        <button
          className="px-4 py-2 bg-primary text-white rounded-full"
          onClick={handleSave}
        >
          Save
        </button>
      </div>
    </div>
  );
}
