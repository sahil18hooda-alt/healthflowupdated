'use client';

import { useState, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Bot, Loader2, ShieldAlert, ShieldCheck, FileJson } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { fraudDetection } from '@/ai/flows/ai-fraud-detection';
import type { FraudDetectionOutput } from '@/lib/types';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { Label } from '@/components/ui/label';

const formSchema = z.object({
  dataType: z.enum(['Insurance Claim', 'Prescription Log']),
  data: z.string().refine((val) => {
    try {
      JSON.parse(val);
      return true;
    } catch (e) {
      return false;
    }
  }, { message: 'Invalid JSON format.' }),
});

const defaultClaimData = [
  { "claimId": "CLM-001", "patientId": "PAT-123", "service": "Cardiology Consultation", "date": "2024-07-20", "cost": 250 },
  { "claimId": "CLM-002", "patientId": "PAT-123", "service": "Cardiology Consultation", "date": "2024-07-20", "cost": 250 }
];

const defaultPrescriptionData = [
  { "prescriptionId": "RX-A01", "patientId": "PAT-456", "drug": "Oxycodone 10mg", "doctor": "Dr. Smith", "date": "2024-07-18" },
  { "prescriptionId": "RX-B02", "patientId": "PAT-456", "drug": "Oxycodone 10mg", "doctor": "Dr. Jones", "date": "2024-07-19" }
];


export default function FraudDetectionPage() {
  const [analysis, setAnalysis] = useState<FraudDetectionOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      dataType: 'Insurance Claim',
      data: JSON.stringify(defaultClaimData, null, 2),
    },
  });

  const dataType = form.watch('dataType');

  useMemo(() => {
    if (dataType === 'Insurance Claim') {
      form.setValue('data', JSON.stringify(defaultClaimData, null, 2));
    } else {
      form.setValue('data', JSON.stringify(defaultPrescriptionData, null, 2));
    }
  }, [dataType, form]);

  const handleAnalyze = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    setError(null);
    setAnalysis(null);

    try {
      const result = await fraudDetection({ dataType: values.dataType, data: values.data });
      setAnalysis(result);
    } catch (err) {
      console.error(err);
      setError('An error occurred while analyzing the data. Please check the format and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const riskColor = useMemo(() => {
    if (!analysis) return 'bg-gray-400';
    if (analysis.riskScore > 75) return 'bg-red-500';
    if (analysis.riskScore > 40) return 'bg-yellow-500';
    return 'bg-green-500';
  }, [analysis]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Bot /> AI Fraud Detection
        </h1>
        <p className="text-muted-foreground">
          Analyze medical claims and prescriptions for fraudulent activity.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Submit Data for Analysis</CardTitle>
          <CardDescription>Select the data type and provide the data in JSON format.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleAnalyze)} className="space-y-6">
              <FormField
                control={form.control}
                name="dataType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Data Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a data type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Insurance Claim">Insurance Claim</SelectItem>
                        <SelectItem value="Prescription Log">Prescription Log</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="data"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      <div className="flex items-center gap-2">
                        <FileJson className="h-4 w-4" /> {dataType} Data (JSON)
                      </div>
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter data here..."
                        rows={10}
                        className="font-mono text-xs"
                        disabled={isLoading}
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Edit the default example or paste your own JSON data.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isLoading || !form.formState.isValid}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isLoading ? 'Analyzing...' : 'Analyze for Fraud'}
              </Button>
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
            <CardTitle>Analysis Results</CardTitle>
            <CardDescription>The AI has analyzed the provided data.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <Alert variant={analysis.isSuspicious ? 'destructive' : 'default'}>
              {analysis.isSuspicious ? <ShieldAlert className="h-4 w-4" /> : <ShieldCheck className="h-4 w-4" />}
              <AlertTitle>{analysis.isSuspicious ? 'Suspicious Activity Detected' : 'No Suspicious Activity Detected'}</AlertTitle>
              <AlertDescription>{analysis.summary}</AlertDescription>
            </Alert>
            
            <div className="space-y-2">
                <div className="flex justify-between items-center">
                    <Label htmlFor="risk-score">Fraud Risk Score</Label>
                    <span className={cn("font-bold text-lg", riskColor.replace('bg-', 'text-'))}>{analysis.riskScore} / 100</span>
                </div>
                <Progress id="risk-score" value={analysis.riskScore} className="h-3" indicatorClassName={riskColor} />
            </div>

            {analysis.isSuspicious && analysis.reasons.length > 0 && (
              <div>
                <h3 className="font-semibold text-lg mb-2">Reasons for Suspicion</h3>
                <ul className="list-disc space-y-2 pl-5 text-sm text-muted-foreground">
                  {analysis.reasons.map((reason, index) => (
                    <li key={index}>{reason}</li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
