'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { format } from 'date-fns';
import { useState } from 'react';

interface EventInfoCollapsibleProps {
  title: string;
  date: Date;
  location?: {
    city: string;
    address?: string | null;
  } | null;
  locale: string;
}

export function EventInfoCollapsible({
  title,
  date,
  location,
  locale,
}: EventInfoCollapsibleProps) {
  const [isOpen, setIsOpen] = useState(true);
  const isArabic = locale === 'ar';

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <Card>
        <CollapsibleTrigger asChild>
          <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">
                {title}
              </CardTitle>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                {isOpen ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </Button>
            </div>
          </CardHeader>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <CardContent>
            <div className="space-y-2">
              <div>
                <span className="font-medium">
                  {isArabic ? 'التاريخ: ' : 'Date: '}
                </span>
                <span>{format(new Date(date), 'PPP')}</span>
              </div>
              {location && (
                <div>
                  <span className="font-medium">
                    {isArabic ? 'الموقع: ' : 'Location: '}
                  </span>
                  <span>
                    {location.city}
                    {location.address ? ` - ${location.address}` : ''}
                  </span>
                </div>
              )}
            </div>
          </CardContent>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
}

