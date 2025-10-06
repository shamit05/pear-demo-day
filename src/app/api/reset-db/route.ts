import { NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';
import { createCompany, createFounder, createConnectionRequest } from '@/lib/db';
import { mockCompanies, mockFounders } from '@/data/mockData';

export async function POST() {
  try {
    // Clear all tables
    await sql`DELETE FROM connection_requests`;
    await sql`DELETE FROM founders`;
    await sql`DELETE FROM companies`;

    // Seed companies
    for (const company of mockCompanies) {
      const { founders, ...companyData } = company;
      await createCompany(companyData);
    }

    // Seed founders
    for (const founder of mockFounders) {
      await createFounder(founder);
    }

    // Seed sample connection requests
    const sampleRequests = [
      {
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
        status: 'unreviewed' as const,
      },
      {
        investorId: 'investor-1',
        investorName: 'Sarah Chen',
        investorEmail: 'investor@demo.com',
        investorFirm: 'Acme Ventures',
        investorLinkedIn: 'https://linkedin.com/in/sarahchen',
        companyId: 'c3',
        companyName: 'FutureTech Dynamics',
        message: 'Your renewable energy solution is exactly what the market needs. Let\'s connect!',
        interests: ['Co-Investor'],
        checkSize: '$500K - $1M',
        timeline: 'Medium-term (3-6 months)',
        status: 'reviewed' as const,
      },
    ];

    for (const request of sampleRequests) {
      await createConnectionRequest(request);
    }

    return NextResponse.json({
      message: 'Database reset and seeded successfully',
      companies: mockCompanies.length,
      founders: mockFounders.length,
      connectionRequests: sampleRequests.length
    });
  } catch (error) {
    console.error('Error resetting database:', error);
    return NextResponse.json(
      { error: 'Failed to reset database', details: String(error) },
      { status: 500 }
    );
  }
}
