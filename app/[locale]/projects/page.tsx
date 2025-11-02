import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from '@/lib/routing';
import { ArrowRight } from 'lucide-react';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return {
    title:
      locale === 'ar' ? 'المشاريع - SMART' : 'Projects - SMART',
    description:
      locale === 'ar'
        ? 'مشاريعنا الناجحة في إدارة الحشود وتنظيم الفعاليات'
        : 'Our successful crowd management and event organization projects',
  };
}

const projects = [
  {
    id: 'riyadh-lights-wadi-hanifah',
    nameEn: 'Riyadh Lights – Wadi Hanifah 2024',
    nameAr: 'نور الرياض وادي حنيفة 2024',
  },
  {
    id: 'riyadh-lights-historical',
    nameEn: 'Noor Riyadh Historical Sites 2024',
    nameAr: 'نور الرياض هيستوريكل 2024',
  },
  {
    id: 'riyadh-lights-jax',
    nameEn: 'Noor Riyadh – JAX District, Diriyah 2024',
    nameAr: 'نور الرياض جاكس الدرعية 2024',
  },
  {
    id: 'city-hub-taif',
    nameEn: 'City Hub Taif 2025',
    nameAr: 'سيتي هب الطائف 2025',
  },
  {
    id: 'middle-beast',
    nameEn: 'Middle Beast',
    nameAr: 'الميدل بيست',
  },
  {
    id: 'diriyah-alula-match',
    nameEn: 'Diriyah - AlUla Match',
    nameAr: 'مباراة الدرعية - العلا',
  },
];

export default async function ProjectsPage({
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
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              {locale === 'ar' ? 'المشاريع' : 'Our Projects'}
            </h1>
            <p className="text-xl text-muted-foreground">
              {locale === 'ar'
                ? 'مشاريعنا الناجحة في إدارة الحشود وتنظيم الفعاليات'
                : 'Our successful crowd management and event organization projects'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <Card key={project.id} className="h-full hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle>
                    {locale === 'ar' ? project.nameAr : project.nameEn}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    {locale === 'ar'
                      ? 'مشروع ناجح في إدارة الحشود وتنظيم الفعاليات'
                      : 'Successful crowd management and event organization project'}
                  </p>
                  <Button asChild variant="ghost">
                    <Link href={`/projects/${project.id}`}>
                      {locale === 'ar' ? 'اعرف المزيد' : 'Learn More'}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

