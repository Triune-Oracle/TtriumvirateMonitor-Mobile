import { NextResponse } from 'next/server';
import { register } from '@/server/metrics';

export async function GET(): Promise<NextResponse> {
  const metrics = await register.metrics();
  return new NextResponse(metrics, {
    headers: { 'Content-Type': register.contentType },
  });
}
