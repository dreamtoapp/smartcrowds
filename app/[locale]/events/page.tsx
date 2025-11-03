import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import type { Metadata } from 'next';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isArabic = locale === 'ar';

  return {
    title: isArabic ? 'الفعاليات - SMART' : 'Events - SMART',
    description: isArabic
      ? 'تعرف على فعالياتنا وأنشطتنا القادمة'
      : 'Explore our upcoming events and activities',
    openGraph: {
      title: isArabic ? 'الفعاليات - SMART' : 'Events - SMART',
      description: isArabic
        ? 'فعاليات وأنشطة شركة سمارت'
        : 'SMART company events and activities',
    },
  };
}

export default async function EventsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  return (
    <>
      <Header />
      <main className="min-h-screen">
        <section className="container mx-auto px-4 py-24">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              {locale === 'ar' ? 'الفعاليات' : 'Events'}
            </h1>
            <p className="text-muted-foreground">
              {locale === 'ar'
                ? 'قريباً: فعاليات وأنشطة جديدة'
                : 'Coming soon: new events and activities'}
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}


