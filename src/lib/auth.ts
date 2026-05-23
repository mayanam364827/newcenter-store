import { NextRequest } from 'next/server';

export function isAdminAuthorized(req: NextRequest): boolean {
  const token = process.env.ADMIN_TOKEN;
  if (!token) return false;
  const authHeader = req.headers.get('authorization');
  const xToken = req.headers.get('x-admin-token');
  if (authHeader && authHeader === `Bearer ${token}`) return true;
  if (xToken && xToken === token) return true;
  return false;
}
