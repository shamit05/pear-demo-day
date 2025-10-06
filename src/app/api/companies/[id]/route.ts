import { NextResponse } from 'next/server';
import { getCompanyById } from '@/lib/db';
import { mockCompanies } from '@/data/mockData';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Check if database is configured
    if (!process.env.POSTGRES_URL) {
      console.log('Database not configured, using mock data');
      const company = mockCompanies.find(c => c.id === params.id);
      if (!company) {
        return NextResponse.json(
          { error: 'Company not found' },
          { status: 404 }
        );
      }
      return NextResponse.json(company);
    }

    const company = await getCompanyById(params.id);
    
    if (!company) {
      return NextResponse.json(
        { error: 'Company not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(company);
  } catch (error) {
    console.error('Error fetching company:', error);
    // Fallback to mock data
    const company = mockCompanies.find(c => c.id === params.id);
    if (company) {
      return NextResponse.json(company);
    }
    return NextResponse.json(
      { error: 'Failed to fetch company' },
      { status: 500 }
    );
  }
}
