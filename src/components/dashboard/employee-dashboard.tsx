'use client';

import { getEmployeeAppointments, getAppointmentRequests, getMessages } from '@/lib/mock-data';
import { useMemo, useState, useEffect, useCallback } from 'react';
import { format } from 'date-fns';
import MagicBento, { CardData } from '@/components/MagicBento';


export default function EmployeeDashboard({ name }: { name: string }) {
  const [appointments, setAppointments] = useState(() => getEmployeeAppointments(name));
  const [requests, setRequests] = useState(() => getAppointmentRequests());
  
  const fetchData = useCallback(() => {
    setAppointments(getEmployeeAppointments(name));
    setRequests(getAppointmentRequests());
  }, [name]);
  
  useEffect(() => {
    fetchData();

    const handleStorageUpdate = (e: Event) => {
        const event = e as CustomEvent;
        if (['allAppointments', 'appointmentRequests'].includes(event.detail.key)) {
            fetchData();
        }
    };
    window.addEventListener('storage-update', handleStorageUpdate);

    const interval = setInterval(fetchData, 5000);

    return () => {
        window.removeEventListener('storage-update', handleStorageUpdate);
        clearInterval(interval);
    };
  }, [fetchData]);


  const todaysAppointmentsCount = useMemo(() => {
    const today = format(new Date(), 'yyyy-MM-dd');
    return appointments.filter(a => a.date === today).length;
  }, [appointments]);

  const pendingRequestsCount = useMemo(() => {
    return requests.filter(req => req.status === 'Pending').length;
  }, [requests]);


  const cardData: CardData[] = [
    {
        label: "Today's Schedule",
        title: `${todaysAppointmentsCount} Appointments`,
        description: 'View your schedule for today.',
        href: '/appointments?role=employee'
    },
    {
        label: 'Pending Requests',
        title: `${pendingRequestsCount} Requests`,
        description: 'Approve or deny appointment requests.',
        href: '/requests?role=employee'
    },
    {
        label: 'Attendance',
        title: 'Checked In',
        description: 'Manage your attendance and view history.',
        href: '/attendance?role=employee'
    },
    {
        label: 'Patient Engagement',
        title: 'View Analytics',
        description: 'See new vs. recurring patient trends.',
        href: '/model-accuracy' 
    },
    {
        label: 'AI-Powered Tools',
        title: 'Decision Support',
        description: 'Get assistance with diagnoses and treatment plans.',
        href: '/decision-support'
    },
    {
        label: 'Communication',
        title: 'Doctor Chat',
        description: 'Communicate with other healthcare professionals securely.',
        href: '/doctor-chat'
    },
];


  return (
    <div className="grid gap-6">
      <div className="space-y-1.5">
        <h1 className="text-3xl font-bold tracking-tight">Welcome, {name}!</h1>
        <p className="text-muted-foreground">Here is your daily brief for today.</p>
      </div>

      <MagicBento cards={cardData} />
    </div>
  );
}
