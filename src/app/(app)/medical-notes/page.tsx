'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Bot, Loader2,Clipboard, FileText, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { generateMedicalNotes, MedicalNotesOutput } from '@/ai/flows/ai-medical-notes-generation';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

const formSchema = z.object({
  chatLog: z.string().min(50, 'Please provide a more detailed chat log for accurate note generation.'),
  symptoms: z.string().min(5, 'Please list at least one key symptom.'),
});

export default function MedicalNotesPage() {
  const [generatedNotes, setGeneratedNotes] = useState<MedicalNotesOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      chatLog: "Patient: Good morning, Doctor. I've been having these really bad headaches for about a week now.\nDoctor: Can you describe them for me?\nPatient: They're a throbbing pain, mostly on one side of my head, and sometimes I feel nauseous and sensitive to light.",
      symptoms: "Headaches, nausea, photosensitivity",
    },
  });

  const handleGenerateNotes = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    setError(null);
    setGeneratedNotes(null);

    try {
      const result = await generateMedicalNotes(values);
      setGeneratedNotes(result);
    } catch (err) {
      console.error(err);
      setError('An error occurred while generating the medical notes. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Bot /> AI Medical Notes Generator
        </h1>
        <p className="text-muted-foreground">
          Transform conversational patient data into structured medical notes.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Patient Consultation Data</CardTitle>
          <CardDescription>Paste the patient chat log and list key symptoms to generate notes.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleGenerateNotes)} className="space-y-6">
              <FormField
                control={form.control}
                name="chatLog"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2"><FileText /> Patient Chat Log</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Paste the full consultation transcript here..." rows={10} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="symptoms"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2"><User /> Key Symptoms</FormLabel>
                    <FormControl>
                      <Textarea placeholder="e.g., Headache, nausea, fatigue" rows={2} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isLoading || !form.formState.isValid}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isLoading ? 'Generating...' : 'Generate Notes'}
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

      {generatedNotes && (
        <Card>
          <CardHeader>
            <CardTitle>Generated Medical Notes</CardTitle>
            <CardDescription>Review and copy the generated notes for your records.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="prose prose-sm max-w-none rounded-md border bg-muted p-4 whitespace-pre-wrap">
                {generatedNotes.medicalNotes}
            </div>
             <Button
                variant="outline"
                size="sm"
                className="mt-4"
                onClick={() => navigator.clipboard.writeText(generatedNotes.medicalNotes)}
            >
                <Clipboard className="mr-2 h-4 w-4" />
                Copy to Clipboard
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
