'use client';

import { useState, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Plus, X, Pill, Clock, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import type { Medication } from '@/lib/types';
import { mockMedications, addMedication as apiAddMedication } from '@/lib/mock-data';

const medicationSchema = z.object({
  name: z.string().min(2, 'Medication name is required.'),
  dosage: z.string().optional(),
  time: z.string().min(1, 'Time is required (e.g., 09:00 AM).'),
});

export function MedicationReminder() {
  const [medications, setMedications] = useState<Medication[]>(mockMedications);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof medicationSchema>>({
    resolver: zodResolver(medicationSchema),
    defaultValues: { name: '', dosage: '', time: '' },
  });

  const handleAddMedication = (values: z.infer<typeof medicationSchema>) => {
    const newMedication: Medication = {
      id: `med-${Date.now()}`,
      name: values.name,
      dosage: values.dosage,
      frequency: 'As scheduled', // This can be customized if needed
      time: values.time.split(',').map(t => t.trim()),
    };
    setMedications(prev => [...prev, newMedication]);
    toast({ title: 'Medication Added', description: `${values.name} has been added.` });
    form.reset();
    setIsModalOpen(false);
  };

  const handleRemoveMedication = (id: string) => {
    setMedications(prev => prev.filter(med => med.id !== id));
    toast({ title: 'Medication Removed', variant: 'destructive' });
  };

  const today = useMemo(() => new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }), []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">Good morning!</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Today is {today}.</p>
        </header>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Your Medications</h2>
            <Button onClick={() => setIsModalOpen(true)} className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-4 py-2 flex items-center gap-2 transition-transform transform hover:scale-105">
              <Plus className="w-5 h-5" />
              <span className="hidden sm:inline">Add New</span>
            </Button>
          </div>

          {medications.length > 0 ? (
            <ul className="space-y-4">
              {medications.map((med) => (
                <li key={med.id} className="bg-gray-100 dark:bg-gray-700 rounded-xl p-4 flex items-center justify-between transition-shadow hover:shadow-md">
                  <div className="flex items-center gap-4">
                    <div className="bg-blue-100 dark:bg-blue-900 p-3 rounded-full">
                      <Pill className="w-6 h-6 text-blue-600 dark:text-blue-300" />
                    </div>
                    <div>
                      <p className="font-semibold text-lg">{med.name}</p>
                      <p className="text-gray-500 dark:text-gray-400 text-sm">
                        {med.dosage}{med.dosage && med.time.length > 0 ? ' - ' : ''}{med.time.join(', ')}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                     <Checkbox id={`taken-${med.id}`} className="w-5 h-5" />
                     <label htmlFor={`taken-${med.id}`} className="text-sm font-medium select-none">Taken</label>
                    <Button variant="ghost" size="icon" onClick={() => handleRemoveMedication(med.id)} className="text-gray-400 hover:text-red-500 hover:bg-red-100 dark:hover:bg-red-900 rounded-full">
                      <Trash2 className="w-5 h-5" />
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-center py-10 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl">
              <Pill className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-4 text-lg font-medium">No medications scheduled.</h3>
              <p className="mt-1 text-sm text-gray-500">Click "Add New" to get started.</p>
            </div>
          )}
        </div>
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="bg-white dark:bg-gray-800 rounded-2xl">
          <DialogHeader className="flex justify-between items-center">
            <DialogTitle className="text-2xl font-semibold">Add New Medication</DialogTitle>
            <Button variant="ghost" size="icon" onClick={() => setIsModalOpen(false)} className="rounded-full">
              <X className="w-5 h-5" />
            </Button>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleAddMedication)} className="space-y-6 pt-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-semibold">Medication Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Vitamin D3" {...field} className="w-full p-3 bg-gray-100 dark:bg-gray-700 rounded-lg border-transparent focus:ring-2 focus:ring-blue-500" />
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
                    <FormLabel className="font-semibold">Dosage (optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., 1000 IU" {...field} className="w-full p-3 bg-gray-100 dark:bg-gray-700 rounded-lg border-transparent focus:ring-2 focus:ring-blue-500" />
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
                    <FormLabel className="font-semibold">Time</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., 9:00 AM, 5:00 PM" {...field} className="w-full p-3 bg-gray-100 dark:bg-gray-700 rounded-lg border-transparent focus:ring-2 focus:ring-blue-500" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter className="mt-6">
                <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-colors">
                  Save Medication
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
