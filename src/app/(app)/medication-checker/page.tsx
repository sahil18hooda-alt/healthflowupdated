'use client';

import { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Beaker, PlusCircle, X, Loader2, AlertTriangle, ShieldCheck, ShieldX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { checkMedicationInteractions } from '@/ai/flows/ai-medication-interaction-checker';
import type { MedicationInteractionOutput } from '@/lib/types';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const formSchema = z.object({
  medications: z.array(z.object({ name: z.string().min(1, 'Medication name cannot be empty.') })).min(2, 'At least two medications are required.'),
});

export default function MedicationInteractionCheckerPage() {
  const [analysis, setAnalysis] = useState<MedicationInteractionOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      medications: [{ name: 'Lisinopril' }, { name: 'Ibuprofen' }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'medications',
  });

  const handleAnalyze = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    setError(null);
    setAnalysis(null);

    try {
      const medicationNames = values.medications.map(m => m.name);
      const result = await checkMedicationInteractions({ medications: medicationNames });
      setAnalysis(result);
    } catch (err) {
      console.error(err);
      setError('An error occurred while checking for interactions. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const getSeverityVariant = (severity: 'Minor' | 'Moderate' | 'Major'): 'default' | 'secondary' | 'destructive' => {
    switch (severity) {
      case 'Major': return 'destructive';
      case 'Moderate': return 'secondary';
      case 'Minor': return 'default';
      default: return 'default';
    }
  };
  
    const getSeverityColor = (severity: 'Minor' | 'Moderate' | 'Major'): string => {
        switch (severity) {
            case 'Major': return 'border-red-500/50 bg-red-500/10';
            case 'Moderate': return 'border-yellow-500/50 bg-yellow-500/10';
            case 'Minor': return 'border-gray-500/50 bg-gray-500/10';
            default: return 'border-border';
        }
    };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Beaker /> AI Medication Interaction Checker
        </h1>
        <p className="text-muted-foreground">
          Check for potential interactions between your medications.
        </p>
      </div>
        
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>For Informational Purposes Only</AlertTitle>
        <AlertDescription>
          This tool does not replace professional medical advice. Always consult your doctor or pharmacist.
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <CardTitle>Enter Medications</CardTitle>
          <CardDescription>Add at least two medications, supplements, or vitamins to check for interactions.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleAnalyze)} className="space-y-4">
              <div className="space-y-4">
                {fields.map((field, index) => (
                  <FormField
                    key={field.id}
                    control={form.control}
                    name={`medications.${index}.name`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className={cn('sr-only')}>Medication {index + 1}</FormLabel>
                        <div className="flex items-center gap-2">
                          <FormControl>
                            <Input placeholder={`e.g., Tylenol`} {...field} />
                          </FormControl>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => remove(index)}
                            disabled={fields.length <= 2}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                ))}
              </div>

              <div className="flex items-center gap-4">
                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => append({ name: '' })}
                >
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add Medication
                </Button>
                <Button type="submit" disabled={isLoading || !form.formState.isValid}>
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Check for Interactions
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

      {error && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {analysis && (
        <Card>
          <CardHeader>
            <CardTitle>Interaction Report</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <Alert variant={analysis.interactions.length > 0 ? "destructive" : "default"}>
              {analysis.interactions.length > 0 ? <ShieldX className="h-4 w-4" /> : <ShieldCheck className="h-4 w-4" />}
              <AlertTitle>
                {analysis.summary}
              </AlertTitle>
               <AlertDescription>
                {analysis.interactions.length > 0 
                    ? `Found ${analysis.interactions.length} potential interaction(s). Please review the details below.`
                    : 'The AI did not find any potential interactions between the medications you entered.'
                }
              </AlertDescription>
            </Alert>
            
            {analysis.interactions.length > 0 && (
                <div className="space-y-4">
                    {analysis.interactions.map((interaction, index) => (
                        <Card key={index} className={cn("border-2", getSeverityColor(interaction.severity))}>
                            <CardHeader>
                                <CardTitle className="flex items-center justify-between">
                                    <span>{interaction.medications.join(' + ')}</span>
                                     <Badge variant={getSeverityVariant(interaction.severity)}>{interaction.severity}</Badge>
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-foreground/80">{interaction.description}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
            
            <Alert variant="destructive" className="mt-6">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Disclaimer</AlertTitle>
                <AlertDescription>{analysis.disclaimer}</AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
