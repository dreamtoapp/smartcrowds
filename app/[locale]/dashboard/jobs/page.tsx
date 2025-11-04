import { listJobs } from '@/app/actions/jobs/actions';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function JobsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const jobs = await listJobs();
  const t = (en: string, ar: string) => (locale === 'ar' ? ar : en);

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{t('Jobs', 'الوظائف')}</h1>
        <Link href={`./jobs/new`}>
          <Button>{t('Create Job', 'إنشاء وظيفة')}</Button>
        </Link>
      </div>
      <div className="space-y-2">
        {jobs.map((job) => (
          <div key={job.id} className="flex items-center justify-between border rounded-md p-3">
            <div>
              <div className="font-medium">{job.name}</div>
              {job.description ? <div className="text-sm text-muted-foreground">{job.description}</div> : null}
            </div>
            <div className="flex gap-2">
              <Link href={`./jobs/${job.id}/edit`}>
                <Button variant="outline" size="sm">{t('Edit', 'تعديل')}</Button>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}


