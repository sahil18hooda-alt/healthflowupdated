
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Pill, PlusCircle, Trash2, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { mockMedications, addMedication as apiAddMedication } from '@/lib/mock-data';
import type { Medication } from '@/lib/types';
import { Checkbox } from '@/components/ui/checkbox';

const medicationSchema = z.object({
  name: z.string().min(2, 'Medication name is required.'),
  dosage: z.string().min(1, 'Dosage is required (e.g., 500mg).'),
  frequency: z.string().min(1, 'Frequency is required (e.g., Once a day).'),
  time: z.string().min(1, 'At least one time is required (e.g., 09:00 AM).'),
});

function AddMedicationDialog({ onAddMedication }: { onAddMedication: (med: Medication) => void }) {
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();
  const form = useForm<z.infer<typeof medicationSchema>>({
    resolver: zodResolver(medicationSchema),
    defaultValues: { name: '', dosage: '', frequency: '', time: '' },
  });

  function onSubmit(values: z.infer<typeof medicationSchema>) {
    const newMedication = apiAddMedication({ ...values, time: values.time.split(',').map(t => t.trim()) });
    onAddMedication(newMedication);
    toast({
      title: 'Medication Added',
      description: `${values.name} has been added to your schedule.`,
    });
    form.reset();
    setIsOpen(false);
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" /> Add Medication
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Medication</DialogTitle>
          <DialogDescription>
            Enter the details of your new medication below.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Medication Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Paracetamol" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="dosage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Dosage</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., 500mg" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="frequency"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Frequency</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Twice a day" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="time"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Times</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., 08:00 AM, 08:00 PM" {...field} />
                  </FormControl>
                   <p className="text-sm text-muted-foreground">
                        Enter times separated by commas.
                    </p>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit">Save Medication</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

function MedicationCard({ medication, onRemove }: { medication: Medication, onRemove: (id: string) => void }) {
    const [takenTimes, setTakenTimes] = useState<string[]>([]);
    
    const handleTakenChange = (time: string, isTaken: boolean) => {
        if(isTaken) {
            setTakenTimes(prev => [...prev, time]);
        } else {
            setTakenTimes(prev => prev.filter(t => t !== time));
        }
    }

    return (
        <Card>
            <CardHeader className="flex flex-row items-start justify-between">
                <div>
                    <CardTitle className="flex items-center gap-2">
                        <Pill /> {medication.name}
                    </CardTitle>
                    <CardDescription>{medication.dosage} - {medication.frequency}</CardDescription>
                </div>
                <Button variant="ghost" size="icon" onClick={() => onRemove(medication.id)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
            </CardHeader>
            <CardContent className="space-y-3">
                 <p className="font-semibold text-sm">Today's Schedule:</p>
                 <div className="space-y-2">
                    {medication.time.map(time => (
                        <div key={time} className="flex items-center justify-between rounded-md bg-muted p-3">
                            <div className="flex items-center gap-2">
                                 <Clock className="h-4 w-4 text-muted-foreground" />
                                 <span className="font-mono">{time}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Checkbox
                                    id={`${medication.id}-${time}`}
                                    checked={takenTimes.includes(time)}
                                    onCheckedChange={(checked) => handleTakenChange(time, !!checked)}
                                />
                                <label
                                    htmlFor={`${medication.id}-${time}`}
                                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                >
                                    Taken
                                </label>
                            </div>
                        </div>
                    ))}
                 </div>
            </CardContent>
        </Card>
    );
}

export default function MedicationsPage() {
  const [medications, setMedications] = useState<Medication[]>(mockMedications);
  const { toast } = useToast();

  const handleAddMedication = (newMedication: Medication) => {
    setMedications(prev => [newMedication, ...prev]);
  };

  const handleRemoveMedication = (id: string) => {
    setMedications(prev => prev.filter(med => med.id !== id));
    toast({
      title: 'Medication Removed',
      description: 'The medication has been removed from your schedule.',
      variant: 'destructive',
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Medication Tracker</h1>
          <p className="text-muted-foreground">
            Manage your medication schedule and reminders.
          </p>
        </div>
        <AddMedicationDialog onAddMedication={handleAddMedication} />
      </div>

      {medications.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {medications.map((med) => (
            <MedicationCard key={med.id} medication={med} onRemove={handleRemoveMedication} />
          ))}
        </div>
      ) : (
        <Card className="text-center py-12">
            <CardContent>
                <Pill className="mx-auto h-12 w-12 text-muted-foreground" />
                <h3 className="mt-4 text-lg font-medium">No Medications Added</h3>
                <p className="mt-1 text-sm text-muted-foreground">Click "Add Medication" to start tracking your schedule.</p>
            </CardContent>
        </Card>
      )}
    </div>
  );
}
