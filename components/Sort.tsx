"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { ChevronDown } from "lucide-react";

export interface SortOption {
  value: string;
  label: string;
}

const defaultSortOptions: SortOption[] = [
  { value: "featured", label: "Featured" },
  { value: "newest", label: "Newest" },
  { value: "price-high-to-low", label: "Price: High-Low" },
  { value: "price-low-to-high", label: "Price: Low-High" },
];

interface SortProps {
  options?: SortOption[];
}

export default function Sort({ options = defaultSortOptions }: SortProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const currentSort = searchParams.get("sort") || "featured";

  const handleSelect = useCallback(
    (value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value === "featured") {
        params.delete("sort");
      } else {
        params.set("sort", value);
      }
      router.push(`${pathname}?${params.toString()}`, { scroll: true });
      setIsOpen(false);
    },
    [searchParams, router, pathname]
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  const handleKeyDown = (event: React.KeyboardEvent, value: string) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      handleSelect(value);
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 text-body font-body text-dark-900 hover:text-dark-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-dark-900 focus-visible:ring-offset-2"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <span>Sort By</span>
        <ChevronDown
          className={`h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
          aria-hidden="true"
        />
      </button>

      {isOpen && (
        <ul
          role="listbox"
          aria-label="Sort options"
          className="absolute right-0 top-full z-30 mt-2 min-w-48 rounded-lg border border-light-300 bg-light-100 py-2 shadow-lg"
        >
          {options.map((option) => (
            <li
              key={option.value}
              role="option"
              aria-selected={currentSort === option.value}
              tabIndex={0}
              onClick={() => handleSelect(option.value)}
              onKeyDown={(e) => handleKeyDown(e, option.value)}
              className={`cursor-pointer px-4 py-2 text-body font-body transition-colors hover:bg-light-200 focus:bg-light-200 focus:outline-none ${
                currentSort === option.value
                  ? "font-body-medium text-dark-900"
                  : "text-dark-700"
              }`}
            >
              {option.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
