'use client';

import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { CareEvent } from '@/lib/types/care-coordination';

export function EventDetailsDrawer({ open, onOpenChange, event }: { open: boolean; onOpenChange: (o: boolean) => void; event: CareEvent | null }) {
  if (!event) return null;
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-[420px] sm:w-[520px]">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <Badge variant="secondary" className="capitalize">{event.eventType}</Badge>
            <span className="text-sm font-normal text-muted-foreground">Status: {event.status.replace('_', ' ')}</span>
          </SheetTitle>
        </SheetHeader>
        <div className="mt-6 space-y-4 text-sm">
          {event.metadata?.doctorName && <div><span className="text-muted-foreground">Doctor: </span>{event.metadata.doctorName}</div>}
          {event.metadata?.medicationName && <div><span className="text-muted-foreground">Medication: </span>{event.metadata.medicationName}</div>}
          {event.metadata?.labTestType && <div><span className="text-muted-foreground">Lab Test: </span>{event.metadata.labTestType}</div>}
          {event.metadata?.resultsSummary && <div><span className="text-muted-foreground">Summary: </span>{event.metadata.resultsSummary}</div>}

          <div className="pt-2 flex gap-2">
            {event.eventType === 'LabResultsReceived' && (
              <Button variant="default">View Results</Button>
            )}
            {event.eventType === 'DoctorReviewedResults' && (
              <Button variant="outline">Book Follow-up</Button>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
