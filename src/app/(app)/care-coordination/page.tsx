'use client';

import { CareTimeline } from '@/components/care-coordination/CareTimeline';
import { CarePathwayCard } from '@/components/care-coordination/CarePathwayCard';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useEffect, useMemo, useState } from 'react';
import type { CarePathway } from '@/lib/types/care-coordination';
import { useCarePathways } from '@/hooks/use-care-pathways';
import { sampleCarePathways } from '@/lib/mock-care-pathways';

export default function CareCoordinationPage() {
  // In a real app, derive patientId from Firebase Auth. For now, allow query or fallback.
  const [patientId, setPatientId] = useState<string>('demo-patient');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const pid = params.get('patientId');
    if (pid) setPatientId(pid);
  }, []);

  const { pathways, loading, error } = useCarePathways(patientId);
  const [overridePathways, setOverridePathways] = useState<CarePathway[] | null>(null);
  const displayPathways = overridePathways ?? pathways;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Real-Time Care Coordination</CardTitle>
        </CardHeader>
        <CardContent>
          <CareTimeline patientId={patientId} />
        </CardContent>
      </Card>

      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Care Pathways</CardTitle>
          </CardHeader>
          <CardContent>
            {loading && !overridePathways ? (
              <div className="text-sm text-muted-foreground">Loading pathways…</div>
            ) : displayPathways.length === 0 ? (
              <div className="text-sm text-muted-foreground">No active care pathways yet.</div>
            ) : null}
            {displayPathways.map((p) => (
              <CarePathwayCard key={p.id} pathway={p} />
            ))}
          </CardContent>
          <CardFooter className="justify-end gap-2">
            {displayPathways.length === 0 && !loading && (
              <Button variant="secondary" size="sm" onClick={() => setOverridePathways(sampleCarePathways(patientId))}>Load sample pathways</Button>
            )}
            {overridePathways && (
              <Button variant="ghost" size="sm" onClick={() => setOverridePathways(null)}>Clear sample</Button>
            )}
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
