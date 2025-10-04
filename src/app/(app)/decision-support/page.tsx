'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Bot, Loader2, Lightbulb, FileText, History, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { analyzeSymptoms, AnalyzeSymptomsOutput } from '@/ai/flows/ai-symptom-analysis';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

const formSchema = z.object({
  symptoms: z.string().min(20, 'Please provide more detailed symptom information.'),
  history: z.string().optional(),
  demographics: z.string().optional(),
});

export default function DecisionSupportPage() {
  const [analysis, setAnalysis] = useState<AnalyzeSymptomsOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      symptoms: 'Patient presents with a persistent dry cough for the last two weeks, accompanied by a slight fever in the evenings and general fatigue.',
      history: 'History of asthma, non-smoker.',
      demographics: '35 y/o female, no recent international travel.',
    },
  });

  const handleAnalyze = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    setError(null);
    setAnalysis(null);

    try {
      const result = await analyzeSymptoms(values);
      setAnalysis(result);
    } catch (err) {
      console.error(err);
      setError('An error occurred while analyzing the data. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Bot /> AI Decision Support
        </h1>
        <p className="text-muted-foreground">
          Analyze patient data to assist with differential diagnosis.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Patient Information</CardTitle>
          <CardDescription>Enter the patient's symptoms, history, and demographics for analysis.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleAnalyze)} className="space-y-6">
              <FormField
                control={form.control}
                name="symptoms"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2"><FileText /> Patient Symptoms</FormLabel>
                    <FormControl>
                      <Textarea placeholder="e.g., Persistent dry cough..." rows={5} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="history"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2"><History /> Relevant Medical History (Optional)</FormLabel>
                      <FormControl>
                        <Textarea placeholder="e.g., History of asthma..." rows={3} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="demographics"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2"><User /> Patient Demographics (Optional)</FormLabel>
                      <FormControl>
                        <Textarea placeholder="e.g., 35 y/o female..." rows={3} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <Button type="submit" disabled={isLoading || !form.formState.isValid}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isLoading ? 'Analyzing...' : 'Analyze for Diagnosis'}
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
            <CardTitle>AI-Generated Analysis</CardTitle>
            <CardDescription>This is a preliminary analysis to support clinical decision-making.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="font-semibold text-lg mb-2">Possible Conditions</h3>
              <p className="text-sm text-muted-foreground whitespace-pre-wrap">{analysis.possibleConditions}</p>
            </div>
            {analysis.confidenceLevels && (
              <div>
                <h3 className="font-semibold text-lg mb-2">Confidence Levels</h3>
                <p className="text-sm text-muted-foreground whitespace-pre-wrap">{analysis.confidenceLevels}</p>
              </div>
            )}
            <Alert>
              <Lightbulb className="h-4 w-4" />
              <AlertTitle>Disclaimer</AlertTitle>
              <AlertDescription>{analysis.disclaimer}</AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
