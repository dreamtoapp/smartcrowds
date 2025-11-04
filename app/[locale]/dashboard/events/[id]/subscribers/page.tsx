import { notFound } from 'next/navigation';
import { getEventById, listEventSubscribers } from '@/app/actions/events/actions';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from '@/lib/routing';
import { ExportSubscribersButton } from '@/components/dashboard/subscribers/ExportSubscribersButton';
import { SubscribersTable } from '@/components/dashboard/subscribers/SubscribersTable';

export default async function EventSubscribersPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  const [event, subscribers] = await Promise.all([
    getEventById(id),
    listEventSubscribers(id),
  ]);

  if (!event) {
    notFound();
  }

  const isArabic = locale === 'ar';

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold mb-2">
            {isArabic ? 'المشتركين' : 'Subscribers'}
          </h1>
          <p className="text-muted-foreground">
            {isArabic
              ? `${event.title} - ${subscribers.length} ${isArabic ? 'مشترك' : 'subscriber'}${subscribers.length !== 1 ? (isArabic ? '' : 's') : ''}`
              : `${event.title} - ${subscribers.length} subscriber${subscribers.length !== 1 ? 's' : ''}`}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {subscribers.length > 0 && (
            <ExportSubscribersButton eventId={id} eventTitle={event.title} />
          )}
          <Link href="/dashboard/events">
            <Button variant="outline">
              {isArabic ? 'العودة للقائمة' : 'Back to Events'}
            </Button>
          </Link>
        </div>
      </div>

      {subscribers.length === 0 ? (
        <Card>
          <CardContent className="py-10 text-center">
            <p className="text-muted-foreground">
              {isArabic ? 'لا يوجد مشتركين حتى الآن' : 'No subscribers yet'}
            </p>
          </CardContent>
        </Card>
      ) : (
        <SubscribersTable subscribers={subscribers} locale={locale} />
      )}
    </section>
  );
}

