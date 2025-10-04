
'use client';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { mockDoctors, getPatientAppointments, getEmployeeAppointments, addAppointmentRequest, getAppointmentRequests } from '@/lib/mock-data';
import { cn } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import { Calendar as CalendarIcon, Clock, Hospital, Users, Video, Bell, Link as LinkIcon, Paperclip, Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useToast } from '@/hooks/use-toast';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AppointmentRequest, Appointment, UserRole } from '@/lib/types';
import { useState, useEffect, Suspense, useMemo } from 'react';
import Link from 'next/link';
import { Textarea } from '@/components/ui/textarea';
import { inquiryTriage } from '@/ai/flows/inquiry-triage-flow';
import { useSearchParams } from 'next/navigation';

const appointmentFormSchema = z.object({
  doctor: z.string().min(1, 'Please select a doctor.'),
  date: z.date({ required_error: 'A date is required.' }),
  time: z.string().min(1, 'Please select a time slot.'),
  type: z.enum(['Hospital', 'Online']),
  problemDescription: z.string().optional(),
  file: z.any().optional(),
});

const AppointmentCard = ({ appointment, role }: { appointment: Appointment, role: UserRole }) => (
    <Card className="flex flex-col">
        <CardHeader>
            <CardTitle className="text-lg">{role === 'patient' ? appointment.doctorName : appointment.patientName}</CardTitle>
            <CardDescription>{role === 'patient' ? mockDoctors.find(d => d.name === appointment.doctorName)?.specialization : `Appointment with ${appointment.doctorName}`}</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-2 text-sm flex-1">
            <div className="flex items-center gap-2"><CalendarIcon className="h-4 w-4 text-muted-foreground"/> <span>{format(new Date(appointment.date), 'PPP')}</span></div>
            <div className="flex items-center gap-2"><Clock className="h-4 w-4 text-muted-foreground"/> <span>{appointment.time}</span></div>
            <div className="flex items-center gap-2">
                {appointment.type === 'Hospital' ? <Hospital className="h-4 w-4 text-muted-foreground"/> : <Video className="h-4 w-4 text-muted-foreground"/>}
                <span>{appointment.type} Visit</span>
            </div>
             <div className="flex items-center gap-2 font-semibold">
                <span className={cn('h-2 w-2 rounded-full', appointment.status === 'Upcoming' ? 'bg-green-500' : 'bg-gray-400')}></span>
                <span>{appointment.status}</span>
             </div>
             {appointment.problemSummary && (
                <div className="text-xs text-muted-foreground pt-2 border-t mt-2">
                    <p className="font-bold">Symptom Summary:</p>
                    <p className="italic">"{appointment.problemSummary}"</p>
                </div>
             )}
        </CardContent>
        {appointment.type === 'Online' && appointment.meetingLink && appointment.status === 'Upcoming' && (
            <CardFooter>
                <Button asChild className="w-full">
                    <Link href={appointment.meetingLink} target="_blank">
                        <LinkIcon className="mr-2 h-4 w-4" />
                        Join Meeting
                    </Link>
                </Button>
            </CardFooter>
        )}
    </Card>
);

function PatientAppointments({ onAppointmentRequest }: { onAppointmentRequest: (req: AppointmentRequest) => void }) {
    const user = { name: 'Guest', role: 'patient' as UserRole };
    const { toast } = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const searchParams = useSearchParams();
    const doctorFromQuery = searchParams.get('doctor');

    const form = useForm<z.infer<typeof appointmentFormSchema>>({
        resolver: zodResolver(appointmentFormSchema),
        defaultValues: {
            doctor: doctorFromQuery || '',
        }
    });

    useEffect(() => {
        if(doctorFromQuery) {
            form.setValue('doctor', doctorFromQuery);
        }
    }, [doctorFromQuery, form]);

    const fileRef = form.register('file');

    const readFileAsDataURL = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    };

    async function onSubmit(data: z.infer<typeof appointmentFormSchema>) {
        if(!user) return;
        setIsSubmitting(true);

        let fileDataUri: string | undefined = undefined;
        if (data.file && data.file[0]) {
            try {
                fileDataUri = await readFileAsDataURL(data.file[0]);
            } catch (error) {
                console.error("Error reading file", error);
                toast({ title: "Error", description: "Could not read the uploaded file.", variant: "destructive" });
                setIsSubmitting(false);
                return;
            }
        }
        
        let summary: string | undefined;
        if(data.problemDescription) {
            try {
                const triageResult = await inquiryTriage({ message: data.problemDescription, fileDataUri: fileDataUri });
                summary = triageResult.summary;
            } catch (error) {
                console.error("Error with AI summary", error);
                // Non-fatal, we can still proceed
            }
        }


        const newRequest = addAppointmentRequest({
            doctor: data.doctor,
            date: data.date,
            time: data.time,
            type: data.type,
            problemDescription: data.problemDescription,
            fileDataUri: fileDataUri,
            problemSummary: summary
        }, user.name);

        onAppointmentRequest(newRequest);
        toast({
            title: 'Request Sent!',
            description: 'Your appointment request has been sent to the doctor for approval.',
        });
        form.reset();
        setIsSubmitting(false);
    }
  return (
    <TabsContent value="book">
        <Card>
            <CardHeader>
                <CardTitle>Book a New Appointment</CardTitle>
                <CardDescription>Fill out the form below to schedule your visit.</CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                            control={form.control}
                            name="doctor"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Doctor</FormLabel>
                                    <Select onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger><SelectValue placeholder="Select a doctor" /></SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {mockDoctors.map(doc => <SelectItem key={doc.id} value={doc.name}>{doc.name} - {doc.specialization}</SelectItem>)}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormField
                                control={form.control}
                                name="date"
                                render={({ field }) => (
                                <FormItem className="flex flex-col">
                                    <FormLabel>Appointment Date</FormLabel>
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
                                        <Calendar mode="single" selected={field.value} onSelect={field.onChange} disabled={(date) => date < new Date() || date < new Date("1900-01-01")} initialFocus />
                                    </PopoverContent>
                                    </Popover>
                                    <FormMessage />
                                </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="time"
                                render={({ field }) => (
                                    <FormItem>
                                    <FormLabel>Time Slot</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl><SelectTrigger><SelectValue placeholder="Select a time" /></SelectTrigger></FormControl>
                                        <SelectContent>
                                            <SelectItem value="09:00 AM">09:00 AM</SelectItem>
                                            <SelectItem value="11:00 AM">11:00 AM</SelectItem>
                                            <SelectItem value="02:00 PM">02:00 PM</SelectItem>
                                            <SelectItem value="04:00 PM">04:00 PM</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <FormField
                            control={form.control}
                            name="type"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Appointment Type</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl><SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger></FormControl>
                                    <SelectContent>
                                        <SelectItem value="Hospital">Hospital Visit</SelectItem>
                                        <SelectItem value="Online">Online Meeting</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                                </FormItem>
                            )}
                        />

                        <Card>
                            <CardHeader>
                                <CardTitle className="text-xl">Describe your problem to the doctor</CardTitle>
                                <CardDescription>This will help the doctor prepare for your appointment.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <FormField
                                    control={form.control}
                                    name="problemDescription"
                                    render={({ field }) => (
                                        <FormItem>
                                        <FormLabel>Symptoms & Problems</FormLabel>
                                        <FormControl>
                                            <Textarea placeholder="e.g., I've had a persistent cough for the last 3 days, accompanied by a mild fever..." {...field} />
                                        </FormControl>
                                        <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="file"
                                    render={() => (
                                        <FormItem>
                                            <FormLabel>Attach Lab Reports / Prescriptions (Optional)</FormLabel>
                                            <FormControl>
                                                <Input type="file" {...fileRef} accept="image/*,.pdf,.doc,.docx" />
                                            </FormControl>
                                            <FormDescription>You can upload one file (image, PDF, or Word document).</FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </CardContent>
                        </Card>


                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Send Request
                        </Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    </TabsContent>
  );
}

function PatientRequests({ appointmentRequests, user }: { appointmentRequests: AppointmentRequest[], user: { name: string } }) {
    const [userRequests, setUserRequests] = useState<AppointmentRequest[]>([]);
    
    useEffect(() => {
        if(user) {
            setUserRequests(appointmentRequests.filter(req => req.patientName === user.name));
        }
    }, [appointmentRequests, user]);


    return (
        <TabsContent value="requests">
            <Card>
                <CardHeader>
                    <CardTitle>My Appointment Requests</CardTitle>
                    <CardDescription>Here is the status of your recent appointment requests.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Doctor</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead>Time</TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead>Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {userRequests.length > 0 ? userRequests.map((request) => (
                                <TableRow key={request.id}>
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
                                </TableRow>
                            )) : (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center h-24">No requests found.</TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </TabsContent>
    );
}


function AppointmentsPageContent() {
    const user = useMemo(() => ({ name: 'Guest', role: 'patient' as UserRole }), []);
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [appointmentRequests, setAppointmentRequests] = useState<AppointmentRequest[]>([]);
    const searchParams = useSearchParams();
    const tabFromQuery = searchParams.get('tab');


    const isPatient = user?.role === 'patient';
    
    useEffect(() => {
        if (user) {
            const fetchAppointments = () => {
                const allAppointments = isPatient ? getPatientAppointments(user.name) : getEmployeeAppointments(user.name);
                setAppointments(allAppointments);
            };
            fetchAppointments();
            const interval = setInterval(fetchAppointments, 2000); // Poll for changes
            return () => clearInterval(interval);
        }
    }, [isPatient, user]);

    useEffect(() => {
        const fetchRequests = () => {
            setAppointmentRequests(getAppointmentRequests());
        };
        fetchRequests();
        const interval = setInterval(fetchRequests, 2000); // Poll for changes
        return () => clearInterval(interval);
    }, []);


    const handleNewRequest = (newRequest: AppointmentRequest) => {
        setAppointmentRequests(prevRequests => [newRequest, ...prevRequests]);
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold">Appointments</h1>
                <p className="text-muted-foreground">
                    {user?.role === 'patient' ? 'Book a new appointment or view your schedule.' : 'Manage your appointment schedule.'}
                </p>
            </div>
            <Tabs defaultValue={tabFromQuery || 'schedule'} className="space-y-4">
                <TabsList>
                    <TabsTrigger value="schedule">
                        {user?.role === 'patient' ? 'My Appointments' : 'Your Schedule'}
                    </TabsTrigger>
                    {user?.role === 'patient' && <TabsTrigger value="requests">My Requests</TabsTrigger>}
                    {user?.role === 'patient' && <TabsTrigger value="book">Book New</TabsTrigger>}
                </TabsList>
                <TabsContent value="schedule">
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {appointments.map(app => <AppointmentCard key={app.id} appointment={app} role={user!.role} />)}
                    </div>
                    {appointments.length === 0 && (
                        <Card>
                            <CardContent className="py-12 text-center text-muted-foreground">
                                No appointments scheduled.
                            </CardContent>
                        </Card>
                    )}
                </TabsContent>
                {user?.role === 'patient' && <PatientRequests appointmentRequests={appointmentRequests} user={user} />}
                {user?.role === 'patient' && <PatientAppointments onAppointmentRequest={handleNewRequest} />}
            </Tabs>
        </div>
    );
}

export default function AppointmentsPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <AppointmentsPageContent />
        </Suspense>
    )
}
