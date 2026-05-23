import { NextRequest, NextResponse } from 'next/server';
import { isAdminAuthorized } from '@/lib/auth';

export async function GET(req: NextRequest) {
  if (!isAdminAuthorized(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  return NextResponse.json({ ok: true });
}
