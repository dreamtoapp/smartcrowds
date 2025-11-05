import { JobForm } from '@/components/dashboard/jobs/JobForm';
import { getJob } from '../actions/actions';

interface EditJobContentProps {
  jobId: string;
  locale: string;
}

export async function EditJobContent({ jobId, locale }: EditJobContentProps) {
  const job = await getJob(jobId);
  if (!job) return <p className="text-muted-foreground">Not found</p>;
  return (
    <>
      <h1 className="text-2xl font-bold mb-4">{locale === 'ar' ? 'تعديل وظيفة' : 'Edit Job'}</h1>
      <JobForm id={job.id} name={job.name} description={job.description || ''} />
    </>
  );
}

