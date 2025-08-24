import * as React from "react";

export interface TimePickerProps {
  value?: string;
  onChange?: (value: string) => void;
  className?: string;
  disabled?: boolean;
}

export const TimePicker: React.FC<TimePickerProps> = ({ value, onChange, className, disabled }) => {
  return (
    <input
      type="time"
      value={value}
      onChange={e => onChange?.(e.target.value)}
      className={className}
      disabled={disabled}
    />
  );
};
