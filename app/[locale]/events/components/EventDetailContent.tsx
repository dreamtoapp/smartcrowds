import { getEventById } from '../actions/actions';
import { listNationalities } from '@/app/actions/nationalities/actions';
import Image from 'next/image';
import RegistrationForm from '@/components/events/RegistrationForm';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { format } from 'date-fns';
import { Calendar, MapPin, FileText } from 'lucide-react';

interface EventDetailContentProps {
  locale: string;
  id: string;
}

export async function EventDetailContent({ locale, id }: EventDetailContentProps) {
  const [event, nationalities] = await Promise.all([
    getEventById(id),
    listNationalities(),
  ]);

  if (!event) {
    return (
      <main className="min-h-screen">
        <section className="container mx-auto px-4 py-10">
          <p className="text-muted-foreground">{locale === 'ar' ? 'الفعالية غير موجودة' : 'Event not found'}</p>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen">
      <section className="container mx-auto px-4 py-10 max-w-4xl space-y-10">
        <div className="relative h-80 w-full bg-muted rounded-lg overflow-hidden shadow-md">
          {event.imageUrl ? (
            <Image src={event.imageUrl} alt={event.title} fill className="object-cover" />
          ) : (
            <div className="flex items-center justify-center h-full">
              <Calendar className="h-16 w-16 text-muted-foreground" />
            </div>
          )}
        </div>

        <div className="space-y-4">
          <h1 className="text-4xl font-bold leading-tight">{event.title}</h1>
          <div className="flex flex-wrap items-center gap-4 text-muted-foreground">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary/70" />
              <span className="font-medium">{format(new Date(event.date), 'PPP')}</span>
            </div>
            {event.location && (
              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-primary/70" />
                <span>{event.location.city}</span>
              </div>
            )}
          </div>
        </div>

        {event.description && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary/70" />
                {locale === 'ar' ? 'الوصف' : 'Description'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed whitespace-pre-line">{event.description}</p>
            </CardContent>
          </Card>
        )}

        {event.requirements?.length ? (
          <Card id="register">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary/70" />
                {locale === 'ar' ? 'المتطلبات' : 'Requirements'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <ul className="list-disc ms-6 space-y-2 text-muted-foreground">
                {event.requirements.map((r, i) => (
                  <li key={i} className="leading-relaxed">{r}</li>
                ))}
              </ul>
              <RegistrationForm 
                eventId={event.id} 
                requirements={event.requirements}
                jobs={event.jobs || []}
                nationalities={nationalities}
                locale={locale}
              />
            </CardContent>
          </Card>
        ) : (
          <Card id="register">
            <CardHeader>
              <CardTitle>{locale === 'ar' ? 'التسجيل' : 'Register'}</CardTitle>
            </CardHeader>
            <CardContent>
              <RegistrationForm 
                eventId={event.id} 
                requirements={[]}
                jobs={event.jobs || []}
                nationalities={nationalities}
                locale={locale}
              />
            </CardContent>
          </Card>
        )}
      </section>
    </main>
  );
}

