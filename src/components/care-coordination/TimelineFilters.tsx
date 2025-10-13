'use client';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Filter, X } from 'lucide-react';
import type { CareEventType, TimelineFilters } from '@/lib/types/care-coordination';

const EVENT_TYPES: (CareEventType | 'all')[] = [
  'all',
  'MedicationDispensed',
  'LabOrderCreated',
  'LabResultsReceived',
  'DoctorReviewedResults',
  'AppointmentScheduled',
  'AppointmentCompleted',
  'PrescriptionIssued',
  'ReferralMade',
  'ImagingOrdered',
  'ImagingCompleted',
];

export function TimelineFilters({ value, onChange }: { value: TimelineFilters; onChange: (v: TimelineFilters) => void }) {
  const set = (patch: Partial<TimelineFilters>) => onChange({ ...value, ...patch });

  return (
    <div className="flex flex-wrap items-center gap-2">
      <div className="flex items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm"><Filter className="h-4 w-4 mr-2"/>Filter</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-56">
            <DropdownMenuLabel>Event Type</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {EVENT_TYPES.map((t) => (
              <DropdownMenuItem key={t} onClick={() => set({ eventType: t })}>
                {t === 'all' ? 'All' : t}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <Button variant={value.actionRequired ? 'default' : 'outline'} size="sm" onClick={() => set({ actionRequired: !value.actionRequired })}>
          <Filter className="h-4 w-4 mr-2"/>Action Required
        </Button>
      </div>

      <div className="flex items-center gap-2 ml-auto">
        <Input
          placeholder="Search events..."
          value={value.search ?? ''}
          onChange={(e) => set({ search: e.target.value })}
          className="w-64"
        />
        {(value.eventType && value.eventType !== 'all') || value.search || value.actionRequired ? (
          <Button variant="ghost" size="sm" onClick={() => onChange({ eventType: 'all', search: '', actionRequired: false })}>
            <X className="h-4 w-4 mr-1"/> Clear
          </Button>
        ) : null}
      </div>
    </div>
  );
}
