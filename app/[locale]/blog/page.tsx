import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { PostCard } from '@/components/blog/PostCard';
import { BlogPagination } from '@/components/blog/BlogPagination';
import { getPosts } from '@/app/actions/blog/actions';
import type { Metadata } from 'next';
import { Suspense } from 'react';

type PostWithAuthor = {
  id: string;
  title: string;
  titleAr?: string | null;
  slug: string;
  excerpt?: string | null;
  excerptAr?: string | null;
  featuredImage?: string | null;
  publishedAt?: Date | null;
  author: {
    name: string;
  };
  readingTime?: number | null;
  locale: string;
};

interface BlogPageProps {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ page?: string; category?: string; tag?: string }>;
}

export async function generateMetadata({
  params,
}: BlogPageProps): Promise<Metadata> {
  const { locale } = await params;
  const isArabic = locale === 'ar';

  return {
    title: isArabic ? 'المدونة - SMART CROWD' : 'Blog - SMART CROWD',
    description: isArabic
      ? 'اكتشف مقالاتنا حول إدارة الحشود وتنظيم الفعاليات'
      : 'Discover our articles about crowd management and event organization',
    openGraph: {
      title: isArabic ? 'المدونة - SMART CROWD' : 'Blog - SMART CROWD',
      description: isArabic
        ? 'اكتشف مقالاتنا حول إدارة الحشود وتنظيم الفعاليات'
        : 'Discover our articles about crowd management and event organization',
    },
  };
}

async function BlogContent({
  locale,
  page,
  category,
  tag,
}: {
  locale: string;
  page: number;
  category?: string;
  tag?: string;
}) {
  const { posts, pagination } = await getPosts({
    locale,
    published: true,
    category,
    tag,
    page,
    limit: 12,
  });

  if (posts.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-muted-foreground text-lg">
          {locale === 'ar' ? 'لا توجد مقالات متاحة' : 'No posts available'}
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {posts.map((post: PostWithAuthor) => (
          <PostCard key={post.id} post={post} locale={locale} />
        ))}
      </div>
      {pagination.totalPages > 1 && (
        <BlogPagination
          currentPage={pagination.page}
          totalPages={pagination.totalPages}
          locale={locale}
        />
      )}
    </>
  );
}

export default async function BlogPage({ params, searchParams }: BlogPageProps) {
  const { locale } = await params;
  const { page = '1', category, tag } = await searchParams;
  const currentPage = parseInt(page, 10) || 1;

  const isArabic = locale === 'ar';

  return (
    <>
      <Header />
      <main className="min-h-screen">
        <section className="container mx-auto px-4 py-16">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                {isArabic ? 'المدونة' : 'Blog'}
              </h1>
              <p className="text-xl text-muted-foreground">
                {isArabic
                  ? 'اكتشف مقالاتنا حول إدارة الحشود وتنظيم الفعاليات'
                  : 'Discover our articles about crowd management and event organization'}
              </p>
            </div>

            <Suspense
              fallback={
                <div className="text-center py-16">
                  <p className="text-muted-foreground">
                    {isArabic ? 'جاري التحميل...' : 'Loading...'}
                  </p>
                </div>
              }
            >
              <BlogContent
                locale={locale}
                page={currentPage}
                category={category}
                tag={tag}
              />
            </Suspense>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

