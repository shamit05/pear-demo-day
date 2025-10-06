import { NextResponse } from 'next/server';
import { updateConnectionRequest, getConnectionRequestById } from '@/lib/connectionStore';

// GET single connection request
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const request = getConnectionRequestById(params.id);
    
    if (!request) {
      return NextResponse.json(
        { error: 'Connection request not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(request);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch connection request' },
      { status: 500 }
    );
  }
}

// PATCH - Update connection request
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    
    const updated = updateConnectionRequest(params.id, {
      ...body,
      reviewedAt: body.status === 'reviewed' ? new Date().toISOString() : undefined,
      respondedAt: body.status === 'accepted' || body.status === 'declined' ? new Date().toISOString() : undefined,
    });

    if (!updated) {
      return NextResponse.json(
        { error: 'Connection request not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(updated);
  } catch (error) {
    console.error('Error updating connection:', error);
    return NextResponse.json(
      { error: 'Failed to update connection request' },
      { status: 500 }
    );
  }
}
