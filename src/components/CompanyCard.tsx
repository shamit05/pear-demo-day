// CompanyCard Component - Pear Design
// Matches exact card design with image

'use client';

import Link from 'next/link';
import { Company } from '@/types';

interface CompanyCardProps {
  company: Company;
}

export default function CompanyCard({ company }: CompanyCardProps) {
  return (
    <Link href={`/company/${company.id}`}>
      <div className="bg-white border border-black/10 rounded-lg overflow-hidden shadow-sm hover:shadow-xl transition-shadow duration-300 cursor-pointer">
        {/* Company Image */}
        <div 
          className="w-full aspect-video bg-cover bg-center"
          style={{ 
            backgroundImage: company.image 
              ? `url('${company.image}')` 
              : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
          }}
        />
        
        {/* Company Info */}
        <div className="p-6">
          <p className="font-bold font-[family-name:var(--font-display)] text-2xl text-black">
            {company.name}
          </p>
          <p className="text-base text-black/60 mt-2 font-[family-name:var(--font-body)]">
            {company.tagline}
          </p>
        </div>
      </div>
    </Link>
  );
}
