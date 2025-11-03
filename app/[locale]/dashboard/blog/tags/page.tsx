import { getTags } from '@/app/actions/blog/actions';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface TagsPageProps {
  params: Promise<{ locale: string }>;
}

export default async function TagsPage({ params }: TagsPageProps) {
  const { locale } = await params;
  const tags = await getTags();

  const isArabic = locale === 'ar';

  return (
    <div className="space-y-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">
            {isArabic ? 'إدارة الوسوم' : 'Manage Tags'}
          </h1>
          <p className="text-muted-foreground">
            {isArabic
              ? 'إدارة وسوم المدونة'
              : 'Manage blog tags'}
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{isArabic ? 'الوسوم' : 'Tags'}</CardTitle>
          </CardHeader>
          <CardContent>
            {tags.length === 0 ? (
              <p className="text-center py-8 text-muted-foreground">
                {isArabic
                  ? 'لا توجد وسوم بعد'
                  : 'No tags yet'}
              </p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <span
                    key={tag.id}
                    className="px-3 py-1 bg-muted rounded-full text-sm"
                  >
                    {isArabic && tag.nameAr ? tag.nameAr : tag.name}
                  </span>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
    </div>
  );
}

