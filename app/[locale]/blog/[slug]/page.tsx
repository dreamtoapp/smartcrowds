import { BlogPostContent } from '../components/BlogPostContent';
import { generateBlogPostMetadata } from '../helpers/metadata';
import type { Metadata } from 'next';

interface BlogPostPageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  return generateBlogPostMetadata(locale, slug);
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { locale, slug } = await params;

  return <BlogPostContent locale={locale} slug={slug} />;
}
