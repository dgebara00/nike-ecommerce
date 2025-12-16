"use client";

import { useId } from "react";

interface CheckboxProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  id?: string;
  disabled?: boolean;
}

export default function Checkbox({
  label,
  checked,
  onChange,
  id,
  disabled = false,
}: CheckboxProps) {
  const generatedId = useId();
  const checkboxId = id || generatedId;

  return (
    <label
      htmlFor={checkboxId}
      className={`flex cursor-pointer items-center gap-3 py-1 ${
        disabled ? "cursor-not-allowed opacity-50" : ""
      }`}
    >
      <span className="relative flex h-5 w-5 items-center justify-center">
        <input
          type="checkbox"
          id={checkboxId}
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          disabled={disabled}
          className="peer sr-only"
        />
        <span
          className={`flex h-5 w-5 items-center justify-center rounded border transition-colors ${
            checked
              ? "border-dark-900 bg-dark-900"
              : "border-dark-500 bg-light-100"
          } peer-focus-visible:ring-2 peer-focus-visible:ring-dark-900 peer-focus-visible:ring-offset-2`}
          aria-hidden="true"
        >
          {checked && (
            <svg
              className="h-3 w-3 text-light-100"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={3}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 13l4 4L19 7"
              />
            </svg>
          )}
        </span>
      </span>
      <span className="text-body font-body text-dark-900">{label}</span>
    </label>
  );
}
