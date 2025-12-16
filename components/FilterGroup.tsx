"use client";

import { useState, useCallback, useEffect } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { X, SlidersHorizontal } from "lucide-react";
import Filter from "./Filter";
import type { CheckboxOption } from "./CheckboxGroup";

export interface FilterConfig {
  key: string;
  label: string;
  options: CheckboxOption[];
  defaultExpanded?: boolean;
}

interface CategoryLink {
  label: string;
  slug: string;
}

interface FilterGroupProps {
  filters: FilterConfig[];
  categoryLinks?: CategoryLink[];
  totalProducts: number;
}

export default function FilterGroup({
  filters,
  categoryLinks = [],
  totalProducts,
}: FilterGroupProps) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const getSelectedValues = useCallback(
    (key: string): string[] => {
      const value = searchParams.get(key);
      return value ? value.split(",") : [];
    },
    [searchParams]
  );

  const updateFilter = useCallback(
    (key: string, values: string[]) => {
      const params = new URLSearchParams(searchParams.toString());
      if (values.length > 0) {
        params.set(key, values.join(","));
      } else {
        params.delete(key);
      }
      router.push(`${pathname}?${params.toString()}`, { scroll: true });
    },
    [searchParams, router, pathname]
  );

  const clearAllFilters = useCallback(() => {
    router.push(pathname, { scroll: false });
  }, [router, pathname]);

  const getActiveFiltersCount = useCallback(() => {
    let count = 0;
    filters.forEach((filter) => {
      count += getSelectedValues(filter.key).length;
    });
    return count;
  }, [filters, getSelectedValues]);

  const activeFiltersCount = getActiveFiltersCount();

  useEffect(() => {
    if (isMobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isMobileOpen) {
        setIsMobileOpen(false);
      }
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isMobileOpen]);

  const filterContent = (
    <>
      {categoryLinks.length > 0 && (
        <nav className="mb-4" aria-label="Category links">
          <ul className="flex flex-col gap-1">
            {categoryLinks.map((link) => (
              <li key={link.slug}>
                <button
                  type="button"
                  onClick={() => updateFilter("category", [link.slug])}
                  className={`text-body font-body text-dark-900 hover:text-dark-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-dark-900 focus-visible:ring-offset-2 ${
                    getSelectedValues("category").includes(link.slug)
                      ? "font-body-medium"
                      : ""
                  }`}
                >
                  {link.label}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      )}

      {filters.map((filter) => (
        <Filter
          key={filter.key}
          label={filter.label}
          options={filter.options}
          selectedValues={getSelectedValues(filter.key)}
          onChange={(values) => updateFilter(filter.key, values)}
          defaultExpanded={filter.defaultExpanded}
        />
      ))}

      {activeFiltersCount > 0 && (
        <div className="mt-4 pt-4 border-t border-light-300">
          <button
            type="button"
            onClick={clearAllFilters}
            className="text-caption font-caption text-dark-700 hover:text-dark-900 underline focus:outline-none focus-visible:ring-2 focus-visible:ring-dark-900 focus-visible:ring-offset-2"
          >
            Clear all filters ({activeFiltersCount})
          </button>
        </div>
      )}
    </>
  );

  return (
    <>
      <button
        type="button"
        onClick={() => setIsMobileOpen(true)}
        className="flex items-center gap-2 rounded-full border border-light-300 bg-light-100 px-4 py-2 text-body font-body-medium text-dark-900 transition-colors hover:bg-light-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-dark-900 focus-visible:ring-offset-2 lg:hidden"
        aria-label="Open filters"
      >
        <SlidersHorizontal className="h-5 w-5" aria-hidden="true" />
        <span>Filters</span>
        {activeFiltersCount > 0 && (
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-dark-900 text-footnote font-footnote text-light-100">
            {activeFiltersCount}
          </span>
        )}
      </button>

      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-dark-900/50 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
          aria-hidden="true"
        />
      )}

      <aside
        className={`fixed left-0 top-0 z-50 h-full w-80 max-w-[85vw] transform overflow-y-auto bg-light-100 p-6 shadow-lg transition-transform duration-300 ease-in-out lg:static lg:z-auto lg:h-auto lg:w-64 lg:translate-x-0 lg:overflow-visible lg:p-0 lg:shadow-none ${
          isMobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        aria-label="Product filters"
      >
        <div className="mb-6 flex items-center justify-between lg:hidden">
          <h2 className="text-heading-3 font-heading-3 text-dark-900">
            Filters
          </h2>
          <button
            type="button"
            onClick={() => setIsMobileOpen(false)}
            className="rounded-full p-2 text-dark-900 hover:bg-light-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-dark-900 focus-visible:ring-offset-2"
            aria-label="Close filters"
          >
            <X className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>

        <div className="mb-4 hidden lg:block">
          <h2 className="text-heading-3 font-heading-3 text-dark-900">
            New ({totalProducts})
          </h2>
        </div>

        {filterContent}
      </aside>
    </>
  );
}
