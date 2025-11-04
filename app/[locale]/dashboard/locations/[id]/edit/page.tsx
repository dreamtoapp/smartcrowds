import { getLocation, updateLocation } from '@/app/actions/locations/actions';
import { LocationForm } from '@/components/dashboard/locations/LocationForm';

export default async function EditLocationPage({ params }: { params: Promise<{ locale: string; id: string }> }) {
  const { id, locale } = await params;
  const loc = await getLocation(id);
  if (!loc) return <p className="text-muted-foreground">Not found</p>;
  return (
    <>
      <h1 className="text-2xl font-bold mb-4">{locale === 'ar' ? 'تعديل موقع' : 'Edit Location'}</h1>
      <LocationForm
        id={loc.id}
        city={loc.city}
        address={loc.address || ''}
        locale={locale}
      />
    </>
  );
}


