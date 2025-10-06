import { NextResponse } from 'next/server';
import { createCompany, createFounder, getAllCompanies } from '@/lib/db';
import { mockCompanies, mockFounders } from '@/data/mockData';

export async function POST() {
  try {
    // Check if data already exists
    const existingCompanies = await getAllCompanies();
    if (existingCompanies.length > 0) {
      return NextResponse.json({
        message: 'Database already seeded',
        count: existingCompanies.length
      });
    }

    // Seed companies
    for (const company of mockCompanies) {
      const { founders, ...companyData } = company;
      await createCompany(companyData);
    }

    // Seed founders
    for (const founder of mockFounders) {
      await createFounder(founder);
    }

    return NextResponse.json({
      message: 'Database seeded successfully',
      companies: mockCompanies.length,
      founders: mockFounders.length
    });
  } catch (error) {
    console.error('Error seeding database:', error);
    return NextResponse.json(
      { error: 'Failed to seed database', details: String(error) },
      { status: 500 }
    );
  }
}
