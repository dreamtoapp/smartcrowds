'use client';

import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { updateJob } from '@/app/actions/jobs/actions';

const schema = z.object({ name: z.string().min(1), description: z.string().optional().default('') });

export function JobForm({ id, name, description }: { id: string; name: string; description: string }) {
  const router = useRouter();
  const locale = useLocale();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<z.input<typeof schema>>({ resolver: zodResolver(schema), defaultValues: { name, description } });

  const onSubmit = async (values: z.input<typeof schema>) => {
    await updateJob(id, values);
    router.push(`/${locale}/dashboard/jobs`);
  };

  return (
    <section className="space-y-4 max-w-xl">
      <h1 className="text-2xl font-bold">Edit Job</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Name</label>
          <Input {...register('name')} />
          {errors.name && <p className="text-sm text-red-600 mt-1">{errors.name.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Description</label>
          <Textarea rows={4} {...register('description')} />
        </div>
        <Button type="submit" disabled={isSubmitting}>{isSubmitting ? 'Saving...' : 'Save'}</Button>
      </form>
    </section>
  );
}




