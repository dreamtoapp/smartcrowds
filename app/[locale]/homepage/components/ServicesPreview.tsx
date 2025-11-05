'use client';

import { useTranslations, useLocale } from 'next-intl';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from '@/lib/routing';
import { motion } from 'framer-motion';
import {
  Car,
  Users,
  Shield,
  ClipboardCheck,
  TrendingUp,
  UserCheck,
} from 'lucide-react';

const serviceIcons = {
  trafficControl: Car,
  guidance: Users,
  security: Shield,
  strategicPlanning: ClipboardCheck,
  crowdManagement: TrendingUp,
  personalProtection: UserCheck,
};

export function ServicesPreview() {
  const t = useTranslations('services');
  const tCommon = useTranslations('common.cta');
  const locale = useLocale();

  const services = [
    'trafficControl',
    'guidance',
    'security',
    'strategicPlanning',
    'crowdManagement',
    'personalProtection',
  ];

  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">{t('title')}</h2>
          <p className="text-xl text-muted-foreground">
            {locale === 'ar'
              ? 'حلول شاملة لتنظيم الفعاليات'
              : 'Comprehensive solutions for event organization'}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => {
            const Icon = serviceIcons[service as keyof typeof serviceIcons];
            return (
              <motion.div
                key={service}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="h-full hover:shadow-lg transition-all hover-lift border-2 hover:border-accent/50 group">
                  <CardHeader>
                    <div className="mb-4 inline-flex p-3 rounded-lg bg-accent/10 group-hover:bg-accent/20 transition-colors">
                      <Icon className="h-10 w-10 text-accent" />
                    </div>
                    <CardTitle className="group-hover:text-accent transition-colors">
                      {t(`items.${service}.title`)}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="leading-relaxed">
                      {t(`items.${service}.description`)}
                    </CardDescription>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        <div className="text-center mt-12">
          <Button asChild variant="outline" size="lg">
            <Link href="/services">{tCommon('viewAll')}</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

