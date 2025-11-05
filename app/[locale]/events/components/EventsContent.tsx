import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import Link from 'next/link';
import { listEvents } from '../actions/actions';
import { format } from 'date-fns';
import { Calendar, MapPin, Briefcase, Users } from 'lucide-react';

interface EventsContentProps {
  locale: string;
}

export async function EventsContent({ locale }: EventsContentProps) {
  const events = await listEvents();
  const isArabic = locale === 'ar';

  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <section className="container mx-auto px-4 py-12 space-y-10">
        <div className="text-center space-y-3">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            {isArabic ? 'الفعاليات' : 'Events'}
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            {isArabic ? 'اختر فعالية للتفاصيل والتسجيل' : 'Select an event to view details and register'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {events.map((event) => {
            const jobsCount = event.jobs?.length || 0;
            const subscribersCount = event.subscribers?.length || 0;
            
            return (
              <Card key={event.id} className="group overflow-hidden h-full flex flex-col bg-card border-2 hover:border-primary/50 transition-colors duration-200">
                <div className="relative h-56 bg-gradient-to-br from-muted to-muted/50 overflow-hidden">
                  {event.imageUrl ? (
                    <>
                      <Image 
                        src={event.imageUrl} 
                        alt={event.title} 
                        fill 
                        className="object-cover" 
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0" />
                    </>
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center">
                      <Calendar className="h-16 w-16 text-primary/30" />
                    </div>
                  )}
                  
                  {jobsCount > 0 && (
                    <div className="absolute top-3 right-3">
                      <Badge className="bg-primary/90 hover:bg-primary text-primary-foreground shadow-lg backdrop-blur-sm">
                        <Briefcase className="h-3 w-3 mr-1" />
                        {jobsCount} {isArabic ? 'وظيفة' : jobsCount === 1 ? 'Job' : 'Jobs'}
                      </Badge>
                    </div>
                  )}
                </div>

                <CardContent className="p-6 flex-1 flex flex-col gap-4">
                  <div>
                    <h3 className="text-xl font-bold leading-tight mb-2 line-clamp-2">
                      {event.title}
                    </h3>
                  </div>

                  <div className="space-y-2.5">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4 text-primary/70 flex-shrink-0" />
                      <span className="font-medium">{format(new Date(event.date), 'PPP')}</span>
                    </div>
                    
                    {event.location && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <MapPin className="h-4 w-4 text-primary/70 flex-shrink-0" />
                        <span>{event.location.city}</span>
                      </div>
                    )}

                    {/* Removed subscribers count from public listing per request */}
                  </div>

                  {event.jobs && event.jobs.length > 0 && (
                    <div className="mt-auto pt-4 border-t border-border/50">
                      <div className="flex items-center gap-2 mb-3">
                        <Briefcase className="h-4 w-4 text-primary/70" />
                        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                          {isArabic ? 'الوظائف المطلوبة' : 'Required Jobs'}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {event.jobs.slice(0, 3).map((jobRequirement) => (
                          <div 
                            key={jobRequirement.id} 
                            className="flex items-center gap-2 bg-muted/80 hover:bg-muted border border-border/50 rounded-md px-3 py-2 transition-all hover:shadow-sm"
                          >
                            <div className="flex items-center gap-2 flex-1 min-w-0">
                              <span className="text-xs font-semibold text-foreground truncate max-w-[100px]">
                                {jobRequirement.job?.name || 'Unknown Job'}
                              </span>
                              {jobRequirement.ratePerDay != null && (
                                <span className="flex items-center gap-1 text-xs font-bold text-primary whitespace-nowrap">
                                  <span className="text-[10px] text-muted-foreground font-normal">
                                    {isArabic ? 'ريال' : 'SAR'}
                                  </span>
                                  {jobRequirement.ratePerDay}
                                  <span className="text-[10px] text-muted-foreground font-normal">
                                    {isArabic ? '/يوم' : '/day'}
                                  </span>
                                </span>
                              )}
                            </div>
                          </div>
                        ))}
                        {event.jobs.length > 3 && (
                          <div className="flex items-center justify-center bg-muted/40 border border-dashed border-border/50 rounded-md px-3 py-2 text-xs text-muted-foreground font-medium">
                            +{event.jobs.length - 3} {isArabic ? 'المزيد' : 'more'}
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="mt-2 pt-4 border-t border-border/50">
                    <Link href={`/${locale}/events/${event.id}#register`}>
                      <Button size="sm" className="w-full" disabled={event.acceptJobs === false}>
                        {event.acceptJobs === false
                          ? (isArabic ? 'اكتمل العدد' : 'Capacity Full')
                          : (isArabic ? 'التقديم الآن' : 'Apply Now')}
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {events.length === 0 && (
          <Card className="p-12 text-center">
            <div className="space-y-4">
              <Calendar className="h-12 w-12 text-muted-foreground mx-auto" />
              <p className="text-muted-foreground text-lg">
                {isArabic ? 'لا توجد فعاليات متاحة حالياً' : 'No events available at the moment'}
              </p>
            </div>
          </Card>
        )}
      </section>
    </main>
  );
}

