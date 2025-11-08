'use client';

import { useTranslations, useLocale } from 'next-intl';
import { Link } from '@/lib/routing';
import { Mail, Phone, MapPin } from 'lucide-react';
import Image from 'next/image';
import facebookSvg from '@/components/icons/facebook.svg';
import instagramSvg from '@/components/icons/instagram.svg';
import linkedinSvg from '@/components/icons/linkedin.svg';
import xSvg from '@/components/icons/icons8-x.svg';
import snapchatSvg from '@/components/icons/snapchat.svg';

export function Footer() {
  const t = useTranslations('common.nav');
  const tFooter = useTranslations('footer');
  const locale = useLocale();

  const currentYear = new Date().getFullYear();

  // Using local correct brand SVGs via next/image

  return (
    <footer className="border-t border-border/40 bg-muted/30 relative">
      {/* Yellow accent bar at top of footer */}
      <div className="h-1 bg-gradient-to-r from-transparent via-accent/50 to-transparent" />
      
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              {locale === 'ar' ? (
                <>
                  <span className="text-foreground text-sm font-semibold">CROWD</span>
                  <h3 className="text-2xl font-bold text-accent">SMART</h3>
                </>
              ) : (
                <>
                  <h3 className="text-2xl font-bold text-accent">SMART</h3>
                  <span className="text-foreground text-sm font-semibold">CROWD</span>
                </>
              )}
            </div>
            <p className="text-muted-foreground mb-4">
              {locale === 'ar'
                ? 'شركة رائدة في مجال إدارة الحشود وتنظيم الفعاليات في المملكة العربية السعودية'
                : 'Leading crowd management and event organization company in Saudi Arabia'}
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4">
              {locale === 'ar' ? 'روابط سريعة' : 'Quick Links'}
            </h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/"
                  className="text-sm text-muted-foreground hover:text-accent transition-colors"
                >
                  {t('home')}
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-sm text-muted-foreground hover:text-accent transition-colors"
                >
                  {t('about')}
                </Link>
              </li>
              <li>
                <Link
                  href="/services"
                  className="text-sm text-muted-foreground hover:text-accent transition-colors"
                >
                  {t('services')}
                </Link>
              </li>
              <li>
                <Link
                  href="/projects"
                  className="text-sm text-muted-foreground hover:text-accent transition-colors"
                >
                  {t('projects')}
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-sm text-muted-foreground hover:text-accent transition-colors"
                >
                  {t('contact')}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">
              {locale === 'ar' ? 'اتصل بنا' : 'Contact Us'}
            </h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-sm text-muted-foreground">
                <Mail className="h-4 w-4 text-accent" />
                <a href="mailto:info@hthkia.com" className="hover:text-accent transition-colors">
                  info@hthkia.com
                </a>
              </li>
              <li className="flex items-center gap-2 text-sm text-muted-foreground">
                <Phone className="h-4 w-4 text-accent" />
                <a href="tel:0580112052" className="hover:text-accent transition-colors">
                  0580112052
                </a>
              </li>
              <li className="flex items-start gap-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4 mt-0.5" />
                <span className="break-words">
                  Al-Rusaifah, Third Ring Road – Al-Sharif Yahya Tower, Makkah
                </span>
              </li>
            </ul>
            <div className="flex gap-4 mt-4">
              {process.env.NEXT_PUBLIC_SOCIAL_FACEBOOK && (
                <a
                  href={process.env.NEXT_PUBLIC_SOCIAL_FACEBOOK}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook"
                  className="text-muted-foreground hover:text-accent transition-colors hover:scale-110 transform"
                >
                  <Image src={facebookSvg} alt="Facebook" width={20} height={20} />
                </a>
              )}
              {process.env.NEXT_PUBLIC_SOCIAL_INSTAGRAM && (
                <a
                  href={process.env.NEXT_PUBLIC_SOCIAL_INSTAGRAM}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  className="text-muted-foreground hover:text-accent transition-colors hover:scale-110 transform"
                >
                  <Image src={instagramSvg} alt="Instagram" width={20} height={20} />
                </a>
              )}
              {process.env.NEXT_PUBLIC_SOCIAL_LINKEDIN && (
                <a
                  href={process.env.NEXT_PUBLIC_SOCIAL_LINKEDIN}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn"
                  className="text-muted-foreground hover:text-accent transition-colors hover:scale-110 transform"
                >
                  <Image src={linkedinSvg} alt="LinkedIn" width={20} height={20} />
                </a>
              )}
              {process.env.NEXT_PUBLIC_SOCIAL_TWITTER && (
                <a
                  href={process.env.NEXT_PUBLIC_SOCIAL_TWITTER}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Twitter/X"
                  className="text-muted-foreground hover:text-accent transition-colors hover:scale-110 transform"
                >
                  <Image src={xSvg} alt="X" width={20} height={20} />
                </a>
              )}
              {process.env.NEXT_PUBLIC_SOCIAL_SNAPCHAT && (
                <a
                  href={process.env.NEXT_PUBLIC_SOCIAL_SNAPCHAT}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Snapchat"
                  className="text-muted-foreground hover:text-accent transition-colors hover:scale-110 transform"
                >
                  <Image src={snapchatSvg} alt="Snapchat" width={20} height={20} />
                </a>
              )}
            </div>
          </div>
        </div>

        <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
          <p>© {currentYear} SMART CROWD. All rights reserved.</p>
          <p className="mt-2">{tFooter('licenseNotice')}</p>
          <p className="mt-2">
            {locale === 'ar' ? (
              <>تم التطوير بواسطة <a href="https://dreamto.app" className="underline-offset-2 hover:underline">Dream to App</a></>
            ) : (
              <>Website by <a href="https://dreamto.app" className="underline-offset-2 hover:underline">Dream to App</a></>
            )}
          </p>
        </div>
      </div>
    </footer>
  );
}

