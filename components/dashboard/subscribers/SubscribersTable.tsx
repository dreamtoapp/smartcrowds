'use client';

import { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Eye } from 'lucide-react';
import { format } from 'date-fns';
import { SubscriberDetailDialog } from './SubscriberDetailDialog';
import Image from 'next/image';

interface SubscribersTableProps {
  subscribers: Array<{
    id: string;
    name: string;
    mobile: string;
    email: string;
    idNumber: string;
    age: number;
    idImageUrl: string | null;
    personalImageUrl: string | null;
    createdAt: Date;
    jobRequirement: {
      id: string;
      job: { name: string } | null;
      ratePerDay: number | null;
    } | null;
    nationality: {
      nameAr: string;
      nameEn: string;
    } | null;
  }>;
  locale: string;
}

export function SubscribersTable({
  subscribers,
  locale,
}: SubscribersTableProps) {
  const [selectedSubscriber, setSelectedSubscriber] = useState<
    SubscribersTableProps['subscribers'][0] | null
  >(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const isArabic = locale === 'ar';

  const handleViewMore = (subscriber: SubscribersTableProps['subscribers'][0]) => {
    setSelectedSubscriber(subscriber);
    setDialogOpen(true);
  };

  return (
    <>
      <Card>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className={`w-[60px] ${isArabic ? 'text-right' : 'text-left'}`}>
                  {isArabic ? 'الصورة' : 'Photo'}
                </TableHead>
                <TableHead className={isArabic ? 'text-right' : 'text-left'}>
                  {isArabic ? 'الاسم' : 'Name'}
                </TableHead>
                <TableHead className={isArabic ? 'text-right' : 'text-left'}>
                  {isArabic ? 'الجوال' : 'Mobile'}
                </TableHead>
                <TableHead className={isArabic ? 'text-right' : 'text-left'}>
                  {isArabic ? 'الجنسية' : 'Nationality'}
                </TableHead>
                <TableHead className={isArabic ? 'text-right' : 'text-left'}>
                  {isArabic ? 'الوظيفة' : 'Job'}
                </TableHead>
                <TableHead className="w-[120px] text-center">
                  {isArabic ? 'الإجراءات' : 'Actions'}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {subscribers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    {isArabic ? 'لا يوجد مشتركين' : 'No subscribers'}
                  </TableCell>
                </TableRow>
              ) : (
                subscribers.map((subscriber) => (
                  <TableRow key={subscriber.id}>
                    <TableCell>
                      {subscriber.personalImageUrl ? (
                        <div className="relative h-10 w-10 rounded-full overflow-hidden bg-muted flex-shrink-0">
                          <Image
                            src={subscriber.personalImageUrl}
                            alt={subscriber.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                      ) : (
                        <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center text-xs text-muted-foreground">
                          {subscriber.name.charAt(0).toUpperCase()}
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="font-medium">{subscriber.name}</TableCell>
                    <TableCell>{subscriber.mobile}</TableCell>
                    <TableCell>
                      {subscriber.nationality
                        ? isArabic
                          ? subscriber.nationality.nameAr
                          : subscriber.nationality.nameEn
                        : 'N/A'}
                    </TableCell>
                    <TableCell>
                      {subscriber.jobRequirement?.job ? (
                        <Badge variant="secondary" className="text-xs">
                          {subscriber.jobRequirement.job.name}
                        </Badge>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleViewMore(subscriber)}
                        className="w-full"
                      >
                        <Eye className={`h-4 w-4 ${isArabic ? 'ml-2' : 'mr-2'}`} />
                        {isArabic ? 'عرض المزيد' : 'View More'}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </Card>

      <SubscriberDetailDialog
        subscriber={selectedSubscriber}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        locale={locale}
      />
    </>
  );
}

