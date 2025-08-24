import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface TimeRangePickerProps {
  from?: string;
  to?: string;
  onChange?: (from: string, to: string) => void;
  className?: string;
  disabled?: boolean;
}

export const TimeRangePicker: React.FC<TimeRangePickerProps> = ({ from = "", to = "", onChange, className, disabled }) => {
  // Ensure max 8 hours difference
  const handleFromChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFrom = e.target.value;
    if (to && newFrom && !isValidRange(newFrom, to)) return;
    onChange?.(newFrom, to);
  };
  const handleToChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTo = e.target.value;
    if (from && newTo && !isValidRange(from, newTo)) return;
    onChange?.(from, newTo);
  };
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <input
        type="time"
        value={from}
        onChange={handleFromChange}
        className={cn("border rounded-md px-2 py-1 w-28", disabled && "opacity-50")}
        disabled={disabled}
        step={60}
      />
      <span className="text-muted-foreground">to</span>
      <input
        type="time"
        value={to}
        onChange={handleToChange}
        className={cn("border rounded-md px-2 py-1 w-28", disabled && "opacity-50")}
        disabled={disabled}
        step={60}
      />
      <Button
        type="button"
        variant="ghost"
        size="sm"
        className="ml-2"
        onClick={() => onChange?.("", "")}
        disabled={disabled}
      >
        Clear
      </Button>
    </div>
  );
};

function isValidRange(from: string, to: string) {
  // Returns true if the difference is <= 8 hours
  const [fh, fm] = from.split(":").map(Number);
  const [th, tm] = to.split(":").map(Number);
  const fromMinutes = fh * 60 + fm;
  const toMinutes = th * 60 + tm;
  if (toMinutes <= fromMinutes) return false;
  return (toMinutes - fromMinutes) <= 8 * 60;
}
