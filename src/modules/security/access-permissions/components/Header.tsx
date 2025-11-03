"use client";

import React from "react";
import { Key } from "lucide-react";

export default function Header({ title }: { title: string }) {
  return (
    <div className="flex items-center gap-4 w-fit">
      <div className="flex-shrink-0">
        <div className="rounded-md bg-primary/10 p-2">
          <Key className="h-7 w-7 text-primary" />
        </div>
      </div>
      <div>
        <h1 className="text-2xl sm:text-3xl font-semibold leading-tight">
          {title}
        </h1>
      </div>
    </div>
  );
}
