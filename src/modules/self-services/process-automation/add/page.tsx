"use client";

import React, { useState } from "react";
import workflowApi from "@/services/workforce/workflowService";
import workflowStepsApi from "@/services/workforce/workflowStepsService";
import rolesApi from "@/services/security/rolesService";
import { Combobox, type ComboboxOption } from "@/components/ui/combobox";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useTranslations } from "@/hooks/use-translations";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function AddWorkflowPage() {
  const { t, currentLocale } = useTranslations();
  const router = useRouter();
  const tr = (key: string, fallback: string) => {
    const v = t(key);
    return v && v !== key ? v : fallback;
  };
  const [code, setCode] = useState("");
  const [nameEng, setNameEng] = useState("");
  const [nameArb, setNameArb] = useState("");
  const [categoryEng, setCategoryEng] = useState("");
  const [categoryArb, setCategoryArb] = useState("");
  const [steps, setSteps] = useState<
    Array<{
      step_order: number;
      step_eng?: string;
      step_arb?: string;
      role_id?: number | string | null;
      is_final_step?: boolean;
    }>
  >([]);
  const [roleOptions, setRoleOptions] = useState<ComboboxOption[]>([]);
  const [rolesLoading, setRolesLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  React.useEffect(() => {
    let mounted = true;
    setRolesLoading(true);
    rolesApi
      .getRoles({ offset: 1, limit: 10 })
      .then((res) => {
        const data = (res?.data && res.data.data) || res?.data || [];
        if (!mounted) return;
        const arr = Array.isArray(data) ? data : [];
        const opts = arr.map((r: any) => {
          const label =
            r.role_name_eng ||
            r.role_name ||
            r.role_name_arb ||
            String(r.role_id);
          return { label, value: r.role_id };
        });
        setRoleOptions(opts);
      })
      .catch(() => setRoleOptions([]))
      .finally(() => {
        if (mounted) setRolesLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, []);

  const handleRoleSearch = (q: string) => {
    setRolesLoading(true);
    rolesApi
      .getRoles({ offset: 1, limit: 10, search: q })
      .then((res) => {
        const data = (res?.data && res.data.data) || res?.data || [];
        const arr = Array.isArray(data) ? data : [];
        const opts = arr.map((r: any) => ({
          label:
            r.role_name_eng ||
            r.role_name ||
            r.role_name_arb ||
            String(r.role_id),
          value: r.role_id,
        }));
        setRoleOptions(opts);
      })
      .catch(() => setRoleOptions([]))
      .finally(() => setRolesLoading(false));
  };
  const MAX_STEPS = 4;

  const addStep = () =>
    setSteps((s) => {
      if (s.length >= MAX_STEPS) return s;
      const next = [
        ...s,
        {
          step_order: s.length + 1,
          role_id: undefined,
          is_final_step: true,
        } as any,
      ];
      return next.map((st, i) => ({
        ...st,
        step_order: i + 1,
        is_final_step: i === next.length - 1,
      }));
    });

  const removeStep = (index: number) =>
    setSteps((s) => {
      const next = s.filter((_, i) => i !== index);
      return next.map((st, i) => ({
        ...st,
        step_order: i + 1,
        is_final_step: i === next.length - 1,
      }));
    });

  const updateStep = (index: number, field: string, value: any) =>
    setSteps((s) => {
      if (field === "is_final_step" && value === true) {
        const item = { ...s[index], [field]: true };
        const others = s
          .filter((_, i) => i !== index)
          .map((st) => ({ ...st, is_final_step: false }));
        const next = [...others, item];
        return next.map((st, i) => ({
          ...st,
          step_order: i + 1,
          is_final_step: i === next.length - 1,
        }));
      }

      const next = s.map((st, i) =>
        i === index ? { ...st, [field]: value } : st
      );
      return next;
    });

  const handleSubmit = async () => {
    if (isSubmitting) return;

    if (!code.trim()) {
      toast.error(tr("workflow.error.noCode", "Code is mandatory."));
      return;
    }

    if (currentLocale === "en" && !nameEng.trim()) {
      toast.error(tr("workflow.error.noNameEng", "English name is mandatory."));
      return;
    }

    if (currentLocale === "ar" && !nameArb.trim()) {
      toast.error(tr("workflow.error.noNameArb", "Arabic name is mandatory."));
      return;
    }

    if (steps.length === 0) {
      toast.error(
        tr("workflow.error.noSteps", "At least one step is mandatory.")
      );
      return;
    }

    for (let i = 0; i < steps.length; i++) {
      const st = steps[i];
      const hasName =
        currentLocale === "en"
          ? !!(st.step_eng && st.step_eng.trim())
          : !!(st.step_arb && st.step_arb.trim());
      const hasRole =
        st.role_id !== null &&
        st.role_id !== undefined &&
        String(st.role_id).trim() !== "";
      if (!hasName) {
        toast.error(
          tr("workflow.error.noStepName", `Step ${i + 1} requires a name.`)
        );
        return;
      }
      if (!hasRole) {
        toast.error(
          tr("workflow.error.noStepRole", `Step ${i + 1} requires a role.`)
        );
        return;
      }
    }

    setIsSubmitting(true);
    try {
      const payload = {
        workflow_code: code,
        workflow_name_eng: nameEng,
        workflow_name_arb: nameArb,
        workflow_category_eng: categoryEng,
        workflow_category_arb: categoryArb,
        created_id: 1,
        last_updated_id: 1,
      };

      const res = await workflowApi.addWorkflow(payload);
      const workflowId = res?.data?.data?.workflow_id || res?.data?.workflow_id;

      if (!workflowId) {
        toast.error(tr("common.error", "Error saving workflow."));
        throw new Error("No workflow id returned from server");
      }

      const validSteps = steps.filter(
        (st) =>
          (st.step_eng && st.step_eng.trim()) ||
          (st.step_arb && st.step_arb.trim())
      );
      if (validSteps.length > 0) {
        for (const step of validSteps) {
          const payloadStep = {
            step_order: step.step_order,
            step_eng: step.step_eng,
            step_arb: step.step_arb,
            role_id:
              step.role_id !== null && step.role_id !== undefined
                ? Number(step.role_id)
                : undefined,
            is_final_step: !!step.is_final_step,
            workflow_id: workflowId,
            created_id: 1,
            last_updated_id: 1,
          } as any;

          await workflowStepsApi.addStep(payloadStep);
        }
      }

      toast.success(tr("workflow.created", "Workflow created successfully"));
      router.push("/leave-management/process-automation");
    } catch (err) {
      console.error(err);
      toast.error(tr("common.error", "Error saving workflow."));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-semibold">
        {t("workflow.add") || "Add Workflow"}
      </h2>

      <div className="bg-white dark:bg-card rounded-lg shadow-sm p-6">
        <div className="grid grid-cols-3 gap-4 items-end">
          <div className="flex flex-col">
            <label className="text-sm text-muted-foreground block mb-1">
              {t("workflow.code") || "Code"}
            </label>
            <Input
              className="w-full"
              placeholder={t("workflow.code") || "Code"}
              value={code}
              onChange={(e) => setCode(e.target.value)}
            />
          </div>

          <div className="flex flex-col">
            {currentLocale === "en" ? (
              <>
                <label className="text-sm text-muted-foreground block mb-1">
                  {t("workflow.nameEng") || "Name (EN)"}
                </label>
                <Input
                  className="w-full"
                  placeholder={t("workflow.nameEng") || "Name (EN)"}
                  value={nameEng}
                  onChange={(e) => setNameEng(e.target.value)}
                />
              </>
            ) : (
              <>
                <label className="text-sm text-muted-foreground block mb-1">
                  {t("workflow.nameArb") || "Name (AR)"}
                </label>
                <Input
                  className="w-full"
                  placeholder={t("workflow.nameArb") || "Name (AR)"}
                  value={nameArb}
                  onChange={(e) => setNameArb(e.target.value)}
                />
              </>
            )}
          </div>

          <div className="flex flex-col">
            {currentLocale === "en" ? (
              <>
                <label className="text-sm text-muted-foreground block mb-1">
                  {t("workflow.categoryEng") || "Category (EN)"}
                </label>
                <Input
                  className="w-full"
                  placeholder={t("workflow.categoryEng") || "Category (EN)"}
                  value={categoryEng}
                  onChange={(e) => setCategoryEng(e.target.value)}
                />
              </>
            ) : (
              <>
                <label className="text-sm text-muted-foreground block mb-1">
                  {t("workflow.categoryArb") || "Category (AR)"}
                </label>
                <Input
                  className="w-full"
                  placeholder={t("workflow.categoryArb") || "Category (AR)"}
                  value={categoryArb}
                  onChange={(e) => setCategoryArb(e.target.value)}
                />
              </>
            )}
          </div>

          <div className="col-span-3 flex justify-end mt-2">
            <div className="flex items-center gap-2">
              <Button
                size="icon"
                onClick={addStep}
                disabled={steps.length >= MAX_STEPS}
                aria-label={t("workflow.addStep") || "Add Step"}
              >
                <Plus className="h-4 w-4" />
              </Button>
              <div className="text-sm text-muted-foreground">
                {steps.length}/{MAX_STEPS}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-card rounded-lg shadow-sm p-6">
        <h3 className="font-medium mb-4">{t("workflow.steps") || "Steps"}</h3>
        <div className="overflow-x-auto">
          <table
            className="w-full min-w-[900px] table-auto border-separate"
            style={{ borderSpacing: 0 }}
          >
            <thead>
              <tr className="text-left text-sm text-muted-foreground">
                <th className="py-3 px-4 w-20">{t("common.step") || "Step"}</th>
                {currentLocale === "en" ? (
                  <th className="py-3 px-4 w-1/3">
                    {t("workflow.stepEng") || "Step (EN)"}
                  </th>
                ) : (
                  <th className="py-3 px-4 w-1/3">
                    {t("workflow.stepArb") || "Step (AR)"}
                  </th>
                )}
                <th className="py-3 px-4 w-56">
                  {t("workflow.role") || "Role"}
                </th>

                <th className="py-3 px-4 w-24 text-center">
                  {t("workflow.isFinal") || "Final"}
                </th>
                <th className="py-3 px-4 w-24">{t("actions") || "Actions"}</th>
              </tr>
            </thead>
            <tbody>
              {steps.map((s, idx) => (
                <tr key={idx} className="align-top border-t">
                  <td className="py-3 px-4 align-middle">
                    <div className="text-sm">{s.step_order}</div>
                  </td>
                  {currentLocale === "en" ? (
                    <td className="py-3 px-4 align-middle">
                      <Input
                        className="w-full"
                        value={s.step_eng || ""}
                        onChange={(e) =>
                          updateStep(idx, "step_eng", e.target.value)
                        }
                      />
                    </td>
                  ) : (
                    <td className="py-3 px-4 align-middle">
                      <Input
                        className="w-full"
                        value={s.step_arb || ""}
                        onChange={(e) =>
                          updateStep(idx, "step_arb", e.target.value)
                        }
                      />
                    </td>
                  )}
                  <td className="py-3 px-4 align-middle">
                    <Combobox
                      className="w-full"
                      options={roleOptions}
                      value={s.role_id ?? null}
                      onValueChange={(v) => updateStep(idx, "role_id", v)}
                      placeholder={t("workflow.role") || "Choose Role"}
                      emptyMessage={t("common.noDataFound") || "No roles found"}
                      disableLocalFiltering={true}
                      onSearch={handleRoleSearch}
                      isLoading={rolesLoading}
                    />
                  </td>

                  <td className="py-3 px-4 text-center align-middle">
                    <input
                      type="checkbox"
                      className="mx-auto"
                      checked={!!s.is_final_step}
                      onChange={(e) =>
                        updateStep(idx, "is_final_step", e.target.checked)
                      }
                    />
                  </td>
                  <td className="py-3 px-4 align-middle">
                    <div className="flex gap-2">
                      <Button
                        variant="destructive"
                        onClick={() => removeStep(idx)}
                      >
                        {t("common.remove") || "Remove"}
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-6 flex justify-end gap-2">
          <Button onClick={handleSubmit}>{t("common.save") || "Save"}</Button>
          <Button
            variant="secondary"
            onClick={() => router.push("/leave-management/process-automation")}
          >
            {t("common.cancel") || "Cancel"}
          </Button>
        </div>
      </div>
    </div>
  );
}
