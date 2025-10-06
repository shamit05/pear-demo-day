import { NextResponse } from 'next/server';
import { updateConnectionRequest, getConnectionRequestById } from '@/lib/db';

// GET single connection request
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const connectionRequest = await getConnectionRequestById(params.id);
    
    if (!connectionRequest) {
      return NextResponse.json(
        { error: 'Connection request not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(connectionRequest);
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
    
    const updated = await updateConnectionRequest(params.id, {
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
