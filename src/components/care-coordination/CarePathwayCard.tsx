'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import type { CarePathway } from '@/lib/types/care-coordination';

export function CarePathwayCard({ pathway, onSelectStep }: { pathway: CarePathway; onSelectStep?: (stepId: string) => void }) {
  const total = pathway.steps.length || 1;
  const completed = pathway.steps.filter((s) => s.status === 'completed').length;
  const percent = Math.round((completed / total) * 100);

  return (
    <Card className="mb-4">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg capitalize">{pathway.pathwayType.replace('_', ' ')}</CardTitle>
          <Badge variant={pathway.overallStatus === 'completed' ? 'default' : 'secondary'} className="capitalize">{pathway.overallStatus}</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-2 text-sm text-muted-foreground">Estimated completion: {pathway.expectedCompletionDate.toDate?.().toLocaleDateString?.() ?? ''}</div>
        <Progress value={percent} className="h-2" />
        <div className="mt-4 flex flex-col gap-3">
          {pathway.steps.map((step, idx) => (
            <div key={step.stepId} className="flex items-center gap-3">
              <div className={`h-6 w-6 rounded-full text-xs flex items-center justify-center border ${idx === pathway.currentStepIndex ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>{idx + 1}</div>
              <div className="flex-1">
                <div className="font-medium">{step.name}</div>
                <div className="text-xs text-muted-foreground capitalize">{step.status.replace('_', ' ')}</div>
              </div>
              {onSelectStep && (
                <button className="text-xs underline" onClick={() => onSelectStep(step.stepId)}>Details</button>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
