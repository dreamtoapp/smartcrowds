'use client';

import { useTranslations, useLocale } from 'next-intl';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from '@/lib/routing';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

const projects = [
  {
    id: 'riyadh-lights-wadi-hanifah',
    name: 'Riyadh Lights – Wadi Hanifah 2024',
    nameAr: 'نور الرياض وادي حنيفة 2024',
  },
  {
    id: 'riyadh-lights-historical',
    name: 'Noor Riyadh Historical Sites 2024',
    nameAr: 'نور الرياض هيستوريكل 2024',
  },
  {
    id: 'riyadh-lights-jax',
    name: 'Noor Riyadh – JAX District, Diriyah 2024',
    nameAr: 'نور الرياض جاكس الدرعية 2024',
  },
];

export function FeaturedProjects() {
  const t = useTranslations('home.projects');
  const tCommon = useTranslations('common.cta');
  const locale = useLocale();

  return (
    <section className="py-24 bg-muted/50">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">{t('title')}</h2>
          <p className="text-xl text-muted-foreground">{t('subtitle')}</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Card className="h-full hover:shadow-lg transition-all hover-lift border-2 hover:border-accent/30 group relative overflow-hidden">
                {/* Yellow accent bar on hover */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-accent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                
                <CardHeader>
                  <CardTitle className="group-hover:text-accent transition-colors">
                    {locale === 'ar' ? project.nameAr : project.name}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="leading-relaxed mb-4">
                    {locale === 'ar'
                      ? 'مشروع ناجح في إدارة الحشود وتنظيم الفعاليات'
                      : 'Successful crowd management and event organization project'}
                  </CardDescription>
                  <Button
                    asChild
                    variant="ghost"
                    className="mt-4 hover:text-accent hover:bg-accent/10 transition-colors"
                  >
                    <Link href={`/projects/${project.id}`}>
                      {tCommon('learnMore')}
                      <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button asChild variant="outline" size="lg">
            <Link href="/projects">{tCommon('viewAll')}</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

