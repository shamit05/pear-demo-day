'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import HeaderNav from '@/components/HeaderNav';
import Footer from '@/components/Footer';
import ConnectionModal from '@/components/ConnectionModal';
import { User } from '@/types/user';
import { Company } from '@/types';
import Link from 'next/link';

export default function CompanyDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [modalOpen, setModalOpen] = useState(false);
  const [founderModalOpen, setFounderModalOpen] = useState(false);
  const [selectedFounder, setSelectedFounder] = useState<{ name: string; role: string; bio: string; linkedIn: string; } | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [company, setCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    firm: '',
    linkedIn: '',
    message: '',
    interests: [] as string[],
    checkSize: '',
    timeline: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  // Fetch company data with caching
  useEffect(() => {
    async function fetchCompany() {
      // Check if we have cached data in sessionStorage
      const cacheKey = `company_${params.id}`;
      const cachedData = sessionStorage.getItem(cacheKey);
      const cacheTimestamp = sessionStorage.getItem(`${cacheKey}_timestamp`);
      const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
      
      if (cachedData && cacheTimestamp) {
        const age = Date.now() - parseInt(cacheTimestamp);
        if (age < CACHE_DURATION) {
          // Use cached data
          const data = JSON.parse(cachedData);
          setCompany(data);
          setLoading(false);
          return;
        }
      }

      // Fetch fresh data
      try {
        const response = await fetch(`/api/companies/${params.id}`);
        if (response.ok) {
          const data = await response.json();
          setCompany(data);
          
          // Cache the data
          sessionStorage.setItem(cacheKey, JSON.stringify(data));
          sessionStorage.setItem(`${cacheKey}_timestamp`, Date.now().toString());
        }
      } catch (error) {
        console.error('Error fetching company:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchCompany();
  }, [params.id]);

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <HeaderNav />
        <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex flex-col items-center justify-center py-32">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600 mb-4"></div>
            <p className="text-gray-600 text-lg">Loading company details...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!company) {
    return (
      <div className="flex flex-col min-h-screen">
        <HeaderNav />
        <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h1 className="text-4xl font-bold text-black mb-4">Company Not Found</h1>
          <Link href="/" className="text-[var(--button-color)] hover:underline">
            ← Back to Companies
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const response = await fetch('/api/connections', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          investorName: formData.name,
          investorEmail: formData.email,
          investorFirm: formData.firm,
          investorLinkedIn: formData.linkedIn,
          companyId: company.id,
          companyName: company.name,
          message: formData.message,
          interests: formData.interests,
          checkSize: formData.checkSize,
          timeline: formData.timeline,
        }),
      });

      if (response.ok) {
        setSubmitSuccess(true);
        setTimeout(() => {
          setModalOpen(false);
          setSubmitSuccess(false);
          // Reset form
          setFormData({
            name: '',
            email: '',
            firm: '',
            linkedIn: '',
            message: '',
            interests: [],
            checkSize: '',
            timeline: '',
          });
        }, 2000);
      }
    } catch (error) {
      console.error('Error submitting connection request:', error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full flex-col">
      <HeaderNav />
      
      {/* Breadcrumb and Section Navigation */}
      <div className="border-b border-black/10 bg-white/80 backdrop-blur-md sticky top-16 z-10">
        <div className="mx-auto max-w-7xl px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm">
              <Link href="/" className="text-black/60 hover:text-black transition">
                Companies
              </Link>
              <svg className="w-4 h-4 text-black/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
              <span className="text-black font-medium">{company.name}</span>
            </div>
            
            {/* Section Pills */}
            <nav className="hidden md:flex items-center gap-2 bg-gray-100 rounded-full p-1">
              <a 
                href="#about" 
                className="text-sm font-medium text-gray-600 hover:text-white px-4 py-1.5 rounded-full hover:bg-[var(--button-color)] transition-colors"
              >
                About
              </a>
              {company.videoUrl && (
                <a 
                  href="#pitch" 
                  className="text-sm font-medium text-gray-600 hover:text-white px-4 py-1.5 rounded-full hover:bg-[var(--button-color)] transition-colors"
                >
                  Pitch
                </a>
              )}
              {company.founders && company.founders.length > 0 && (
                <a 
                  href="#founders" 
                  className="text-sm font-medium text-gray-600 hover:text-white px-4 py-1.5 rounded-full hover:bg-[var(--button-color)] transition-colors"
                >
                  Founders
                </a>
              )}
              <a 
                href="#details" 
                className="text-sm font-medium text-gray-600 hover:text-white px-4 py-1.5 rounded-full hover:bg-[var(--button-color)] transition-colors"
              >
                Details
              </a>
            </nav>
          </div>
        </div>
      </div>
      
      <main className="w-full flex-1">
        <div className="space-y-0">
          {/* About Section */}
          <section className="bg-white w-full py-12" id="about">
            <div className="mx-auto max-w-7xl px-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <h1 className="text-5xl font-black text-gray-900 font-[family-name:var(--font-display)]">
                    {company.name}
                  </h1>
                  <p className="text-xl text-gray-600 leading-relaxed">
                    {company.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {company.tags.map((tag) => (
                      <span 
                        key={tag}
                        className="rounded-full bg-[var(--button-color)]/10 px-3 py-1 text-sm font-medium text-[var(--button-color)]"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                <div 
                  className="aspect-[4/3] w-full overflow-hidden rounded-xl bg-cover bg-center"
                  style={{ 
                    backgroundImage: company.image 
                      ? `url('${company.image}')` 
                      : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                  }}
                />
              </div>
            </div>
          </section>

          {/* Pitch Section */}
          {company.videoUrl && (
            <section className="w-full py-12 bg-[var(--fill-color)]" id="pitch">
              <div className="mx-auto max-w-7xl px-6 space-y-8">
                <div className="relative aspect-video w-full rounded-lg bg-cover bg-center bg-gray-300">
                  <button className="absolute inset-0 flex items-center justify-center rounded-lg bg-black/40 text-white transition-colors hover:bg-black/50">
                    <svg fill="currentColor" height="48" viewBox="0 0 256 256" width="48" xmlns="http://www.w3.org/2000/svg">
                      <path d="M240,128a15.74,15.74,0,0,1-7.6,13.51L88.32,229.65a16,16,0,0,1-16.2,.3A15.86,15.86,0,0,1,64,216.13V39.87a15.86,15.86,0,0,1,8.12-13.82,16,16,0,0,1,16.2,.3L232.4,114.49A15.74,15.74,0,0,1,240,128Z"></path>
                    </svg>
                  </button>
                </div>
                {company.pitchDeckUrl && (
                  <a 
                    href={company.pitchDeckUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex h-12 items-center justify-center gap-2 rounded-lg border-2 border-black bg-transparent px-6 text-sm font-bold text-black shadow-sm transition-colors hover:bg-black hover:text-white"
                  >
                    View Pitch Deck
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                )}
              </div>
            </section>
          )}

          {/* Founders Section */}
          {company.founders && company.founders.length > 0 && (
            <section className="w-full py-12 bg-white" id="founders">
              <div className="mx-auto max-w-7xl px-6 space-y-8">
                <div className="flex items-center justify-between">
                  <h3 className="text-3xl font-bold text-gray-900">Meet the Founders</h3>
                  <button 
                    onClick={() => {
                      if (!user) {
                        localStorage.setItem('redirectAfterLogin', `/company/${company.id}`);
                        router.push('/login');
                      } else {
                        setModalOpen(true);
                      }
                    }}
                    className="px-6 py-3 items-center justify-center rounded-lg border-2 border-[#354227] bg-transparent text-[#354227] text-base font-bold shadow-sm transition-colors hover:bg-[#354227] hover:text-[var(--fill-color)]"
                  >
                    Connect with Team
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {company.founders.map((founder, index) => (
                    <button
                      key={founder.id}
                      onClick={() => {
                        setSelectedFounder(founder);
                        setFounderModalOpen(true);
                      }}
                      className="text-center p-4 rounded-lg hover:bg-gray-50 transition-all cursor-pointer"
                    >
                      <img
                        src={`https://bundui-images.netlify.app/avatars/0${(index % 5) + 1}.png`}
                        alt={founder.name}
                        className="mx-auto mb-3 h-32 w-32 rounded-full ring-2 ring-transparent hover:ring-[var(--button-color)] transition-all"
                      />
                      <p className="font-bold text-xl text-gray-900">{founder.name}</p>
                      <p className="text-base text-gray-600 mt-1">{founder.title}</p>
                      <p className="text-sm text-[var(--button-color)] mt-3 font-medium">Click to view bio →</p>
                    </button>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* Details Section */}
          <section className="w-full py-12 bg-[var(--fill-color)]" id="details">
            <div className="mx-auto max-w-7xl px-6 space-y-8">
              <h3 className="text-3xl font-bold text-gray-900">Company Details</h3>
              <div className="space-y-4 text-lg">
              <div className="flex justify-between border-t border-gray-200/50 pt-4">
                <span className="text-gray-500">Location</span>
                <span className="font-medium text-gray-800">{company.location}</span>
              </div>
              <div className="flex justify-between border-t border-gray-200/50 pt-4">
                <span className="text-gray-500">Website</span>
                <a 
                  className="font-medium text-[var(--button-color)] hover:underline" 
                  href={company.website}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {company.website.replace('https://', '')}
                </a>
              </div>
              <div className="flex justify-between border-t border-gray-200/50 pt-4">
                <span className="text-gray-500">Batch</span>
                <span className="font-medium text-gray-800">{company.batch}</span>
              </div>
              <div className="flex justify-between border-t border-gray-200/50 pt-4">
                <span className="text-gray-500">Stage</span>
                <span className="font-medium text-gray-800">{company.stage}</span>
              </div>
                <div className="flex justify-between border-t border-gray-200/50 pt-4">
                  <span className="text-gray-500">Industry</span>
                  <span className="font-medium text-gray-800">{company.industry}</span>
                </div>
              </div>
            </div>
          </section>

        </div>
      </main>

      <Footer />

      {/* Connection Modal */}
      <ConnectionModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        companyName={company.name}
        formData={formData}
        setFormData={setFormData}
        onSubmit={handleSubmit}
        submitting={submitting}
        submitSuccess={submitSuccess}
      />

      {/* Founder Bio Modal */}
      {founderModalOpen && selectedFounder && (
        <>
          {/* Backdrop */}
          <div 
            onClick={() => setFounderModalOpen(false)}
            className="fixed inset-0 z-30 bg-black/50 backdrop-blur-sm animate-in fade-in duration-300"
          />
          
          {/* Modal Content */}
          <div className="fixed inset-0 z-40 flex items-center justify-center p-4 animate-in fade-in zoom-in-95 duration-300">
            <div className="w-full max-w-2xl p-8 bg-white rounded-xl shadow-lg max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-4">
                  <img
                    src={`https://bundui-images.netlify.app/avatars/0${(company.founders?.indexOf(selectedFounder) % 5) + 1}.png`}
                    alt={selectedFounder.name}
                    className="h-20 w-20 rounded-full"
                  />
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">{selectedFounder.name}</h2>
                    <p className="text-lg text-gray-600">{selectedFounder.title}</p>
                  </div>
                </div>
                <button 
                  onClick={() => setFounderModalOpen(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path d="M6 18L18 6M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                  </svg>
                </button>
              </div>
              
              {/* Bio Content */}
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Bio</h3>
                  <p className="text-gray-700 leading-relaxed">
                    {selectedFounder.bio || `${selectedFounder.name} is the ${selectedFounder.title} at ${company.name}. With extensive experience in ${company.industry}, they bring deep expertise in building innovative solutions that drive growth and impact. Their vision and leadership have been instrumental in shaping the company's direction and success.`}
                  </p>
                </div>
                
                {/* Social Links */}
                {(selectedFounder.linkedIn || selectedFounder.twitter) && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Connect</h3>
                    <div className="flex gap-3">
                      {selectedFounder.linkedIn && (
                        <a 
                          href={selectedFounder.linkedIn}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition font-medium"
                        >
                          LinkedIn
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                        </a>
                      )}
                      {selectedFounder.twitter && (
                        <a 
                          href={selectedFounder.twitter}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 px-4 py-2 border-2 border-black bg-transparent text-black rounded-lg hover:bg-black hover:text-white transition"
                        >
                          Twitter
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                        </a>
                      )}
                    </div>
                  </div>
                )}
                
                {/* Connect with Founders Button */}
                <div className="pt-4 border-t border-gray-200">
                  <button 
                    onClick={() => {
                      if (!user) {
                        setFounderModalOpen(false);
                        localStorage.setItem('redirectAfterLogin', `/company/${company.id}`);
                        router.push('/login');
                      } else {
                        setFounderModalOpen(false);
                        setModalOpen(true);
                      }
                    }}
                    className="w-full h-12 items-center justify-center rounded-lg border-2 border-[#354227] bg-transparent px-6 text-sm font-bold text-[#354227] shadow-sm transition-colors hover:bg-[#354227] hover:text-[var(--fill-color)]"
                  >
                    Connect with {company.name} Team
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
