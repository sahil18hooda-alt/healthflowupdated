'use client';

import { useEffect, useMemo, useState, useCallback } from 'react';
import { initializeFirebase } from '@/firebase';
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  where,
  Timestamp,
  DocumentData,
} from 'firebase/firestore';
import type { CareEvent, CareEventType, TimelineFilters } from '@/lib/types/care-coordination';

export function useCareTimeline(patientId: string, filters?: TimelineFilters) {
  const { firestore } = initializeFirebase();
  const [events, setEvents] = useState<CareEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!patientId) return;

    const baseQuery = query(
      collection(firestore, 'care_events'),
      where('patientId', '==', patientId),
      orderBy('timestamp', 'desc')
    );

    const unsub = onSnapshot(
      baseQuery,
      (snap) => {
        const docs: CareEvent[] = snap.docs.map((d) => ({ ...(d.data() as DocumentData) })) as CareEvent[];
        setEvents(docs);
        setLoading(false);
      },
      (err) => {
        setError(err.message);
        setLoading(false);
      }
    );

    return () => unsub();
  }, [firestore, patientId]);

  const filtered = useMemo(() => {
    let list = [...events];

    // Date range filtering (client-side)
    if (filters?.dateFrom || filters?.dateTo) {
      list = list.filter((e) => {
        const t = (e.timestamp as unknown as Timestamp).toDate();
        if (filters?.dateFrom && t < filters.dateFrom) return false;
        if (filters?.dateTo && t > filters.dateTo) return false;
        return true;
      });
    }

    if (filters?.eventType && filters.eventType !== 'all') {
      list = list.filter((e) => e.eventType === (filters.eventType as CareEventType));
    }

    if (filters?.actionRequired) {
      list = list.filter((e) => e.status === 'pending' || e.status === 'in_progress');
    }

    if (filters?.search) {
      const q = filters.search.toLowerCase();
      list = list.filter((e) => {
        return (
          e.eventType.toLowerCase().includes(q) ||
          e.status.toLowerCase().includes(q) ||
          e.metadata?.doctorName?.toLowerCase?.().includes(q) ||
          e.metadata?.medicationName?.toLowerCase?.().includes(q) ||
          e.metadata?.labTestType?.toLowerCase?.().includes(q) ||
          e.metadata?.resultsSummary?.toLowerCase?.().includes(q)
        );
      });
    }

    return list;
  }, [events, filters?.actionRequired, filters?.dateFrom, filters?.dateTo, filters?.eventType, filters?.search]);

  const unreadCount = useMemo(() => events.filter((e) => !e.readByPatient).length, [events]);

  const markAsRead = useCallback(async () => {
    try {
      // Optimistic UI: mark locally
      setEvents((prev) => prev.map((e) => ({ ...e, readByPatient: true })) as CareEvent[]);
      // Server action will persist marking as read; fallback to client write if needed later
      const { markPatientEventsAsRead } = await import('@/app/actions/care-coordination');
      await markPatientEventsAsRead(patientId);
    } catch (e) {
      // swallow; UI already optimistic, and rules may restrict this in some envs
    }
  }, [patientId]);

  return { events: filtered, loading, error, unreadCount, markAsRead };
}
