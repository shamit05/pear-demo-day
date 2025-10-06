export interface User {
  id: string;
  email: string;
  password: string; // In production, this would be hashed
  name: string;
  role: 'investor' | 'admin' | 'founder';
  companyId?: string; // For founders
}

// Hardcoded users for demo
export const users: User[] = [
  {
    id: 'investor-1',
    email: 'investor@demo.com',
    password: 'investor123',
    name: 'Sarah Chen',
    role: 'investor',
  },
  {
    id: 'admin-1',
    email: 'admin@pear.vc',
    password: 'admin123',
    name: 'Pear Admin',
    role: 'admin',
  },
  {
    id: 'founder-1',
    email: 'founder@innovate.com',
    password: 'founder123',
    name: 'John Smith',
    role: 'founder',
    companyId: 'c1', // Innovate Solutions
  },
];

export function validateUser(email: string, password: string): User | null {
  const user = users.find(u => u.email === email && u.password === password);
  return user || null;
}

export function getUserById(id: string): User | null {
  return users.find(u => u.id === id) || null;
}
