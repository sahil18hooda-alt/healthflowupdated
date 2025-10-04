'use client';

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { getAppointmentRequests, updateAppointmentRequestStatus } from '@/lib/mock-data';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { AppointmentRequest, UserRole } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { AlertCircle } from 'lucide-react';
import { useSearchParams } from 'next/navigation';

export default function RequestsPage() {
    const searchParams = useSearchParams();
    const role = searchParams.get('role');
    const [requests, setRequests] = useState<AppointmentRequest[]>([]);
    const { toast } = useToast();

    const fetchRequests = useCallback(() => {
        if (role === 'employee') {
            setRequests(getAppointmentRequests());
        }
    }, [role]);

    useEffect(() => {
        fetchRequests();

        window.addEventListener('storage-update', (e) => {
            const event = e as CustomEvent;
            if (event.detail.key === 'appointmentRequests') {
                fetchRequests();
            }
        });

        // Fallback polling
        const interval = setInterval(fetchRequests, 5000); 

        return () => {
            window.removeEventListener('storage-update', (e) => {
                const event = e as CustomEvent;
                if (event.detail.key === 'appointmentRequests') fetchRequests();
            });
            clearInterval(interval);
        };
    }, [fetchRequests]);


    const handleStatusUpdate = (id: string, status: 'Accepted' | 'Declined') => {
        updateAppointmentRequestStatus(id, status);
        toast({
            title: `Request ${status}`,
            description: `The appointment request has been ${status.toLowerCase()}.`,
        });
        // The event listener will handle the UI update
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
                <Accordion type="single" collapsible className="w-full">
                    {requests.length > 0 ? requests.map((request) => (
                        <AccordionItem value={request.id} key={request.id}>
                            <AccordionTrigger className={cn("flex w-full items-center justify-between rounded-lg p-4 hover:bg-muted/50", request.status !== 'Pending' && 'opacity-60')}>
                                <div className="flex items-center gap-4 text-sm">
                                    <div className="font-semibold">{request.patientName}</div>
                                    <div className="text-muted-foreground">{request.doctor}</div>
                                    <div>{format(new Date(request.date), 'MMM dd, yyyy')} - {request.time}</div>
                                </div>
                                <div className="flex items-center gap-4">
                                     {request.problemSummary && (
                                        <div className="flex items-center gap-1 text-yellow-600">
                                            <AlertCircle className="h-4 w-4" />
                                            <span className="text-xs font-semibold">AI Summary</span>
                                        </div>
                                    )}
                                    <span className={cn('px-2 py-1 text-xs font-semibold rounded-full', 
                                        request.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                                        request.status === 'Accepted' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                    )}>
                                        {request.status}
                                    </span>
                                </div>
                            </AccordionTrigger>
                            <AccordionContent className="p-4 pt-0">
                                <div className="space-y-4 rounded-b-lg border bg-background p-4">
                                    <div className="grid grid-cols-2 gap-4 text-sm">
                                        <div><span className="font-semibold">Patient:</span> {request.patientName}</div>
                                        <div><span className="font-semibold">Requested Doctor:</span> {request.doctor}</div>
                                        <div><span className="font-semibold">Type:</span> {request.type}</div>
                                        {request.fileDataUri && <div><span className="font-semibold">Attachment:</span> <a href={request.fileDataUri} target="_blank" rel="noopener noreferrer" className="text-primary underline">View Report</a></div>}
                                    </div>
                                    {request.problemDescription && (
                                        <div>
                                            <h4 className="font-semibold">Patient's Description:</h4>
                                            <p className="text-muted-foreground text-sm italic">"{request.problemDescription}"</p>
                                        </div>
                                    )}
                                    {request.problemSummary && (
                                        <div>
                                            <h4 className="font-semibold">AI Generated Summary:</h4>
                                            <p className="text-muted-foreground text-sm italic">"{request.problemSummary}"</p>
                                        </div>
                                    )}
                                     {request.status === 'Pending' && (
                                        <div className="flex gap-2 justify-end border-t pt-4 mt-4">
                                            <Button size="sm" onClick={() => handleStatusUpdate(request.id, 'Accepted')}>Accept</Button>
                                            <Button size="sm" variant="destructive" onClick={() => handleStatusUpdate(request.id, 'Declined')}>Decline</Button>
                                        </div>
                                    )}
                                </div>
                            </AccordionContent>
                        </AccordionItem>
                    )) : (
                        <div className="text-center h-24 text-muted-foreground flex items-center justify-center">No requests found.</div>
                    )}
                </Accordion>
            </CardContent>
        </Card>
    </div>
  );
}

    
