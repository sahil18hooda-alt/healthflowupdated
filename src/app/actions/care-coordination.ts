'use server';

import { firebaseConfig } from '@/firebase/config';
import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  updateDoc,
  serverTimestamp,
  Timestamp,
  query,
  where,
  orderBy,
  writeBatch,
} from 'firebase/firestore';
import type { CareEvent, CareEventType, CarePathway, CarePathwayStep } from '@/lib/types/care-coordination';

function getDb() {
  const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
  return getFirestore(app);
}

export type CreateCareEventInput = {
  id?: string;
  patientId: string;
  eventType: CareEventType;
  status?: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  timestamp?: Timestamp;
  metadata?: Record<string, unknown>;
  relatedEvents?: string[];
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  notification?: { sent: boolean; title: string; message: string };
};

export async function createCareEvent(input: CreateCareEventInput) {
  const db = getDb();
  const id = input.id ?? crypto.randomUUID();
  const ref = doc(collection(db, 'care_events'), id);
  const payload: Omit<CareEvent, 'timestamp'> & { timestamp: any } = {
    id,
    patientId: input.patientId,
    eventType: input.eventType,
    status: input.status ?? 'pending',
    timestamp: input.timestamp ?? (serverTimestamp() as any),
    metadata: (input.metadata as any) ?? {},
    relatedEvents: input.relatedEvents ?? [],
    priority: input.priority ?? 'medium',
    readByPatient: false,
    notification: input.notification ?? { sent: false, title: 'Care Update', message: '' },
  };
  await setDoc(ref, payload, { merge: false });
  return { id };
}

export type UpdatePathwayStepInput = {
  pathwayId: string;
  stepId: string;
  updates: Partial<Pick<CarePathwayStep, 'status' | 'eventId' | 'completedAt'>>;
};

export async function updateCarePathwayStep({ pathwayId, stepId, updates }: UpdatePathwayStepInput) {
  const db = getDb();
  const ref = doc(db, 'care_pathways', pathwayId);
  const snap = await getDoc(ref);
  if (!snap.exists()) throw new Error('Pathway not found');
  const data = snap.data() as CarePathway;

  const steps = [...data.steps];
  const idx = steps.findIndex((s) => s.stepId === stepId);
  if (idx === -1) throw new Error('Step not found');

  steps[idx] = { ...steps[idx], ...updates };

  // Recompute currentStepIndex and overallStatus
  const currentStepIndex = Math.max(
    0,
    steps.findIndex((s) => s.status !== 'completed')
  );
  const allCompleted = steps.every((s) => s.status === 'completed');
  const overallStatus = allCompleted ? 'completed' : steps[currentStepIndex].status;

  await updateDoc(ref, {
    steps,
    currentStepIndex,
    overallStatus,
  } as Partial<CarePathway>);

  return { pathwayId, stepId };
}

export async function linkRelatedEvents(eventId: string, relatedEventIds: string[]) {
  const db = getDb();
  const ref = doc(db, 'care_events', eventId);
  await updateDoc(ref, { relatedEvents: relatedEventIds });
  return { eventId, relatedEventIds };
}

export async function markPatientEventsAsRead(patientId: string) {
  const db = getDb();
  const q = query(
    collection(db, 'care_events'),
    where('patientId', '==', patientId),
    where('readByPatient', '==', false)
  );
  const snap = await getDocs(q);
  const batch = writeBatch(db);
  snap.forEach((docSnap) => {
    batch.update(docSnap.ref, { readByPatient: true });
  });
  if (!snap.empty) await batch.commit();
  return { updated: snap.size };
}
