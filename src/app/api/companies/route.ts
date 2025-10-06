import { NextResponse } from 'next/server';
import { getAllCompanies } from '@/lib/db';
import { mockCompanies } from '@/data/mockData';

export async function GET() {
  try {
    // Check if database is configured
    if (!process.env.POSTGRES_URL) {
      console.log('Database not configured, using mock data');
      return NextResponse.json(mockCompanies);
    }

    const companies = await getAllCompanies();
    return NextResponse.json(companies);
  } catch (error) {
    console.error('Error fetching companies:', error);
    // Fallback to mock data
    console.log('Falling back to mock data');
    return NextResponse.json(mockCompanies);
  }
}
