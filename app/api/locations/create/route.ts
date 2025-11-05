import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { city, address } = body ?? {};
    if (!city || typeof city !== 'string') {
      return NextResponse.json({ error: 'city is required' }, { status: 400 });
    }
    const created = await prisma.location.create({ data: { city, address: address || '' } });
    revalidatePath('/ar/dashboard/locations');
    revalidatePath('/en/dashboard/locations');
    return NextResponse.json(created);
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'error' }, { status: 500 });
  }
}











