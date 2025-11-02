import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

const projects: Record<
  string,
  {
    nameEn: string;
    nameAr: string;
    descEn: string;
    descAr: string;
  }
> = {
  'riyadh-lights-wadi-hanifah': {
    nameEn: 'Riyadh Lights – Wadi Hanifah 2024',
    nameAr: 'نور الرياض وادي حنيفة 2024',
    descEn:
      'Comprehensive crowd management and traffic control solutions for the Riyadh Lights festival at Wadi Hanifah.',
    descAr:
      'حلول شاملة في إدارة الحشود وضبط حركة المرور لمهرجان نور الرياض في وادي حنيفة.',
  },
  'riyadh-lights-historical': {
    nameEn: 'Noor Riyadh Historical Sites 2024',
    nameAr: 'نور الرياض هيستوريكل 2024',
    descEn:
      'Event organization and crowd management at historical sites during Noor Riyadh festival.',
    descAr:
      'تنظيم الفعاليات وإدارة الحشود في المواقع التاريخية خلال مهرجان نور الرياض.',
  },
  'riyadh-lights-jax': {
    nameEn: 'Noor Riyadh – JAX District, Diriyah 2024',
    nameAr: 'نور الرياض جاكس الدرعية 2024',
    descEn:
      'Crowd management services for the JAX District event during Noor Riyadh festival.',
    descAr: 'خدمات إدارة الحشود لفعالية منطقة جاكس خلال مهرجان نور الرياض.',
  },
  'city-hub-taif': {
    nameEn: 'City Hub Taif 2025',
    nameAr: 'سيتي هب الطائف 2025',
    descEn:
      'Complete event management and crowd control for City Hub Taif festival.',
    descAr: 'إدارة كاملة للفعالية وضبط الحشود لمهرجان سيتي هب الطائف.',
  },
  'middle-beast': {
    nameEn: 'Middle Beast',
    nameAr: 'الميدل بيست',
    descEn:
      'Professional crowd management and security services for the Middle Beast event.',
    descAr:
      'خدمات احترافية في إدارة الحشود والأمن لفعالية الميدل بيست.',
  },
  'diriyah-alula-match': {
    nameEn: 'Diriyah - AlUla Match',
    nameAr: 'مباراة الدرعية - العلا',
    descEn:
      'Fan management, safety, and logistics coordination for the Diriyah-AlUla match.',
    descAr:
      'إدارة الجماهير والسلامة والتنسيق اللوجستي لمباراة الدرعية والعلا.',
  },
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}): Promise<Metadata> {
  const { locale, id } = await params;
  const project = projects[id];

  if (!project) {
    return {
      title: 'Project Not Found',
    };
  }

  const name = locale === 'ar' ? project.nameAr : project.nameEn;
  return {
    title: `${name} - SMART`,
    description:
      locale === 'ar' ? project.descAr : project.descEn,
  };
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  const project = projects[id];

  if (!project) {
    notFound();
  }

  return (
    <>
      <Header />
      <main className="min-h-screen">
        <section className="container mx-auto px-4 py-24">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold mb-8">
              {locale === 'ar' ? project.nameAr : project.nameEn}
            </h1>
            <Card>
              <CardHeader>
                <CardTitle>
                  {locale === 'ar' ? 'تفاصيل المشروع' : 'Project Details'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  {locale === 'ar' ? project.descAr : project.descEn}
                </p>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}



