"use client";
import React from "react";

type Props = {
  rows: any[];
};

export default function PreviewTable({ rows }: Props) {
  if (!rows?.length) return null;

  // Build dynamic headers based on union of keys to avoid assuming specific schema
  const columns: string[] = [];
  for (const row of rows) {
    for (const key of Object.keys(row)) {
      if (!columns.includes(key)) columns.push(key);
    }
  }

  const previewColumns = columns.slice(0, 12); // cap columns to keep preview compact

  return (
    // Constrain height and allow both vertical and horizontal scrolling
    <div className="border rounded-md max-h-[60vh] overflow-auto">
      <div className="min-w-[600px]">
        <table className="min-w-full w-full table-auto text-sm">
          <thead className="bg-muted">
            <tr>
              {previewColumns.map((h) => (
                <th
                  key={h}
                  className="text-left px-3 py-2 font-medium align-top whitespace-normal break-words"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, idx) => (
              <tr key={idx} className="odd:bg-background even:bg-muted/30 align-top">
                {previewColumns.map((c) => (
                  <td
                    key={c}
                    className="px-3 py-1 align-top max-w-[220px] break-words whitespace-normal"
                  >
                    {String(row[c] ?? "")}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
