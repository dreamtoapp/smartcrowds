import { listLocations } from '@/app/actions/locations/actions';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function LocationsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const locations = await listLocations();
  const t = (en: string, ar: string) => (locale === 'ar' ? ar : en);

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{t('Locations', 'المواقع')}</h1>
        <Link href={`./locations/new`}>
          <Button>{t('Create Location', 'إنشاء موقع')}</Button>
        </Link>
      </div>
      <div className="space-y-2">
        {locations.map((loc) => (
          <div key={loc.id} className="flex items-center justify-between border rounded-md p-3">
            <div>
              <div className="font-medium">{loc.city}</div>
              {loc.address ? <div className="text-sm text-muted-foreground">{loc.address}</div> : null}
            </div>
            <div className="flex gap-2">
              <Link href={`./locations/${loc.id}/edit`}>
                <Button variant="outline" size="sm">{t('Edit', 'تعديل')}</Button>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}


