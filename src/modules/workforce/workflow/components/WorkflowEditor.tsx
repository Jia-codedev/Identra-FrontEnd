"use client";
import React, { useState } from "react";
import { useTranslations } from "@/hooks/use-translations";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useForm, Controller } from "react-hook-form";
import workflowApi from "@/services/workforce/workflowService";
import workflowStepsApi from "@/services/workforce/workflowStepsService";
import { useUserStore } from "@/store/userStore";
import { toast } from "sonner";

type Step = {
  step_order: number;
  step_eng?: string;
  step_arb?: string;
  role_id?: number | null;
  is_final_step?: boolean;
};

export const WorkflowEditor: React.FC<{ onSaved?: () => void }> = ({ onSaved }) => {
  const { t } = useTranslations();
  const getUserId = useUserStore((s) => s.getUserId);
  const userId = getUserId();

  const { control, handleSubmit } = useForm({
    defaultValues: {
      workflow_code: "",
      workflow_name_eng: "",
      workflow_name_arb: "",
      workflow_category_eng: "",
      workflow_category_arb: "",
    },
  });

  const [steps, setSteps] = useState<Step[]>([]);
  const [saving, setSaving] = useState(false);

  const addStep = () => {
    const nextOrder = steps.length + 1;
    setSteps((s) => [...s, { step_order: nextOrder }]);
  };

  const updateStep = (index: number, patch: Partial<Step>) => {
    setSteps((s) => s.map((st, i) => (i === index ? { ...st, ...patch } : st)));
  };

  const removeStep = (index: number) => {
    setSteps((s) => s.filter((_, i) => i !== index).map((st, i) => ({ ...st, step_order: i + 1 })));
  };

  const onSubmit = async (data: any) => {
    setSaving(true);
    try {
      const payload = {
        ...data,
        created_id: userId || 0,
        last_updated_id: userId || 0,
      };

      const resp = await workflowApi.addWorkflow(payload);
      const created = resp.data?.data || resp.data;
      const workflowId = created?.workflow_id;

      if (workflowId && steps.length > 0) {
        // submit each step
        for (const st of steps) {
          await workflowStepsApi.addStep({
            workflow_id: workflowId,
            step_order: st.step_order,
            step_eng: st.step_eng,
            step_arb: st.step_arb,
            role_id: st.role_id,
            is_final_step: !!st.is_final_step,
            created_id: userId || 0,
            last_updated_id: userId || 0,
          });
        }
      }

      toast.success(t("workforce.workflow_saved") || "Saved");
      onSaved?.();
    } catch (err) {
      console.error(err);
      toast.error(t("common.error") || "Error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-3xl p-4">
      <div className="grid grid-cols-1 gap-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>{t("workforce.workflow_code") || "Workflow Code"}</Label>
            <Controller name="workflow_code" control={control} render={({ field }) => <Input {...field} />} />
          </div>
          <div>
            <Label>{t("workforce.workflow_name") || "Workflow Name"}</Label>
            <Controller name="workflow_name_eng" control={control} render={({ field }) => <Input {...field} />} />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>{t("workforce.workflow_name_arb") || "Name (Arabic)"}</Label>
            <Controller name="workflow_name_arb" control={control} render={({ field }) => <Input {...field} />} />
          </div>
          <div>
            <Label>{t("workforce.workflow_category") || "Category"}</Label>
            <Controller name="workflow_category_eng" control={control} render={({ field }) => <Input {...field} />} />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">{t("workforce.steps_section") || "Steps"}</h3>
            <Button type="button" onClick={addStep} className="h-8 w-8 p-0">
              +
            </Button>
          </div>

          <div className="mt-3 space-y-2">
            {steps.map((step, idx) => (
              <div key={idx} className="border rounded-md p-3 bg-muted">
                <div className="flex items-start gap-2">
                  <div className="w-10 text-sm">{step.step_order}</div>
                  <div className="flex-1 grid grid-cols-1 gap-2">
                    <Input placeholder={t("workforce.step_eng") || "Step (English)"} value={step.step_eng || ""} onChange={(e) => updateStep(idx, { step_eng: e.target.value })} />
                    <Input placeholder={t("workforce.step_arb") || "Step (Arabic)"} value={step.step_arb || ""} onChange={(e) => updateStep(idx, { step_arb: e.target.value })} />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Button variant="outline" size="sm" onClick={() => removeStep(idx)}>
                      {t("common.delete")}
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end">
          <Button type="submit" disabled={saving}>{saving ? (t("common.saving") || "Saving...") : (t("common.save") || "Save")}</Button>
        </div>
      </div>
    </form>
  );
};

export default WorkflowEditor;
