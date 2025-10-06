export interface User {
  id: string;
  email: string;
  role: 'founder' | 'investor' | 'admin';
  name?: string;
  companyId?: string;
  investorId?: string;
}
