import { listAllSubscribers } from '@/app/actions/events/actions';
import { Card, CardContent } from '@/components/ui/card';
import { SubscribersByEventGroup } from '@/components/dashboard/subscribers/SubscribersByEventGroup';

export default async function AllSubscribersPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const subscribers = await listAllSubscribers();
  const isArabic = locale === 'ar';

  // Group subscribers by event
  const subscribersByEvent = subscribers.reduce((acc, subscriber) => {
    const eventTitle = subscriber.event?.title || 'Unknown Event';
    if (!acc[eventTitle]) {
      acc[eventTitle] = [];
    }
    acc[eventTitle].push(subscriber);
    return acc;
  }, {} as Record<string, typeof subscribers>);

  const eventTitles = Object.keys(subscribersByEvent).sort();

  return (
    <section className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-2">
          {isArabic ? 'جميع المشتركين' : 'All Subscribers'}
        </h1>
        <p className="text-muted-foreground">
          {isArabic
            ? `إجمالي ${subscribers.length} مشترك من ${eventTitles.length} فعالية`
            : `Total ${subscribers.length} subscriber${subscribers.length !== 1 ? 's' : ''} from ${eventTitles.length} event${eventTitles.length !== 1 ? 's' : ''}`}
        </p>
      </div>

      {eventTitles.length === 0 ? (
        <Card>
          <CardContent className="py-10 text-center">
            <p className="text-muted-foreground">
              {isArabic ? 'لا يوجد مشتركين حتى الآن' : 'No subscribers yet'}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {eventTitles.map((eventTitle) => (
            <SubscribersByEventGroup
              key={eventTitle}
              eventTitle={eventTitle}
              subscribers={subscribersByEvent[eventTitle]}
              locale={locale}
            />
          ))}
        </div>
      )}
    </section>
  );
}

