'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ConnectionRequest } from '@/types/connection';
import { User } from '@/types/user';

export default function AdminDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [requests, setRequests] = useState<ConnectionRequest[]>([]);
  const [stats, setStats] = useState({ total: 0, unreviewed: 0, reviewed: 0, accepted: 0, declined: 0 });
  const [filter, setFilter] = useState<string>('all');
  const [selectedRequest, setSelectedRequest] = useState<ConnectionRequest | null>(null);
  const [pearNotes, setPearNotes] = useState('');

  useEffect(() => {
    // Check auth
    const userData = localStorage.getItem('user');
    if (!userData) {
      router.push('/login');
      return;
    }
    
    const parsedUser = JSON.parse(userData);
    if (parsedUser.role !== 'admin') {
      router.push('/');
      return;
    }
    
    setUser(parsedUser);
    fetchRequests();
    fetchStats();
  }, []);

  const fetchRequests = async () => {
    const response = await fetch('/api/connections');
    const data = await response.json();
    setRequests(data);
  };

  const fetchStats = async () => {
    const response = await fetch('/api/connections?stats=true');
    const data = await response.json();
    setStats(data);
  };

  const updateStatus = async (id: string, status: string, notes?: string) => {
    await fetch(`/api/connections/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, pearNotes: notes }),
    });
    fetchRequests();
    fetchStats();
    setSelectedRequest(null);
  };

  const logout = () => {
    localStorage.removeItem('user');
    router.push('/login');
  };

  const filteredRequests = requests.filter(req => {
    if (filter === 'all') return true;
    return req.status === filter;
  });

  if (!user) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

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
              <h1 className="text-xl font-bold text-gray-900">Admin Dashboard</h1>
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
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <div className="text-sm font-medium text-gray-600">Total</div>
            <div className="text-3xl font-bold text-gray-900 mt-2">{stats.total}</div>
          </div>
          <div className="bg-yellow-50 rounded-lg p-6 border border-yellow-200">
            <div className="text-sm font-medium text-yellow-800">Unreviewed</div>
            <div className="text-3xl font-bold text-yellow-900 mt-2">{stats.unreviewed}</div>
          </div>
          <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
            <div className="text-sm font-medium text-blue-800">Reviewed</div>
            <div className="text-3xl font-bold text-blue-900 mt-2">{stats.reviewed}</div>
          </div>
          <div className="bg-green-50 rounded-lg p-6 border border-green-200">
            <div className="text-sm font-medium text-green-800">Accepted</div>
            <div className="text-3xl font-bold text-green-900 mt-2">{stats.accepted}</div>
          </div>
          <div className="bg-red-50 rounded-lg p-6 border border-red-200">
            <div className="text-sm font-medium text-red-800">Declined</div>
            <div className="text-3xl font-bold text-red-900 mt-2">{stats.declined}</div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg p-4 mb-6 border border-gray-200">
          <div className="flex gap-2">
            {['all', 'unreviewed', 'reviewed', 'accepted', 'declined'].map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                  filter === status
                    ? 'bg-[var(--button-color)] text-black'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Requests Table */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Investor
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Company
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Interests
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredRequests.map((request) => (
                  <tr key={request.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{request.investorName}</div>
                      <div className="text-sm text-gray-500">{request.investorFirm || 'Independent'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{request.companyName}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {request.interests.slice(0, 2).map((interest) => (
                          <span key={interest} className="px-2 py-1 text-xs bg-gray-100 rounded">
                            {interest}
                          </span>
                        ))}
                        {request.interests.length > 2 && (
                          <span className="px-2 py-1 text-xs bg-gray-100 rounded">
                            +{request.interests.length - 2}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        request.status === 'unreviewed' ? 'bg-yellow-100 text-yellow-800' :
                        request.status === 'reviewed' ? 'bg-blue-100 text-blue-800' :
                        request.status === 'accepted' ? 'bg-green-100 text-green-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {request.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(request.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <button
                        onClick={() => setSelectedRequest(request)}
                        className="text-[var(--button-color)] hover:underline font-medium"
                      >
                        Review
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
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
                <h2 className="text-2xl font-bold text-gray-900">Review Request</h2>
                <button onClick={() => setSelectedRequest(null)} className="text-gray-400 hover:text-gray-600">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Investor</label>
                    <p className="text-base font-semibold text-gray-900">{selectedRequest.investorName}</p>
                    <p className="text-sm text-gray-600">{selectedRequest.investorEmail}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Company</label>
                    <p className="text-base font-semibold text-gray-900">{selectedRequest.companyName}</p>
                  </div>
                </div>

                {selectedRequest.investorFirm && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">Firm</label>
                    <p className="text-base text-gray-900">{selectedRequest.investorFirm}</p>
                  </div>
                )}

                <div>
                  <label className="text-sm font-medium text-gray-500">Interests</label>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {selectedRequest.interests.map((interest) => (
                      <span key={interest} className="px-3 py-1 bg-[var(--button-color)]/10 text-[var(--button-color)] rounded-full text-sm">
                        {interest}
                      </span>
                    ))}
                  </div>
                </div>

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

                <div>
                  <label className="text-sm font-medium text-gray-500">Message</label>
                  <p className="text-base text-gray-900 mt-1">{selectedRequest.message}</p>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Pear Notes (Internal)</label>
                  <textarea
                    value={pearNotes || selectedRequest.pearNotes || ''}
                    onChange={(e) => setPearNotes(e.target.value)}
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-[var(--button-color)] focus:ring-[var(--button-color)] text-sm px-3 py-2 border"
                    rows={3}
                    placeholder="Add internal notes about this request..."
                  />
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                  <p className="text-sm text-blue-900">
                    <strong>Note:</strong> All requests are visible to founders. Use "Reviewed" status and notes to provide context.
                  </p>
                </div>

                <div className="flex gap-3 pt-4 border-t">
                  {selectedRequest.status === 'unreviewed' ? (
                    <button
                      onClick={() => updateStatus(selectedRequest.id, 'reviewed', pearNotes)}
                      className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-bold"
                    >
                      Mark as Reviewed
                    </button>
                  ) : (
                    <button
                      onClick={() => updateStatus(selectedRequest.id, 'unreviewed', pearNotes)}
                      className="flex-1 px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition font-bold"
                    >
                      Mark as Unreviewed
                    </button>
                  )}
                  <button
                    onClick={() => {
                      setPearNotes('');
                      setSelectedRequest(null);
                    }}
                    className="px-6 py-2 border-2 border-gray-300 bg-transparent text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium"
                  >
                    Close
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
