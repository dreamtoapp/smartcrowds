import { Header } from '@/components/layout/Header';
import { Sidebar } from '@/components/dashboard/Sidebar';
import { redirect } from '@/lib/routing';

export default async function DashboardLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  
  // TODO: Add authentication check here
  // For now, we'll allow access without authentication
  // In production, add proper auth logic

  return (
    <>
      <Header />
      <div className="flex min-h-screen">
        <Sidebar locale={locale} />
        <main className="flex-1 p-8">{children}</main>
      </div>
    </>
  );
}



