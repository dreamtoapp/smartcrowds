import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getProjectBySlug } from '@/app/actions/project/actions';
import { ImageGallery } from '@/components/projects/ImageGallery';
import Image from 'next/image';
import { format } from 'date-fns';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}): Promise<Metadata> {
  const { locale, id } = await params;
  const project = await getProjectBySlug(id, locale);

  if (!project) {
    return {
      title: 'Project Not Found',
    };
  }

  const name = locale === 'ar' && project.nameAr ? project.nameAr : project.name;
  return {
    title: `${name} - SMART`,
    description:
      project.seoDescription ||
      (locale === 'ar' && project.descriptionAr
        ? project.descriptionAr
        : project.description || ''),
  };
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  const project = await getProjectBySlug(id, locale);

  if (!project || !project.published) {
    notFound();
  }

  const isArabic = locale === 'ar';
  const name = isArabic && project.nameAr ? project.nameAr : project.name;
  const description =
    isArabic && project.descriptionAr
      ? project.descriptionAr
      : project.description || project.descriptionAr || '';

  return (
    <>
      <Header />
      <main className="min-h-screen">
        <section className="container mx-auto px-4 py-24">
          <div className="max-w-6xl mx-auto">
            <div className="mb-8">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">{name}</h1>
              
              {/* Project Dates */}
              {(project.startDate || project.endDate) && (
                <div className="flex flex-wrap gap-4 text-muted-foreground mb-6">
                  {project.startDate && (
                    <div>
                      <span className="font-medium">
                        {isArabic ? 'تاريخ البداية:' : 'Start Date:'}{' '}
                      </span>
                      {format(new Date(project.startDate), 'MMMM d, yyyy')}
                    </div>
                  )}
                  {project.endDate && (
                    <div>
                      <span className="font-medium">
                        {isArabic ? 'تاريخ النهاية:' : 'End Date:'}{' '}
                      </span>
                      {format(new Date(project.endDate), 'MMMM d, yyyy')}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Featured Image */}
            {project.featuredImage && (
              <div className="relative w-full h-96 mb-8 rounded-lg overflow-hidden bg-muted">
                <Image
                  src={project.featuredImage}
                  alt={name}
                  fill
                  className="object-cover"
                  sizes="100vw"
                  priority
                />
              </div>
            )}

            {/* Project Description */}
            {description && (
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle>
                    {isArabic ? 'تفاصيل المشروع' : 'Project Details'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-lg text-muted-foreground leading-relaxed whitespace-pre-wrap">
                    {description}
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Image Gallery */}
            {project.images && project.images.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>
                    {isArabic ? 'معرض الصور' : 'Image Gallery'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ImageGallery images={project.images} locale={locale} />
                </CardContent>
              </Card>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}



