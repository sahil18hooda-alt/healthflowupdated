import type { CareEvent } from '@/lib/types/care-coordination';

function fakeTimestamp(date: Date): any {
  return {
    toDate: () => date,
    seconds: Math.floor(date.getTime() / 1000),
    nanoseconds: (date.getTime() % 1000) * 1e6,
  } as any;
}

export function sampleCareEvents(patientId: string): CareEvent[] {
  const now = new Date();
  const mk = (minsAgo: number) => fakeTimestamp(new Date(now.getTime() - minsAgo * 60 * 1000));

  return [
    {
      id: 'evt-apt-scheduled',
      patientId,
      eventType: 'AppointmentScheduled',
      status: 'completed',
      timestamp: mk(720),
      metadata: { doctorName: 'Dr. Arjun Sharma' },
      relatedEvents: [],
      priority: 'medium',
      readByPatient: false,
      notification: { sent: true, title: 'Appointment Scheduled', message: 'Your appointment has been scheduled.' },
    },
    {
      id: 'evt-lab-ordered',
      patientId,
      eventType: 'LabOrderCreated',
      status: 'completed',
      timestamp: mk(700),
      metadata: { doctorName: 'Dr. Arjun Sharma', labTestType: 'CBC' },
      relatedEvents: ['evt-apt-scheduled'],
      priority: 'medium',
      readByPatient: true,
      notification: { sent: true, title: 'Lab Ordered', message: 'CBC ordered. Please visit the lab.' },
    },
    {
      id: 'evt-imaging-ordered',
      patientId,
      eventType: 'ImagingOrdered',
      status: 'completed',
      timestamp: mk(650),
      metadata: { doctorName: 'Dr. Arjun Sharma' },
      relatedEvents: [],
      priority: 'low',
      readByPatient: true,
      notification: { sent: true, title: 'Imaging Ordered', message: 'Please schedule your imaging.' },
    },
    {
      id: 'evt-lab-results',
      patientId,
      eventType: 'LabResultsReceived',
      status: 'completed',
      timestamp: mk(180),
      metadata: { labTestType: 'CBC', resultsSummary: 'WBC normal. Hemoglobin slightly low.' },
      relatedEvents: ['evt-lab-ordered'],
      priority: 'medium',
      readByPatient: false,
      notification: { sent: true, title: 'Lab Results Ready', message: 'Your lab results are available.' },
    },
    {
      id: 'evt-doctor-reviewed',
      patientId,
      eventType: 'DoctorReviewedResults',
      status: 'in_progress',
      timestamp: mk(90),
      metadata: { doctorName: 'Dr. Arjun Sharma', resultsSummary: 'Consider iron supplementation. Follow-up advised.' },
      relatedEvents: ['evt-lab-results'],
      priority: 'high',
      readByPatient: false,
      notification: { sent: true, title: 'Doctor Reviewed Results', message: 'Doctor reviewed your lab results.' },
    },
    {
      id: 'evt-prescription-issued',
      patientId,
      eventType: 'PrescriptionIssued',
      status: 'pending',
      timestamp: mk(45),
      metadata: { medicationName: 'Ferrous Sulfate 325mg' },
      relatedEvents: ['evt-doctor-reviewed'],
      priority: 'urgent',
      readByPatient: false,
      notification: { sent: false, title: 'Prescription Issued', message: 'Your prescription is ready for pickup.' },
    },
  ];
}
