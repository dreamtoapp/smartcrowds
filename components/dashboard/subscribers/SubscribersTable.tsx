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
import { Eye, Check, X as XIcon, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { SubscriberDetailDialog } from './SubscriberDetailDialog';
import Image from 'next/image';
import { updateSubscriberAccepted, bulkUpdateSubscribersAccepted } from '@/app/actions/events/actions';

interface SubscribersTableProps {
  subscribers: Array<{
    id: string;
    name: string;
    mobile: string;
    email: string;
    idNumber: string;
    age: number;
    accepted?: boolean;
    dateOfBirth?: Date | string | null;
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
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [bulkUpdating, setBulkUpdating] = useState(false);
  const isArabic = locale === 'ar';

  const allSelected = subscribers.length > 0 && selectedIds.size === subscribers.length;
  const toggleSelectAll = () => {
    if (allSelected) setSelectedIds(new Set());
    else setSelectedIds(new Set(subscribers.map(s => s.id)));
  };
  const toggleSelectOne = (id: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const handleBulkAccept = async (accepted: boolean) => {
    const ids = Array.from(selectedIds);
    if (ids.length === 0) return;
    setBulkUpdating(true);
    await bulkUpdateSubscribersAccepted(ids, accepted);
    setBulkUpdating(false);
    setSelectedIds(new Set());
  };

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
                <TableHead className="w-[40px] text-center">
                  <input type="checkbox" checked={allSelected} onChange={toggleSelectAll} />
                </TableHead>
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
                <TableHead className={isArabic ? 'text-right' : 'text-left'}>
                  {isArabic ? 'مقبول' : 'Accepted'}
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
                  <TableRow
                    key={subscriber.id}
                    className={[
                      selectedIds.has(subscriber.id) ? 'bg-green-50 dark:bg-green-900/20' : '',
                      subscriber.accepted ? 'bg-emerald-50/70 dark:bg-emerald-900/20 border-l-4 border-emerald-500 ring-1 ring-emerald-200/60 dark:ring-emerald-800/50' : '',
                    ].filter(Boolean).join(' ')}
                  >
                    <TableCell className="text-center">
                      <input
                        type="checkbox"
                        checked={selectedIds.has(subscriber.id)}
                        onChange={() => toggleSelectOne(subscriber.id)}
                      />
                    </TableCell>
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
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={async () => {
                            setUpdatingId(subscriber.id);
                            await updateSubscriberAccepted(subscriber.id, !subscriber.accepted);
                            setUpdatingId(null);
                          }}
                          title={subscriber.accepted ? (isArabic ? 'إلغاء القبول' : 'Unaccept') : (isArabic ? 'تعيين مقبول' : 'Mark accepted')}
                          disabled={updatingId === subscriber.id || bulkUpdating}
                        >
                          {updatingId === subscriber.id ? (
                            <Loader2 className="h-3 w-3 animate-spin" />
                          ) : subscriber.accepted ? (
                            <XIcon className="h-3 w-3" />
                          ) : (
                            <Check className="h-3 w-3" />
                          )}
                        </Button>
                      </div>
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
        {selectedIds.size > 0 && (
          <div className="flex items-center gap-2 p-3 border-t">
            <span className="text-sm text-muted-foreground">
              {isArabic ? 'المحدد:' : 'Selected:'} {selectedIds.size}
            </span>
            <Button variant="outline" size="sm" onClick={() => handleBulkAccept(true)} disabled={bulkUpdating}>
              {bulkUpdating ? (
                <Loader2 className="h-4 w-4 mr-1 animate-spin" />
              ) : (
                <Check className="h-4 w-4 mr-1" />
              )}
              {isArabic ? 'تعيين مقبول' : 'Mark accepted'}
            </Button>
            <Button variant="outline" size="sm" onClick={() => handleBulkAccept(false)} disabled={bulkUpdating}>
              {bulkUpdating ? (
                <Loader2 className="h-4 w-4 mr-1 animate-spin" />
              ) : (
                <XIcon className="h-4 w-4 mr-1" />
              )}
              {isArabic ? 'إلغاء القبول' : 'Unaccept'}
            </Button>
          </div>
        )}
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

