import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default async function AnalyticsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">
          {locale === 'ar' ? 'التحليلات' : 'Analytics'}
        </h1>
        <p className="text-muted-foreground">
          {locale === 'ar'
            ? 'إحصائيات وأداء الموقع'
            : 'Website statistics and performance'}
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>
              {locale === 'ar' ? 'زيارات الموقع' : 'Website Visits'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">1,234</p>
            <p className="text-sm text-muted-foreground">
              {locale === 'ar' ? 'هذا الشهر' : 'This month'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>
              {locale === 'ar' ? 'معدل التحويل' : 'Conversion Rate'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">3.2%</p>
            <p className="text-sm text-muted-foreground">
              {locale === 'ar' ? 'زيادة 0.5%' : '+0.5% increase'}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}



