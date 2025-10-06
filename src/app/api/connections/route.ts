import { NextResponse } from 'next/server';
import {
  getAllConnectionRequests,
  createConnectionRequest,
  getConnectionRequestsByCompany,
  getConnectionRequestsByInvestor,
  getConnectionStats,
} from '@/lib/db';

// GET - Fetch connection requests
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const companyId = searchParams.get('companyId');
    const investorId = searchParams.get('investorId');
    const stats = searchParams.get('stats');

    if (stats === 'true') {
      const statsData = await getConnectionStats();
      return NextResponse.json(statsData);
    }

    if (companyId) {
      const requests = await getConnectionRequestsByCompany(companyId);
      return NextResponse.json(requests);
    }

    if (investorId) {
      const requests = await getConnectionRequestsByInvestor(investorId);
      return NextResponse.json(requests);
    }

    // Return all requests (admin view)
    const requests = await getAllConnectionRequests();
    return NextResponse.json(requests);
  } catch (error) {
    console.error('Error fetching connections:', error);
    return NextResponse.json(
      { error: 'Failed to fetch connections' },
      { status: 500 }
    );
  }
}

// POST - Create new connection request
export async function POST(request: Request) {
  try {
    const body = await request.json();

    const {
      investorId,
      investorName,
      investorEmail,
      investorFirm,
      investorLinkedIn,
      companyId,
      companyName,
      message,
      interests,
      checkSize,
      timeline,
    } = body;

    // Validation
    if (!investorName || !investorEmail || !companyId || !companyName || !message) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const newRequest = await createConnectionRequest({
      investorId: investorId || 'guest',
      investorName,
      investorEmail,
      investorFirm,
      investorLinkedIn,
      companyId,
      companyName,
      message,
      interests: interests || [],
      checkSize,
      timeline,
      status: 'unreviewed',
    });

    return NextResponse.json(newRequest, { status: 201 });
  } catch (error) {
    console.error('Error creating connection:', error);
    return NextResponse.json(
      { error: 'Failed to create connection request' },
      { status: 500 }
    );
  }
}
