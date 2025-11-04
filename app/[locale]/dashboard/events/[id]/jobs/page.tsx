import { notFound } from 'next/navigation';
import { getEventWithJobs } from '@/app/actions/events/actions';
import { listJobs } from '@/app/actions/jobs/actions';
import EventRequirementsJobsForm from '@/components/dashboard/events/EventRequirementsJobsForm';
import { EventInfoCollapsible } from '@/components/dashboard/events/EventInfoCollapsible';

export default async function EventJobsPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  const [event, jobs] = await Promise.all([
    getEventWithJobs(id),
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
        eventId={id}
        jobs={jobs}
        initialRequirements={event.requirements || []}
        initialJobs={event.jobs || []}
        locale={locale}
      />
    </section>
  );
}

