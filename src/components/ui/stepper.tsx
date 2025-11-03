"use client";

import React from "react";
import { CheckIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export interface Step {
  id: string;
  title: string;
  description?: string;
  isCompleted?: boolean;
  isActive?: boolean;
  isOptional?: boolean;
}

interface StepperProps {
  steps: Step[];
  currentStep: number;
  orientation?: "horizontal" | "vertical";
  className?: string;
  compact?: boolean;
}

export const Stepper: React.FC<StepperProps> = ({
  steps,
  currentStep,
  orientation = "horizontal",
  className,
  compact = false,
}) => {
  const isHorizontal = orientation === "horizontal";

  return (
    <div
      className={cn(
        "w-full",
        className
      )}
    >
      {/* Mobile Compact View */}
      <div className="md:hidden">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div
              className={cn(
                "flex h-8 w-8 items-center justify-center rounded-full border-2 text-sm font-medium",
                "border-primary bg-primary text-primary-foreground"
              )}
            >
              {currentStep < steps.length - 1 ? (
                <span>{currentStep + 1}</span>
              ) : (
                <CheckIcon className="h-4 w-4" />
              )}
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">
                {steps[currentStep]?.title}
              </p>
              <p className="text-xs text-muted-foreground">
                Step {currentStep + 1} of {steps.length}
              </p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-xs text-muted-foreground mb-1">Progress</div>
            <div className="w-20 h-2 bg-muted rounded-full">
              <div 
                className="h-2 bg-primary rounded-full transition-all duration-300"
                style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Desktop Full View */}
      <div className={cn(
        "hidden md:flex",
        isHorizontal ? "items-start justify-between" : "flex-col"
      )}>
        {steps.map((step, index) => {
          const isActive = index === currentStep;
          const isCompleted = index < currentStep;
          const isLast = index === steps.length - 1;

          return (
            <div
              key={step.id}
              className={cn(
                "flex",
                isHorizontal ? "flex-col items-center flex-1" : "flex-row items-center",
                !isLast && !isHorizontal && "mb-6"
              )}
            >
              <div className={cn(
                "flex items-center",
                isHorizontal ? "flex-col" : "flex-row"
              )}>
                {/* Step Circle */}
                <div
                  className={cn(
                    "relative flex items-center justify-center rounded-full border-2 text-sm font-medium transition-all duration-200",
                    compact ? "h-8 w-8" : "h-10 w-10",
                    isCompleted
                      ? "border-primary bg-primary text-primary-foreground shadow-md"
                      : isActive
                      ? "border-primary bg-background text-primary shadow-sm ring-4 ring-primary/10"
                      : "border-muted-foreground/30 bg-background text-muted-foreground"
                  )}
                >
                  {isCompleted ? (
                    <CheckIcon className={cn(compact ? "h-4 w-4" : "h-5 w-5")} />
                  ) : (
                    <span className={cn(compact ? "text-xs" : "text-sm")}>{index + 1}</span>
                  )}
                </div>

                {/* Step Label */}
                <div className={cn(
                  "text-center",
                  isHorizontal ? "mt-3" : "ml-4"
                )}>
                  <div
                    className={cn(
                      "font-medium transition-colors",
                      compact ? "text-sm" : "text-base",
                      isActive || isCompleted
                        ? "text-foreground"
                        : "text-muted-foreground"
                    )}
                  >
                    {step.title}
                  </div>
                  {step.description && !compact && (
                    <div className={cn(
                      "text-muted-foreground mt-1",
                      isHorizontal ? "text-xs max-w-24" : "text-sm"
                    )}>
                      {step.description}
                    </div>
                  )}
                </div>
              </div>

              {/* Vertical Connector */}
              {!isLast && !isHorizontal && (
                <div
                  className={cn(
                    "ml-5 h-8 w-0.5 transition-colors duration-300",
                    isCompleted ? "bg-primary" : "bg-muted-foreground/30"
                  )}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Stepper;
