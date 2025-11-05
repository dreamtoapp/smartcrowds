'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AddImage from '@/components/AddImage';
import { updateEvent } from '@/app/actions/events/actions';
import { useRouter } from '@/lib/routing';

interface EditEventFormProps {
  event: any;
  locations: Array<{ id: string; city: string }>;
  locale: string;
}

export function EditEventForm({ event, locations, locale }: EditEventFormProps) {
  const router = useRouter();
  const isArabic = locale === 'ar';
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    title: event.title || '',
    description: event.description || '',
    date: new Date(event.date).toISOString().split('T')[0],
    imageUrl: event.imageUrl || '',
    locationId: event.locationId || '',
    acceptJobs: Boolean(event.acceptJobs),
    published: Boolean(event.published),
  });

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const result = await updateEvent(event.id, form);
    setSaving(false);
    if (result?.success) {
      router.push('/dashboard/events');
    } else if (result?.error) {
      alert(result.error);
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-6 max-w-3xl">
      <Card>
        <CardHeader>
          <CardTitle>{isArabic ? 'تعديل الفعالية' : 'Edit Event'}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="title">{isArabic ? 'العنوان' : 'Title'}</Label>
            <Input
              id="title"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              required
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="description">{isArabic ? 'الوصف' : 'Description'}</Label>
            <Textarea
              id="description"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={5}
              required
              className="mt-1"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="date">{isArabic ? 'التاريخ' : 'Date'}</Label>
              <Input
                id="date"
                type="date"
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
                required
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="location">{isArabic ? 'الموقع' : 'Location'}</Label>
              <select
                id="location"
                value={form.locationId}
                onChange={(e) => setForm({ ...form, locationId: e.target.value })}
                className="mt-1 block w-full h-10 rounded-md border border-input bg-background px-3 text-sm"
              >
                <option value="">{isArabic ? 'اختر موقعاً' : 'Select location'}</option>
                {locations.map((l) => (
                  <option key={l.id} value={l.id}>
                    {l.city}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <Label>{isArabic ? 'الصورة' : 'Image'}</Label>
            <AddImage
              value={form.imageUrl}
              onChange={(url) => setForm({ ...form, imageUrl: url })}
              uploadOnly={true}
              table="events"
              tableField="imageUrl"
              folder="events"
              autoUpload={true}
              className="w-full"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <input
                id="acceptJobs"
                type="checkbox"
                checked={form.acceptJobs}
                onChange={(e) => setForm({ ...form, acceptJobs: e.target.checked })}
                className="h-4 w-4"
              />
              <Label htmlFor="acceptJobs" className="cursor-pointer">
                {isArabic ? 'السماح بقبول الوظائف' : 'Accept Jobs'}
              </Label>
            </div>
            <div className="flex items-center gap-2">
              <input
                id="published"
                type="checkbox"
                checked={form.published}
                onChange={(e) => setForm({ ...form, published: e.target.checked })}
                className="h-4 w-4"
              />
              <Label htmlFor="published" className="cursor-pointer">
                {isArabic ? 'منشور' : 'Published'}
              </Label>
            </div>
          </div>

          <div className="flex justify-end">
            <Button type="submit" disabled={saving}>
              {saving ? (isArabic ? 'جاري الحفظ...' : 'Saving...') : (isArabic ? 'حفظ' : 'Save')}
            </Button>
          </div>
        </CardContent>
      </Card>
    </form>
  );
}



