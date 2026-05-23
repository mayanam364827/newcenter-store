import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { isAdminAuthorized } from '@/lib/auth';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const model = await prisma.model.findUnique({
      where: { id: Number(id) },
      include: { series: true },
    });

    if (!model) {
      return NextResponse.json({ error: 'Model not found' }, { status: 404 });
    }

    return NextResponse.json({ model });
  } catch (error) {
    console.error('GET /api/models/[id] error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!isAdminAuthorized(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  try {
    const body = await req.json();
    const { seriesId, name, price, storages, colors, status, note, imageUrl } = body;

    const data: Record<string, unknown> = {};
    if (seriesId !== undefined) data.seriesId = Number(seriesId);
    if (name !== undefined) data.name = name;
    if (price !== undefined) data.price = Number(price);
    if (storages !== undefined) data.storages = storages;
    if (colors !== undefined) data.colors = colors;
    if (status !== undefined) data.status = status;
    if (note !== undefined) data.note = note;
    if (imageUrl !== undefined) data.imageUrl = imageUrl;

    const model = await prisma.model.update({
      where: { id: Number(id) },
      data,
      include: { series: true },
    });

    return NextResponse.json({ model });
  } catch (error) {
    console.error('PUT /api/models/[id] error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!isAdminAuthorized(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  try {
    await prisma.model.delete({
      where: { id: Number(id) },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('DELETE /api/models/[id] error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
