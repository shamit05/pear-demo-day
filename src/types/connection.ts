export interface ConnectionRequest {
  id: string;
  investorId: string;
  investorName: string;
  investorEmail: string;
  investorFirm?: string;
  investorLinkedIn?: string;
  companyId: string;
  companyName: string;
  message: string;
  interests: string[]; // ["Lead investor", "Follow-on", "Advisor"]
  checkSize?: string;
  timeline?: string;
  status: 'unreviewed' | 'reviewed' | 'accepted' | 'declined';
  pearNotes?: string;
  founderResponse?: string;
  createdAt: string;
  reviewedAt?: string;
  respondedAt?: string;
}

export type ConnectionStatus = 'pending' | 'reviewed' | 'accepted' | 'declined';

export const interestOptions = [
  'Lead Investor',
  'Follow-on Investment',
  'Strategic Advisory',
  'Board Seat',
  'Exploring Opportunities',
];

export const checkSizeOptions = [
  '$50K - $250K',
  '$250K - $1M',
  '$1M - $5M',
  '$5M+',
  'Flexible',
];

export const timelineOptions = [
  'Immediate (Next 2 weeks)',
  'Short-term (1-3 months)',
  'Medium-term (3-6 months)',
  'Exploring',
];
