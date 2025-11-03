import { MetadataRoute } from 'next';
import { routing } from '@/lib/routing';
import { getPosts } from '@/app/actions/blog/actions';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://hthkia.com';
  
  const routes = [
    '',
    '/about',
    '/services',
    '/projects',
    '/blog',
    '/contact',
    '/dashboard',
  ];

  const sitemapEntries: MetadataRoute.Sitemap = [];

  routing.locales.forEach((locale) => {
    routes.forEach((route) => {
      sitemapEntries.push({
        url: `${baseUrl}/${locale}${route}`,
        lastModified: new Date(),
        changeFrequency: route === '' ? 'daily' : route === '/blog' ? 'daily' : 'weekly',
        priority: route === '' ? 1 : route === '/blog' ? 0.9 : 0.8,
        alternates: {
          languages: {
            ar: `${baseUrl}/ar${route}`,
            en: `${baseUrl}/en${route}`,
          },
        },
      });
    });
  });

  // Add blog posts to sitemap
  for (const locale of routing.locales) {
    const { posts } = await getPosts({
      locale,
      published: true,
      limit: 1000,
    });

    posts.forEach((post) => {
      sitemapEntries.push({
        url: `${baseUrl}/${locale}/blog/${post.slug}`,
        lastModified: post.updatedAt,
        changeFrequency: 'weekly',
        priority: 0.7,
        alternates: {
          languages: {
            ar: `${baseUrl}/ar/blog/${post.slug}`,
            en: `${baseUrl}/en/blog/${post.slug}`,
          },
        },
      });
    });
  }

  return sitemapEntries;
}



