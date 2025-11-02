'use client';

import { useTranslations, useLocale } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Link } from '@/lib/routing';
import { motion } from 'framer-motion';

export function Hero() {
  const t = useTranslations('home.hero');
  const tCommon = useTranslations('common.cta');
  const locale = useLocale();

  return (
    <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
      {/* Subtle gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-muted/30 to-accent/5" />
      
      {/* Decorative yellow accent circles */}
      <div className="absolute top-20 right-10 w-72 h-72 bg-accent/10 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-20 left-10 w-96 h-96 bg-accent/5 rounded-full blur-3xl -z-10" />
      
      <div className="container mx-auto px-4 py-24 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-4xl mx-auto"
        >
          <h1 className="text-5xl md:text-7xl font-bold mb-6 text-foreground">
            {t('title')}
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8">
            {t('subtitle')}
          </p>
          <p className="text-lg text-muted-foreground mb-12 max-w-2xl mx-auto leading-relaxed">
            {t('description')}
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Button 
              asChild 
              size="lg"
              className="hover-lift shadow-lg"
            >
              <Link href="/contact">{tCommon('contactUs')}</Link>
            </Button>
            <Button 
              asChild 
              variant="outline" 
              size="lg"
              className="border-2 hover-lift hover:bg-accent hover:text-accent-foreground transition-all"
            >
              <Link href="/services">{tCommon('learnMore')}</Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

