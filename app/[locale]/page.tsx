import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Hero } from '@/components/sections/Hero';
import { ServicesPreview } from '@/components/sections/ServicesPreview';
import { FeaturedProjects } from '@/components/sections/FeaturedProjects';
import { getProjects } from '@/app/actions/project/actions';

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  // Fetch featured projects from database
  const result = await getProjects({
    locale,
    published: true,
    featured: true,
    page: 1,
    limit: 6,
  });

  const featuredProjects = result?.projects || [];

  return (
    <>
      <Header />
      <main className="flex min-h-screen flex-col">
        <Hero />
        <ServicesPreview />
        <FeaturedProjects projects={featuredProjects} locale={locale} />
      </main>
      <Footer />
    </>
  );
}

