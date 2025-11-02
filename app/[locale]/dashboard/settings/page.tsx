import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default async function SettingsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">
          {locale === 'ar' ? 'الإعدادات' : 'Settings'}
        </h1>
        <p className="text-muted-foreground">
          {locale === 'ar'
            ? 'إعدادات النظام والحساب'
            : 'System and account settings'}
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>
            {locale === 'ar' ? 'إعدادات الموقع' : 'Site Settings'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="siteName">
              {locale === 'ar' ? 'اسم الموقع' : 'Site Name'}
            </Label>
            <Input id="siteName" defaultValue="SMART CROWD" />
          </div>
          <div>
            <Label htmlFor="email">
              {locale === 'ar' ? 'البريد الإلكتروني' : 'Email'}
            </Label>
            <Input id="email" defaultValue="info@hthkia.com" />
          </div>
          <div>
            <Label htmlFor="phone">
              {locale === 'ar' ? 'الهاتف' : 'Phone'}
            </Label>
            <Input id="phone" defaultValue="0580112052" />
          </div>
          <Button>
            {locale === 'ar' ? 'حفظ التغييرات' : 'Save Changes'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}



