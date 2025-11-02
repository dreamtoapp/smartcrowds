import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { Metadata } from 'next';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return {
    title:
      locale === 'ar'
        ? 'من نحن - SMART'
        : 'About Us - SMART CROWD',
    description:
      locale === 'ar'
        ? 'شركة سمارت الخيار الرائد في مجال إدارة الحشود وتنظيم الفعاليات'
        : 'SMART is one of the leading companies in crowd management and event organization',
  };
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  // Note: useTranslations must be used in client components
  // We'll make this a client component or fetch messages differently
  return (
    <>
      <Header />
      <main className="min-h-screen">
        <section className="container mx-auto px-4 py-24">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold mb-8 text-center">
              {locale === 'ar' ? 'عن سمارت' : 'About SMART'}
            </h1>
            <p className="text-lg text-muted-foreground mb-12 leading-relaxed">
              {locale === 'ar'
                ? 'شركة سمارت الخيار الرائد في مجال إدارة الحشود وتنظيم الفعاليات في المملكة العربية السعودية. تتمتع الشركة بخبرة واسعة في تقديم حلول شاملة لتنظيم الفعاليات الكبيرة والمعقدة، بما في ذلك نشر فرق متخصصة لتنظيم حركة المرور والحفاظ على النظام والسلامة في الأحداث الكبرى.'
                : 'SMART is one of the leading companies in the field of crowd management and event organization in the Kingdom of Saudi Arabia. The company enjoys extensive experience in providing comprehensive solutions for organizing large-scale and complex events, including the deployment of specialized teams to manage traffic flow and maintain order at major events.'}
            </p>

            <div className="grid md:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle>
                    {locale === 'ar' ? 'رؤيتنا' : 'Our Vision'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    {locale === 'ar'
                      ? 'أن نكون الشركة الرائدة في المملكة العربية السعودية في مجال إدارة وتنظيم الحشود، من خلال تقديم حلول مبتكرة وآمنة تساهم في نجاح الفعاليات الكبرى وتعزز تجربة الجمهور.'
                      : 'To be the leading company in the Kingdom of Saudi Arabia in the field of crowd management and event organization, offering innovative and safe solutions that contribute to the success of major events and enhance audience experience.'}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>
                    {locale === 'ar' ? 'رسالتنا' : 'Our Mission'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    {locale === 'ar'
                      ? 'تتمثل رسالتنا في تقديم خدمات احترافية في إدارة الحشود باستخدام أحدث التقنيات وأنظمة امنية المتقدمة، لضمان سلامة الزوار والمشاركين، وتمكين التنسيق الأمثل بين الفرق المختلفة في كافة الفعاليات.'
                      : 'Our mission is to deliver professional services in crowd management using the latest technologies and advanced security systems to ensure the safety of visitors and participants, and to enable optimal coordination between teams across all events.'}
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

