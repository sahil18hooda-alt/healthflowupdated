'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { mockAppointmentRequests as initialMockRequests, updateAppointmentRequestStatus } from '@/lib/mock-data';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { AppointmentRequest } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';

export default function RequestsPage() {
    const [requests, setRequests] = useState<AppointmentRequest[]>([]);
    const { toast } = useToast();

    useEffect(() => {
        // In a real app, you would fetch this data. Here we use the mock data.
        // We'll use a copy to avoid direct mutation issues in React strict mode.
        setRequests([...initialMockRequests]);
    }, []);


    const handleStatusUpdate = (id: string, status: 'Accepted' | 'Declined') => {
        const updatedRequest = updateAppointmentRequestStatus(id, status);
        if (updatedRequest) {
            setRequests(prev => prev.map(req => req.id === id ? { ...req, status } : req));
            toast({
                title: `Request ${status}`,
                description: `The appointment request has been ${status.toLowerCase()}.`,
            });
        }
    };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Appointment Requests</h1>
        <p className="text-muted-foreground">Manage incoming appointment requests from patients.</p>
      </div>

        <Card>
            <CardHeader>
                <CardTitle>Incoming Requests</CardTitle>
                <CardDescription>Review and respond to new appointment requests.</CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Patient</TableHead>
                            <TableHead>Doctor</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead>Time</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {requests.map((request) => (
                            <TableRow key={request.id}>
                                <TableCell>{request.patientName}</TableCell>
                                <TableCell>{request.doctor}</TableCell>
                                <TableCell>{format(new Date(request.date), 'MMM dd, yyyy')}</TableCell>
                                <TableCell>{request.time}</TableCell>
                                <TableCell>{request.type}</TableCell>
                                <TableCell>
                                    <span className={cn('px-2 py-1 text-xs font-semibold rounded-full', 
                                        request.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                                        request.status === 'Accepted' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                    )}>
                                        {request.status}
                                    </span>
                                </TableCell>
                                <TableCell className="text-right">
                                    {request.status === 'Pending' && (
                                        <div className="flex gap-2 justify-end">
                                            <Button size="sm" onClick={() => handleStatusUpdate(request.id, 'Accepted')}>Accept</Button>
                                            <Button size="sm" variant="destructive" onClick={() => handleStatusUpdate(request.id, 'Declined')}>Decline</Button>
                                        </div>
                                    )}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                 {requests.filter(r => r.status === 'Pending').length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                        No pending requests.
                    </div>
                )}
            </CardContent>
        </Card>
    </div>
  );
}
