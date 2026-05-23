import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { isAdminAuthorized } from '@/lib/auth';

export async function POST(req: NextRequest) {
  if (!isAdminAuthorized(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { seriesId, name, price, storages, colors, status, note, imageUrl } = body;

    if (!seriesId || !name || price === undefined) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const model = await prisma.model.create({
      data: {
        seriesId: Number(seriesId),
        name,
        price: Number(price),
        storages: storages ?? [],
        colors: colors ?? [],
        status: status ?? 'in_stock',
        note: note ?? '',
        imageUrl: imageUrl ?? '',
      },
      include: { series: true },
    });

    return NextResponse.json({ model }, { status: 201 });
  } catch (error) {
    console.error('POST /api/models error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
