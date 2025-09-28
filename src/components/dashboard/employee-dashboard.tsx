'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Calendar, Users, Clock, ArrowRight, BarChart3 } from 'lucide-react';
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
      color: 'hsl(var(--chart-1))',
    },
    recurring: {
      label: 'Recurring Patients',
      color: 'hsl(var(--chart-2))',
    },
}

function EngagementChart() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Patient Engagement</CardTitle>
                <CardDescription>New vs. Recurring Patients</CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig} className="h-[250px] w-full">
                    <BarChart accessibilityLayer data={chartData} margin={{ top: 20 }}>
                        <CartesianGrid vertical={false} />
                        <XAxis
                        dataKey="month"
                        tickLine={false}
                        tickMargin={10}
                        axisLine={false}
                        tickFormatter={(value) => value.slice(0, 3)}
                        />
                        <YAxis />
                        <ChartTooltip content={<ChartTooltipContent />} />
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
  return (
    <div className="grid gap-6">
      <div className="space-y-1.5">
        <h1 className="text-3xl font-bold">Welcome, {name}!</h1>
        <p className="text-muted-foreground">Here is your daily brief for today.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Today&apos;s Appointments</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">+3 from yesterday</p>
            <Button variant="link" asChild className="p-0 h-auto mt-2">
                <Link href="/appointments">View Schedule <ArrowRight className="ml-1 h-4 w-4"/></Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Patient Queue</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5</div>
            <p className="text-xs text-muted-foreground">New questions waiting</p>
            <Button variant="link" asChild className="p-0 h-auto mt-2">
                <Link href="#">View Queue <ArrowRight className="ml-1 h-4 w-4"/></Link>
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
                <Link href="/attendance">Manage Attendance <ArrowRight className="ml-1 h-4 w-4"/></Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <EngagementChart />
        <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Doctor-Patient Ratio</CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">1:25</div>
                <p className="text-xs text-muted-foreground">Represents doctors per patient</p>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
