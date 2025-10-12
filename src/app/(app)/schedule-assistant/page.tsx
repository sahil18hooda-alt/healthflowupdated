'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { format, addDays } from 'date-fns';
import { Calendar as CalendarIcon, Bot, Loader2, CalendarClock, User, Stethoscope, Clock, FileText, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { scheduleAppointment } from '@/ai/flows/ai-surgery-scheduling-assistant';
import type { ScheduleAppointmentOutput } from '@/lib/types';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { DateRange } from 'react-day-picker';
import { addAppointment } from '@/lib/mock-data';
import { useToast } from '@/hooks/use-toast';

const formSchema = z.object({
  doctor: z.string().min(1, 'Doctor is required.'),
  patient: z.string().min(1, 'Patient is required.'),
  appointmentType: z.string().min(3, 'Appointment type is required.'),
  durationInMinutes: z.coerce.number().min(1, 'Duration must be greater than 0.'),
  preferredDateRange: z.object({
    from: z.date(),
    to: z.date(),
  }),
  existingCommitments: z.string().min(10, 'Please list at least one existing commitment.'),
});

const defaultCommitments = `2024-08-22 09:00 - 2024-08-22 12:00, Scheduled Surgery (OR 3)
2024-08-22 14:00 - 2024-08-22 15:00, Patient Consultation (Mr. Smith)
2024-08-23 10:00 - 2024-08-23 11:00, Department Meeting
2024-08-24 08:00 - 2024-08-24 17:00, Attending Medical Conference`;

export default function ScheduleAssistantPage() {
  const [analysis, setAnalysis] = useState<ScheduleAppointmentOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      doctor: 'Dr. Evelyn Reed',
      patient: 'Mr. Johnathan Pierce',
      appointmentType: 'Aortic Valve Replacement Surgery',
      durationInMinutes: 180,
      preferredDateRange: { from: new Date(), to: addDays(new Date(), 7) },
      existingCommitments: defaultCommitments,
    },
  });

  const handleAnalyze = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    setError(null);
    setAnalysis(null);

    const input = {
      ...values,
      preferredDateRange: {
        start: format(values.preferredDateRange.from, 'yyyy-MM-dd'),
        end: format(values.preferredDateRange.to, 'yyyy-MM-dd'),
      },
    };

    try {
      const result = await scheduleAppointment(input);
      setAnalysis(result);
    } catch (err) {
      console.error(err);
      setError('An error occurred while finding a slot. Please check the inputs and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirmSchedule = async () => {
    if (!analysis || !analysis.suggestedAppointmentSlot || analysis.suggestedAppointmentSlot.includes("No available slot")) {
        return;
    }

    const [startString] = analysis.suggestedAppointmentSlot.split(' - ');
    const startDate = new Date(startString);
    const formValues = form.getValues();

    await addAppointment({
        doctorName: formValues.doctor,
        patientName: formValues.patient,
        date: format(startDate, 'yyyy-MM-dd'),
        time: format(startDate, 'HH:mm'),
        type: 'Hospital', // Assuming hospital, could be made dynamic
        problemSummary: formValues.appointmentType
    });

    toast({
        title: "Appointment Scheduled!",
        description: `Booked for ${formValues.patient} with ${formValues.doctor} on ${format(startDate, 'PPP p')}.`,
    });
    setAnalysis(null);
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <CalendarClock /> AI Schedule Assistant
        </h1>
        <p className="text-muted-foreground">
          Find the optimal time slot for medical procedures and appointments.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Scheduling Constraints</CardTitle>
          <CardDescription>Provide the details below to find the best available slot.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleAnalyze)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="doctor"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2"><Stethoscope /> Doctor</FormLabel>
                      <FormControl><Input placeholder="e.g., Dr. Smith" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="patient"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2"><User /> Patient</FormLabel>
                      <FormControl><Input placeholder="e.g., Jane Doe" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="appointmentType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2"><Bot /> Appointment Type</FormLabel>
                      <FormControl><Input placeholder="e.g., Consultation" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="durationInMinutes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2"><Clock /> Duration (in minutes)</FormLabel>
                      <FormControl><Input type="number" placeholder="e.g., 60" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

               <FormField
                  control={form.control}
                  name="preferredDateRange"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Preferred Date Range</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            id="date"
                            variant={"outline"}
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !field.value.from && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {field.value?.from ? (
                              field.value.to ? (
                                <>
                                  {format(field.value.from, "LLL dd, y")} -{" "}
                                  {format(field.value.to, "LLL dd, y")}
                                </>
                              ) : (
                                format(field.value.from, "LLL dd, y")
                              )
                            ) : (
                              <span>Pick a date range</span>
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            initialFocus
                            mode="range"
                            defaultMonth={field.value.from}
                            selected={{from: field.value.from, to: field.value.to}}
                            onSelect={(range) => field.onChange(range || { from: new Date(), to: new Date() })}
                            numberOfMonths={2}
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />

              <FormField
                control={form.control}
                name="existingCommitments"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2"><FileText /> Doctor's Existing Commitments</FormLabel>
                    <FormControl>
                      <Textarea placeholder="YYYY-MM-DD HH:MM - YYYY-MM-DD HH:MM, Description" rows={6} {...field} className="font-mono text-xs"/>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isLoading || !form.formState.isValid}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isLoading ? 'Finding Slot...' : 'Find Best Slot'}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {error && (
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {analysis && (
        <Card>
          <CardHeader>
            <CardTitle>AI Scheduling Suggestion</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
             <Alert variant={analysis.suggestedAppointmentSlot.includes("No available slot") ? "destructive" : "default"}>
                <CheckCircle className="h-4 w-4" />
                <AlertTitle>Suggested Slot</AlertTitle>
                <AlertDescription className="font-mono text-base font-semibold">
                    {analysis.suggestedAppointmentSlot}
                </AlertDescription>
            </Alert>
            <div>
              <h3 className="font-semibold text-lg mb-2">Reasoning</h3>
              <p className="text-sm text-muted-foreground italic">"{analysis.reasoning}"</p>
            </div>
            {!analysis.suggestedAppointmentSlot.includes("No available slot") &&
                <Button onClick={handleConfirmSchedule}>Confirm and Schedule</Button>
            }
          </CardContent>
        </Card>
      )}
    </div>
  );
}
