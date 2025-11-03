import { getCategories } from '@/app/actions/blog/actions';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface CategoriesPageProps {
  params: Promise<{ locale: string }>;
}

export default async function CategoriesPage({ params }: CategoriesPageProps) {
  const { locale } = await params;
  const categories = await getCategories(locale);

  const isArabic = locale === 'ar';

  return (
    <div className="space-y-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">
            {isArabic ? 'إدارة الفئات' : 'Manage Categories'}
          </h1>
          <p className="text-muted-foreground">
            {isArabic
              ? 'إدارة فئات المدونة'
              : 'Manage blog categories'}
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{isArabic ? 'الفئات' : 'Categories'}</CardTitle>
          </CardHeader>
          <CardContent>
            {categories.length === 0 ? (
              <p className="text-center py-8 text-muted-foreground">
                {isArabic
                  ? 'لا توجد فئات بعد'
                  : 'No categories yet'}
              </p>
            ) : (
              <div className="space-y-2">
                {categories.map((category) => (
                  <div
                    key={category.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div>
                      <h3 className="font-semibold">
                        {isArabic && category.nameAr
                          ? category.nameAr
                          : category.name}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        /{category.slug}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
    </div>
  );
}

