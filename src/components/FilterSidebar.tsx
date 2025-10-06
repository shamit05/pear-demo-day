// FilterSidebar Component
// Figma Frame: MainContent > FilterSidebar
// Maps to: /components/FilterSidebar.tsx
// Features: Industry, Stage, Batch dropdowns + AI natural language filter

'use client';

import { useState } from 'react';
import { filterOptions } from '@/data/mockData';

interface FilterSidebarProps {
  onFilterChange?: (filters: FilterState) => void;
}

export interface FilterState {
  industry: string;
  stage: string;
  batch: string;
  aiQuery: string;
}

export default function FilterSidebar({ onFilterChange }: FilterSidebarProps) {
  const [filters, setFilters] = useState<FilterState>({
    industry: '',
    stage: '',
    batch: '',
    aiQuery: '',
  });

  const handleFilterChange = (key: keyof FilterState, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    if (onFilterChange) {
      onFilterChange(newFilters);
    }
  };

  const clearFilters = () => {
    const emptyFilters: FilterState = {
      industry: '',
      stage: '',
      batch: '',
      aiQuery: '',
    };
    setFilters(emptyFilters);
    if (onFilterChange) {
      onFilterChange(emptyFilters);
    }
  };

  return (
    <aside className="w-full lg:w-64 bg-white border border-[var(--border-gray)] rounded-xl p-6 h-fit sticky top-20">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-semibold text-lg text-[var(--text-primary)]">Filters</h3>
        <button
          onClick={clearFilters}
          className="text-sm text-[var(--blue-accent)] hover:underline"
        >
          Clear all
        </button>
      </div>

      <div className="space-y-6">
        {/* Industry Dropdown */}
        <div>
          <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
            Industry
          </label>
          <select
            value={filters.industry}
            onChange={(e) => handleFilterChange('industry', e.target.value)}
            className="w-full px-3 py-2 border border-[var(--border-gray)] rounded-lg focus:outline-none focus:border-[var(--pear-green)] bg-white text-[var(--text-primary)]"
          >
            <option value="">All Industries</option>
            {filterOptions.industries.map((industry) => (
              <option key={industry} value={industry}>
                {industry}
              </option>
            ))}
          </select>
        </div>

        {/* Stage Dropdown */}
        <div>
          <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
            Stage
          </label>
          <select
            value={filters.stage}
            onChange={(e) => handleFilterChange('stage', e.target.value)}
            className="w-full px-3 py-2 border border-[var(--border-gray)] rounded-lg focus:outline-none focus:border-[var(--pear-green)] bg-white text-[var(--text-primary)]"
          >
            <option value="">All Stages</option>
            {filterOptions.stages.map((stage) => (
              <option key={stage} value={stage}>
                {stage}
              </option>
            ))}
          </select>
        </div>

        {/* Batch Dropdown */}
        <div>
          <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
            Batch
          </label>
          <select
            value={filters.batch}
            onChange={(e) => handleFilterChange('batch', e.target.value)}
            className="w-full px-3 py-2 border border-[var(--border-gray)] rounded-lg focus:outline-none focus:border-[var(--pear-green)] bg-white text-[var(--text-primary)]"
          >
            <option value="">All Batches</option>
            {filterOptions.batches.map((batch) => (
              <option key={batch} value={batch}>
                {batch}
              </option>
            ))}
          </select>
        </div>

        {/* AI Natural Language Filter - Cupcake Feature */}
        <div className="pt-4 border-t border-[var(--border-gray)]">
          <label className="block text-sm font-medium text-[var(--text-primary)] mb-2 flex items-center space-x-1">
            <span>AI Smart Filter</span>
            <svg className="w-4 h-4 text-[var(--pear-green)]" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
            </svg>
          </label>
          <textarea
            value={filters.aiQuery}
            onChange={(e) => handleFilterChange('aiQuery', e.target.value)}
            placeholder="Describe what you're looking for..."
            rows={3}
            className="w-full px-3 py-2 border border-[var(--border-gray)] rounded-lg focus:outline-none focus:border-[var(--pear-green)] bg-white text-[var(--text-primary)] text-sm resize-none"
          />
          <p className="mt-1 text-xs text-[var(--text-secondary)]">
            Try: "B2B SaaS companies with AI focus"
          </p>
        </div>
      </div>
    </aside>
  );
}
