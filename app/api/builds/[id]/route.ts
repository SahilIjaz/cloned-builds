import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Build from '@/models/Build';

// GET - Fetch single build by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    await dbConnect();

    const build = await Build.findById(id);

    if (!build) {
      return NextResponse.json({ error: 'Build not found' }, { status: 404 });
    }

    return NextResponse.json(
      {
        build,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Fetch build error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch build' },
      { status: 500 }
    );
  }
}
