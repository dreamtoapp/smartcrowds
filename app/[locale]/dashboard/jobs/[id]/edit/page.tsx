import { getJob } from '@/app/actions/jobs/actions';
import { JobForm } from '@/components/dashboard/jobs/JobForm';

export default async function EditJobPage({ params }: { params: Promise<{ locale: string; id: string }> }) {
  const { id, locale } = await params;
  const job = await getJob(id);
  if (!job) return <p className="text-muted-foreground">Not found</p>;
  return (
    <>
      <h1 className="text-2xl font-bold mb-4">{locale === 'ar' ? 'تعديل وظيفة' : 'Edit Job'}</h1>
      <JobForm id={job.id} name={job.name} description={job.description || ''} />
    </>
  );
}

