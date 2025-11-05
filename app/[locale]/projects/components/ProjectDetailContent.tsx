import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { notFound } from 'next/navigation';
import { getProjectBySlug } from '../actions/actions';
import { ImageGallery } from '@/components/projects/ImageGallery';
import Image from 'next/image';

interface ProjectDetailContentProps {
  locale: string;
  id: string;
}

export async function ProjectDetailContent({ locale, id }: ProjectDetailContentProps) {
  const project = await getProjectBySlug(id, locale);

  if (!project) {
    notFound();
  }

  const isArabic = locale === 'ar';
  const name = isArabic && project.nameAr ? project.nameAr : project.name;
  const description =
    isArabic && project.descriptionAr
      ? project.descriptionAr
      : project.description || project.descriptionAr || '';

  return (
    <main className="min-h-screen">
      <section className="container mx-auto px-4 py-24">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">{name}</h1>
            {/* Removed start/end dates section per request */}
          </div>

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
  );
}

