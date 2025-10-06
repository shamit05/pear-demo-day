export interface User {
  email: string;
  role: 'founder' | 'investor' | 'admin';
  name?: string;
  companyId?: string;
  investorId?: string;
}
