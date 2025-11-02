import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Hero } from '@/components/sections/Hero';
import { ServicesPreview } from '@/components/sections/ServicesPreview';
import { FeaturedProjects } from '@/components/sections/FeaturedProjects';

export default function HomePage() {
  return (
    <>
      <Header />
      <main className="flex min-h-screen flex-col">
        <Hero />
        <ServicesPreview />
        <FeaturedProjects />
      </main>
      <Footer />
    </>
  );
}

