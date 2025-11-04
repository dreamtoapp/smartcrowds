import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { Link } from '@/lib/routing';
import { listEvents } from '@/app/actions/events/actions';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { EventSettingsMenu } from '@/components/dashboard/events/EventSettingsMenu';

export default async function DashboardEventsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const events = await listEvents();
  const isArabic = locale === 'ar';

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{isArabic ? 'الفعاليات' : 'Events'}</h1>
        <Link href="/dashboard/events/new">
          <Button>{isArabic ? 'إنشاء فعالية' : 'Create Event'}</Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map((event) => {
          const requirementsCount = event.requirements?.length || 0;
          const jobsCount = event.jobs?.length || 0;
          const subscribersCount = event.subscribers?.length || 0;
          
          return (
            <Card key={event.id} className="overflow-hidden flex flex-col">
              <div className="relative h-40 bg-muted">
                {event.imageUrl ? (
                  <Image src={event.imageUrl} alt={event.title} fill className="object-cover" />
                ) : null}
              </div>
              <CardContent className="pt-4 flex-1 flex flex-col">
                <div className="font-semibold mb-1">{event.title}</div>
                <div className="text-sm text-muted-foreground mb-3">
                  {format(new Date(event.date), 'PPP')}
                  {event.location && ` • ${event.location.city}`}
                </div>
                
                <div className="flex items-center gap-2 mb-3 flex-wrap">
                  {event.published && (
                    <Badge variant="default" className="bg-blue-600">
                      {isArabic ? 'منشور' : 'Published'}
                    </Badge>
                  )}
                  {event.completed && (
                    <Badge variant="default" className="bg-green-600">
                      {isArabic ? 'تم التنفيذ' : 'Done'}
                    </Badge>
                  )}
                  {!event.acceptJobs && (
                    <Badge variant="default" className="bg-orange-600">
                      {isArabic ? 'لا يوجد وظائف' : 'No More Jobs'}
                    </Badge>
                  )}
                  {requirementsCount > 0 && (
                    <Badge variant="secondary">
                      {isArabic ? `${requirementsCount} متطلب` : `${requirementsCount} Requirements`}
                    </Badge>
                  )}
                  {jobsCount > 0 && (
                    <Badge variant="secondary">
                      {isArabic ? `${jobsCount} وظيفة` : `${jobsCount} Jobs`}
                    </Badge>
                  )}
                  <Badge variant="secondary">
                    {isArabic ? `${subscribersCount} مشترك` : `${subscribersCount} Subscriber${subscribersCount !== 1 ? 's' : ''}`}
                  </Badge>
                </div>

                <div className="mt-auto space-y-2">
                  <Link href={`/dashboard/events/${event.id}/jobs`} className="block">
                    <Button variant="default" size="sm" className="w-full">
                      {isArabic ? 'إدارة المتطلبات والوظائف' : 'Manage Requirements & Jobs'}
                    </Button>
                  </Link>
                  <Link href={`/dashboard/events/${event.id}/subscribers`} className="block">
                    <Button variant="secondary" size="sm" className="w-full">
                      {isArabic ? `عرض المشتركين (${subscribersCount})` : `View Subscribers (${subscribersCount})`}
                    </Button>
                  </Link>
                  <div className="flex items-center gap-2">
                    <Link href={`/events/${event.id}`} className="flex-1">
                      <Button variant="outline" size="sm" className="w-full">
                        {isArabic ? 'عرض' : 'View'}
                      </Button>
                    </Link>
                    <EventSettingsMenu
                      eventId={event.id}
                      published={event.published ?? false}
                      acceptJobs={event.acceptJobs ?? true}
                      completed={event.completed ?? false}
                      locale={locale}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </section>
  );
}


