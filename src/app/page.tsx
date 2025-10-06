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
  const [industryFilters, setIndustryFilters] = useState<string[]>([]);
  const [stageFilters, setStageFilters] = useState<string[]>([]);
  const [batchFilters, setBatchFilters] = useState<string[]>([]);
  const [aiFilteredCompanies, setAiFilteredCompanies] = useState(mockCompanies);
  const [isAiSearching, setIsAiSearching] = useState(false);
  const [appliedFilters, setAppliedFilters] = useState<Record<string, string[]> | null>(null);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [searchError, setSearchError] = useState<string | null>(null);

  // Handle AI search
  const handleAiSearch = async () => {
    if (!searchQuery.trim()) {
      setAiFilteredCompanies(mockCompanies);
      setAppliedFilters(null);
      return;
    }

    setIsAiSearching(true);
    setSearchError(null);
    try {
      const response = await fetch('/api/ai-search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: searchQuery }),
      });

      const data = await response.json();
      
      // Check for errors in the response
      if (!response.ok || data.error) {
        setSearchError(data.error || 'Failed to process AI search. Please try again.');
        return;
      }
      
      setAiFilteredCompanies(data.companies);
      setAppliedFilters(data.filters);
      
      // Auto-apply AI filters to manual filters
      if (data.filters) {
        if (data.filters.industries) {
          setIndustryFilters(prev => [...new Set([...prev, ...data.filters.industries])]);
        }
        if (data.filters.stages) {
          setStageFilters(prev => [...new Set([...prev, ...data.filters.stages])]);
        }
        if (data.filters.batches) {
          setBatchFilters(prev => [...new Set([...prev, ...data.filters.batches])]);
        }
      }
    } catch (error) {
      console.error('AI search failed:', error);
      setSearchError('Network error or API rate limit exceeded. Please try again later.');
    } finally {
      setIsAiSearching(false);
    }
  };

  const clearAiFilters = () => {
    // Remove AI-applied filters from manual filters
    if (appliedFilters) {
      if (appliedFilters.industries) {
        setIndustryFilters(prev => prev.filter(f => !appliedFilters.industries.includes(f)));
      }
      if (appliedFilters.stages) {
        setStageFilters(prev => prev.filter(f => !appliedFilters.stages.includes(f)));
      }
      if (appliedFilters.batches) {
        setBatchFilters(prev => prev.filter(f => !appliedFilters.batches.includes(f)));
      }
    }
    setSearchQuery('');
    setAiFilteredCompanies(mockCompanies);
    setAppliedFilters(null);
    setSearchError(null);
  };

  const toggleFilter = (category: 'industry' | 'stage' | 'batch', value: string) => {
    if (category === 'industry') {
      setIndustryFilters(prev => 
        prev.includes(value) ? prev.filter(v => v !== value) : [...prev, value]
      );
    } else if (category === 'stage') {
      setStageFilters(prev => 
        prev.includes(value) ? prev.filter(v => v !== value) : [...prev, value]
      );
    } else {
      setBatchFilters(prev => 
        prev.includes(value) ? prev.filter(v => v !== value) : [...prev, value]
      );
    }
  };

  const clearManualFilters = () => {
    setIndustryFilters([]);
    setStageFilters([]);
    setBatchFilters([]);
  };

  // Filter companies based on manual filters AND AI results (using AND logic)
  const filteredCompanies = aiFilteredCompanies.filter((company) => {
    const hasFilters = industryFilters.length > 0 || stageFilters.length > 0 || batchFilters.length > 0;
    
    if (!hasFilters) return true;

    // AND logic: company must match ALL selected filter categories
    const matchesIndustry = industryFilters.length === 0 || industryFilters.includes(company.industry);
    const matchesStage = stageFilters.length === 0 || stageFilters.includes(company.stage);
    const matchesBatch = batchFilters.length === 0 || batchFilters.includes(company.batch);
    
    return matchesIndustry && matchesStage && matchesBatch;
  });

  return (
    <div className="flex flex-col min-h-screen">
      <HeaderNav />
      
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="bg-[var(--fill-color)] rounded-xl p-8 md:p-12 mb-8 text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-black mb-4 font-[family-name:var(--font-heading)]">
            Pear Demo Day
          </h1>
          <p className="text-xl text-black/70 max-w-2xl mx-auto font-[family-name:var(--font-body)]">
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

          {/* Search Error Display */}
          {searchError && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <svg className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div className="flex-1">
                  <p className="text-sm font-medium text-red-900">{searchError}</p>
                </div>
                <button 
                  onClick={() => setSearchError(null)}
                  className="text-red-600 hover:text-red-800 transition"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          )}

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
                  onClick={clearAiFilters}
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
          <div className="space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <h3 className="text-sm font-bold text-black/60">Manual Filters:</h3>
              
              <div className="flex items-center gap-3">
                {(industryFilters.length > 0 || stageFilters.length > 0 || batchFilters.length > 0) && (
                  <button
                    onClick={clearManualFilters}
                    className="px-4 py-2 text-sm text-gray-600 hover:text-black transition"
                  >
                    Clear All
                  </button>
                )}
              </div>
            </div>

            <p className="text-xs text-gray-600">
              Showing companies matching ALL selected filters
            </p>

            {/* Multi-select Dropdowns */}
            <div className="flex flex-wrap gap-3">
              {/* Industry Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setOpenDropdown(openDropdown === 'industry' ? null : 'industry')}
                  className="px-4 py-2 border-2 border-gray-200 rounded-full text-sm font-medium hover:border-gray-300 focus:border-[var(--button-color)] focus:outline-none cursor-pointer bg-white flex items-center gap-2"
                >
                  + Industry
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {openDropdown === 'industry' && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setOpenDropdown(null)} />
                    <div className="absolute z-20 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 max-h-64 overflow-y-auto">
                      {filterOptions.industries.map(industry => (
                        <label key={industry} className="flex items-center gap-2 px-4 py-2 hover:bg-gray-50 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={industryFilters.includes(industry)}
                            onChange={() => toggleFilter('industry', industry)}
                            className="w-4 h-4 text-[var(--button-color)] border-gray-300 rounded focus:ring-[var(--button-color)]"
                          />
                          <span className="text-sm text-gray-700">{industry}</span>
                        </label>
                      ))}
                    </div>
                  </>
                )}
              </div>

              {/* Stage Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setOpenDropdown(openDropdown === 'stage' ? null : 'stage')}
                  className="px-4 py-2 border-2 border-gray-200 rounded-full text-sm font-medium hover:border-gray-300 focus:border-[var(--button-color)] focus:outline-none cursor-pointer bg-white flex items-center gap-2"
                >
                  + Stage
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {openDropdown === 'stage' && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setOpenDropdown(null)} />
                    <div className="absolute z-20 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200">
                      {filterOptions.stages.map(stage => (
                        <label key={stage} className="flex items-center gap-2 px-4 py-2 hover:bg-gray-50 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={stageFilters.includes(stage)}
                            onChange={() => toggleFilter('stage', stage)}
                            className="w-4 h-4 text-blue-500 border-gray-300 rounded focus:ring-blue-500"
                          />
                          <span className="text-sm text-gray-700">{stage}</span>
                        </label>
                      ))}
                    </div>
                  </>
                )}
              </div>

              {/* Batch Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setOpenDropdown(openDropdown === 'batch' ? null : 'batch')}
                  className="px-4 py-2 border-2 border-gray-200 rounded-full text-sm font-medium hover:border-gray-300 focus:border-[var(--button-color)] focus:outline-none cursor-pointer bg-white flex items-center gap-2"
                >
                  + Batch
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {openDropdown === 'batch' && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setOpenDropdown(null)} />
                    <div className="absolute z-20 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200">
                      {filterOptions.batches.map(batch => (
                        <label key={batch} className="flex items-center gap-2 px-4 py-2 hover:bg-gray-50 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={batchFilters.includes(batch)}
                            onChange={() => toggleFilter('batch', batch)}
                            className="w-4 h-4 text-purple-500 border-gray-300 rounded focus:ring-purple-500"
                          />
                          <span className="text-sm text-gray-700">{batch}</span>
                        </label>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Selected Filter Pills */}
            {(industryFilters.length > 0 || stageFilters.length > 0 || batchFilters.length > 0) && (
              <div className="flex flex-wrap gap-2">
                {industryFilters.map(industry => (
                  <span
                    key={industry}
                    className="inline-flex items-center gap-2 px-3 py-1 bg-[var(--button-color)] text-black text-sm font-medium rounded-full"
                  >
                    {industry}
                    <button
                      onClick={() => toggleFilter('industry', industry)}
                      className="hover:text-red-600 transition"
                    >
                      ×
                    </button>
                  </span>
                ))}
                {stageFilters.map(stage => (
                  <span
                    key={stage}
                    className="inline-flex items-center gap-2 px-3 py-1 bg-blue-500 text-white text-sm font-medium rounded-full"
                  >
                    {stage}
                    <button
                      onClick={() => toggleFilter('stage', stage)}
                      className="hover:text-red-200 transition"
                    >
                      ×
                    </button>
                  </span>
                ))}
                {batchFilters.map(batch => (
                  <span
                    key={batch}
                    className="inline-flex items-center gap-2 px-3 py-1 bg-purple-500 text-white text-sm font-medium rounded-full"
                  >
                    {batch}
                    <button
                      onClick={() => toggleFilter('batch', batch)}
                      className="hover:text-red-200 transition"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
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
