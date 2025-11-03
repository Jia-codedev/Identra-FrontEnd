"use client";

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useTranslations } from "@/hooks/use-translations";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { IWorkflowApproval } from "../types";

const approvalSchema = z.object({
  request_id: z.number().min(1, "Request ID is required"),
  workflow_steps_id: z.number().min(1, "Workflow step is required"),
  approver_id: z.number().min(1, "Approver is required"),
  approval_status: z.enum(["PENDING", "APPROVED", "REJECTED"]).optional(),
  approval_date: z.string().optional(),
  comments: z.string().optional(),
});

type ApprovalFormData = z.infer<typeof approvalSchema>;

interface ApprovalsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: ApprovalFormData) => void;
  editingApproval?: IWorkflowApproval | null;
  isLoading?: boolean;
}

export const ApprovalsModal: React.FC<ApprovalsModalProps> = ({
  isOpen,
  onClose,
  onSave,
  editingApproval,
  isLoading = false,
}) => {
  const { t } = useTranslations();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<ApprovalFormData>({
    resolver: zodResolver(approvalSchema),
    defaultValues: {
      request_id: 0,
      workflow_steps_id: 0,
      approver_id: 0,
      approval_status: "PENDING",
      approval_date: "",
      comments: "",
    },
  });

  useEffect(() => {
    if (editingApproval) {
      reset({
        request_id: editingApproval.request_id,
        workflow_steps_id: editingApproval.workflow_steps_id,
        approver_id: editingApproval.approver_id,
        approval_status: editingApproval.approval_status as "PENDING" | "APPROVED" | "REJECTED",
        approval_date: editingApproval.approval_date || "",
        comments: editingApproval.comments || "",
      });
    } else {
      reset({
        request_id: 0,
        workflow_steps_id: 0,
        approver_id: 0,
        approval_status: "PENDING",
        approval_date: "",
        comments: "",
      });
    }
  }, [editingApproval, reset]);

  const onSubmit = (data: ApprovalFormData) => {
    onSave(data);
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {editingApproval
              ? (t("workforce.approvals.editTitle") || "Edit Approval")
              : (t("workforce.approvals.addTitle") || "Add Approval")
            }
          </DialogTitle>
          <DialogDescription>
            {editingApproval
              ? (t("workforce.approvals.editDescription") || "Update the approval details below.")
              : (t("workforce.approvals.addDescription") || "Fill in the details to create a new approval.")
            }
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t("workforce.approvals.requestId") || "Request ID"} *
              </label>
              <Input
                type="number"
                {...register("request_id", { valueAsNumber: true })}
                placeholder={t("workforce.approvals.enterRequestId") || "Enter request ID"}
                className={errors.request_id ? "border-red-500" : ""}
              />
              {errors.request_id && (
                <p className="text-red-500 text-xs mt-1">{errors.request_id.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t("workforce.approvals.workflowStepId") || "Workflow Step ID"} *
              </label>
              <Input
                type="number"
                {...register("workflow_steps_id", { valueAsNumber: true })}
                placeholder={t("workforce.approvals.enterWorkflowStepId") || "Enter workflow step ID"}
                className={errors.workflow_steps_id ? "border-red-500" : ""}
              />
              {errors.workflow_steps_id && (
                <p className="text-red-500 text-xs mt-1">{errors.workflow_steps_id.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t("workforce.approvals.approverId") || "Approver ID"} *
              </label>
              <Input
                type="number"
                {...register("approver_id", { valueAsNumber: true })}
                placeholder={t("workforce.approvals.enterApproverId") || "Enter approver ID"}
                className={errors.approver_id ? "border-red-500" : ""}
              />
              {errors.approver_id && (
                <p className="text-red-500 text-xs mt-1">{errors.approver_id.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t("workforce.approvals.status") || "Status"}
              </label>
              <Select
                value={watch("approval_status")}
                onValueChange={(value) => setValue("approval_status", value as "PENDING" | "APPROVED" | "REJECTED")}
              >
                <SelectTrigger>
                  <SelectValue placeholder={t("workforce.approvals.selectStatus") || "Select status"} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PENDING">{t("workforce.approvals.pending") || "Pending"}</SelectItem>
                  <SelectItem value="APPROVED">{t("workforce.approvals.approved") || "Approved"}</SelectItem>
                  <SelectItem value="REJECTED">{t("workforce.approvals.rejected") || "Rejected"}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t("workforce.approvals.approvalDate") || "Approval Date"}
            </label>
            <Input
              type="datetime-local"
              {...register("approval_date")}
              className={errors.approval_date ? "border-red-500" : ""}
            />
            {errors.approval_date && (
              <p className="text-red-500 text-xs mt-1">{errors.approval_date.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t("workforce.approvals.comments") || "Comments"}
            </label>
            <Textarea
              {...register("comments")}
              placeholder={t("workforce.approvals.enterComments") || "Enter comments"}
              rows={3}
              className={errors.comments ? "border-red-500" : ""}
            />
            {errors.comments && (
              <p className="text-red-500 text-xs mt-1">{errors.comments.message}</p>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isLoading}
            >
              {t("common.cancel") || "Cancel"}
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading
                ? (t("common.saving") || "Saving...")
                : (editingApproval
                    ? (t("workforce.approvals.updateApproval") || "Update Approval")
                    : (t("workforce.approvals.createApproval") || "Create Approval")
                  )
              }
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};