'use client';

import { getPatientAppointments, mockMedications } from '@/lib/mock-data';
import { useEffect, useMemo, useState } from 'react';
import { format } from 'date-fns';
import MagicBento, { CardData } from '@/components/MagicBento';

export default function PatientDashboard({ name }: { name: string }) {
  const [appointments, setAppointments] = useState<ReturnType<typeof getPatientAppointments>>([]);

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
    upcomingAppointment ? {
        label: 'Upcoming Appointment',
        title: upcomingAppointment.doctorName,
        description: `${upcomingAppointment.problemSummary || 'Check-up'} on ${format(new Date(upcomingAppointment.date), 'PPP')} at ${upcomingAppointment.time}`,
        href: '/appointments'
    } : {
        label: 'Upcoming Appointment',
        title: 'No Upcoming Appointments',
        description: 'Book your next check-up now.',
        href: '/appointments?tab=book'
    },
    nextMedication ? {
        label: 'Medicine Schedule',
        title: `${nextMedication.name} ${nextMedication.dosage}`,
        description: `Next dose today at ${nextMedication.time[0]}`,
        href: '/medications'
    } : {
        label: 'Medicine Schedule',
        title: 'No Medications Scheduled',
        description: 'Add your medications to get reminders.',
        href: '/medications'
    },
    {
        label: 'Quick Link',
        title: 'Book Appointment',
        description: 'Schedule your next visit with a doctor.',
        href: '/appointments?tab=book'
    },
    {
        label: 'Quick Link',
        title: 'Find a Doctor',
        description: 'Search for a specialist that fits your needs.',
        href: '/doctors'
    },
    {
        label: 'AI Tool',
        title: 'Symptom Analyzer',
        description: 'Check your symptoms with our AI assistant.',
        href: '/symptom-analyzer'
    },
    {
        label: 'AI Tool',
        title: 'Interaction Checker',
        description: 'Check for interactions between your medications.',
        href: '/medication-checker'
    }
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
