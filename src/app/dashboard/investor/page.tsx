'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ConnectionRequest } from '@/types/connection';
import { User } from '@/types/user';

export default function InvestorDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [requests, setRequests] = useState<ConnectionRequest[]>([]);

  useEffect(() => {
    // Check auth
    const userData = localStorage.getItem('user');
    if (!userData) {
      router.push('/login');
      return;
    }
    
    const parsedUser = JSON.parse(userData);
    if (parsedUser.role !== 'investor') {
      router.push('/');
      return;
    }
    
    setUser(parsedUser);
    fetchRequests(parsedUser.id);
  }, []);

  const fetchRequests = async (investorId: string) => {
    try {
      const response = await fetch(`/api/connections?investorId=${investorId}`);
      const data = await response.json();
      // Ensure data is an array
      if (Array.isArray(data)) {
        setRequests(data);
      } else {
        console.error('Invalid data format:', data);
        setRequests([]);
      }
    } catch (error) {
      console.error('Error fetching requests:', error);
      setRequests([]);
    }
  };

  const logout = () => {
    localStorage.removeItem('user');
    router.push('/login');
  };

  if (!user) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  const pendingRequests = requests.filter(r => r.status === 'unreviewed' || r.status === 'reviewed');
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
              <h1 className="text-xl font-bold text-gray-900">Investor Dashboard</h1>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">{user.name}</span>
              <Link
                href="/"
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition"
              >
                Browse Companies
              </Link>
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
            <div className="text-sm font-medium text-blue-800">Pending</div>
            <div className="text-3xl font-bold text-blue-900 mt-2">{pendingRequests.length}</div>
            <p className="text-xs text-blue-700 mt-1">Awaiting founder response</p>
          </div>
          <div className="bg-green-50 rounded-lg p-6 border border-green-200">
            <div className="text-sm font-medium text-green-800">Connected</div>
            <div className="text-3xl font-bold text-green-900 mt-2">{acceptedRequests.length}</div>
            <p className="text-xs text-green-700 mt-1">Connections made</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
            <div className="text-sm font-medium text-gray-600">Total Requests</div>
            <div className="text-3xl font-bold text-gray-900 mt-2">{requests.length}</div>
            <p className="text-xs text-gray-600 mt-1">All time</p>
          </div>
        </div>

        {/* Active Connections */}
        {acceptedRequests.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Active Connections</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {acceptedRequests.map((request) => (
                <div key={request.id} className="bg-white rounded-lg border-2 border-green-200 p-6 hover:shadow-lg transition">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">{request.companyName}</h3>
                      <p className="text-sm text-gray-600">Connection accepted</p>
                    </div>
                    <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded-full">
                      Connected
                    </span>
                  </div>
                  
                  {request.founderResponse && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
                      <p className="text-sm text-gray-700">{request.founderResponse}</p>
                    </div>
                  )}

                  <div className="flex gap-2">
                    <Link
                      href={`/company/${request.companyId}`}
                      className="flex-1 px-4 py-2 border-2 border-black bg-transparent text-black rounded-lg hover:bg-black hover:text-white transition font-medium text-sm text-center"
                    >
                      View Company
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Pending Requests */}
        {pendingRequests.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Pending Requests</h2>
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Company</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Your Interests</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Sent</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {pendingRequests.map((request) => (
                    <tr key={request.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <Link href={`/company/${request.companyId}`} className="text-sm font-medium text-gray-900 hover:text-[var(--button-color)]">
                          {request.companyName}
                        </Link>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-1">
                          {request.interests.slice(0, 2).map((interest) => (
                            <span key={interest} className="px-2 py-1 text-xs bg-gray-100 rounded">
                              {interest}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {new Date(request.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded-full">
                          Pending
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Empty State */}
        {requests.length === 0 && (
          <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
            <div className="text-6xl mb-4">🚀</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Start Connecting with Founders</h3>
            <p className="text-gray-600 mb-6">Browse companies and send connection requests to get started.</p>
            <Link
              href="/"
              className="inline-flex px-6 py-3 border-2 border-[#354227] bg-transparent text-[#354227] rounded-lg hover:bg-[#354227] hover:text-[var(--fill-color)] transition font-bold"
            >
              Browse Companies
            </Link>
          </div>
        )}

        {/* Declined Requests */}
        {declinedRequests.length > 0 && (
          <div className="mb-8">
            <details className="bg-white rounded-lg border border-gray-200 p-4">
              <summary className="cursor-pointer font-semibold text-gray-700">
                Declined Requests ({declinedRequests.length})
              </summary>
              <div className="mt-4 space-y-2">
                {declinedRequests.map((request) => (
                  <div key={request.id} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                    <span className="text-sm text-gray-900">{request.companyName}</span>
                    <span className="text-xs text-gray-500">
                      {new Date(request.respondedAt || request.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                ))}
              </div>
            </details>
          </div>
        )}
      </main>
    </div>
  );
}
