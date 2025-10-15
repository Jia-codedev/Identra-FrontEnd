"use client";

import * as React from "react";

interface Props {
  children?: React.ReactNode;
}

export default function AnalyticsGrid({ children }: Props) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">{children}</div>
  );
}
