import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const series = await prisma.series.findMany({
      orderBy: { order: 'asc' },
    });
    return NextResponse.json({ series });
  } catch (error) {
    console.error('GET /api/series error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
