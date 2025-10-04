'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Calendar, Pill, Stethoscope } from 'lucide-react';
import Link from 'next/link';
import { getPatientAppointments, mockMedications } from '@/lib/mock-data';
import { useMemo } from 'react';
import { format } from 'date-fns';

const QuickLink = ({ icon, title, href }: { icon: React.ReactNode, title: string, href: string }) => (
    <Link href={href} className="flex flex-col items-center justify-center gap-2 rounded-lg bg-accent/10 p-4 text-center transition-colors hover:bg-accent/20">
        <>
            <div className="rounded-full bg-background p-3">{icon}</div>
            <span className="text-sm font-medium text-foreground">{title}</span>
        </>
    </Link>
);

export default function PatientDashboard({ name }: { name: string }) {
  const appointments = getPatientAppointments(name);
  
  const upcomingAppointment = useMemo(() => {
    const now = new Date();
    return appointments
      .filter(a => new Date(a.date) >= now)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())[0];
  }, [appointments]);

  const nextMedication = useMemo(() => {
    // This is a simplified logic. A real app would compare times for today.
    return mockMedications[0];
  }, []);

  return (
    <div className="grid gap-6">
      <div className="space-y-1.5">
        <h1 className="text-3xl font-bold">Welcome back, {name}!</h1>
        <p className="text-muted-foreground">Here&apos;s a summary of your health dashboard.</p>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="flex flex-col">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Appointment</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="flex-1 flex flex-col justify-center">
            {upcomingAppointment ? (
                <>
                    <div className="text-2xl font-bold">{upcomingAppointment.doctorName}</div>
                    <p className="text-xs text-muted-foreground">{upcomingAppointment.problemSummary || 'Check-up'}</p>
                    <p className="mt-2 font-semibold">{format(new Date(upcomingAppointment.date), 'PPP')} at {upcomingAppointment.time}</p>
                </>
            ) : (
                <p className="text-center text-muted-foreground py-4">No upcoming appointments.</p>
            )}
          </CardContent>
        </Card>

        <Card className="flex flex-col">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Medicine Schedule</CardTitle>
            <Pill className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="flex-1 flex flex-col justify-center">
            {nextMedication ? (
                 <>
                    <div className="text-2xl font-bold">{nextMedication.name} {nextMedication.dosage}</div>
                    <p className="text-xs text-muted-foreground">Next dose</p>
                    <p className="mt-2 font-semibold">Today at {nextMedication.time[0]}</p>
                 </>
            ) : (
                <p className="text-center text-muted-foreground py-4">No medications scheduled.</p>
            )}
          </CardContent>
        </Card>
        
        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle>Quick Links</CardTitle>
            <CardDescription>Your health shortcuts</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-4">
            <QuickLink icon={<Calendar className="h-6 w-6 text-primary" />} title="Book Appointment" href="/appointments" />
            <QuickLink icon={<Stethoscope className="h-6 w-6 text-primary" />} title="Find a Doctor" href="/doctors" />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
