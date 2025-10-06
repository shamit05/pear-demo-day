import { ConnectionRequest } from '@/types/connection';

const connectionRequests: ConnectionRequest[] = [
  {
    id: 'req-1',
    investorId: 'investor-1',
    investorName: 'Sarah Chen',
    investorEmail: 'investor@demo.com',
    investorFirm: 'Acme Ventures',
    investorLinkedIn: 'https://linkedin.com/in/sarahchen',
    companyId: 'c1',
    companyName: 'Innovate Solutions',
    message: 'Really impressed by your AI-driven approach. Would love to discuss potential investment opportunities.',
    interests: ['Lead Investor', 'Board Seat'],
    checkSize: '$1M - $5M',
    timeline: 'Short-term (1-3 months)',
    status: 'unreviewed',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

export function getAllConnectionRequests(): ConnectionRequest[] {
  return connectionRequests;
}

export function getConnectionRequestById(id: string): ConnectionRequest | null {
  return connectionRequests.find(req => req.id === id) || null;
}

export function getConnectionRequestsByCompany(companyId: string): ConnectionRequest[] {
  return connectionRequests.filter(req => req.companyId === companyId);
}

export function getConnectionRequestsByInvestor(investorId: string): ConnectionRequest[] {
  return connectionRequests.filter(req => req.investorId === investorId);
}

export function createConnectionRequest(request: Omit<ConnectionRequest, 'id' | 'createdAt'>): ConnectionRequest {
  const newRequest: ConnectionRequest = {
    ...request,
    id: `req-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    createdAt: new Date().toISOString(),
  };
  connectionRequests.push(newRequest);
  return newRequest;
}

export function updateConnectionRequest(id: string, updates: Partial<ConnectionRequest>): ConnectionRequest | null {
  const index = connectionRequests.findIndex(req => req.id === id);
  if (index === -1) return null;
  
  connectionRequests[index] = {
    ...connectionRequests[index],
    ...updates,
  };
  
  return connectionRequests[index];
}

export function deleteConnectionRequest(id: string): boolean {
  const index = connectionRequests.findIndex(req => req.id === id);
  if (index === -1) return false;
  
  connectionRequests.splice(index, 1);
  return true;
}

// Stats functions
export function getConnectionStats() {
  const total = connectionRequests.length;
  const unreviewed = connectionRequests.filter(r => r.status === 'unreviewed').length;
  const reviewed = connectionRequests.filter(r => r.status === 'reviewed').length;
  const accepted = connectionRequests.filter(r => r.status === 'accepted').length;
  const declined = connectionRequests.filter(r => r.status === 'declined').length;
  
  return { total, unreviewed, reviewed, accepted, declined };
}
