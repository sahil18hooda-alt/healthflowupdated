'use client';

import { useState, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Bot, Loader2, AlertTriangle, ShieldCheck, FileText, Activity, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { predictiveRiskModel } from '@/ai/flows/ai-predictive-risk-model';
import type { PredictiveRiskOutput } from '@/lib/types';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { Label } from '@/components/ui/label';

const formSchema = z.object({
  patientData: z.string().min(100, 'Please provide more detailed patient data for an accurate analysis.'),
});

const defaultPatientData = `Age: 72, Sex: Male
Medical History: Type 2 Diabetes, Hypertension, previous Myocardial Infarction (MI) 3 years ago.
Current Admission: Admitted for Community-Acquired Pneumonia. Treated with IV antibiotics.
Vital Signs: BP 140/90, HR 95, Temp 37.8C.
Lab Results: WBC 12.5, Creatinine 1.4, Glucose 180.
Current Medications: Metformin, Lisinopril, Aspirin, Atorvastatin.`;

export default function PredictiveRiskModelPage() {
  const [analysis, setAnalysis] = useState<PredictiveRiskOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      patientData: defaultPatientData,
    },
  });

  const handleAnalyze = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    setError(null);
    setAnalysis(null);

    try {
      const result = await predictiveRiskModel({ patientData: values.patientData });
      setAnalysis(result);
    } catch (err) {
      console.error(err);
      setError('An error occurred while calculating risk scores. Please check the data and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const getRiskColor = (score: number) => {
    if (score > 65) return 'bg-red-500';
    if (score > 35) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Activity /> Predictive Patient Risk Model
        </h1>
        <p className="text-muted-foreground">
          Analyze clinical data to predict hospital readmission and complication risks.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Patient Clinical Data</CardTitle>
          <CardDescription>Enter a comprehensive summary of the patient's data. Use the example as a guide.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleAnalyze)} className="space-y-6">
              <FormField
                control={form.control}
                name="patientData"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4" /> Patient Summary
                      </div>
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter patient data here..."
                        rows={10}
                        className="font-mono text-xs"
                        disabled={isLoading}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isLoading || !form.formState.isValid}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isLoading ? 'Calculating...' : 'Calculate Risk Scores'}
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
            <CardTitle>AI-Powered Risk Analysis</CardTitle>
            <CardDescription>The model has analyzed the patient's data and generated the following assessment.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <div className="flex justify-between items-center">
                        <Label htmlFor="readmission-risk">Hospital Readmission Risk</Label>
                        <span className={cn("font-bold text-lg", getRiskColor(analysis.readmissionRiskScore).replace('bg-','text-'))}>{analysis.readmissionRiskScore}%</span>
                    </div>
                    <Progress id="readmission-risk" value={analysis.readmissionRiskScore} className="h-4" indicatorClassName={getRiskColor(analysis.readmissionRiskScore)} />
                </div>
                 <div className="space-y-2">
                    <div className="flex justify-between items-center">
                        <Label htmlFor="complication-risk">Post-Discharge Complication Risk</Label>
                        <span className={cn("font-bold text-lg", getRiskColor(analysis.complicationRiskScore).replace('bg-','text-'))}>{analysis.complicationRiskScore}%</span>
                    </div>
                    <Progress id="complication-risk" value={analysis.complicationRiskScore} className="h-4" indicatorClassName={getRiskColor(analysis.complicationRiskScore)} />
                </div>
            </div>

            <div className="space-y-4">
                <div>
                    <h3 className="font-semibold text-lg mb-2 flex items-center gap-2"><TrendingUp /> Key Risk Factors</h3>
                    <ul className="space-y-2">
                    {analysis.riskFactors.map((item, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm">
                            <AlertTriangle className="h-4 w-4 text-orange-500 mt-1 shrink-0" />
                            <div>
                                <span className="font-semibold">{item.factor}:</span>
                                <span className="text-muted-foreground ml-1">{item.explanation}</span>
                            </div>
                        </li>
                    ))}
                    </ul>
                </div>

                <Alert>
                    <ShieldCheck className="h-4 w-4" />
                    <AlertTitle>Summary & Recommendations</AlertTitle>
                    <AlertDescription className="space-y-3">
                        <p className="font-semibold italic">"{analysis.summary}"</p>
                        <div>
                            <p className="font-bold mb-1">Recommendations:</p>
                             <ul className="list-disc space-y-1 pl-5">
                                {analysis.recommendations.map((rec, index) => (
                                    <li key={index}>{rec}</li>
                                ))}
                            </ul>
                        </div>
                    </AlertDescription>
                </Alert>
            </div>

          </CardContent>
        </Card>
      )}
    </div>
  );
}
