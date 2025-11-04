'use client';

import { getPatientAppointments, mockMedications } from '@/lib/mock-data';
import { useMemo, useState, useEffect } from 'react';
import { format } from 'date-fns';
import MagicBento, { CardData } from '@/components/MagicBento';

export default function PatientDashboard({ name }: { name: string }) {
  const [appointments, setAppointments] = useState(() => getPatientAppointments(name));

  useEffect(() => {
    setAppointments(getPatientAppointments(name));
  }, [name]);

  const upcomingAppointment = useMemo(() => {
    const now = new Date();
    return appointments
      .filter(a => new Date(a.date) >= now)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())[0];
  }, [appointments]);

  const nextMedication = useMemo(() => {
    return mockMedications[0];
  }, []);

  const cardData: CardData[] = [
    {
      label: "Upcoming Appointment",
      title: upcomingAppointment ? upcomingAppointment.doctorName : "No upcoming appointments.",
      description: upcomingAppointment ? `${format(new Date(upcomingAppointment.date), 'PPP')} at ${upcomingAppointment.time}` : ' ',
      href: '/appointments'
    },
    {
      label: 'Medicine Schedule',
      title: nextMedication ? `${nextMedication.name} ${nextMedication.dosage}` : 'No medications scheduled.',
      description: nextMedication ? `Next dose: Today at ${nextMedication.time[0]}` : ' ',
      href: '/medications'
    },
    {
        label: 'Quick Link',
        title: 'Book Appointment',
        description: 'Schedule your next visit.',
        href: '/appointments?tab=book'
    },
    {
        label: 'Quick Link',
        title: 'Find a Doctor',
        description: 'Search for specialists.',
        href: '/doctors'
    },
    {
        label: 'AI-Powered Tools',
        title: 'Symptom Analyzer',
        description: 'Check your symptoms.',
        href: '/symptom-analyzer'
    },
    {
        label: 'AI-Powered Tools',
        title: 'Interaction Checker',
        description: 'Check for drug interactions.',
        href: '/medication-checker'
    },
];

  return (
    <div className="grid gap-6">
      <div className="space-y-1.5">
        <h1 className="text-3xl font-bold tracking-tight">Welcome back, {name}!</h1>
        <p className="text-muted-foreground">Here&apos;s a summary of your health dashboard.</p>
      </div>

      <MagicBento cards={cardData} />
    </div>
  );
}
