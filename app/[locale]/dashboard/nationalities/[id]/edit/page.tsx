import { getNationality, updateNationality } from '@/app/actions/nationalities/actions';
import { NationalityForm } from '@/components/dashboard/nationalities/NationalityForm';

export default async function EditNationalityPage({ params }: { params: Promise<{ locale: string; id: string }> }) {
  const { id, locale } = await params;
  const nationality = await getNationality(id);
  if (!nationality) return <p className="text-muted-foreground">{locale === 'ar' ? 'غير موجود' : 'Not found'}</p>;
  return (
    <>
      <h1 className="text-2xl font-bold mb-4">{locale === 'ar' ? 'تعديل جنسية' : 'Edit Nationality'}</h1>
      <NationalityForm
        id={nationality.id}
        nameAr={nationality.nameAr}
        nameEn={nationality.nameEn}
        locale={locale}
      />
    </>
  );
}

