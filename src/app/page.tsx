// Pear Demo Day Landing Page
// Matches exact design from HTML

'use client';

import { useState } from 'react';
import HeaderNav from '@/components/HeaderNav';
import Footer from '@/components/Footer';
import CompanyGrid from '@/components/CompanyGrid';
import { mockCompanies, filterOptions } from '@/data/mockData';

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const [industryFilter, setIndustryFilter] = useState('');
  const [stageFilter, setStageFilter] = useState('');
  const [batchFilter, setBatchFilter] = useState('');
  const [aiFilteredCompanies, setAiFilteredCompanies] = useState(mockCompanies);
  const [isAiSearching, setIsAiSearching] = useState(false);
  const [appliedFilters, setAppliedFilters] = useState<any>(null);

  // Handle AI search
  const handleAiSearch = async () => {
    if (!searchQuery.trim()) {
      setAiFilteredCompanies(mockCompanies);
      setAppliedFilters(null);
      return;
    }

    setIsAiSearching(true);
    try {
      const response = await fetch('/api/ai-search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: searchQuery }),
      });

      const data = await response.json();
      setAiFilteredCompanies(data.companies);
      setAppliedFilters(data.filters);
    } catch (error) {
      console.error('AI search failed:', error);
    } finally {
      setIsAiSearching(false);
    }
  };

  // Filter companies based on manual filters AND AI results
  const filteredCompanies = aiFilteredCompanies.filter(company => {
    const matchesIndustry = !industryFilter || company.industry === industryFilter;
    const matchesStage = !stageFilter || company.stage === stageFilter;
    const matchesBatch = !batchFilter || company.batch === batchFilter;
    
    return matchesIndustry && matchesStage && matchesBatch;
  });

  return (
    <div className="flex flex-col min-h-screen">
      <HeaderNav />
      
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="bg-[var(--fill-color)] rounded-xl p-8 md:p-12 mb-8 text-center">
          <h1 className="text-5xl md:text-7xl font-[family-name:var(--font-display)] font-bold leading-tight tracking-tight mb-2">
            Pear Demo Day
          </h1>
          <p className="text-lg text-black/70 max-w-2xl mx-auto font-[family-name:var(--font-body)]">
            Discover and connect with the next generation of visionary founders.
          </p>
        </div>

        <div className="space-y-8">
          {/* AI Search Section */}
          <div className="gap-6">
            <div className="relative w-full">
              {/* Rainbow gradient border effect */}
              <div className="absolute -inset-[2px] bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 rounded-full opacity-20 blur-sm"></div>
              
              <div className="relative flex items-center bg-white rounded-full border border-black/10 shadow-lg">
                <input
                  className="flex-1 pl-6 pr-4 py-4 font-[family-name:var(--font-body)] bg-transparent rounded-full text-black placeholder-black/50 focus:outline-none"
                  placeholder="Ask AI to filter or find companies..."
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAiSearch();
                    }
                  }}
                />
                
                {/* AI Search Button */}
                <button 
                  className="flex items-center gap-2 px-6 py-3 mr-1 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-full font-medium hover:from-purple-600 hover:to-blue-600 transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={handleAiSearch}
                  disabled={isAiSearching}
                >
                  {isAiSearching ? (
                    <>
                      <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span className="hidden sm:inline">Searching...</span>
                    </>
                  ) : (
                    <>
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 2.75L10.88 5.12L8.5 6.25L10.88 7.38L12 9.75L13.12 7.38L15.5 6.25L13.12 5.12L12 2.75Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"></path>
                        <path d="M5.75 8.75L4.88 10.62L3 11.25L4.88 11.88L5.75 13.75L6.62 11.88L8.5 11.25L6.62 10.62L5.75 8.75Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"></path>
                        <path d="M19.75 9.75L18.88 11.62L17 12.25L18.88 12.88L19.75 14.75L20.62 12.88L22.5 12.25L20.62 11.62L19.75 9.75Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"></path>
                        <path d="M12 14.75L10.88 17.12L8.5 18.25L10.88 19.38L12 21.75L13.12 19.38L15.5 18.25L13.12 17.12L12 14.75Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"></path>
                      </svg>
                      <span className="hidden sm:inline">Search</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* AI Applied Filters Indicator */}
          {appliedFilters && Object.keys(appliedFilters).length > 0 && (
            <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <svg className="h-5 w-5 text-purple-600 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2.75L10.88 5.12L8.5 6.25L10.88 7.38L12 9.75L13.12 7.38L15.5 6.25L13.12 5.12L12 2.75Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"></path>
                  <path d="M5.75 8.75L4.88 10.62L3 11.25L4.88 11.88L5.75 13.75L6.62 11.88L8.5 11.25L6.62 10.62L5.75 8.75Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"></path>
                </svg>
                <div className="flex-1">
                  <p className="text-sm font-medium text-purple-900 mb-2">AI Applied Filters:</p>
                  <div className="flex flex-wrap gap-2">
                    {appliedFilters.industries?.map((industry: string) => (
                      <span key={industry} className="px-3 py-1 bg-white text-purple-700 text-xs font-medium rounded-full border border-purple-200">
                        Industry: {industry}
                      </span>
                    ))}
                    {appliedFilters.stages?.map((stage: string) => (
                      <span key={stage} className="px-3 py-1 bg-white text-purple-700 text-xs font-medium rounded-full border border-purple-200">
                        Stage: {stage}
                      </span>
                    ))}
                    {appliedFilters.batches?.map((batch: string) => (
                      <span key={batch} className="px-3 py-1 bg-white text-purple-700 text-xs font-medium rounded-full border border-purple-200">
                        Batch: {batch}
                      </span>
                    ))}
                    {appliedFilters.tags?.map((tag: string) => (
                      <span key={tag} className="px-3 py-1 bg-white text-purple-700 text-xs font-medium rounded-full border border-purple-200">
                        Tag: {tag}
                      </span>
                    ))}
                    {appliedFilters.locations?.map((location: string) => (
                      <span key={location} className="px-3 py-1 bg-white text-purple-700 text-xs font-medium rounded-full border border-purple-200">
                        Location: {location}
                      </span>
                    ))}
                    {appliedFilters.searchText && (
                      <span className="px-3 py-1 bg-white text-purple-700 text-xs font-medium rounded-full border border-purple-200">
                        Search: {appliedFilters.searchText}
                      </span>
                    )}
                  </div>
                </div>
                <button 
                  onClick={() => {
                    setSearchQuery('');
                    setAiFilteredCompanies(mockCompanies);
                    setAppliedFilters(null);
                  }}
                  className="text-purple-600 hover:text-purple-800 transition"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          )}

          {/* Filters */}
          <div className="flex items-center gap-4 flex-wrap">
            <h3 className="text-sm font-bold text-black/60 mr-2">Manual Filters:</h3>
            
            {/* Industry Filter */}
            <div className="relative">
              <select 
                className="appearance-none bg-white border border-black/10 rounded-full py-2 pl-4 pr-10 text-sm font-medium text-black focus:ring-[var(--button-color)] focus:border-[var(--button-color)] transition"
                value={industryFilter}
                onChange={(e) => setIndustryFilter(e.target.value)}
              >
                <option value="">Industry</option>
                {filterOptions.industries.map(industry => (
                  <option key={industry} value={industry}>{industry}</option>
                ))}
              </select>
              <svg className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-black/50 pointer-events-none" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path clipRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.25 4.25a.75.75 0 01-1.06 0L5.21 8.27a.75.75 0 01.02-1.06z" fillRule="evenodd"></path>
              </svg>
            </div>

            {/* Stage Filter */}
            <div className="relative">
              <select 
                className="appearance-none bg-white border border-black/10 rounded-full py-2 pl-4 pr-10 text-sm font-medium text-black focus:ring-[var(--button-color)] focus:border-[var(--button-color)] transition"
                value={stageFilter}
                onChange={(e) => setStageFilter(e.target.value)}
              >
                <option value="">Stage</option>
                {filterOptions.stages.map(stage => (
                  <option key={stage} value={stage}>{stage}</option>
                ))}
              </select>
              <svg className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-black/50 pointer-events-none" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path clipRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.25 4.25a.75.75 0 01-1.06 0L5.21 8.27a.75.75 0 01.02-1.06z" fillRule="evenodd"></path>
              </svg>
            </div>

            {/* Batch Filter */}
            <div className="relative">
              <select 
                className="appearance-none bg-white border border-black/10 rounded-full py-2 pl-4 pr-10 text-sm font-medium text-black focus:ring-[var(--button-color)] focus:border-[var(--button-color)] transition"
                value={batchFilter}
                onChange={(e) => setBatchFilter(e.target.value)}
              >
                <option value="">Batch</option>
                {filterOptions.batches.map(batch => (
                  <option key={batch} value={batch}>{batch}</option>
                ))}
              </select>
              <svg className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-black/50 pointer-events-none" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path clipRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.25 4.25a.75.75 0 01-1.06 0L5.21 8.27a.75.75 0 01.02-1.06z" fillRule="evenodd"></path>
              </svg>
            </div>
          </div>

          {/* Companies Section */}
          <div>
            <h2 className="text-3xl font-bold font-[family-name:var(--font-display)] text-black mb-6">
              Companies
            </h2>
            <CompanyGrid companies={filteredCompanies} />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
