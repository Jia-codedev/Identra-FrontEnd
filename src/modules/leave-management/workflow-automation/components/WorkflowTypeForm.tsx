"use client";

import React, { useState } from 'react';
import { useTranslations } from '@/hooks/use-translations';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Checkbox } from '@/components/ui/Checkbox';
import workflowTypesApi, { WorkflowType } from '@/services/leaveManagement/workflowTypes';

interface Props {
  workflowType?: WorkflowType | null;
  onClose: (refresh?: boolean) => void;
}

const WorkflowTypeForm: React.FC<Props> = ({ workflowType, onClose }) => {
  const { t } = useTranslations();
  const [workflowCode, setWorkflowCode] = useState(workflowType?.workflow_code || "");
  const [workflowNameEng, setWorkflowNameEng] = useState(workflowType?.workflow_name_eng || "");
  const [workflowNameArb, setWorkflowNameArb] = useState(workflowType?.workflow_name_arb || "");
  const [description, setDescription] = useState(workflowType?.description || "");
  const [isActive, setIsActive] = useState(workflowType?.is_active ?? true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    try {
      const payload = {
        workflow_code: workflowCode,
        workflow_name_eng: workflowNameEng,
        workflow_name_arb: workflowNameArb,
        description: description,
        is_active: isActive,
      };

      if (workflowType?.workflow_id) {
        await workflowTypesApi.updateWorkflowType(workflowType.workflow_id, payload);
      } else {
        await workflowTypesApi.createWorkflowType(payload);
      }
      
      onClose(true);
    } catch (err: any) {
      setError(err?.message || "Failed to submit workflow type");
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
        <label className="block mb-1 font-medium">Workflow Code *</label>
        <Input
          value={workflowCode}
          onChange={(e) => setWorkflowCode(e.target.value)}
          placeholder="Enter workflow code (e.g., WF-001)"
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block mb-1 font-medium">Workflow Name (English)</label>
          <Input
            value={workflowNameEng}
            onChange={(e) => setWorkflowNameEng(e.target.value)}
            placeholder="Enter workflow name in English"
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Workflow Name (Arabic)</label>
          <Input
            value={workflowNameArb}
            onChange={(e) => setWorkflowNameArb(e.target.value)}
            placeholder="Enter workflow name in Arabic"
          />
        </div>
      </div>

      <div>
        <label className="block mb-1 font-medium">Description</label>
        <Textarea
          value={description}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setDescription(e.target.value)}
          placeholder="Enter workflow description"
          rows={3}
        />
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
          {loading ? 'Submitting...' : workflowType?.workflow_id ? 'Update' : 'Save'}
        </Button>
      </div>
    </form>
  );
};

export default WorkflowTypeForm;
