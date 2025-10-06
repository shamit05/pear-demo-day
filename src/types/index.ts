// Type definitions for Pear Demo Day Platform
// Maps to Figma component props and JSON data structure

export interface Founder {
  id: string;
  name: string;
  title: string;
  photo: string;
  bio: string;
  linkedIn?: string;
  twitter?: string;
  companyId: string;
}

export interface Company {
  id: string;
  name: string;
  tagline: string;
  logo: string;
  image?: string;
  description: string;
  industry: string;
  stage: 'Pre-Seed' | 'Seed' | 'Series A' | 'Series B';
  batch: string;
  location: string;
  website: string;
  videoUrl?: string;
  pitchDeckUrl?: string;
  tags: string[];
  founders: Founder[];
  featured?: boolean;
}

export interface FilterOptions {
  industries: string[];
  stages: string[];
  batches: string[];
}

export interface ConnectFormData {
  name: string;
  email: string;
  message: string;
  purpose: string;
}
