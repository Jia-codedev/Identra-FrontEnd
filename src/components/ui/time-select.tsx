import * as React from "react";
import { cn } from "@/lib/utils";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";

export interface TimeSelectProps {
  value?: string;
  onChange?: (value: string) => void;
  className?: string;
  disabled?: boolean;
  step?: number; // in minutes
  startHour?: number;
  endHour?: number;
}

function generateTimeOptions(step: number, startHour: number, endHour: number) {
  const options: string[] = [];
  for (let h = startHour; h <= endHour; h++) {
    for (let m = 0; m < 60; m += step) {
      const hour = h.toString().padStart(2, "0");
      const min = m.toString().padStart(2, "0");
      options.push(`${hour}:${min}`);
    }
  }
  return options;
}

export const TimeSelect: React.FC<TimeSelectProps> = ({ value = "", onChange, className, disabled, step = 15, startHour = 0, endHour = 23 }) => {
  const options = React.useMemo(() => generateTimeOptions(step, startHour, endHour), [step, startHour, endHour]);
  return (
    <Select value={value} onValueChange={onChange} disabled={disabled}>
      <SelectTrigger className={cn("w-28", className)}>
        <SelectValue placeholder="--:--" />
      </SelectTrigger>
      <SelectContent className="max-h-60 overflow-y-auto">
        {options.map(opt => (
          <SelectItem key={opt} value={opt} className="text-sm">
            {opt}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
