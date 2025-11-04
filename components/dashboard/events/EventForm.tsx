'use client';

import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { eventBasicSchema } from '@/lib/validations/event';
import { useTransition } from 'react';
import { createEvent } from '@/app/actions/events/actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import AddImage from '@/components/AddImage';

type FormValues = z.input<typeof eventBasicSchema>;

export default function EventForm({ locations }: { locations: { id: string; city: string; address?: string | null }[] }) {
  const [isPending, startTransition] = useTransition();

  const form = useForm<FormValues>({
    resolver: zodResolver(eventBasicSchema),
    defaultValues: {
      title: '',
      date: '',
      locationId: '',
      description: '',
      imageUrl: '',
    },
  });

  const onSubmit = (values: FormValues) => {
    startTransition(async () => {
      await createEvent(values);
      window.location.href = `./events`;
    });
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = form;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Title</label>
        <Input {...register('title')} placeholder="Event title" />
        {errors.title && <p className="text-sm text-red-600 mt-1">{errors.title.message}</p>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Date</label>
          <Input {...register('date')} placeholder="2025-01-01" />
          {errors.date && <p className="text-sm text-red-600 mt-1">{errors.date.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Location</label>
          <select className="w-full border rounded-md h-10 px-3 text-sm" {...register('locationId')} defaultValue="">
            <option value="" disabled>Select location</option>
            {locations.map((loc) => (
              <option key={loc.id} value={loc.id}>{loc.city}{loc.address ? ` - ${loc.address}` : ''}</option>
            ))}
          </select>
          {errors.locationId && <p className="text-sm text-red-600 mt-1">{errors.locationId.message}</p>}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Image</label>
        <AddImage
          table="events"
          uploadOnly
          value={form.watch('imageUrl')}
          onChange={(url) => form.setValue('imageUrl', url, { shouldValidate: true, shouldDirty: true })}
          className="mt-2"
        />
        {errors.imageUrl && <p className="text-sm text-red-600 mt-2">{errors.imageUrl.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Description</label>
        <Textarea {...register('description')} placeholder="Event description" rows={5} />
        {errors.description && <p className="text-sm text-red-600 mt-1">{errors.description.message}</p>}
      </div>

      <Button type="submit" disabled={isPending}>
        {isPending ? 'Saving...' : 'Create Event'}
      </Button>
    </form>
  );
}


