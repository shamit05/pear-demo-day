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
          <h3 className="text-2xl font-bold text-black mb-2 line-clamp-1">{company.name}</h3>
          <p className="text-base text-black/70 mb-4 line-clamp-2">{company.tagline}</p>
        </div>
      </div>
    </Link>
  );
}
