"use client";

import React, { useState, useEffect } from 'react';
import { useTranslations } from '@/hooks/use-translations';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/Input';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/Checkbox';
import workflowTypesApi, { WorkflowType, WorkflowTypeStep } from '@/services/leaveManagement/workflowTypes';

interface Props {
  workflowStep?: WorkflowTypeStep | null;
  workflowId?: number | null;
  onClose: (refresh?: boolean) => void;
}

const WorkflowStepForm: React.FC<Props> = ({ workflowStep, workflowId, onClose }) => {
  const { t } = useTranslations();
  const [workflows, setWorkflows] = useState<WorkflowType[]>([]);
  const [selectedWorkflowId, setSelectedWorkflowId] = useState(
    workflowStep?.workflow_id?.toString() || workflowId?.toString() || ""
  );
  const [stepNumber, setStepNumber] = useState(workflowStep?.step_number?.toString() || "");
  const [stepNameEng, setStepNameEng] = useState(workflowStep?.step_name_eng || "");
  const [stepNameArb, setStepNameArb] = useState(workflowStep?.step_name_arb || "");
  const [approverLevel, setApproverLevel] = useState(workflowStep?.approver_level?.toString() || "");
  const [isFinalStep, setIsFinalStep] = useState(workflowStep?.is_final_step ?? false);
  const [isActive, setIsActive] = useState(workflowStep?.is_active ?? true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    // Fetch workflow types for dropdown
    workflowTypesApi.getAllWorkflowTypes().then((res) => {
      const workflowTypes = Array.isArray(res?.data?.data) 
        ? res.data.data 
        : Array.isArray(res?.data) 
        ? res.data 
        : [];
      setWorkflows(workflowTypes);
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    try {
      const payload = {
        workflow_id: Number(selectedWorkflowId),
        step_number: Number(stepNumber),
        step_name_eng: stepNameEng,
        step_name_arb: stepNameArb,
        approver_level: approverLevel ? Number(approverLevel) : undefined,
        is_final_step: isFinalStep,
        is_active: isActive,
      };

      if (workflowStep?.step_id) {
        await workflowTypesApi.updateWorkflowStep(workflowStep.step_id, payload);
      } else {
        await workflowTypesApi.createWorkflowStep(payload);
      }
      
      onClose(true);
    } catch (err: any) {
      setError(err?.message || "Failed to submit workflow step");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}
      
      <div>
        <label className="block mb-1 font-medium">Workflow *</label>
        <Select value={selectedWorkflowId} onValueChange={setSelectedWorkflowId} required>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select workflow" />
          </SelectTrigger>
          <SelectContent>
            {workflows.map((workflow) => (
              <SelectItem key={workflow.workflow_id} value={workflow.workflow_id.toString()}>
                {workflow.workflow_code} - {workflow.workflow_name_eng || 'Unnamed'}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block mb-1 font-medium">Step Number *</label>
          <Input
            type="number"
            value={stepNumber}
            onChange={(e) => setStepNumber(e.target.value)}
            placeholder="Enter step number"
            required
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Approver Level</label>
          <Input
            type="number"
            value={approverLevel}
            onChange={(e) => setApproverLevel(e.target.value)}
            placeholder="Enter approver level"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block mb-1 font-medium">Step Name (English)</label>
          <Input
            value={stepNameEng}
            onChange={(e) => setStepNameEng(e.target.value)}
            placeholder="Enter step name in English"
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Step Name (Arabic)</label>
          <Input
            value={stepNameArb}
            onChange={(e) => setStepNameArb(e.target.value)}
            placeholder="Enter step name in Arabic"
          />
        </div>
      </div>

      <div className="flex flex-col space-y-2">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="isFinalStep"
            checked={isFinalStep}
            onCheckedChange={(checked) => setIsFinalStep(!!checked)}
          />
          <label htmlFor="isFinalStep" className="font-medium">
            Final Step
          </label>
        </div>
        
        <div className="flex items-center space-x-2">
          <Checkbox
            id="isActive"
            checked={isActive}
            onCheckedChange={(checked) => setIsActive(!!checked)}
          />
          <label htmlFor="isActive" className="font-medium">
            Active
          </label>
        </div>
      </div>

      <div className="flex gap-2 justify-end">
        <Button
          type="button"
          variant="outline"
          onClick={() => onClose()}
          disabled={loading}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? 'Submitting...' : workflowStep?.step_id ? 'Update' : 'Save'}
        </Button>
      </div>
    </form>
  );
};

export default WorkflowStepForm;
