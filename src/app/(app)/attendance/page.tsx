
'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { useToast } from '@/hooks/use-toast';
import { mockAttendance } from '@/lib/mock-data';
import { cn } from '@/lib/utils';
import type { AttendanceRecord } from '@/lib/types';

const leaveRequestSchema = z.object({
    leaveDate: z.date({
        required_error: "A date for your leave is required.",
    }),
    reason: z.string().min(10, {
        message: "Reason must be at least 10 characters.",
    }),
});

export default function AttendancePage() {
  const [status, setStatus] = useState<'Checked Out' | 'Checked In'>('Checked Out');
  const [time, setTime] = useState<string | null>(null);
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>(mockAttendance);
  const { toast } = useToast();

  const leaveForm = useForm<z.infer<typeof leaveRequestSchema>>({
    resolver: zodResolver(leaveRequestSchema),
  });
  
  useEffect(() => {
    // On component mount, check if there's an entry for today that is checked-in but not checked-out
    const today = format(new Date(), 'yyyy-MM-dd');
    const todaysRecord = attendanceRecords.find(record => record.date === today);
    if(todaysRecord && todaysRecord.checkIn && !todaysRecord.checkOut) {
        setStatus('Checked In');
        setTime(todaysRecord.checkIn);
    }
  }, []);


  const handleCheckIn = () => {
    const now = new Date();
    const currentTime = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const today = format(now, 'yyyy-MM-dd');

    setStatus('Checked In');
    setTime(currentTime);
    
    setAttendanceRecords(prevRecords => {
      const newRecord: AttendanceRecord = {
        id: `att-${Date.now()}`,
        date: today,
        checkIn: currentTime,
        checkOut: null,
        status: 'Present'
      };
      // Remove any previous entry for today to avoid duplicates, then add the new one
      const otherRecords = prevRecords.filter(r => r.date !== today);
      return [newRecord, ...otherRecords];
    });
  };

  const handleCheckOut = () => {
    const now = new Date();
    const currentTime = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const today = format(now, 'yyyy-MM-dd');

    setStatus('Checked Out');
    setTime(currentTime);
    
    setAttendanceRecords(prevRecords => {
        return prevRecords.map(record => {
            if (record.date === today) {
                return { ...record, checkOut: currentTime };
            }
            return record;
        });
    });
  };

  function onLeaveSubmit(data: z.infer<typeof leaveRequestSchema>) {
    console.log("Leave Request Submitted", data);
    toast({
        title: "Leave Request Sent",
        description: "Your request has been submitted for approval.",
    });
    leaveForm.reset();
  }

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
                        {attendanceRecords.map((record) => (
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

       <Card>
            <CardHeader>
                <CardTitle>Request Leave</CardTitle>
                <CardDescription>Submit a request for time off.</CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...leaveForm}>
                    <form onSubmit={leaveForm.handleSubmit(onLeaveSubmit)} className="space-y-6">
                         <FormField
                            control={leaveForm.control}
                            name="leaveDate"
                            render={({ field }) => (
                            <FormItem className="flex flex-col">
                                <FormLabel>Leave Date</FormLabel>
                                <Popover>
                                <PopoverTrigger asChild>
                                    <FormControl>
                                    <Button
                                        variant={"outline"}
                                        className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}
                                    >
                                        {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                    </Button>
                                    </FormControl>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                    <Calendar mode="single" selected={field.value} onSelect={field.onChange} disabled={(date) => date < new Date()} initialFocus />
                                </PopoverContent>
                                </Popover>
                                <FormMessage />
                            </FormItem>
                            )}
                        />
                        <FormField
                            control={leaveForm.control}
                            name="reason"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Reason for Leave</FormLabel>
                                    <FormControl>
                                        <Textarea placeholder="Please provide a brief reason for your leave..." {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit">Submit Request</Button>
                    </form>
                </Form>
            </CardContent>
       </Card>

    </div>
  );
}
