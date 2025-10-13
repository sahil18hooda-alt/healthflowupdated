'use client';

import { useState, useMemo, useEffect } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { TimelineFilters as Filters } from './TimelineFilters';
import { TimelineEvent } from './TimelineEvent';
import { EventDetailsDrawer } from './EventDetailsDrawer';
import { useCareTimeline } from '@/hooks/use-care-timeline';
import type { CareEvent, TimelineFilters } from '@/lib/types/care-coordination';
import { sampleCareEvents } from '@/lib/mock-care-events';

export function CareTimeline({ patientId }: { patientId: string }) {
  const [filters, setFilters] = useState<TimelineFilters>({ eventType: 'all', actionRequired: false, search: '' });
  const { toast } = useToast();
  const { events, loading, error, unreadCount, markAsRead } = useCareTimeline(patientId, filters);

  const [selected, setSelected] = useState<CareEvent | null>(null);
  const [open, setOpen] = useState(false);
  const [overrideEvents, setOverrideEvents] = useState<CareEvent[] | null>(null);

  const displayEvents = overrideEvents ?? events;
  const displayUnread = useMemo(() => displayEvents.filter((e) => !e.readByPatient).length, [displayEvents]);

  const onOpenDetails = (e: CareEvent) => { setSelected(e); setOpen(true); };

  useEffect(() => {
    if (error) {
      toast({ title: 'Error', description: error, variant: 'destructive' });
    }
  }, [error, toast]);

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-3 mb-3">
        <h2 className="text-xl font-semibold">Care Timeline</h2>
        {displayUnread > 0 && <span className="text-xs rounded-full bg-blue-600 text-white px-2 py-0.5">{displayUnread} new</span>}
        <div className="ml-auto flex gap-2">
          <Button variant="outline" size="sm" onClick={markAsRead}>Mark all as read</Button>
          {displayEvents.length === 0 && !loading && (
            <Button variant="secondary" size="sm" onClick={() => setOverrideEvents(sampleCareEvents(patientId))}>Load sample data</Button>
          )}
          {overrideEvents && (
            <Button variant="ghost" size="sm" onClick={() => setOverrideEvents(null)}>Clear sample</Button>
          )}
        </div>
      </div>

      <Filters value={filters} onChange={setFilters} />

      <ScrollArea className="mt-3 h-[60vh] pr-3">
        {loading && !overrideEvents ? (
          <div className="text-sm text-muted-foreground">Loading timeline…</div>
        ) : displayEvents.length === 0 ? (
          <div className="text-sm text-muted-foreground p-6 border rounded-md">
            No care events yet. Click "Load sample data" to preview the timeline.
          </div>
        ) : (
          <div>
            {displayEvents.map((e) => (
              <TimelineEvent key={e.id} event={e} onOpenDetails={onOpenDetails} />
            ))}
          </div>
        )}
      </ScrollArea>

      <EventDetailsDrawer open={open} onOpenChange={setOpen} event={selected} />
    </div>
  );
}
