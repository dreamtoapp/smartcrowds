import { notFound } from 'next/navigation';
import EventRequirementsJobsForm from '@/components/dashboard/events/EventRequirementsJobsForm';
import { EventInfoCollapsible } from '@/components/dashboard/events/EventInfoCollapsible';
import { getEventWithJobs } from '../actions/actions';
import { listJobs } from '../actions/actions';

interface EventJobsContentProps {
  eventId: string;
  locale: string;
}

export async function EventJobsContent({ eventId, locale }: EventJobsContentProps) {
  const [event, jobs] = await Promise.all([
    getEventWithJobs(eventId),
    listJobs(),
  ]);

  if (!event) {
    notFound();
  }

  const isArabic = locale === 'ar';

  return (
    <section className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-2">
          {isArabic ? 'إدارة المتطلبات والوظائف' : 'Manage Requirements & Jobs'}
        </h1>
        <p className="text-muted-foreground">
          {isArabic
            ? 'إدارة متطلبات ووظائف الفعالية'
            : 'Manage event requirements and jobs'}
        </p>
      </div>

      <EventInfoCollapsible
        title={event.title}
        date={event.date}
        location={event.location}
        locale={locale}
      />

      <EventRequirementsJobsForm
        eventId={eventId}
        jobs={jobs}
        initialRequirements={event.requirements || []}
        initialJobs={event.jobs || []}
        locale={locale}
      />
    </section>
  );
}

