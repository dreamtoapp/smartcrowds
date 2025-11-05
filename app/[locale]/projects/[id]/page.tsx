import { ProjectDetailContent } from '../components/ProjectDetailContent';
import { generateProjectDetailMetadata } from '../helpers/metadata';
import type { Metadata } from 'next';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}): Promise<Metadata> {
  const { locale, id } = await params;
  return generateProjectDetailMetadata(locale, id);
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;

  return <ProjectDetailContent locale={locale} id={id} />;
}
