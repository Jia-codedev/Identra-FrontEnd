"use client";

import React, { useState, useEffect } from "react";
import { useTranslations } from "@/hooks/use-translations";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/Input";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { PlusCircle, Trash2, Save, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import workflowTypesApi from "@/services/leaveManagement/workflowTypes";
import rolesApi from "@/services/security/rolesService";

interface WorkflowStep {
  id: string;
  stepOrder: number;
  stepName: string;
  roleId: string;
  onSuccess: string;
  onFailure: string;
}

interface Role {
  role_id: number;
  role_name: string;
  editable_flag?: boolean;
  created_id?: number;
  created_date?: string;
  last_updated_id?: number;
  last_updated_date?: string;
  _count?: {
    sec_user_roles: number;
  };
}

export default function GenerateWorkflowsPage() {
  const { t } = useTranslations();
  const router = useRouter();
  
  // Workflow Type fields
  const [code, setCode] = useState("");
  const [workflowType, setWorkflowType] = useState("Leaves");
  const [workflowNameEng, setWorkflowNameEng] = useState("");
  
  // Workflow Steps
  const [steps, setSteps] = useState<WorkflowStep[]>([
    { id: "1", stepOrder: 1, stepName: "", roleId: "", onSuccess: "", onFailure: "Rejected" },
    { id: "2", stepOrder: 2, stepName: "", roleId: "", onSuccess: "", onFailure: "Rejected" },
    { id: "3", stepOrder: 3, stepName: "", roleId: "", onSuccess: "", onFailure: "Rejected" },
  ]);
  
  const [loading, setLoading] = useState(false);
  const [rolesLoading, setRolesLoading] = useState(true);
  const [roles, setRoles] = useState<Role[]>([]);

  const workflowTypeOptions = [
    "Leaves",
    "Overtime",
    "Training",
    "Travel",
    "Performance Review",
    "Asset Request"
  ];

  const stepOptions = [
    "Pending",
    "Approved",
    "Next Step",
    "Completed",
    "Escalate"
  ];

  // Fetch roles on component mount
  useEffect(() => {
    const fetchRoles = async () => {
      try {
        setRolesLoading(true);
        const response = await rolesApi.getRoles();
        const rolesData = response.data?.data || [];
        setRoles(rolesData);
        
        if (rolesData.length === 0) {
          toast.error("No roles found. Please check if roles are configured.");
        }
      } catch (error: any) {
        console.error("Error fetching roles:", error);
        toast.error(error.response?.data?.message || "Failed to load roles");
      } finally {
        setRolesLoading(false);
      }
    };

    fetchRoles();
  }, []);

  const addStep = () => {
    const newStep: WorkflowStep = {
      id: Date.now().toString(),
      stepOrder: steps.length + 1,
      stepName: "",
      roleId: "",
      onSuccess: "",
      onFailure: "Rejected"
    };
    setSteps([...steps, newStep]);
  };

  const removeStep = (stepId: string) => {
    if (steps.length <= 1) {
      toast.error("At least one step is required");
      return;
    }
    
    const filteredSteps = steps.filter(step => step.id !== stepId);
    // Reorder step numbers
    const reorderedSteps = filteredSteps.map((step, index) => ({
      ...step,
      stepOrder: index + 1
    }));
    setSteps(reorderedSteps);
  };

  const updateStep = (stepId: string, field: keyof WorkflowStep, value: string | number) => {
    setSteps(steps.map(step => 
      step.id === stepId 
        ? { ...step, [field]: value }
        : step
    ));
  };

  const validateForm = () => {
    if (!code.trim()) {
      toast.error("Workflow code is required");
      return false;
    }
    
    if (!workflowNameEng.trim()) {
      toast.error("Workflow name is required");
      return false;
    }

    // Validate steps
    for (const step of steps) {
      if (!step.stepName.trim()) {
        toast.error(`Step ${step.stepOrder} name is required`);
        return false;
      }
      if (!step.roleId.trim()) {
        toast.error(`Step ${step.stepOrder} role is required`);
        return false;
      }
    }

    return true;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      // First create the workflow type
      const workflowTypePayload = {
        workflow_code: code.trim(),
        workflow_name_eng: workflowNameEng.trim(),
        workflow_name_arb: workflowNameEng.trim(), // Using English as default for Arabic
        workflow_category_eng: workflowType,
        workflow_category_arb: workflowType,
      };

      const workflowTypeResponse = await workflowTypesApi.createWorkflowType(workflowTypePayload);
      const createdWorkflowId = workflowTypeResponse.data?.data?.workflow_id;

      if (!createdWorkflowId) {
        throw new Error("Failed to create workflow type");
      }

      // Then create the workflow steps
      for (const step of steps) {
        const stepPayload = {
          workflow_id: createdWorkflowId,
          step_order: step.stepOrder,
          step_eng: step.stepName.trim(),
          step_arb: step.stepName.trim(), // Using English as default for Arabic
          role_id: step.roleId ? parseInt(step.roleId) : undefined,
          is_final_step: step.stepOrder === steps.length,
        };

        await workflowTypesApi.createWorkflowStep(stepPayload);
      }

      toast.success("Workflow created successfully!");
      router.push("/leave-management/workflow-automation");
      
    } catch (error: any) {
      console.error("Error creating workflow:", error);
      toast.error(error?.response?.data?.message || "Failed to create workflow");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    router.push("/leave-management/workflow-automation");
  };

  const generateCode = () => {
    const prefix = "wf";
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    setCode(`${prefix}${timestamp}${random}`);
  };

  useEffect(() => {
    if (!code) {
      generateCode();
    }
  }, []);

  return (
    <div className="w-full h-full flex flex-col items-center justify-start">
      <div className="w-full relative">
        <div className="rounded-2xl border py-4 border-border bg-background/90 p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleCancel}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </Button>
              <h1 className="text-2xl font-semibold text-blue-600">
                Generate the workflows
              </h1>
            </div>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                onClick={handleCancel}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button 
                onClick={handleSave}
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                {loading ? "Saving..." : "Save"}
              </Button>
            </div>
          </div>

          {/* Workflow Type Form */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-lg">Workflow Configuration</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="code" className="text-sm font-medium">
                    Code <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="code"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="wf001"
                    className="mt-1"
                  />
                </div>
                
                <div>
                  <Label htmlFor="workflows" className="text-sm font-medium">
                    Workflows <span className="text-red-500">*</span>
                  </Label>
                  <Select value={workflowType} onValueChange={setWorkflowType}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select workflow type" />
                    </SelectTrigger>
                    <SelectContent>
                      {workflowTypeOptions.map((option) => (
                        <SelectItem key={option} value={option}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="workflowName" className="text-sm font-medium">
                    Workflow Name (English) <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="workflowName"
                    value={workflowNameEng}
                    onChange={(e) => setWorkflowNameEng(e.target.value)}
                    placeholder="vacation"
                    className="mt-1"
                  />
                </div>
              </div>
              
              <div className="mt-4 flex justify-end">
                <Button 
                  className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-2"
                  onClick={generateCode}
                >
                  <PlusCircle className="w-4 h-4" />
                  Generate
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Workflow Steps */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg">Workflow Steps</CardTitle>
              <Button 
                onClick={addStep}
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                <PlusCircle className="w-4 h-4" />
                Add Step
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Header Row */}
                <div className="grid grid-cols-12 gap-4 text-sm font-medium text-gray-600 pb-2 border-b">
                  <div className="col-span-1 text-center">Step Order</div>
                  <div className="col-span-3">Step Name</div>
                  <div className="col-span-2">Role</div>
                  <div className="col-span-2">On Success</div>
                  <div className="col-span-2">On Failure</div>
                  <div className="col-span-2">Actions</div>
                </div>

                {/* Steps */}
                {steps.map((step) => (
                  <div key={step.id} className="grid grid-cols-12 gap-4 items-center">
                    <div className="col-span-1 text-center font-medium">
                      {step.stepOrder}
                    </div>
                    
                    <div className="col-span-3">
                      <Input
                        value={step.stepName}
                        onChange={(e) => updateStep(step.id, "stepName", e.target.value)}
                        placeholder="Enter step name"
                        className="w-full"
                      />
                    </div>
                    
                    <div className="col-span-2">
                      <Select 
                        value={step.roleId} 
                        onValueChange={(value) => updateStep(step.id, "roleId", value)}
                        disabled={rolesLoading}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder={rolesLoading ? "Loading roles..." : "Choose Role"} />
                        </SelectTrigger>
                        <SelectContent>
                          {rolesLoading ? (
                            <SelectItem value="loading" disabled>
                              Loading roles...
                            </SelectItem>
                          ) : roles.length === 0 ? (
                            <SelectItem value="no-roles" disabled>
                              No roles available
                            </SelectItem>
                          ) : (
                            roles.map((role) => (
                              <SelectItem key={role.role_id} value={role.role_id.toString()}>
                                {role.role_name || `Role ${role.role_id}`}
                              </SelectItem>
                            ))
                          )}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="col-span-2">
                      <Select 
                        value={step.onSuccess} 
                        onValueChange={(value) => updateStep(step.id, "onSuccess", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Choose Step" />
                        </SelectTrigger>
                        <SelectContent>
                          {stepOptions.map((option) => (
                            <SelectItem key={option} value={option}>
                              {option}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="col-span-2">
                      <Input
                        value={step.onFailure}
                        onChange={(e) => updateStep(step.id, "onFailure", e.target.value)}
                        placeholder="Rejected"
                        className="w-full"
                        readOnly
                        disabled
                      />
                    </div>
                    
                    <div className="col-span-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeStep(step.id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        disabled={steps.length <= 1}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
