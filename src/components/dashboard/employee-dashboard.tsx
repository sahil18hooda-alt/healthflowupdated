'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Calendar, Users, Clock, ArrowRight, BarChart3, AlertCircle, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
    ChartLegend,
    ChartLegendContent,
  } from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend, Tooltip, ResponsiveContainer } from 'recharts';
import { getEmployeeAppointments, getAppointmentRequests, getMessages, ChatMessage } from '@/lib/mock-data';
import { useMemo, useState, useEffect, useCallback } from 'react';
import { format } from 'date-fns';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { PlaceHolderImages } from '@/lib/placeholder-images';

const chartData = [
    { month: 'January', new: 186, recurring: 80 },
    { month: 'February', new: 305, recurring: 200 },
    { month: 'March', new: 237, recurring: 120 },
    { month: 'April', new: 73, recurring: 190 },
    { month: 'May', new: 209, recurring: 130 },
    { month: 'June', new: 214, recurring: 140 },
]

const chartConfig = {
    new: {
      label: 'New Patients',
      color: 'hsl(var(--primary))',
    },
    recurring: {
      label: 'Recurring Patients',
      color: 'hsl(var(--accent))',
    },
}

function EngagementChart() {
    return (
        <Card className="lg:col-span-3">
            <CardHeader>
                <CardTitle>Patient Engagement</CardTitle>
                <CardDescription>New vs. Recurring Patients (Last 6 Months)</CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig} className="h-[250px] w-full">
                    <BarChart accessibilityLayer data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                        <CartesianGrid vertical={false} />
                        <XAxis
                          dataKey="month"
                          tickLine={false}
                          tickMargin={10}
                          axisLine={false}
                          tickFormatter={(value) => value.slice(0, 3)}
                        />
                        <YAxis tickLine={false} axisLine={false} />
                        <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                        <ChartLegend content={<ChartLegendContent />} />
                        <Bar dataKey="new" fill="var(--color-new)" radius={4} />
                        <Bar dataKey="recurring" fill="var(--color-recurring)" radius={4} />
                    </BarChart>
                </ChartContainer>
            </CardContent>
      </Card>
    );
}

export default function EmployeeDashboard({ name }: { name: string }) {
  const [appointments, setAppointments] = useState(() => getEmployeeAppointments(name));
  const [requests, setRequests] = useState(() => getAppointmentRequests());
  const [messages, setMessages] = useState(() => getMessages());
  
  const fetchData = useCallback(() => {
    setAppointments(getEmployeeAppointments(name));
    setRequests(getAppointmentRequests());
    setMessages(getMessages());
  }, [name]);
  
  useEffect(() => {
    fetchData();

    const handleStorageUpdate = (e: Event) => {
        const event = e as CustomEvent;
        // Check if the update is relevant to any of the data displayed on the dashboard
        if (['allAppointments', 'appointmentRequests', 'chatMessages'].includes(event.detail.key)) {
            fetchData();
        }
    };
    window.addEventListener('storage-update', handleStorageUpdate);

    // Fallback polling for other tabs/windows
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
  
  const lastMessage = useMemo(() => messages.filter(m => m.receiver === name).pop(), [messages, name]);
  const patientImage = `https://avatar.vercel.sh/guest.png`;


  return (
    <div className="grid gap-6">
      <div className="space-y-1.5">
        <h1 className="text-3xl font-bold tracking-tight">Welcome, {name}!</h1>
        <p className="text-muted-foreground">Here is your daily brief for today.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Today's Appointments</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{todaysAppointmentsCount}</div>
            <p className="text-xs text-muted-foreground">scheduled for today</p>
            <Button variant="link" asChild className="p-0 h-auto mt-2">
                <Link href="/appointments?role=employee">View Schedule <ArrowRight className="ml-1 h-4 w-4"/></Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Pending Requests</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingRequestsCount}</div>
            <p className="text-xs text-muted-foreground">requests need approval</p>
            <Button variant="link" asChild className="p-0 h-auto mt-2">
                <Link href="/requests?role=employee">View Requests <ArrowRight className="ml-1 h-4 w-4"/></Link>
            </Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Attendance</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">Checked In</div>
            <p className="text-xs text-muted-foreground">at 08:55 AM</p>
             <Button variant="link" asChild className="p-0 h-auto mt-2">
                <Link href="/attendance?role=employee">Manage Attendance <ArrowRight className="ml-1 h-4 w-4"/></Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <EngagementChart />
      </div>
    </div>
  );
}
