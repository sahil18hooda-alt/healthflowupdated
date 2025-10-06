'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Calendar, Pill, Stethoscope, Bot, Beaker } from 'lucide-react';
import Link from 'next/link';
import { getPatientAppointments, mockMedications } from '@/lib/mock-data';
import { useMemo } from 'react';
import { format } from 'date-fns';

const QuickLink = ({ icon, title, href }: { icon: React.ReactNode, title: string, href: string }) => (
    <Link href={href} className="flex flex-col items-center justify-center gap-2 rounded-lg bg-muted p-4 text-center transition-colors hover:bg-accent hover:text-accent-foreground flex-1">
        <>
            <div className="rounded-full bg-background p-3 ring-1 ring-inset ring-border">{icon}</div>
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
        <h1 className="text-3xl font-bold tracking-tight">Welcome back, {name}!</h1>
        <p className="text-muted-foreground">Here&apos;s a summary of your health dashboard.</p>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2">
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
                <div className="py-8 flex flex-col items-center justify-center text-center">
                    <Calendar className="h-10 w-10 text-muted-foreground" />
                    <p className="mt-4 text-muted-foreground">No upcoming appointments.</p>
                </div>
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
                <div className="py-8 flex flex-col items-center justify-center text-center">
                    <Pill className="h-10 w-10 text-muted-foreground" />
                    <p className="mt-4 text-muted-foreground">No medications scheduled.</p>
                </div>
            )}
          </CardContent>
        </Card>
      </div>
        
      <Card>
        <CardHeader>
            <CardTitle>Quick Links</CardTitle>
            <CardDescription>Your health shortcuts</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col sm:flex-row gap-4">
            <QuickLink icon={<Calendar className="h-6 w-6 text-primary" />} title="Book Appointment" href="/appointments?tab=book" />
            <QuickLink icon={<Stethoscope className="h-6 w-6 text-primary" />} title="Find a Doctor" href="/doctors" />
            <QuickLink icon={<Bot className="h-6 w-6 text-primary" />} title="Symptom Analyzer" href="/symptom-analyzer" />
            <QuickLink icon={<Beaker className="h-6 w-6 text-primary" />} title="Interaction Checker" href="/medication-checker" />
        </CardContent>
      </Card>
    </div>
  );
}
