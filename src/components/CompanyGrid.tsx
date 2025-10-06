// CompanyGrid Component
// Figma Frame: MainContent > CompanyGrid
// Maps to: /components/CompanyGrid.tsx
// Responsive grid layout for CompanyCard components

import { Company } from '@/types';
import CompanyCard from './CompanyCard';

interface CompanyGridProps {
  companies: Company[];
}

export default function CompanyGrid({ companies }: CompanyGridProps) {
  if (companies.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <svg className="w-16 h-16 text-[var(--text-secondary)] mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-2">
          No companies found
        </h3>
        <p className="text-[var(--text-secondary)]">
          Try adjusting your filters or search query
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {companies.map((company) => (
        <CompanyCard key={company.id} company={company} />
      ))}
    </div>
  );
}
