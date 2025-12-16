"use client";

import Checkbox from "./Checkbox";

export interface CheckboxOption {
  value: string;
  label: string;
}

interface CheckboxGroupProps {
  options: CheckboxOption[];
  selectedValues: string[];
  onChange: (values: string[]) => void;
  disabled?: boolean;
}

export default function CheckboxGroup({
  options,
  selectedValues,
  onChange,
  disabled = false,
}: CheckboxGroupProps) {
  const handleCheckboxChange = (value: string, checked: boolean) => {
    if (checked) {
      onChange([...selectedValues, value]);
    } else {
      onChange(selectedValues.filter((v) => v !== value));
    }
  };

  return (
    <div className="flex flex-col gap-1" role="group">
      {options.map((option) => (
        <Checkbox
          key={option.value}
          label={option.label}
          checked={selectedValues.includes(option.value)}
          onChange={(checked) => handleCheckboxChange(option.value, checked)}
          disabled={disabled}
        />
      ))}
    </div>
  );
}
