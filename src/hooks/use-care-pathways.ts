"use client";

import { useEffect, useState } from 'react';
import { initializeFirebase } from '@/firebase';
import { collection, onSnapshot, orderBy, query, where, DocumentData } from 'firebase/firestore';
import type { CarePathway } from '@/lib/types/care-coordination';

export function useCarePathways(patientId: string) {
  const { firestore } = initializeFirebase();
  const [pathways, setPathways] = useState<CarePathway[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!patientId) return;
    const q = query(
      collection(firestore, 'care_pathways'),
      where('patientId', '==', patientId),
      orderBy('startDate', 'desc')
    );

    const unsub = onSnapshot(
      q,
      (snap) => {
        const docs = snap.docs.map((d) => ({ ...(d.data() as DocumentData) })) as CarePathway[];
        setPathways(docs);
        setLoading(false);
      },
      (err) => {
        setError(err.message);
        setLoading(false);
      }
    );

    return () => unsub();
  }, [firestore, patientId]);

  return { pathways, loading, error };
}
