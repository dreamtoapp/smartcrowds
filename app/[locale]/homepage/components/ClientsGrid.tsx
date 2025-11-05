import { prisma } from '@/lib/prisma';
import Image from 'next/image';

interface ClientsGridProps {
  locale: string;
}

export default async function ClientsGrid({ locale }: ClientsGridProps) {
  type ClientItem = { id: string; name: string; logoUrl: string };
  const clients = (await prisma.client.findMany({
    where: { published: true },
    orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
  })) as unknown as ClientItem[];

  if (!clients.length) return null;

  return (
    <section className="py-12">
      <h2 className="text-center text-base md:text-lg font-medium text-muted-foreground mb-8">
        {locale === 'ar' ? 'عملاؤنا' : 'Trusted by'}
      </h2>
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6 md:gap-8 items-stretch">
          {clients.map((c: ClientItem) => (
            <div
              key={c.id}
              className="flex items-center justify-center h-24 md:h-28 rounded-xl border border-border/50 bg-muted/30 backdrop-blur-sm shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 opacity-90 hover:opacity-100"
              title={c.name}
              aria-label={c.name}
            >
              <Image
                src={c.logoUrl}
                alt={c.name}
                width={240}
                height={120}
                sizes="(max-width: 640px) 45vw, (max-width: 1024px) 25vw, 240px"
                className="object-contain max-h-[72%] w-auto grayscale hover:grayscale-0 transition"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}


