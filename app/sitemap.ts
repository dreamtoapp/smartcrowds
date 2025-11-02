import { MetadataRoute } from 'next';
import { routing } from '@/lib/routing';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://hthkia.com';
  
  const routes = [
    '',
    '/about',
    '/services',
    '/projects',
    '/contact',
    '/dashboard',
  ];

  const sitemapEntries: MetadataRoute.Sitemap = [];

  routing.locales.forEach((locale) => {
    routes.forEach((route) => {
      sitemapEntries.push({
        url: `${baseUrl}/${locale}${route}`,
        lastModified: new Date(),
        changeFrequency: route === '' ? 'daily' : 'weekly',
        priority: route === '' ? 1 : 0.8,
        alternates: {
          languages: {
            ar: `${baseUrl}/ar${route}`,
            en: `${baseUrl}/en${route}`,
          },
        },
      });
    });
  });

  return sitemapEntries;
}



