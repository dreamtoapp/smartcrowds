import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus } from 'lucide-react';

export default async function ServicesManagementPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">
            {locale === 'ar' ? 'إدارة الخدمات' : 'Services Management'}
          </h1>
          <p className="text-muted-foreground">
            {locale === 'ar'
              ? 'إدارة وتحرير الخدمات'
              : 'Manage and edit services'}
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          {locale === 'ar' ? 'إضافة خدمة' : 'Add Service'}
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>
              {locale === 'ar' ? 'تنظيم حركة المرور' : 'Traffic Control'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                {locale === 'ar' ? 'تحرير' : 'Edit'}
              </Button>
              <Button variant="destructive" size="sm">
                {locale === 'ar' ? 'حذف' : 'Delete'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}



