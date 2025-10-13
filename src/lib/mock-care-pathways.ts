import type { CarePathway } from '@/lib/types/care-coordination';

function fakeTimestamp(date: Date): any {
  return {
    toDate: () => date,
    seconds: Math.floor(date.getTime() / 1000),
    nanoseconds: (date.getTime() % 1000) * 1e6,
  } as any;
}

export function sampleCarePathways(patientId: string): CarePathway[] {
  const now = new Date();
  const daysAgo = (d: number) => new Date(now.getTime() - d * 24 * 60 * 60 * 1000);
  const daysFromNow = (d: number) => new Date(now.getTime() + d * 24 * 60 * 60 * 1000);

  const labTestPathway: CarePathway = {
    id: 'path-lab-cbc-001',
    patientId,
    pathwayType: 'lab_test',
    startDate: fakeTimestamp(daysAgo(7)),
    expectedCompletionDate: fakeTimestamp(daysFromNow(2)),
    steps: [
      { stepId: 's1', name: 'Lab ordered by doctor', status: 'completed', completedAt: fakeTimestamp(daysAgo(6)) },
      { stepId: 's2', name: 'Visit lab for sample', status: 'completed', completedAt: fakeTimestamp(daysAgo(5)) },
      { stepId: 's3', name: 'Results processing', status: 'in_progress' },
      { stepId: 's4', name: 'Doctor review', status: 'not_started' },
      { stepId: 's5', name: 'Follow-up appointment', status: 'not_started' },
    ],
    currentStepIndex: 2,
    overallStatus: 'in_progress',
  };

  const imagingPathway: CarePathway = {
    id: 'path-imaging-xray-001',
    patientId,
    pathwayType: 'specialist_referral',
    startDate: fakeTimestamp(daysAgo(10)),
    expectedCompletionDate: fakeTimestamp(daysFromNow(5)),
    steps: [
      { stepId: 'r1', name: 'Referral created', status: 'completed', completedAt: fakeTimestamp(daysAgo(9)) },
      { stepId: 'r2', name: 'Schedule specialist', status: 'in_progress' },
      { stepId: 'r3', name: 'Specialist consultation', status: 'not_started' },
    ],
    currentStepIndex: 1,
    overallStatus: 'in_progress',
  };

  return [labTestPathway, imagingPathway];
}
