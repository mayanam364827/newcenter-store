import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ key: string }> }
) {
  const { key } = await params;
  try {
    const series = await prisma.series.findUnique({
      where: { key },
    });

    if (!series) {
      return NextResponse.json({ error: 'Series not found' }, { status: 404 });
    }

    const models = await prisma.model.findMany({
      where: { seriesId: series.id },
      orderBy: { createdAt: 'asc' },
    });

    return NextResponse.json({ models });
  } catch (error) {
    console.error('GET /api/series/[key]/models error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
