'use server';

import { prisma } from '@/lib/prisma';
import { eventBasicSchema, eventInputSchema, registrationInputSchema, eventRequirementsJobsSchema, eventJobRequirementSchema } from '@/lib/validations/event';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';
// Simplified ID validation handled inline

export async function createEvent(input: unknown) {
  const data = eventBasicSchema.parse(input);
  const created = await prisma.event.create({
    data: {
      title: data.title,
      description: data.description,
      date: new Date(data.date),
      imageUrl: data.imageUrl || undefined,
      requirements: [],
      locationId: data.locationId,
    },
  });
  revalidatePath('/ar/dashboard/events');
  revalidatePath('/en/dashboard/events');
  return created;
}

export async function listEvents() {
  return prisma.event.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      location: true,
      jobs: {
        include: { job: true },
      },
      subscribers: {
        select: {
          id: true,
          accepted: true,
        },
      },
    },
  });
}

export async function getEventById(id: string) {
  return prisma.event.findUnique({
    where: { id },
    include: { location: true, jobs: { include: { job: true } } },
  });
}

export async function getEventWithJobs(id: string) {
  const event = await prisma.event.findUnique({
    where: { id },
    include: { 
      location: true, 
      jobs: { 
        include: { job: true },
        orderBy: { id: 'asc' }
      } 
    },
  });
  return event;
}

export async function updateEventRequirements(eventId: string, requirements: string[]) {
  try {
    await prisma.event.update({
      where: { id: eventId },
      data: { requirements },
    });
    revalidatePath('/ar/dashboard/events');
    revalidatePath('/en/dashboard/events');
    revalidatePath(`/ar/dashboard/events/${eventId}/jobs`);
    revalidatePath(`/en/dashboard/events/${eventId}/jobs`);
    return { success: true };
  } catch (error) {
    console.error('Error updating event requirements:', error);
    if (error instanceof Error) {
      return { error: error.message };
    }
    return { error: 'Failed to update event requirements' };
  }
}

export async function addEventJob(eventId: string, jobId: string, ratePerDay: number) {
  try {
    const validated = eventJobRequirementSchema.parse({ jobId, ratePerDay });

    await prisma.eventJobRequirement.create({
      data: {
        eventId,
        jobId: validated.jobId,
        ratePerDay: validated.ratePerDay,
      },
    });
    
    revalidatePath('/ar/dashboard/events');
    revalidatePath('/en/dashboard/events');
    revalidatePath(`/ar/dashboard/events/${eventId}/jobs`);
    revalidatePath(`/en/dashboard/events/${eventId}/jobs`);
    return { success: true };
  } catch (error) {
    console.error('Error adding event job:', error);
    if (error instanceof Error) {
      return { error: error.message };
    }
    return { error: 'Failed to add event job' };
  }
}

export async function updateEventJob(requirementId: string, ratePerDay: number) {
  try {
    if (!ratePerDay || ratePerDay <= 0) {
      return { error: 'Rate per day must be a positive number' };
    }

    await prisma.eventJobRequirement.update({
      where: { id: requirementId },
      data: { ratePerDay },
    });
    
    const requirement = await prisma.eventJobRequirement.findUnique({
      where: { id: requirementId },
      include: { event: true },
    });

    if (requirement) {
      revalidatePath('/ar/dashboard/events');
      revalidatePath('/en/dashboard/events');
      revalidatePath(`/ar/dashboard/events/${requirement.eventId}/jobs`);
      revalidatePath(`/en/dashboard/events/${requirement.eventId}/jobs`);
    }
    
    return { success: true };
  } catch (error) {
    console.error('Error updating event job:', error);
    if (error instanceof Error) {
      return { error: error.message };
    }
    return { error: 'Failed to update event job' };
  }
}

export async function removeEventJob(requirementId: string) {
  try {
    const requirement = await prisma.eventJobRequirement.findUnique({
      where: { id: requirementId },
      include: { event: true },
    });

    if (!requirement) {
      return { error: 'Event job requirement not found' };
    }

    await prisma.eventJobRequirement.delete({
      where: { id: requirementId },
    });
    
    revalidatePath('/ar/dashboard/events');
    revalidatePath('/en/dashboard/events');
    revalidatePath(`/ar/dashboard/events/${requirement.eventId}/jobs`);
    revalidatePath(`/en/dashboard/events/${requirement.eventId}/jobs`);
    
    return { success: true };
  } catch (error) {
    console.error('Error removing event job:', error);
    if (error instanceof Error) {
      return { error: error.message };
    }
    return { error: 'Failed to remove event job' };
  }
}

export async function updateEventRequirementsAndJobs(eventId: string, data: unknown) {
  try {
    const validated = eventRequirementsJobsSchema.parse(data);
    
    // Update requirements
    await prisma.event.update({
      where: { id: eventId },
      data: { requirements: validated.requirements },
    });

    // Get existing jobs
    const existingJobs = (await prisma.eventJobRequirement.findMany({
      where: { eventId },
    })) as Array<{ id: string; jobId: string }>;

    // Remove jobs that are no longer in the list
    const existingJobIds = new Set(existingJobs.map((j: { jobId: string }) => j.jobId));
    const newJobIds = new Set((validated.jobs as Array<{ jobId: string; ratePerDay: number }>).map((j) => j.jobId));
    
    const jobsToRemove = existingJobs.filter((j: { jobId: string }) => !newJobIds.has(j.jobId));
    await Promise.all(
      jobsToRemove.map(job => 
        prisma.eventJobRequirement.delete({ where: { id: job.id } })
      )
    );

    // Update or create jobs
    await Promise.all(
      validated.jobs.map(async (job) => {
        const existing = existingJobs.find(j => j.jobId === job.jobId);
        if (existing) {
          // Update existing
          await prisma.eventJobRequirement.update({
            where: { id: existing.id },
            data: { ratePerDay: job.ratePerDay },
          });
        } else {
          // Create new
          await prisma.eventJobRequirement.create({
            data: {
              eventId,
              jobId: job.jobId,
              ratePerDay: job.ratePerDay,
            },
          });
        }
      })
    );
    
    revalidatePath('/ar/dashboard/events');
    revalidatePath('/en/dashboard/events');
    revalidatePath(`/ar/dashboard/events/${eventId}/jobs`);
    revalidatePath(`/en/dashboard/events/${eventId}/jobs`);
    
    return { success: true };
  } catch (error) {
    console.error('Error updating event requirements and jobs:', error);
    if (error instanceof Error) {
      return { error: error.message };
    }
    return { error: 'Failed to update event requirements and jobs' };
  }
}

export async function verifyIdNumber(eventId: string, idNumber: string) {
  try {
    // Simplified validation: 10 digits starting with 1 or 2
    if (!/^[12][0-9]{9}$/.test(idNumber)) {
      return {
        valid: false,
        isDuplicate: false,
        error: 'رقم الهوية غير صحيح',
      };
    }
    
    // Check for duplicate ID in database
    const existingSubscriber = await prisma.eventSubscriber.findFirst({
      where: {
        eventId,
        idNumber,
      },
    });
    
    if (existingSubscriber) {
      return {
        valid: true,
        isDuplicate: true,
        error: 'رقم الهوية هذا مسجل مسبقاً في هذه الفعالية. لا يمكن التسجيل مرتين بنفس رقم الهوية',
      };
    }
    
    return {
      valid: true,
      isDuplicate: false,
    };
  } catch (error) {
    console.error('Error verifying ID number:', error);
    return {
      valid: false,
      isDuplicate: false,
      error: error instanceof Error ? error.message : 'فشل التحقق من رقم الهوية',
    };
  }
}

export async function registerForEvent(input: unknown) {
  try {
    const data = registrationInputSchema.parse(input);
    
    // Check if this ID number is already registered for this event
    const existingSubscriber = await prisma.eventSubscriber.findFirst({
      where: {
        eventId: data.eventId,
        idNumber: data.idNumber,
      },
    });
    
    if (existingSubscriber) {
      return { 
        error: 'رقم الهوية هذا مسجل مسبقاً في هذه الفعالية. لا يمكن التسجيل مرتين بنفس رقم الهوية' 
      };
    }
    
    // Compute age from date of birth
    const dob = new Date(data.dateOfBirth);
    const now = new Date();
    const ageMs = now.getTime() - dob.getTime();
    const computedAge = Math.floor(ageMs / (365.2425 * 24 * 60 * 60 * 1000));

    const subscriber = await prisma.eventSubscriber.create({
      data: {
        eventId: data.eventId,
        jobRequirementId: data.jobRequirementId || undefined,
        nationalityId: data.nationalityId,
        name: data.name,
        mobile: data.mobile,
        email: data.email,
        idNumber: data.idNumber,
        age: computedAge,
        dateOfBirth: dob,
        idImageUrl: data.idImageUrl || undefined,
        personalImageUrl: data.personalImageUrl || undefined,
      },
    });
    
    revalidatePath('/ar/events');
    revalidatePath('/en/events');
    revalidatePath(`/ar/events/${data.eventId}`);
    revalidatePath(`/en/events/${data.eventId}`);
    revalidatePath('/ar/dashboard/events');
    revalidatePath('/en/dashboard/events');
    revalidatePath(`/ar/dashboard/events/${data.eventId}/subscribers`);
    revalidatePath(`/en/dashboard/events/${data.eventId}/subscribers`);
    revalidatePath('/ar/dashboard/subscribers');
    revalidatePath('/en/dashboard/subscribers');
    
    return { success: true, subscriber };
  } catch (error) {
    console.error('Error registering for event:', error);
    
    // Handle Prisma unique constraint violation
    if (error && typeof error === 'object' && 'code' in error && error.code === 'P2002') {
      return { 
        error: 'رقم الهوية هذا مسجل مسبقاً في هذه الفعالية. لا يمكن التسجيل مرتين بنفس رقم الهوية' 
      };
    }
    
    if (error instanceof Error) {
      return { error: error.message };
    }
    return { error: 'Failed to register for event' };
  }
}

export async function listEventSubscribers(eventId: string, acceptedOnly: boolean = false) {
  try {
    const subscribers = await prisma.eventSubscriber.findMany({
      where: { eventId, accepted: acceptedOnly ? true : undefined },
      include: {
        jobRequirement: {
          include: {
            job: true,
          },
        },
        nationality: true,
      },
      orderBy: { createdAt: 'desc' },
    });
    return subscribers;
  } catch (error) {
    console.error('Error listing event subscribers:', error);
    return [];
  }
}
export async function updateSubscriberAccepted(subscriberId: string, accepted: boolean) {
  try {
    const updated = await prisma.eventSubscriber.update({
      where: { id: subscriberId },
      data: { accepted },
    });
    revalidatePath('/ar/dashboard/events');
    revalidatePath('/en/dashboard/events');
    revalidatePath(`/ar/dashboard/events/${updated.eventId}/subscribers`);
    revalidatePath(`/en/dashboard/events/${updated.eventId}/subscribers`);
    return { success: true };
  } catch (error) {
    console.error('Error updating subscriber accepted:', error);
    if (error instanceof Error) {
      return { error: error.message };
    }
    return { error: 'Failed to update subscriber accepted' };
  }
}

export async function bulkUpdateSubscribersAccepted(ids: string[], accepted: boolean) {
  try {
    const subs = await prisma.eventSubscriber.findMany({ where: { id: { in: ids } } });
    if (subs.length === 0) return { success: true };
    await prisma.eventSubscriber.updateMany({ where: { id: { in: ids } }, data: { accepted } });
    const eventIds = Array.from(new Set(subs.map(s => s.eventId)));
    revalidatePath('/ar/dashboard/events');
    revalidatePath('/en/dashboard/events');
    for (const eid of eventIds) {
      revalidatePath(`/ar/dashboard/events/${eid}/subscribers`);
      revalidatePath(`/en/dashboard/events/${eid}/subscribers`);
    }
    return { success: true };
  } catch (error) {
    console.error('Error bulk updating subscriber accepted:', error);
    if (error instanceof Error) {
      return { error: error.message };
    }
    return { error: 'Failed to bulk update subscriber accepted' };
  }
}

export async function exportEventSubscribersToCSV(eventId: string) {
  try {
    const subscribers = await prisma.eventSubscriber.findMany({
      where: { eventId },
      orderBy: { createdAt: 'desc' },
      include: {
        event: {
          select: {
            title: true,
          },
        },
        jobRequirement: {
          include: {
            job: true,
          },
        },
        nationality: true,
      },
    });

    if (subscribers.length === 0) {
      return { error: 'No subscribers to export' };
    }

    // CSV Headers
    const headers = [
      'Name',
      'Mobile',
      'Email',
      'ID Number',
      'Nationality',
      'Age',
      'Job',
      'Rate Per Day',
      'ID Image URL',
      'Personal Image URL',
      'Registration Date',
    ];

    // CSV Rows
    type CsvSub = {
      name: string; mobile: string; email: string; idNumber: string; age: number;
      jobRequirement?: { job?: { name?: string | null } | null; ratePerDay?: number | null } | null;
      idImageUrl?: string | null; personalImageUrl?: string | null; createdAt: Date | string;
      nationality?: { nameEn?: string | null } | null;
    };
    const rows = (subscribers as unknown as CsvSub[]).map((subscriber) => [
      subscriber.name,
      subscriber.mobile,
      subscriber.email,
      subscriber.idNumber,
      subscriber.nationality ? subscriber.nationality.nameEn : '',
      subscriber.age.toString(),
      subscriber.jobRequirement?.job?.name || '',
      subscriber.jobRequirement?.ratePerDay?.toString() || '',
      subscriber.idImageUrl || '',
      subscriber.personalImageUrl || '',
      new Date(subscriber.createdAt).toISOString(),
    ]);

    // Combine headers and rows
    const csvContent = [
      headers.join(','),
      ...rows.map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(',')),
    ].join('\n');

    // Add BOM for UTF-8 to support Arabic characters in Excel
    const BOM = '\uFEFF';
    const csvWithBOM = BOM + csvContent;

    return { success: true, csv: csvWithBOM };
  } catch (error) {
    console.error('Error exporting subscribers to CSV:', error);
    if (error instanceof Error) {
      return { error: error.message };
    }
    return { error: 'Failed to export subscribers to CSV' };
  }
}

export async function listAllSubscribers() {
  try {
    const subscribers = await prisma.eventSubscriber.findMany({
      include: {
        event: {
          select: {
            title: true,
          },
        },
        jobRequirement: {
          include: {
            job: true,
          },
        },
        nationality: true,
      },
      orderBy: { createdAt: 'desc' },
    });
    return subscribers;
  } catch (error) {
    console.error('Error listing all subscribers:', error);
    return [];
  }
}

export async function updateEventPublished(eventId: string, published: boolean) {
  try {
    await prisma.event.update({
      where: { id: eventId },
      data: { published },
    });
    revalidatePath('/ar/dashboard/events');
    revalidatePath('/en/dashboard/events');
    return { success: true };
  } catch (error) {
    console.error('Error updating event published status:', error);
    if (error instanceof Error) {
      return { error: error.message };
    }
    return { error: 'Failed to update event published status' };
  }
}

export async function updateEventAcceptJobs(eventId: string, acceptJobs: boolean) {
  try {
    await prisma.event.update({
      where: { id: eventId },
      data: { acceptJobs },
    });
    revalidatePath('/ar/dashboard/events');
    revalidatePath('/en/dashboard/events');
    return { success: true };
  } catch (error) {
    console.error('Error updating event accept jobs status:', error);
    if (error instanceof Error) {
      return { error: error.message };
    }
    return { error: 'Failed to update event accept jobs status' };
  }
}

export async function updateEventCompleted(eventId: string, completed: boolean) {
  try {
    await prisma.event.update({
      where: { id: eventId },
      data: { completed },
    });
    revalidatePath('/ar/dashboard/events');
    revalidatePath('/en/dashboard/events');
    return { success: true };
  } catch (error) {
    console.error('Error updating event completed status:', error);
    if (error instanceof Error) {
      return { error: error.message };
    }
    return { error: 'Failed to update event completed status' };
  }
}


// Update event core fields
const updateEventSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().min(1).optional(),
  date: z.string().optional(),
  imageUrl: z.string().url().optional().or(z.literal('')).optional(),
  locationId: z.string().optional(),
  acceptJobs: z.boolean().optional(),
  published: z.boolean().optional(),
});

export async function updateEvent(eventId: string, input: unknown) {
  try {
    const data = updateEventSchema.parse(input);
    const updateData: any = {};
    if (data.title !== undefined) updateData.title = data.title;
    if (data.description !== undefined) updateData.description = data.description;
    if (data.date !== undefined) updateData.date = new Date(data.date);
    if (data.imageUrl !== undefined) updateData.imageUrl = data.imageUrl || null;
    if (data.locationId !== undefined) updateData.locationId = data.locationId;
    if (data.acceptJobs !== undefined) updateData.acceptJobs = data.acceptJobs;
    if (data.published !== undefined) updateData.published = data.published;

    await prisma.event.update({ where: { id: eventId }, data: updateData });

    // Revalidate dashboards and public pages
    revalidatePath('/ar/dashboard/events');
    revalidatePath('/en/dashboard/events');
    revalidatePath(`/ar/dashboard/events/${eventId}/jobs`);
    revalidatePath(`/en/dashboard/events/${eventId}/jobs`);
    revalidatePath('/ar/events');
    revalidatePath('/en/events');
    revalidatePath(`/ar/events/${eventId}`);
    revalidatePath(`/en/events/${eventId}`);
    return { success: true };
  } catch (error) {
    console.error('Error updating event:', error);
    if (error instanceof Error) {
      return { error: error.message };
    }
    return { error: 'Failed to update event' };
  }
}


