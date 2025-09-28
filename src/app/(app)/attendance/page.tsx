'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { mockAttendance } from '@/lib/mock-data';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

export default function AttendancePage() {
  const [status, setStatus] = useState<'Checked Out' | 'Checked In'>('Checked Out');
  const [time, setTime] = useState<string | null>(null);

  const handleCheckIn = () => {
    setStatus('Checked In');
    setTime(new Date().toLocaleTimeString());
  };

  const handleCheckOut = () => {
    setStatus('Checked Out');
    setTime(new Date().toLocaleTimeString());
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Online Attendance</h1>
        <p className="text-muted-foreground">Manage your shift check-in and check-out.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Your Current Status</CardTitle>
            <CardDescription>
                {status === 'Checked In' ? 'You are currently on the clock.' : 'You are currently off the clock.'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div
              className={cn(
                'text-2xl font-bold flex items-center gap-2',
                status === 'Checked In' ? 'text-green-600' : 'text-red-600'
              )}
            >
              <span className={cn('h-3 w-3 rounded-full', status === 'Checked In' ? 'bg-green-600' : 'bg-red-600')}></span>
              {status}
            </div>
            {time && <p className="text-sm text-muted-foreground">Last action at {time}</p>}
            <div className="flex gap-4">
              <Button onClick={handleCheckIn} disabled={status === 'Checked In'} className="w-full">
                Check In
              </Button>
              <Button onClick={handleCheckOut} disabled={status === 'Checked Out'} variant="destructive" className="w-full">
                Check Out
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Your attendance log for the past few days.</CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Date</TableHead>
                            <TableHead>Check In</TableHead>
                            <TableHead>Check Out</TableHead>
                            <TableHead>Status</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {mockAttendance.map((record) => (
                            <TableRow key={record.id}>
                                <TableCell>{format(new Date(record.date), 'MMM dd, yyyy')}</TableCell>
                                <TableCell>{record.checkIn || 'N/A'}</TableCell>
                                <TableCell>{record.checkOut || 'N/A'}</TableCell>
                                <TableCell>
                                    <span className={cn('px-2 py-1 text-xs font-semibold rounded-full', record.status === 'Present' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800')}>
                                        {record.status}
                                    </span>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
