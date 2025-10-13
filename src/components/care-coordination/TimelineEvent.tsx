'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, FileSearch, Pill, Stethoscope, TestTube, UserCheck, Share2, Image as ImageIcon, CheckCircle2 } from 'lucide-react';
import type { CareEvent } from '@/lib/types/care-coordination';
import { formatDistanceToNow } from 'date-fns';

const typeConfig: Record<string, { label: string; color: string; icon: any }> = {
  MedicationDispensed: { label: 'Medication Dispensed', color: 'bg-green-100 text-green-700', icon: Pill },
  LabOrderCreated: { label: 'Lab Order', color: 'bg-blue-100 text-blue-700', icon: TestTube },
  LabResultsReceived: { label: 'Lab Results', color: 'bg-blue-100 text-blue-700', icon: FileSearch },
  DoctorReviewedResults: { label: 'Doctor Reviewed', color: 'bg-amber-100 text-amber-700', icon: UserCheck },
  AppointmentScheduled: { label: 'Appointment Scheduled', color: 'bg-purple-100 text-purple-700', icon: Calendar },
  AppointmentCompleted: { label: 'Appointment Completed', color: 'bg-purple-100 text-purple-700', icon: CheckCircle2 },
  PrescriptionIssued: { label: 'Prescription Issued', color: 'bg-green-100 text-green-700', icon: Pill },
  ReferralMade: { label: 'Referral', color: 'bg-amber-100 text-amber-700', icon: Share2 },
  ImagingOrdered: { label: 'Imaging Ordered', color: 'bg-blue-100 text-blue-700', icon: ImageIcon },
  ImagingCompleted: { label: 'Imaging Completed', color: 'bg-blue-100 text-blue-700', icon: ImageIcon },
};

function StatusBadge({ status }: { status: CareEvent['status'] }) {
  const color =
    status === 'completed'
      ? 'bg-green-100 text-green-700'
      : status === 'in_progress'
      ? 'bg-amber-100 text-amber-700'
      : status === 'pending'
      ? 'bg-gray-100 text-gray-700'
      : 'bg-red-100 text-red-700';
  return <Badge className={`${color} capitalize`} variant="secondary">{status.replace('_', ' ')}</Badge>;
}

export function TimelineEvent({ event, onOpenDetails }: { event: CareEvent; onOpenDetails: (e: CareEvent) => void }) {
  const cfg = typeConfig[event.eventType] ?? { label: event.eventType, color: 'bg-gray-100 text-gray-700', icon: Stethoscope };
  const Icon = cfg.icon;
  const when = formatDistanceToNow((event.timestamp as any).toDate ? (event.timestamp as any).toDate() : new Date(), { addSuffix: true });

  return (
    <Card className="mb-3 hover:shadow-md transition-shadow cursor-pointer" onClick={() => onOpenDetails(event)}>
      <CardHeader className="flex flex-row items-center gap-3 py-3">
        <div className={`h-10 w-10 rounded-full flex items-center justify-center ${cfg.color}`}> <Icon className="h-5 w-5"/> </div>
        <div className="flex-1">
          <CardTitle className="text-base">{cfg.label}</CardTitle>
          <div className="text-xs text-muted-foreground">{when}</div>
        </div>
        <div className="flex items-center gap-2">
          <StatusBadge status={event.status} />
          {!event.readByPatient && <span className="h-2 w-2 rounded-full bg-blue-500" />}
        </div>
      </CardHeader>
      <CardContent className="text-sm flex flex-wrap gap-3 py-3">
        {event.metadata?.doctorName && (
          <Badge variant="outline">Doctor: {event.metadata.doctorName}</Badge>
        )}
        {event.metadata?.medicationName && (
          <Badge variant="outline">Medication: {event.metadata.medicationName}</Badge>
        )}
        {event.metadata?.labTestType && (
          <Badge variant="outline">Lab: {event.metadata.labTestType}</Badge>
        )}
        {event.metadata?.resultsSummary && (
          <div className="w-full text-muted-foreground">{event.metadata.resultsSummary}</div>
        )}
        <div className="ml-auto">
          <Button size="sm" variant="secondary" onClick={(e) => { e.stopPropagation(); onOpenDetails(event); }}>
            View Details
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
