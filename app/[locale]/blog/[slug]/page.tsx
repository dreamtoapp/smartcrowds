import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ReadingTime } from '@/components/blog/ReadingTime';
import { getPostBySlug, getPosts } from '@/app/actions/blog/actions';
import { notFound } from 'next/navigation';
import { format } from 'date-fns';
import { Calendar, User } from 'lucide-react';
import Image from 'next/image';
import { calculateReadingTime } from '@/lib/utils/blog';
import type { Metadata } from 'next';
import { Link } from '@/lib/routing';

interface BlogPostPageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  const post = await getPostBySlug(slug, locale);

  if (!post) {
    return {
      title: 'Post Not Found',
    };
  }

  const isArabic = locale === 'ar';
  const title = isArabic && post.titleAr ? post.titleAr : post.title;
  const description =
    isArabic && post.excerptAr
      ? post.excerptAr
      : post.excerpt || post.seoDescription || '';

  return {
    title: post.seoTitle || title,
    description: post.seoDescription || description,
    keywords: post.keywords,
    openGraph: {
      title: post.seoTitle || title,
      description: post.seoDescription || description,
      images: post.featuredImage
        ? [
          {
            url: post.featuredImage,
            width: 1200,
            height: 630,
            alt: title,
          },
        ]
        : [],
      type: 'article',
      publishedTime: post.publishedAt?.toISOString(),
      authors: [post.author.name],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.seoTitle || title,
      description: post.seoDescription || description,
      images: post.featuredImage ? [post.featuredImage] : [],
    },
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { locale, slug } = await params;
  const post = await getPostBySlug(slug, locale);

  if (!post || !post.published) {
    notFound();
  }

  const isArabic = locale === 'ar';
  const title = isArabic && post.titleAr ? post.titleAr : post.title;
  const content = isArabic && post.contentAr ? post.contentAr : post.content;
  const readingTime = post.readingTime || calculateReadingTime(content);

  // Get related posts
  const { posts: relatedPosts } = await getPosts({
    locale,
    published: true,
    limit: 3,
  });

  const related = relatedPosts
    .filter((p: any) => p.id !== post.id)
    .slice(0, 3);

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description: post.excerpt || post.seoDescription,
    image: post.featuredImage ? [post.featuredImage] : [],
    datePublished: post.publishedAt?.toISOString(),
    dateModified: post.updatedAt.toISOString(),
    author: {
      '@type': 'Person',
      name: post.author.name,
    },
    publisher: {
      '@type': 'Organization',
      name: 'SMART CROWD',
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />
      <Header />
      <main className="min-h-screen">
        <article className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto">
            <header className="mb-8">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">{title}</h1>

              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-6">
                <div className="flex items-center gap-1">
                  <User className="h-4 w-4" />
                  <span>{post.author.name}</span>
                </div>
                {post.publishedAt && (
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>{format(new Date(post.publishedAt), 'MMMM d, yyyy')}</span>
                  </div>
                )}
                <ReadingTime minutes={readingTime} locale={locale} />
              </div>

              {post.featuredImage && (
                <div className="relative w-full h-96 mb-8 rounded-lg overflow-hidden">
                  <Image
                    src={post.featuredImage}
                    alt={title}
                    fill
                    className="object-cover"
                    priority
                    sizes="(max-width: 768px) 100vw, 896px"
                  />
                </div>
              )}

              {(post.categories.length > 0 || post.tags.length > 0) && (
                <div className="flex flex-wrap gap-2 mb-6">
                  {post.categories.map((pc: any) => {
                    const category = pc.category;
                    return (
                      <span
                        key={category.id}
                        className="px-3 py-1 bg-accent/10 text-accent rounded-full text-sm"
                      >
                        {isArabic && category.nameAr ? category.nameAr : category.name}
                      </span>
                    );
                  })}
                  {post.tags.map((pt: any) => {
                    const tag = pt.tag;
                    return (
                      <span
                        key={tag.id}
                        className="px-3 py-1 bg-muted text-muted-foreground rounded-full text-sm"
                      >
                        {isArabic && tag.nameAr ? tag.nameAr : tag.name}
                      </span>
                    );
                  })}
                </div>
              )}
            </header>

            <div
              className="prose prose-lg dark:prose-invert max-w-none"
              dangerouslySetInnerHTML={{ __html: content }}
            />

            {related.length > 0 && (
              <section className="mt-16 pt-8 border-t">
                <h2 className="text-2xl font-bold mb-6">
                  {isArabic ? 'مقالات ذات صلة' : 'Related Articles'}
                </h2>
                <div className="grid gap-6 md:grid-cols-3">
                  {related.map((relatedPost: any) => (
                    <div key={relatedPost.id} className="border rounded-lg p-4 hover:shadow-lg transition-shadow">
                      <Link href={`/blog/${relatedPost.slug}`} className="block">
                        <h3 className="font-bold mb-2 line-clamp-2">
                          {isArabic && relatedPost.titleAr
                            ? relatedPost.titleAr
                            : relatedPost.title}
                        </h3>
                        {relatedPost.excerpt && (
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {isArabic && relatedPost.excerptAr
                              ? relatedPost.excerptAr
                              : relatedPost.excerpt}
                          </p>
                        )}
                      </Link>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>
        </article>
      </main>
      <Footer />
    </>
  );
}

