"use client";

import React, { useState, useEffect } from "react";
import { useTranslations } from "@/hooks/use-translations";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/Input";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/Textarea";
import { ArrowLeft, Send, User, FileText, Calendar, AlertCircle, CheckCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import workflowTypesApi, { WorkflowType } from "@/services/leaveManagement/workflowTypes";
import workflowRequestApi from "@/services/leaveManagement/workflowRequest";

interface Employee {
  employee_id: number;
  firstname_eng?: string;
  lastname_eng?: string;
  employee_code?: string;
  department?: string;
}

interface WorkflowRequest {
  workflow_id: number;
  transaction_id: number;
  requestor_id: number;
  request_date?: string;
  action_remarks?: string;
}

export default function InitiateWorkflowPage() {
  const { t } = useTranslations();
  const router = useRouter();
  
  // Form fields
  const [selectedWorkflowId, setSelectedWorkflowId] = useState<string>("");
  const [transactionId, setTransactionId] = useState("");
  const [requestorId, setRequestorId] = useState("");
  const [requestDate, setRequestDate] = useState("");
  const [actionRemarks, setActionRemarks] = useState("");
  
  // Data and loading states
  const [loading, setLoading] = useState(false);
  const [workflowsLoading, setWorkflowsLoading] = useState(true);
  const [workflows, setWorkflows] = useState<WorkflowType[]>([]);
  const [selectedWorkflow, setSelectedWorkflow] = useState<WorkflowType | null>(null);

  // Fetch workflows on component mount
  useEffect(() => {
    const fetchWorkflows = async () => {
      try {
        setWorkflowsLoading(true);
        const response = await workflowTypesApi.getAllWorkflowTypes();
        const workflowsData = response.data?.data || [];
        setWorkflows(workflowsData);
        
        if (workflowsData.length === 0) {
          toast.error("No workflows found. Please create workflows first.");
        }
      } catch (error: any) {
        console.error("Error fetching workflows:", error);
        toast.error(error.response?.data?.message || "Failed to load workflows");
      } finally {
        setWorkflowsLoading(false);
      }
    };

    fetchWorkflows();
  }, []);

  // Set default request date to today
  useEffect(() => {
    if (!requestDate) {
      const today = new Date().toISOString().split('T')[0];
      setRequestDate(today);
    }
  }, []);

  // Get workflow details when selection changes
  useEffect(() => {
    if (selectedWorkflowId) {
      const workflow = workflows.find(w => w.workflow_id.toString() === selectedWorkflowId);
      setSelectedWorkflow(workflow || null);
    } else {
      setSelectedWorkflow(null);
    }
  }, [selectedWorkflowId, workflows]);

  const generateTransactionId = () => {
    const timestamp = Date.now().toString();
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    setTransactionId(`TXN${timestamp}${random}`);
  };

  // Auto-generate transaction ID if empty
  useEffect(() => {
    if (!transactionId) {
      generateTransactionId();
    }
  }, []);

  const validateForm = () => {
    if (!selectedWorkflowId) {
      toast.error("Please select a workflow");
      return false;
    }
    
    if (!transactionId.trim()) {
      toast.error("Transaction ID is required");
      return false;
    }
    
    if (!requestorId.trim()) {
      toast.error("Requestor ID is required");
      return false;
    }

    if (!requestDate) {
      toast.error("Request date is required");
      return false;
    }

    // Validate requestor ID is a number
    if (isNaN(Number(requestorId))) {
      toast.error("Requestor ID must be a valid number");
      return false;
    }

    // Validate transaction ID is a number
    if (isNaN(Number(transactionId))) {
      toast.error("Transaction ID must be a valid number");
      return false;
    }

    return true;
  };

  const handleInitiateWorkflow = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const workflowRequestData: WorkflowRequest = {
        workflow_id: parseInt(selectedWorkflowId),
        transaction_id: parseInt(transactionId),
        requestor_id: parseInt(requestorId),
        request_date: new Date(requestDate).toISOString(),
        action_remarks: actionRemarks.trim() || undefined,
      };

      const response = await workflowRequestApi.initiateWorkflow(workflowRequestData);
      
      toast.success("Workflow initiated successfully!");
      
      // Show success details
      const responseData = response.data?.data;
      if (responseData) {
        console.log("Workflow initiated:", responseData);
        toast.success(
          `Request ID: ${responseData.workflow_request?.request_id || 'N/A'}`, 
          { duration: 5000 }
        );
      }
      
      // Navigate back to workflow automation page
      router.push("/leave-management/workflow-automation");
      
    } catch (error: any) {
      console.error("Error initiating workflow:", error);
      const errorMessage = error?.response?.data?.message || error?.message || "Failed to initiate workflow";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    router.push("/leave-management/workflow-automation");
  };

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
                Initiate Workflow Request
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
                onClick={handleInitiateWorkflow}
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
              >
                <Send className="w-4 h-4" />
                {loading ? "Initiating..." : "Initiate Workflow"}
              </Button>
            </div>
          </div>

          {/* Main Form */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Form */}
            <div className="lg:col-span-2 space-y-6">
              {/* Workflow Selection */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    Workflow Information
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="workflow" className="text-sm font-medium">
                        Select Workflow <span className="text-red-500">*</span>
                      </Label>
                      <Select 
                        value={selectedWorkflowId} 
                        onValueChange={setSelectedWorkflowId}
                        disabled={workflowsLoading}
                      >
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder={workflowsLoading ? "Loading workflows..." : "Choose a workflow"} />
                        </SelectTrigger>
                        <SelectContent>
                          {workflowsLoading ? (
                            <SelectItem value="loading" disabled>
                              Loading workflows...
                            </SelectItem>
                          ) : workflows.length === 0 ? (
                            <SelectItem value="no-workflows" disabled>
                              No workflows available
                            </SelectItem>
                          ) : (
                            workflows.map((workflow) => (
                              <SelectItem key={workflow.workflow_id} value={workflow.workflow_id.toString()}>
                                {workflow.workflow_name_eng || workflow.workflow_code || `Workflow ${workflow.workflow_id}`}
                              </SelectItem>
                            ))
                          )}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="transactionId" className="text-sm font-medium">
                        Transaction ID <span className="text-red-500">*</span>
                      </Label>
                      <div className="flex gap-2 mt-1">
                        <Input
                          id="transactionId"
                          value={transactionId}
                          onChange={(e) => setTransactionId(e.target.value)}
                          placeholder="12345"
                          className="flex-1"
                        />
                        <Button 
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={generateTransactionId}
                          className="px-3"
                        >
                          Generate
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Request Details */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <User className="w-5 h-5" />
                    Request Details
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="requestorId" className="text-sm font-medium">
                        Requestor Employee ID <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="requestorId"
                        value={requestorId}
                        onChange={(e) => setRequestorId(e.target.value)}
                        placeholder="101"
                        className="mt-1"
                        type="number"
                      />
                    </div>

                    <div>
                      <Label htmlFor="requestDate" className="text-sm font-medium">
                        Request Date <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="requestDate"
                        type="date"
                        value={requestDate}
                        onChange={(e) => setRequestDate(e.target.value)}
                        className="mt-1"
                      />
                    </div>
                  </div>

                  <div className="mt-4">
                    <Label htmlFor="actionRemarks" className="text-sm font-medium">
                      Action Remarks
                    </Label>
                    <Textarea
                      id="actionRemarks"
                      value={actionRemarks}
                      onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setActionRemarks(e.target.value)}
                      placeholder="Enter any additional remarks or comments for this workflow request..."
                      className="mt-1 min-h-[100px]"
                      maxLength={500}
                    />
                    <div className="text-right text-xs text-muted-foreground mt-1">
                      {actionRemarks.length}/500 characters
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Info Panel */}
            <div className="space-y-6">
              {/* Selected Workflow Info */}
              {selectedWorkflow && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      Selected Workflow
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div>
                        <Label className="text-sm font-medium text-muted-foreground">Name</Label>
                        <p className="text-sm font-medium">
                          {selectedWorkflow.workflow_name_eng || selectedWorkflow.workflow_code}
                        </p>
                      </div>
                      
                      <div>
                        <Label className="text-sm font-medium text-muted-foreground">Code</Label>
                        <p className="text-sm">{selectedWorkflow.workflow_code}</p>
                      </div>
                      
                      {selectedWorkflow.description && (
                        <div>
                          <Label className="text-sm font-medium text-muted-foreground">Description</Label>
                          <p className="text-sm">{selectedWorkflow.description}</p>
                        </div>
                      )}
                      
                      <div>
                        <Label className="text-sm font-medium text-muted-foreground">Status</Label>
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${selectedWorkflow.is_active ? 'bg-green-500' : 'bg-red-500'}`} />
                          <span className="text-sm">{selectedWorkflow.is_active ? 'Active' : 'Inactive'}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Help & Instructions */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-amber-600" />
                    Instructions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 text-sm text-muted-foreground">
                    <div className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 flex-shrink-0" />
                      <p>Select the workflow you want to initiate from the dropdown</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 flex-shrink-0" />
                      <p>Transaction ID should be unique for each request</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 flex-shrink-0" />
                      <p>Requestor ID must be a valid employee ID from the system</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 flex-shrink-0" />
                      <p>Action remarks are optional but recommended for context</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-2 flex-shrink-0" />
                      <p>Once initiated, the workflow will create all approval steps automatically</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
