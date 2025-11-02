import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Car,
  Users,
  Shield,
  ClipboardCheck,
  TrendingUp,
  UserCheck,
} from 'lucide-react';
import type { Metadata } from 'next';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isArabic = locale === 'ar';
  
  return {
    title: isArabic ? 'خدماتنا - SMART' : 'Services - SMART',
    description: isArabic
      ? 'خدمات شاملة في إدارة الحشود وتنظيم الفعاليات في المملكة العربية السعودية'
      : 'Comprehensive crowd management and event organization services in Saudi Arabia',
    openGraph: {
      title: isArabic ? 'خدماتنا - SMART' : 'Services - SMART',
      description: isArabic
        ? 'خدمات شاملة في إدارة الحشود'
        : 'Comprehensive crowd management services',
    },
  };
}

const services = [
  {
    id: 'trafficControl',
    icon: Car,
    titleEn: 'Traffic Control',
    titleAr: 'تنظيم حركة المرور',
    descEn:
      'Managing and organizing traffic within and around event areas using modern technologies to ensure smooth movement.',
    descAr:
      'إدارة وتنظيم حركة المرور داخل الفعاليات والمناطق المحيطة بها باستخدام تقنيات حديثة لضمان انسيابية الحركة.',
  },
  {
    id: 'guidance',
    icon: Users,
    titleEn: 'Guidance & Orientation',
    titleAr: 'التوجيه والإرشاد',
    descEn:
      'We ensure visitors are guided smoothly within events and exhibitions to prevent confusion, while offering assistance when needed.',
    descAr:
      'نحرص على إرشاد وتوجيه الزوار داخل الفعاليات والمعارض، لضمان تنقلهم بسهولة ودون تشتت، مع توفير المساعدة اللازمة عند الحاجة.',
  },
  {
    id: 'security',
    icon: Shield,
    titleEn: 'Security & Safety',
    titleAr: 'أمن وسلامة',
    descEn:
      'Providing highly trained security teams, applying preventive measures to ensure audience safety and overall security.',
    descAr:
      'توفير فرق أمنية مدربة على أعلى مستوى، مع تطبيق اجراءات احترازية لحماية الجمهور وضمان الأمان.',
  },
  {
    id: 'strategicPlanning',
    icon: ClipboardCheck,
    titleEn: 'Strategic Planning',
    titleAr: 'التخطيط الاستراتيجي',
    descEn:
      'Developing detailed traffic and security plans for large and complex projects based on comprehensive studies and in-depth analysis.',
    descAr:
      'وضع خطط مرورية وأمنية دقيقة للمشاريع الكبيرة والمعقدة بناءً على دراسة شاملة وتحليل متعمق.',
  },
  {
    id: 'crowdManagement',
    icon: TrendingUp,
    titleEn: 'Crowd Management',
    titleAr: 'إدارة الحشود',
    descEn:
      'Designing and implementing effective organization strategies to ensure smooth event flow.',
    descAr:
      'تصميم وتنفيذ استراتيجيات تنظيم فعّالة لضمان سير الفعاليات بسلاسة.',
  },
  {
    id: 'personalProtection',
    icon: UserCheck,
    titleEn: 'Personal Protection',
    titleAr: 'الحماية الشخصية',
    descEn:
      'Providing personal protection services for VIPs and officials during events and occasions.',
    descAr:
      'توفير خدمات الحماية الشخصية لكبار الشخصيات والمسؤولين ضمن الفعاليات والمناسبات.',
  },
];

export default async function ServicesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  return (
    <>
      <Header />
      <main className="min-h-screen">
        <section className="container mx-auto px-4 py-24">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              {locale === 'ar' ? 'خدماتنا' : 'Our Services'}
            </h1>
            <p className="text-xl text-muted-foreground">
              {locale === 'ar'
                ? 'حلول شاملة لتنظيم الفعاليات'
                : 'Comprehensive solutions for event organization'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service) => {
              const Icon = service.icon;
              return (
                <Card key={service.id} className="h-full">
                  <CardHeader>
                    <div className="mb-4">
                      <Icon className="h-10 w-10 text-primary" />
                    </div>
                    <CardTitle>
                      {locale === 'ar' ? service.titleAr : service.titleEn}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      {locale === 'ar' ? service.descAr : service.descEn}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
