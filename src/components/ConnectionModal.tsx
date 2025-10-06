'use client';

import { interestOptions, checkSizeOptions, timelineOptions } from '@/types/connection';

interface ConnectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  companyName: string;
  formData: {
    name: string;
    email: string;
    firm: string;
    linkedIn: string;
    message: string;
    interests: string[];
    checkSize: string;
    timeline: string;
  };
  setFormData: (data: ConnectionModalProps['formData']) => void;
  onSubmit: (e: React.FormEvent) => void;
  submitting: boolean;
  submitSuccess: boolean;
}

export default function ConnectionModal({
  isOpen,
  onClose,
  companyName,
  formData,
  setFormData,
  onSubmit,
  submitting,
  submitSuccess,
}: ConnectionModalProps) {
  if (!isOpen) return null;

  const toggleInterest = (interest: string) => {
    if (formData.interests.includes(interest)) {
      setFormData({
        ...formData,
        interests: formData.interests.filter(i => i !== interest),
      });
    } else {
      setFormData({
        ...formData,
        interests: [...formData.interests, interest],
      });
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        onClick={onClose}
        className="fixed inset-0 z-30 bg-black/50 backdrop-blur-sm animate-in fade-in duration-300"
      />
      
      {/* Modal Content */}
      <div className="fixed inset-0 z-40 flex items-center justify-center p-4 animate-in fade-in zoom-in-95 duration-300">
        <div className="w-full max-w-2xl p-8 bg-white rounded-xl shadow-lg max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                Connect with {companyName}
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                Your request will be sent directly to the company
              </p>
            </div>
            <button 
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M6 18L18 6M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
              </svg>
            </button>
          </div>
          
          {submitSuccess ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Request Sent!</h3>
              <p className="text-gray-600">The Pear team will review your request and get back to you soon.</p>
            </div>
          ) : (
            <form onSubmit={onSubmit} className="space-y-6">
              {/* Required Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="name">
                    Your Name *
                  </label>
                  <input 
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-[var(--button-color)] focus:ring-[var(--button-color)] text-sm px-3 py-2 border"
                    id="name"
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="email">
                    Your Email *
                  </label>
                  <input 
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-[var(--button-color)] focus:ring-[var(--button-color)] text-sm px-3 py-2 border"
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </div>
              </div>

              {/* Optional Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="firm">
                    Firm / Organization
                  </label>
                  <input 
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-[var(--button-color)] focus:ring-[var(--button-color)] text-sm px-3 py-2 border"
                    id="firm"
                    type="text"
                    value={formData.firm}
                    onChange={(e) => setFormData({ ...formData, firm: e.target.value })}
                    placeholder="Acme Ventures"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="linkedIn">
                    LinkedIn Profile
                  </label>
                  <input 
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-[var(--button-color)] focus:ring-[var(--button-color)] text-sm px-3 py-2 border"
                    id="linkedIn"
                    type="url"
                    value={formData.linkedIn}
                    onChange={(e) => setFormData({ ...formData, linkedIn: e.target.value })}
                    placeholder="https://linkedin.com/in/..."
                  />
                </div>
              </div>

              {/* Interests */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  What are you interested in?
                </label>
                <div className="flex flex-wrap gap-2">
                  {interestOptions.map((interest) => (
                    <button
                      key={interest}
                      type="button"
                      onClick={() => toggleInterest(interest)}
                      className={`px-3 py-1.5 rounded-full text-sm font-medium transition ${
                        formData.interests.includes(interest)
                          ? 'bg-[var(--button-color)] text-black'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {interest}
                    </button>
                  ))}
                </div>
              </div>

              {/* Investment Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="checkSize">
                    Check Size
                  </label>
                  <select
                    id="checkSize"
                    value={formData.checkSize}
                    onChange={(e) => setFormData({ ...formData, checkSize: e.target.value })}
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-[var(--button-color)] focus:ring-[var(--button-color)] text-sm px-3 py-2 border"
                  >
                    <option value="">Select range</option>
                    {checkSizeOptions.map((size) => (
                      <option key={size} value={size}>{size}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="timeline">
                    Timeline
                  </label>
                  <select
                    id="timeline"
                    value={formData.timeline}
                    onChange={(e) => setFormData({ ...formData, timeline: e.target.value })}
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-[var(--button-color)] focus:ring-[var(--button-color)] text-sm px-3 py-2 border"
                  >
                    <option value="">Select timeline</option>
                    {timelineOptions.map((timeline) => (
                      <option key={timeline} value={timeline}>{timeline}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Message */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="message">
                  Message *
                </label>
                <textarea 
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-[var(--button-color)] focus:ring-[var(--button-color)] text-sm px-3 py-2 border"
                  id="message"
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Tell the founders why you're interested in connecting..."
                  required
                />
              </div>
              
              <div className="flex justify-end gap-3 pt-4">
                <button 
                  type="button"
                  onClick={onClose}
                  className="px-6 py-2 border-2 border-gray-300 bg-transparent text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2 border-2 border-[var(--button-color)] bg-[var(--button-color)] text-black rounded-lg hover:bg-[var(--button-color)]/90 transition font-bold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? 'Sending...' : 'Send Request'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </>
  );
}
