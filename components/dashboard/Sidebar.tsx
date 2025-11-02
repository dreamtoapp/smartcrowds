'use client';

import { useLocale } from 'next-intl';
import { Link } from '@/lib/routing';
import { 
  LayoutDashboard, 
  FolderKanban, 
  Briefcase, 
  BarChart3,
  Settings,
  LogOut 
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface SidebarProps {
  locale: string;
}

const menuItems = [
  {
    title: 'Dashboard',
    titleAr: 'لوحة التحكم',
    icon: LayoutDashboard,
    href: 'dashboard',
  },
  {
    title: 'Projects',
    titleAr: 'المشاريع',
    icon: FolderKanban,
    href: 'dashboard/projects',
  },
  {
    title: 'Services',
    titleAr: 'الخدمات',
    icon: Briefcase,
    href: 'dashboard/services',
  },
  {
    title: 'Analytics',
    titleAr: 'التحليلات',
    icon: BarChart3,
    href: 'dashboard/analytics',
  },
  {
    title: 'Settings',
    titleAr: 'الإعدادات',
    icon: Settings,
    href: 'dashboard/settings',
  },
];

export function Sidebar({ locale }: SidebarProps) {
  const isRTL = locale === 'ar';

  return (
    <aside
      className={cn(
        'w-64 border-r bg-muted/40 p-6',
        isRTL && 'border-l border-r-0'
      )}
    >
      <div className="mb-8">
        <h2 className="text-2xl font-bold">SMART</h2>
        <p className="text-sm text-muted-foreground">
          {locale === 'ar' ? 'لوحة التحكم' : 'Dashboard'}
        </p>
      </div>

      <nav className="space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const title = locale === 'ar' ? item.titleAr : item.title;
          return (
            <Link
              key={item.href}
              href={`/${item.href}`}
              className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-muted transition-colors"
            >
              <Icon className="h-5 w-5" />
              <span>{title}</span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-8 pt-8 border-t">
        <button className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-muted transition-colors w-full text-left">
          <LogOut className="h-5 w-5" />
          <span>{locale === 'ar' ? 'تسجيل الخروج' : 'Logout'}</span>
        </button>
      </div>
    </aside>
  );
}

