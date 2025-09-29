

'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { getAppointmentRequests, updateAppointmentRequestStatus } from '@/lib/mock-data';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { AppointmentRequest } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/use-auth';

export default function RequestsPage() {
    const { user } = useAuth();
    const [requests, setRequests] = useState<AppointmentRequest[]>([]);
    const { toast } = useToast();

    useEffect(() => {
        const fetchRequests = () => {
            if (user) {
                // For this prototype, employees see all requests. 
                // A real app would filter by the employee's assigned patients or department.
                setRequests(getAppointmentRequests().filter(req => req.doctor === user.name || mockDoctors.some(d => d.name === req.doctor)));
            }
        };

        fetchRequests();
        const interval = setInterval(fetchRequests, 1000); // Poll for new requests
        return () => clearInterval(interval);
    }, [user]);


    const handleStatusUpdate = (id: string, status: 'Accepted' | 'Declined') => {
        const updatedRequest = updateAppointmentRequestStatus(id, status);
        if (updatedRequest) {
            toast({
                title: `Request ${status}`,
                description: `The appointment request has been ${status.toLowerCase()}.`,
            });
            // The useEffect polling will update the UI, no need to manually set state here.
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
                        {requests.length > 0 ? requests.map((request) => (
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
                        )) : (
                            <TableRow>
                                <TableCell colSpan={7} className="text-center h-24">No requests found.</TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    </div>
  );
}

    