"use client";

import { useState } from "react";
import { ChevronUp, ChevronDown } from "lucide-react";
import CheckboxGroup, { type CheckboxOption } from "./CheckboxGroup";

interface FilterProps {
  label: string;
  options: CheckboxOption[];
  selectedValues: string[];
  onChange: (values: string[]) => void;
  defaultExpanded?: boolean;
}

export default function Filter({
  label,
  options,
  selectedValues,
  onChange,
  defaultExpanded = true,
}: FilterProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  return (
    <div className="border-b border-light-300 py-4">
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex w-full items-center justify-between text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-dark-900 focus-visible:ring-offset-2"
        aria-expanded={isExpanded}
      >
        <span className="text-body font-body-medium text-dark-900">{label}</span>
        {isExpanded ? (
          <ChevronUp className="h-5 w-5 text-dark-900" aria-hidden="true" />
        ) : (
          <ChevronDown className="h-5 w-5 text-dark-900" aria-hidden="true" />
        )}
      </button>
      {isExpanded && (
        <div className="mt-3">
          <CheckboxGroup options={options} selectedValues={selectedValues} onChange={onChange} />
        </div>
      )}
    </div>
  );
}
