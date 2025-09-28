'use client';

import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { mockDoctors, mockPatientAppointments, mockEmployeeAppointments } from '@/lib/mock-data';
import { cn } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import { Calendar as CalendarIcon, Clock, Hospital, Users, Video } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const appointmentFormSchema = z.object({
  doctor: z.string().min(1, 'Please select a doctor.'),
  date: z.date({ required_error: 'A date is required.' }),
  time: z.string().min(1, 'Please select a time slot.'),
  type: z.enum(['Hospital', 'Online']),
});

const AppointmentCard = ({ appointment, role }: { appointment: typeof mockPatientAppointments[0], role: 'patient' | 'employee' }) => (
    <Card>
        <CardHeader>
            <CardTitle className="text-lg">{role === 'patient' ? appointment.doctorName : appointment.patientName}</CardTitle>
            <CardDescription>{role === 'patient' ? mockDoctors.find(d => d.name === appointment.doctorName)?.specialization : `Appointment with ${appointment.doctorName}`}</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-2 text-sm">
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
        </CardContent>
    </Card>
);

function PatientAppointments() {
    const form = useForm<z.infer<typeof appointmentFormSchema>>({
        resolver: zodResolver(appointmentFormSchema),
    });

    function onSubmit(data: z.infer<typeof appointmentFormSchema>) {
        console.log(data);
        alert('Appointment booked successfully! (See console for details)');
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
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                        <Button type="submit">Book Appointment</Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    </TabsContent>
  );
}

export default function AppointmentsPage() {
    const { user } = useAuth();
    const appointments = user?.role === 'patient' ? mockPatientAppointments : mockEmployeeAppointments;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Appointments</h1>
        <p className="text-muted-foreground">
          {user?.role === 'patient' ? 'Book a new appointment or view your schedule.' : 'Manage your appointment schedule.'}
        </p>
      </div>
      <Tabs defaultValue="schedule" className="space-y-4">
        <TabsList>
            <TabsTrigger value="schedule">
                {user?.role === 'patient' ? 'My Appointments' : 'Your Schedule'}
            </TabsTrigger>
          {user?.role === 'patient' && <TabsTrigger value="book">Book New</TabsTrigger>}
        </TabsList>
        <TabsContent value="schedule">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {appointments.map(app => <AppointmentCard key={app.id} appointment={app} role={user!.role} />)}
            </div>
        </TabsContent>
        {user?.role === 'patient' && <PatientAppointments />}
      </Tabs>
    </div>
  );
}
