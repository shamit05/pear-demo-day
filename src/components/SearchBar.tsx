// SearchBar Component
// Figma Frame: Hero > SearchBar
// Maps to: /components/SearchBar.tsx
// Features: Natural language search with AI filter icon

'use client';

import { useState } from 'react';

interface SearchBarProps {
  onSearch?: (query: string) => void;
  placeholder?: string;
}

export default function SearchBar({ 
  onSearch, 
  placeholder = "Try: AI fintech startups raising Seed rounds" 
}: SearchBarProps) {
  const [query, setQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(query);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-3xl mx-auto">
      <div className="relative">
        {/* Search Icon */}
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        {/* Input Field */}
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          className="w-full pl-12 pr-32 py-4 text-base border-2 border-[var(--border-gray)] rounded-xl focus:outline-none focus:border-[var(--pear-green)] transition-colors bg-white"
        />

        {/* AI Filter Button - Cupcake Feature */}
        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center space-x-2">
          <button
            type="button"
            className="px-3 py-2 bg-[var(--panel-bg)] text-[var(--text-secondary)] rounded-lg hover:bg-[var(--pear-green)] hover:text-white transition-all flex items-center space-x-1 text-sm font-medium"
            title="AI Smart Filter"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
            </svg>
            <span>Filters</span>
          </button>
          
          <button
            type="submit"
            className="px-4 py-2 bg-[var(--blue-accent)] text-white rounded-lg hover:opacity-90 hover:shadow-md transition-all font-medium"
          >
            Search
          </button>
        </div>
      </div>

      {/* AI Smart Filter Label - Developer Note */}
      <div className="mt-2 text-xs text-[var(--text-secondary)] flex items-center space-x-1">
        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
          <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
        </svg>
        <span>Powered by AI semantic search</span>
      </div>
    </form>
  );
}
