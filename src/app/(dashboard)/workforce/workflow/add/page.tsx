"use client";
import React from "react";
import WorkflowEditor from "@/modules/workforce/workflow/components/WorkflowEditor";
import { useRouter } from "next/navigation";

export default function AddWorkflowPage() {
  const router = useRouter();
  return (
    <div className="w-full h-full flex items-start justify-center p-6">
      <WorkflowEditor onSaved={() => router.push("/workforce/process-automation") } />
    </div>
  );
}