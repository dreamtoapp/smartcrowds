import { useLocale } from 'next-intl';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  FolderKanban, 
  Briefcase, 
  Users, 
  TrendingUp 
} from 'lucide-react';

export default async function DashboardPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  const stats = [
    {
      title: locale === 'ar' ? 'إجمالي المشاريع' : 'Total Projects',
      value: '12',
      icon: FolderKanban,
      change: '+3',
    },
    {
      title: locale === 'ar' ? 'الخدمات النشطة' : 'Active Services',
      value: '6',
      icon: Briefcase,
      change: '+0',
    },
    {
      title: locale === 'ar' ? 'العملاء' : 'Clients',
      value: '25',
      icon: Users,
      change: '+5',
    },
    {
      title: locale === 'ar' ? 'نمو الإيرادات' : 'Revenue Growth',
      value: '15%',
      icon: TrendingUp,
      change: '+5%',
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">
          {locale === 'ar' ? 'لوحة التحكم' : 'Dashboard'}
        </h1>
        <p className="text-muted-foreground">
          {locale === 'ar'
            ? 'نظرة عامة على أداء الشركة'
            : 'Overview of company performance'}
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-green-600">{stat.change}</span>{' '}
                  {locale === 'ar' ? 'من الشهر الماضي' : 'from last month'}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>
              {locale === 'ar' ? 'المشاريع الأخيرة' : 'Recent Projects'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              {locale === 'ar'
                ? 'لا توجد مشاريع حديثة'
                : 'No recent projects'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>
              {locale === 'ar' ? 'النشاط الأخير' : 'Recent Activity'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              {locale === 'ar'
                ? 'لا يوجد نشاط حديث'
                : 'No recent activity'}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}



