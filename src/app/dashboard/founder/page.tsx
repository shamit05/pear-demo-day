'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ConnectionRequest } from '@/types/connection';
import { User } from '@/types/user';

export default function FounderDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [requests, setRequests] = useState<ConnectionRequest[]>([]);
  const [selectedRequest, setSelectedRequest] = useState<ConnectionRequest | null>(null);
  const [founderResponse, setFounderResponse] = useState('');

  useEffect(() => {
    // Check auth
    const userData = localStorage.getItem('user');
    if (!userData) {
      router.push('/login');
      return;
    }
    
    const parsedUser = JSON.parse(userData);
    if (parsedUser.role !== 'founder') {
      router.push('/');
      return;
    }
    
    setUser(parsedUser);
    fetchRequests(parsedUser.companyId);
  }, []);

  const fetchRequests = async (companyId: string) => {
    const response = await fetch(`/api/connections?companyId=${companyId}`);
    const data = await response.json();
    // Show all requests - founders can see everything
    setRequests(data);
  };

  const respondToRequest = async (id: string, status: 'accepted' | 'declined', response: string) => {
    await fetch(`/api/connections/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, founderResponse: response }),
    });
    
    if (status === 'accepted') {
      const request = requests.find(r => r.id === id);
      if (request) {
        const subject = encodeURIComponent(`Connection: ${request.companyName} & ${request.investorName}`);
        const body = encodeURIComponent(
          `Hi ${request.investorName},\n\n` +
          `Thank you for your interest in ${request.companyName}!\n\n` +
          `${response ? response + '\n\n' : ''}` +
          `Let's schedule a time to connect.\n\n` +
          `Best regards,\n${user.name}`
        );
        window.open(`mailto:${request.investorEmail}?subject=${subject}&body=${body}`, '_blank');
      }
    }
    
    fetchRequests(user.companyId);
    setSelectedRequest(null);
    setFounderResponse('');
  };

  const logout = () => {
    localStorage.removeItem('user');
    router.push('/login');
  };

  if (!user) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  const unreviewedRequests = requests.filter(r => r.status === 'unreviewed');
  const reviewedRequests = requests.filter(r => r.status === 'reviewed');
  const pendingRequests = [...unreviewedRequests, ...reviewedRequests]; // All pending founder action
  const acceptedRequests = requests.filter(r => r.status === 'accepted');
  const declinedRequests = requests.filter(r => r.status === 'declined');

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/">
                <img 
                  src="https://pear.vc/wp-content/themes/pear-vc/assets/images/pearvc_logo.png" 
                  alt="Pear VC"
                  className="h-8 w-auto"
                />
              </Link>
              <div className="h-6 w-px bg-gray-300" />
              <h1 className="text-xl font-bold text-gray-900">Founder Dashboard</h1>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">{user.name}</span>
              <button
                onClick={logout}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
            <div className="text-sm font-medium text-blue-800">Pending Requests</div>
            <div className="text-3xl font-bold text-blue-900 mt-2">{pendingRequests.length}</div>
            <p className="text-xs text-blue-700 mt-1">Awaiting your response</p>
          </div>
          <div className="bg-green-50 rounded-lg p-6 border border-green-200">
            <div className="text-sm font-medium text-green-800">Accepted</div>
            <div className="text-3xl font-bold text-green-900 mt-2">{acceptedRequests.length}</div>
            <p className="text-xs text-green-700 mt-1">Connections made</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
            <div className="text-sm font-medium text-gray-600">Total Interest</div>
            <div className="text-3xl font-bold text-gray-900 mt-2">{requests.length}</div>
            <p className="text-xs text-gray-600 mt-1">All time</p>
          </div>
        </div>

        {/* Pending Requests */}
        {pendingRequests.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Connection Requests</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {pendingRequests.map((request) => (
                <div key={request.id} className="bg-white rounded-lg border-2 border-blue-200 p-6 hover:shadow-lg transition">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">{request.investorName}</h3>
                      <p className="text-sm text-gray-600">{request.investorFirm || 'Independent Investor'}</p>
                    </div>
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded-full">
                      New
                    </span>
                  </div>
                  
                  <div className="space-y-2 mb-4">
                    {request.checkSize && (
                      <div className="flex items-center gap-2 text-sm">
                        <span className="text-gray-500">💰</span>
                        <span className="text-gray-700">{request.checkSize}</span>
                      </div>
                    )}
                    {request.timeline && (
                      <div className="flex items-center gap-2 text-sm">
                        <span className="text-gray-500">⏱️</span>
                        <span className="text-gray-700">{request.timeline}</span>
                      </div>
                    )}
                    <div className="flex flex-wrap gap-1 mt-2">
                      {request.interests.map((interest) => (
                        <span key={interest} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                          {interest}
                        </span>
                      ))}
                    </div>
                  </div>

                  <p className="text-sm text-gray-700 mb-4 line-clamp-2">{request.message}</p>

                  <button
                    onClick={() => setSelectedRequest(request)}
                    className="w-full px-4 py-2 border-2 border-[#354227] bg-transparent text-[#354227] rounded-lg hover:bg-[#354227] hover:text-[var(--fill-color)] transition font-bold text-sm"
                  >
                    Review Request
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Accepted Connections */}
        {acceptedRequests.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Active Connections</h2>
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Investor</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Details</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Contact</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {acceptedRequests.map((request) => (
                    <tr key={request.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">{request.investorName}</div>
                        <div className="text-sm text-gray-500">{request.investorFirm || 'Independent'}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">{request.checkSize}</div>
                        <div className="text-sm text-gray-500">{request.timeline}</div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {new Date(request.respondedAt || request.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <a 
                          href={`mailto:${request.investorEmail}`}
                          className="text-sm text-[var(--button-color)] hover:underline font-medium"
                        >
                          {request.investorEmail}
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {requests.length === 0 && (
          <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
            <div className="text-6xl mb-4">📭</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No connection requests yet</h3>
            <p className="text-gray-600">Investors will be able to request connections through your company page.</p>
          </div>
        )}
      </main>

      {/* Review Modal */}
      {selectedRequest && (
        <>
          <div 
            onClick={() => setSelectedRequest(null)}
            className="fixed inset-0 z-30 bg-black/50 backdrop-blur-sm"
          />
          <div className="fixed inset-0 z-40 flex items-center justify-center p-4">
            <div className="w-full max-w-2xl bg-white rounded-xl shadow-lg p-8 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Connection Request</h2>
                <button onClick={() => setSelectedRequest(null)} className="text-gray-400 hover:text-gray-600">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-6">
                {selectedRequest.status === 'reviewed' ? (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="font-semibold text-blue-900">Reviewed by Pear Team</p>
                    <p className="text-sm text-blue-700 mt-1">The Pear team has reviewed this request and added context below.</p>
                  </div>
                ) : (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <p className="font-semibold text-yellow-900">Pending Pear Review</p>
                    <p className="text-sm text-yellow-700 mt-1">This request hasn't been reviewed by the Pear team yet. You can still respond.</p>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Investor Name</label>
                    <p className="text-lg font-semibold text-gray-900">{selectedRequest.investorName}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Email</label>
                    <p className="text-base text-gray-900">{selectedRequest.investorEmail}</p>
                  </div>
                </div>

                {selectedRequest.investorFirm && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">Firm</label>
                    <p className="text-base text-gray-900">{selectedRequest.investorFirm}</p>
                  </div>
                )}

                {selectedRequest.investorLinkedIn && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">LinkedIn</label>
                    <a 
                      href={selectedRequest.investorLinkedIn}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-base text-[var(--button-color)] hover:underline"
                    >
                      View Profile →
                    </a>
                  </div>
                )}

                <div>
                  <label className="text-sm font-medium text-gray-500">Interests</label>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {selectedRequest.interests.map((interest) => (
                      <span key={interest} className="px-3 py-1 bg-[var(--button-color)]/10 text-[var(--button-color)] rounded-full text-sm font-medium">
                        {interest}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {selectedRequest.checkSize && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">Check Size</label>
                      <p className="text-base text-gray-900">{selectedRequest.checkSize}</p>
                    </div>
                  )}
                  {selectedRequest.timeline && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">Timeline</label>
                      <p className="text-base text-gray-900">{selectedRequest.timeline}</p>
                    </div>
                  )}
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-500">Message</label>
                  <div className="mt-1 p-4 bg-gray-50 rounded-lg">
                    <p className="text-base text-gray-900">{selectedRequest.message}</p>
                  </div>
                </div>

                {selectedRequest.pearNotes && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">Pear Team Notes</label>
                    <div className="mt-1 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <p className="text-sm text-gray-900">{selectedRequest.pearNotes}</p>
                    </div>
                  </div>
                )}

                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Your Response (Optional)</label>
                  <textarea
                    value={founderResponse}
                    onChange={(e) => setFounderResponse(e.target.value)}
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-[var(--button-color)] focus:ring-[var(--button-color)] text-sm px-3 py-2 border"
                    rows={3}
                    placeholder="Add a personal note for the investor..."
                  />
                </div>

                <div className="flex gap-3 pt-4 border-t">
                  <button
                    onClick={() => respondToRequest(selectedRequest.id, 'accepted', founderResponse)}
                    className="flex-1 px-6 py-3 border-2 border-[#354227] bg-transparent text-[#354227] rounded-lg hover:bg-[#354227] hover:text-[var(--fill-color)] transition font-bold"
                  >
                    Accept & Connect
                  </button>
                  <button
                    onClick={() => respondToRequest(selectedRequest.id, 'declined', founderResponse)}
                    className="px-6 py-3 border-2 border-gray-300 bg-transparent text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium"
                  >
                    Decline
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
