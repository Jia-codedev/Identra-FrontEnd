"use client";

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Save, Plus, Trash2 } from 'lucide-react';
import { useTranslations } from '@/hooks/use-translations';
import { useLanguage } from '@/providers/language-provider';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import workflowApi from '@/services/workforce/workflowService';
import workflowStepsApi from '@/services/workforce/workflowStepsService';
import rolesApi from '@/services/security/rolesService';

// Role interface - flexible to handle different API response formats
interface Role {
  role_id?: number;
  role_name?: string;
  role_description?: string;
  // Alternative field names in case API uses different naming
  id?: number;
  name?: string;
  description?: string;
}

// Workflow Type form data  
interface WorkflowTypeFormData {
  workflow_code: string;
  workflow_name_eng: string;
  workflow_name_arb: string;
  workflow_category_eng?: string;
  workflow_category_arb?: string;
}

// Workflow Step form data
interface WorkflowStepData {
  step_order: number;
  step_eng: string;
  step_arb: string;
  role_id: number;
  is_final_step: boolean;
}

export default function AddWorkflowAutomationPage() {
  const { t } = useTranslations();
  const { currentLocale } = useLanguage();
  const router = useRouter();
  
  // Workflow Type State
  const [workflowTypeData, setWorkflowTypeData] = useState<WorkflowTypeFormData>({
    workflow_code: '',
    workflow_name_eng: '',
    workflow_name_arb: '',
    workflow_category_eng: '',
    workflow_category_arb: '',
  });
  
  // Workflow Steps State (max 4 steps)
  const [workflowSteps, setWorkflowSteps] = useState<WorkflowStepData[]>([
    {
      step_order: 1,
      step_eng: '',
      step_arb: '',
      role_id: 0,
      is_final_step: true,
    }
  ]);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [workflowTypeErrors, setWorkflowTypeErrors] = useState<Partial<WorkflowTypeFormData>>({});
  const [stepErrors, setStepErrors] = useState<{[key: number]: Partial<{step_eng: string; step_arb: string; role_id: string}>}>({});
  
  // Roles state
  const [roles, setRoles] = useState<Role[]>([]);
  const [rolesLoading, setRolesLoading] = useState(false);

  // Fetch roles from backend
  const fetchRoles = async () => {
    try {
      setRolesLoading(true);
      const response = await rolesApi.getRoles({ limit: 100 }); // Get more roles
      
      // Handle different possible response structures
      let rolesData: Role[] = [];
      if (response.data?.data?.roles) {
        rolesData = response.data.data.roles;
      } else if (response.data?.data && Array.isArray(response.data.data)) {
        rolesData = response.data.data;
      } else if (response.data?.roles) {
        rolesData = response.data.roles;
      } else if (Array.isArray(response.data)) {
        rolesData = response.data;
      }
      
      console.log('Fetched roles:', rolesData);
      setRoles(rolesData);
    } catch (error) {
      console.error('Error fetching roles:', error);
      toast.error('Failed to fetch roles');
      // Set empty array on error
      setRoles([]);
    } finally {
      setRolesLoading(false);
    }
  };

  // Load roles on component mount
  useEffect(() => {
    fetchRoles();
  }, []);

  const validateWorkflowType = (): boolean => {
    const newErrors: Partial<WorkflowTypeFormData> = {};
    
    if (!workflowTypeData.workflow_code.trim()) {
      newErrors.workflow_code = 'Workflow code is required';
    }
    
    // Language-specific validation
    if (currentLocale === 'ar') {
      if (!workflowTypeData.workflow_name_arb.trim()) {
        newErrors.workflow_name_arb = 'Arabic workflow name is required';
      }
    } else {
      if (!workflowTypeData.workflow_name_eng.trim()) {
        newErrors.workflow_name_eng = 'English workflow name is required';
      }
    }
    
    setWorkflowTypeErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateSteps = (): boolean => {
    const newStepErrors: {[key: number]: Partial<{step_eng: string; step_arb: string; role_id: string}>} = {};
    let hasErrors = false;

    workflowSteps.forEach((step, index) => {
      const stepErrors: Partial<{step_eng: string; step_arb: string; role_id: string}> = {};
      
      // Language-specific validation for step names
      if (currentLocale === 'ar') {
        if (!step.step_arb.trim()) {
          stepErrors.step_arb = 'Arabic step name is required';
          hasErrors = true;
        }
      } else {
        if (!step.step_eng.trim()) {
          stepErrors.step_eng = 'English step name is required';
          hasErrors = true;
        }
      }
      
      if (step.role_id === 0) {
        stepErrors.role_id = 'Role is required';
        hasErrors = true;
      }

      if (Object.keys(stepErrors).length > 0) {
        newStepErrors[index] = stepErrors;
      }
    });

    setStepErrors(newStepErrors);
    return !hasErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const isWorkflowTypeValid = validateWorkflowType();
    const areStepsValid = validateSteps();
    
    if (!isWorkflowTypeValid || !areStepsValid) {
      toast.error('Please fix all validation errors');
      return;
    }

    if (workflowSteps.length === 0) {
      toast.error('At least one workflow step is required');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Prepare workflow type data - auto-populate missing language fields
      const submissionData = { ...workflowTypeData };
      
      if (currentLocale === 'ar') {
        // If Arabic mode, use Arabic as primary and fallback to English if missing
        if (!submissionData.workflow_name_eng && submissionData.workflow_name_arb) {
          submissionData.workflow_name_eng = submissionData.workflow_name_arb;
        }
        if (!submissionData.workflow_category_eng && submissionData.workflow_category_arb) {
          submissionData.workflow_category_eng = submissionData.workflow_category_arb;
        }
      } else {
        // If English mode, use English as primary and fallback to Arabic if missing
        if (!submissionData.workflow_name_arb && submissionData.workflow_name_eng) {
          submissionData.workflow_name_arb = submissionData.workflow_name_eng;
        }
        if (!submissionData.workflow_category_arb && submissionData.workflow_category_eng) {
          submissionData.workflow_category_arb = submissionData.workflow_category_eng;
        }
      }

      // First create the workflow type
      const workflowTypeResponse = await workflowApi.addWorkflow({
        ...submissionData,
        created_id: 1, // Replace with actual user ID
        last_updated_id: 1, // Replace with actual user ID
      });

      const workflowId = workflowTypeResponse.data.data.workflow_id;

      // Prepare steps data - auto-populate missing language fields
      const stepsWithLanguageFallback = workflowSteps.map(step => {
        const stepData = { ...step };
        
        if (currentLocale === 'ar') {
          // If Arabic mode, use Arabic as primary and fallback to English if missing
          if (!stepData.step_eng && stepData.step_arb) {
            stepData.step_eng = stepData.step_arb;
          }
        } else {
          // If English mode, use English as primary and fallback to Arabic if missing
          if (!stepData.step_arb && stepData.step_eng) {
            stepData.step_arb = stepData.step_eng;
          }
        }
        
        return stepData;
      });

      // Then create all workflow steps
      const stepPromises = stepsWithLanguageFallback.map(step => 
        workflowStepsApi.addStep({
          ...step,
          workflow_id: workflowId,
        })
      );

      await Promise.all(stepPromises);
      
      toast.success(t('leaveManagement.workflowAutomation.messages.created') || 'Workflow type and steps created successfully');
      router.push('/leave-management/workflow-automation');
      
    } catch (error: any) {
      console.error('Error creating workflow:', error);
      const errorMessage = error?.response?.data?.message || 'Failed to create workflow';
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleWorkflowTypeChange = (field: keyof WorkflowTypeFormData, value: string) => {
    setWorkflowTypeData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (workflowTypeErrors[field]) {
      setWorkflowTypeErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleStepChange = (stepIndex: number, field: keyof WorkflowStepData, value: string | number | boolean) => {
    // Prevent setting disabled values for role_id
    if (field === 'role_id' && (value === 'loading' || value === 'no-roles')) {
      return; // Don't update state with disabled values
    }
    
    setWorkflowSteps(prev => 
      prev.map((step, index) => 
        index === stepIndex ? { ...step, [field]: value } : step
      )
    );

    // Clear error when user changes value
    if (stepErrors[stepIndex]?.[field as keyof {step_eng: string; step_arb: string; role_id: string}]) {
      setStepErrors(prev => ({
        ...prev,
        [stepIndex]: { ...prev[stepIndex], [field]: undefined }
      }));
    }
  };

  const addStep = () => {
    if (workflowSteps.length >= 4) {
      toast.error('Maximum 4 workflow steps allowed');
      return;
    }

    // Mark previous step as not final
    const updatedSteps = workflowSteps.map((step, index) => 
      index === workflowSteps.length - 1 ? { ...step, is_final_step: false } : step
    );

    setWorkflowSteps([
      ...updatedSteps,
      {
        step_order: workflowSteps.length + 1,
        step_eng: '',
        step_arb: '',
        role_id: 0,
        is_final_step: true, // New step is final by default
      }
    ]);
  };

  const removeStep = (stepIndex: number) => {
    if (workflowSteps.length <= 1) {
      toast.error('At least one workflow step is required');
      return;
    }

    const updatedSteps = workflowSteps
      .filter((_, index) => index !== stepIndex)
      .map((step, index) => ({ 
        ...step, 
        step_order: index + 1,
        is_final_step: index === workflowSteps.length - 2 // Last remaining step becomes final
      }));

    setWorkflowSteps(updatedSteps);

    // Remove errors for this step
    const newStepErrors = { ...stepErrors };
    delete newStepErrors[stepIndex];
    setStepErrors(newStepErrors);
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-start">
      <div className="w-full relative">
        <div className="py-4 border-border bg-background/90 p-4">
          
          {/* Header */}
          <div className="flex items-center gap-4 mb-6">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleBack}
              className="p-2"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-primary">
                {t('leaveManagement.workflowAutomation.createWorkflowType') || 'Create Workflow Type'}
              </h1>
              <p className="text-muted-foreground">
                {t('leaveManagement.workflowAutomation.createWorkflowTypeDescription') || 'Create a new workflow type template and define its approval steps (max 4 steps)'}
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Section 1: Workflow Type Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span className="bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400 rounded-full w-6 h-6 flex items-center justify-center text-sm font-semibold">
                    1
                  </span>
                  {t('leaveManagement.workflowAutomation.form.workflowTypeInfo') || 'Workflow Type Information'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  {/* Workflow Code */}
                  <div className="space-y-2">
                    <Label htmlFor="workflow_code">
                      {t('leaveManagement.workflowAutomation.form.code') || 'Workflow Code'} *
                    </Label>
                    <Input
                      id="workflow_code"
                      value={workflowTypeData.workflow_code}
                      onChange={(e) => handleWorkflowTypeChange('workflow_code', e.target.value)}
                      placeholder="e.g., WF001, LEAVE_APPROVAL"
                      className={workflowTypeErrors.workflow_code ? 'border-destructive' : ''}
                    />
                    {workflowTypeErrors.workflow_code && (
                      <p className="text-sm text-destructive">{workflowTypeErrors.workflow_code}</p>
                    )}
                  </div>

                  {/* English Name - Show only in English mode */}
                  {currentLocale === 'en' && (
                    <div className="space-y-2">
                      <Label htmlFor="workflow_name_eng">
                        {t('leaveManagement.workflowAutomation.form.nameEng') || 'Workflow Name'} *
                      </Label>
                      <Input
                        id="workflow_name_eng"
                        value={workflowTypeData.workflow_name_eng}
                        onChange={(e) => handleWorkflowTypeChange('workflow_name_eng', e.target.value)}
                        placeholder="Enter workflow name"
                        className={workflowTypeErrors.workflow_name_eng ? 'border-destructive' : ''}
                      />
                      {workflowTypeErrors.workflow_name_eng && (
                        <p className="text-sm text-destructive">{workflowTypeErrors.workflow_name_eng}</p>
                      )}
                    </div>
                  )}

                  {/* Arabic Name - Show only in Arabic mode */}
                  {currentLocale === 'ar' && (
                    <div className="space-y-2">
                      <Label htmlFor="workflow_name_arb">
                        {t('leaveManagement.workflowAutomation.form.nameArb') || 'اسم سير العمل'} *
                      </Label>
                      <Input
                        id="workflow_name_arb"
                        value={workflowTypeData.workflow_name_arb}
                        onChange={(e) => handleWorkflowTypeChange('workflow_name_arb', e.target.value)}
                        placeholder="أدخل اسم سير العمل"
                        className={workflowTypeErrors.workflow_name_arb ? 'border-destructive' : ''}
                      />
                      {workflowTypeErrors.workflow_name_arb && (
                        <p className="text-sm text-destructive">{workflowTypeErrors.workflow_name_arb}</p>
                      )}
                    </div>
                  )}

                  {/* English Category - Show only in English mode */}
                  {currentLocale === 'en' && (
                    <div className="space-y-2">
                      <Label htmlFor="workflow_category_eng">
                        {t('leaveManagement.workflowAutomation.form.categoryEng') || 'Category'}
                      </Label>
                      <Input
                        id="workflow_category_eng"
                        value={workflowTypeData.workflow_category_eng}
                        onChange={(e) => handleWorkflowTypeChange('workflow_category_eng', e.target.value)}
                        placeholder="Enter category (e.g., HR Management, Leave Management)"
                      />
                    </div>
                  )}

                  {/* Arabic Category - Show only in Arabic mode */}
                  {currentLocale === 'ar' && (
                    <div className="space-y-2">
                      <Label htmlFor="workflow_category_arb">
                        {t('leaveManagement.workflowAutomation.form.categoryArb') || 'الفئة'}
                      </Label>
                      <Input
                        id="workflow_category_arb"
                        value={workflowTypeData.workflow_category_arb}
                        onChange={(e) => handleWorkflowTypeChange('workflow_category_arb', e.target.value)}
                        placeholder="أدخل الفئة (مثل: إدارة الموارد البشرية، إدارة الإجازات)"
                      />
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Section 2: Workflow Steps */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <span className="bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400 rounded-full w-6 h-6 flex items-center justify-center text-sm font-semibold">
                      2
                    </span>
                    {t('leaveManagement.workflowAutomation.form.workflowSteps') || 'Workflow Steps'}
                    <span className="text-sm text-muted-foreground ml-2">
                      ({workflowSteps.length}/4 steps)
                    </span>
                  </CardTitle>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addStep}
                    disabled={workflowSteps.length >= 4}
                    className="flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    {t('leaveManagement.workflowAutomation.form.addStep') || 'Add Step'}
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {workflowSteps.map((step, stepIndex) => (
                  <div key={stepIndex} className="border rounded-lg p-4 relative">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-medium flex items-center gap-2">
                        <span className="bg-muted text-muted-foreground rounded-full w-6 h-6 flex items-center justify-center text-sm">
                          {step.step_order}
                        </span>
                        {t('leaveManagement.workflowAutomation.form.step') || 'Step'} {step.step_order}
                        {step.is_final_step && (
                          <span className="text-xs bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400 px-2 py-1 rounded">
                            {t('leaveManagement.workflowAutomation.form.finalStep') || 'Final Step'}
                          </span>
                        )}
                      </h4>
                      {workflowSteps.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeStep(stepIndex)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Step Name (English) - Show only in English mode */}
                      {currentLocale === 'en' && (
                        <div className="space-y-2">
                          <Label>
                            {t('leaveManagement.workflowAutomation.form.stepNameEng') || 'Step Name'} *
                          </Label>
                          <Input
                            value={step.step_eng}
                            onChange={(e) => handleStepChange(stepIndex, 'step_eng', e.target.value)}
                            placeholder="e.g., Manager Approval, HR Review"
                            className={stepErrors[stepIndex]?.step_eng ? 'border-destructive' : ''}
                          />
                          {stepErrors[stepIndex]?.step_eng && (
                            <p className="text-sm text-destructive">{stepErrors[stepIndex].step_eng}</p>
                          )}
                        </div>
                      )}

                      {/* Step Name (Arabic) - Show only in Arabic mode */}
                      {currentLocale === 'ar' && (
                        <div className="space-y-2">
                          <Label>
                            {t('leaveManagement.workflowAutomation.form.stepNameArb') || 'اسم الخطوة'} *
                          </Label>
                          <Input
                            value={step.step_arb}
                            onChange={(e) => handleStepChange(stepIndex, 'step_arb', e.target.value)}
                            placeholder="مثل: موافقة المدير، مراجعة الموارد البشرية"
                            className={stepErrors[stepIndex]?.step_arb ? 'border-destructive' : ''}
                          />
                          {stepErrors[stepIndex]?.step_arb && (
                            <p className="text-sm text-destructive">{stepErrors[stepIndex].step_arb}</p>
                          )}
                        </div>
                      )}

                      {/* Role */}
                      <div className="space-y-2">
                        <Label>
                          {t('leaveManagement.workflowAutomation.form.role') || 'Approver Role'} *
                        </Label>
                        <Select
                          value={step.role_id.toString()}
                          onValueChange={(value) => handleStepChange(stepIndex, 'role_id', parseInt(value))}
                        >
                          <SelectTrigger className={stepErrors[stepIndex]?.role_id ? 'border-destructive' : ''}>
                            <SelectValue placeholder={rolesLoading ? "Loading roles..." : "Select role"} />
                          </SelectTrigger>
                          <SelectContent>
                            {rolesLoading ? (
                              <SelectItem value="loading" disabled>Loading roles...</SelectItem>
                            ) : roles.length === 0 ? (
                              <SelectItem value="no-roles" disabled>No roles found</SelectItem>
                            ) : (
                              roles.map((role) => {
                                // Handle different possible field names
                                const roleId = role.role_id || role.id;
                                const roleName = role.role_name || role.name;
                                
                                return roleId && roleName ? (
                                  <SelectItem key={roleId} value={roleId.toString()}>
                                    {roleName}
                                  </SelectItem>
                                ) : null;
                              })
                            )}
                          </SelectContent>
                        </Select>
                        {stepErrors[stepIndex]?.role_id && (
                          <p className="text-sm text-destructive">Role is required</p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Submit Button */}
            <div className="flex justify-end gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleBack}
                disabled={isSubmitting}
              >
                {t('common.cancel') || 'Cancel'}
              </Button>
              
              <Button
                type="submit"
                disabled={isSubmitting}
                className="min-w-[180px]"
              >
                {isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    {t('common.saving') || 'Creating...'}
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Save className="w-4 h-4" />
                    {t('leaveManagement.workflowAutomation.form.createWorkflow') || 'Create Workflow Type'}
                  </div>
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
