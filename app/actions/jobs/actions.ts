'use server';

import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';

const jobInputSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional().default(''),
});

export async function createJob(input: unknown) {
  const data = jobInputSchema.parse(input);
  const created = await prisma.job.create({ data });
  revalidatePath('/ar/dashboard/jobs');
  revalidatePath('/en/dashboard/jobs');
  return created;
}

export async function listJobs() {
  return prisma.job.findMany({ orderBy: { createdAt: 'desc' } });
}

export async function getJob(id: string) {
  return prisma.job.findUnique({ where: { id } });
}

export async function updateJob(id: string, input: unknown) {
  const data = jobInputSchema.parse(input);
  const updated = await prisma.job.update({ where: { id }, data });
  revalidatePath('/ar/dashboard/jobs');
  revalidatePath('/en/dashboard/jobs');
  return updated;
}

export async function deleteJob(id: string) {
  // Disallow delete if used by any requirement
  const useCount = await prisma.eventJobRequirement.count({ where: { jobId: id } });
  if (useCount > 0) throw new Error('Job is in use by events');
  const deleted = await prisma.job.delete({ where: { id } });
  revalidatePath('/ar/dashboard/jobs');
  revalidatePath('/en/dashboard/jobs');
  return deleted;
}


