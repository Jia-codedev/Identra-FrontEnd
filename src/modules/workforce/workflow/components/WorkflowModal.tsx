import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useTranslations } from "@/hooks/use-translations";
import { IWorkflow } from "../types";

interface WorkflowModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Omit<IWorkflow, "workflow_id">) => void;
  workflow: IWorkflow | null;
  mode: "add" | "edit";
}

const workflowSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
});

type FormValues = {
  name: string;
  description?: string;
  steps?: Array<{
    step_type: string;
    title?: string;
    approver_role?: string;
    message?: string;
    assignee?: string;
    is_final?: boolean;
  }>;
};

export const WorkflowModal: React.FC<WorkflowModalProps> = ({
  isOpen,
  onClose,
  onSave,
  workflow,
  mode,
}) => {
  const { t } = useTranslations();
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(workflowSchema),
    defaultValues: {
      name: "",
      description: "",
      steps: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "steps",
  });

  useEffect(() => {
    if (isOpen && mode === "edit" && workflow) {
      reset({
        name: workflow.name,
        description: workflow.description,
        // populate steps if provided on the workflow object
        // @ts-ignore allow optional property
        steps: (workflow as any).steps ?? [],
      });
    } else {
      reset({
        name: "",
        description: "",
        steps: [],
      });
    }
  }, [isOpen, mode, workflow, reset]);

  const onSubmit = (data: FormValues) => {
    // Call onSave with basic workflow payload. Steps are returned via a second arg on the event
    // to avoid changing the existing onSave signature expected elsewhere.
    onSave({ name: data.name, description: data.description ?? "" });
    // Optionally, if parent needs steps, it can read them from an exported callback or
    // the workflow editor component. For now we attach steps to the workflow object
    // by emitting a custom event on the window (lightweight decoupling).
    try {
      const steps = data.steps ?? [];
      window.dispatchEvent(
        new CustomEvent("workflow:steps", { detail: steps })
      );
    } catch (e) {
      // noop
    }
  };

  if (!isOpen) return null;

  return (
    <div className="rounded-2xl border py-4 border-border bg-background/90 p-4 w-full">
      <div className="mb-4">
        <h3 className="text-lg font-semibold">
          {mode === "add"
            ? t("workforce.add_workflow")
            : t("workforce.edit_workflow")}
        </h3>
      </div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              {t("workforce.workflow_name")}
            </Label>
            <Controller
              name="name"
              control={control}
              render={({ field }) => (
                <Input id="name" {...field} className="col-span-3" />
              )}
            />
            {errors.name && (
              <p className="col-span-4 text-red-500 text-xs">
                {errors.name.message}
              </p>
            )}
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="description" className="text-right">
              {t("common.description")}
            </Label>
            <Controller
              name="description"
              control={control}
              render={({ field }) => (
                <Input id="description" {...field} className="col-span-3" />
              )}
            />
          </div>
          {/* Steps Section */}
          <div className="col-span-4 pt-4">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium">
                {t("workforce.steps") ?? "Steps"}
              </h4>
              <div>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() =>
                    append({
                      step_type: "approval",
                      title: "",
                      approver_role: "",
                      message: "",
                      assignee: "",
                      is_final: false,
                    })
                  }
                >
                  + {t("workforce.add_step") ?? "Add Step"}
                </Button>
              </div>
            </div>

            <div className="mt-3 space-y-3">
              {fields.length === 0 && (
                <p className="text-sm text-muted-foreground">
                  {t("workforce.no_steps") ?? "No steps added"}
                </p>
              )}
              {fields.map((fieldItem, index) => (
                <div key={fieldItem.id} className="border rounded p-3 bg-muted">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="grid grid-cols-6 gap-3 items-center">
                        <div className="col-span-1 text-sm text-muted-foreground">
                          {index + 1}.
                        </div>
                        <div className="col-span-5 grid grid-cols-5 gap-3">
                          <Controller
                            name={`steps.${index}.step_type` as const}
                            control={control}
                            defaultValue={fieldItem.step_type}
                            render={({ field: f }) => (
                              <select
                                {...f}
                                className="col-span-1 rounded border p-2 bg-white"
                              >
                                <option value="approval">
                                  {t("workforce.step_type_approval") ??
                                    "Approval"}
                                </option>
                                <option value="notification">
                                  {t("workforce.step_type_notification") ??
                                    "Notification"}
                                </option>
                                <option value="task">
                                  {t("workforce.step_type_task") ?? "Task"}
                                </option>
                              </select>
                            )}
                          />

                          <Controller
                            name={`steps.${index}.title` as const}
                            control={control}
                            defaultValue={fieldItem.title}
                            render={({ field: f }) => (
                              <Input
                                {...f}
                                placeholder={
                                  t("workforce.step_title") ?? "Step title"
                                }
                                className="col-span-3"
                              />
                            )}
                          />
                          <div className="col-span-1 text-right">
                            <button
                              type="button"
                              onClick={() => remove(index)}
                              aria-label={t("common.remove") ?? "Remove"}
                              className="text-red-600 font-bold px-2"
                            >
                              ×
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Conditional fields by step type */}
                      <div className="mt-3">
                        {/* approval */}
                        <Controller
                          name={`steps.${index}.step_type` as const}
                          control={control}
                          defaultValue={fieldItem.step_type}
                          render={({ field: typeField }) => {
                            const currentType = typeField.value;
                            return (
                              <div>
                                {currentType === "approval" && (
                                  <div className="grid grid-cols-4 gap-3 items-center">
                                    <Label className="text-right col-span-1">
                                      {t("workforce.approver_role") ??
                                        "Approver role"}
                                    </Label>
                                    <Controller
                                      name={
                                        `steps.${index}.approver_role` as const
                                      }
                                      control={control}
                                      defaultValue={
                                        (fieldItem as any).approver_role
                                      }
                                      render={({ field: approverField }) => (
                                        <Input
                                          {...approverField}
                                          className="col-span-3"
                                        />
                                      )}
                                    />
                                  </div>
                                )}

                                {currentType === "notification" && (
                                  <div className="grid grid-cols-4 gap-3 items-center">
                                    <Label className="text-right col-span-1">
                                      {t("workforce.notification_message") ??
                                        "Message"}
                                    </Label>
                                    <Controller
                                      name={`steps.${index}.message` as const}
                                      control={control}
                                      defaultValue={(fieldItem as any).message}
                                      render={({ field: msgField }) => (
                                        <Input
                                          {...msgField}
                                          className="col-span-3"
                                        />
                                      )}
                                    />
                                  </div>
                                )}

                                {currentType === "task" && (
                                  <div className="grid grid-cols-4 gap-3 items-center">
                                    <Label className="text-right col-span-1">
                                      {t("workforce.assignee") ?? "Assignee"}
                                    </Label>
                                    <Controller
                                      name={`steps.${index}.assignee` as const}
                                      control={control}
                                      defaultValue={(fieldItem as any).assignee}
                                      render={({ field: assigneeField }) => (
                                        <Input
                                          {...assigneeField}
                                          className="col-span-3"
                                        />
                                      )}
                                    />
                                  </div>
                                )}
                              </div>
                            );
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="flex justify-end space-x-2 mt-4">
          <Button type="button" variant="outline" onClick={onClose}>
            {t("common.cancel")}
          </Button>
          <Button type="submit">{t("common.save")}</Button>
        </div>
      </form>
    </div>
  );
};
