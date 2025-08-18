"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "@/hooks/use-translations";
import { WorkflowModal } from "@/modules/workforce/workflow/components/WorkflowModal";
import { useWorkflowMutations } from "@/modules/workforce/workflow/hooks/useWorkflowMutations";
import { IWorkflow } from "@/modules/workforce/workflow/types";

export default function AddWorkflowPage() {
  const { t } = useTranslations();
  const router = useRouter();
  const { createWorkflow } = useWorkflowMutations();

  const handleSave = (data: Omit<IWorkflow, "workflow_id">) => {
    createWorkflow(data, {
      onSuccess: () => {
        router.push("/dashboard/workforce/workflow");
      },
    });
  };

  const handleClose = () => {
    router.push("/dashboard/workforce/workflow");
  };

  return (
    <div className="w-full h-full flex items-center justify-center">
      <WorkflowModal isOpen={true} onClose={handleClose} onSave={handleSave} workflow={null} mode="add" />
    </div>
  );
}