'use client';

import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ShieldAlert, ShieldCheck, Loader2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { fraudDetection, FraudDetectionOutput } from '@/ai/flows/ai-fraud-detection';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';


const claimSchema = z.object({
  claimId: z.string().min(1, "Claim ID is required."),
  patientId: z.string().min(1, "Patient ID is required."),
  service: z.string().min(1, "Service description is required."),
  date: z.string().min(1, "Date is required."),
  cost: z.coerce.number().min(0, "Cost must be a positive number."),
});

const prescriptionSchema = z.object({
  prescriptionId: z.string().min(1, "Prescription ID is required."),
  patientId: z.string().min(1, "Patient ID is required."),
  drug: z.string().min(1, "Drug name is required."),
  doctor: z.string().min(1, "Doctor name is required."),
  date: z.string().min(1, "Date is required."),
});


export default function FraudDetectionPage() {
  const [dataType, setDataType] = useState<'Insurance Claim' | 'Prescription Log'>('Insurance Claim');
  const [analysisResult, setAnalysisResult] = useState<FraudDetectionOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const claimForm = useForm({
    resolver: zodResolver(claimSchema),
    defaultValues: {
      claimId: 'C-1001',
      patientId: 'P-XYZ',
      service: 'MRI Scan',
      date: '2024-07-20',
      cost: 1500,
    },
  });

  const prescriptionForm = useForm({
    resolver: zodResolver(prescriptionSchema),
    defaultValues: {
      prescriptionId: 'RX-55A',
      patientId: 'P-ABC',
      drug: 'Oxycodone 10mg',
      doctor: 'Dr. Smith',
      date: '2024-07-15',
    },
  });

  const handleDataTypeChange = (value: 'Insurance Claim' | 'Prescription Log') => {
    setDataType(value);
    setAnalysisResult(null);
    setError(null);
  };

  const handleAnalyze = async (formData: any) => {
    setIsLoading(true);
    setError(null);
    setAnalysisResult(null);

    // We'll wrap the single object in an array to match the AI's expected training format
    const jsonData = JSON.stringify([formData], null, 2);

    try {
      const result = await fraudDetection({ dataType, jsonData });
      setAnalysisResult(result);
    } catch (err) {
      console.error(err);
      setError('An error occurred during analysis. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const renderForm = () => {
    if (dataType === 'Insurance Claim') {
      return (
        <Form {...claimForm}>
          <form onSubmit={claimForm.handleSubmit(handleAnalyze)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField control={claimForm.control} name="claimId" render={({ field }) => ( <FormItem> <FormLabel>Claim ID</FormLabel> <FormControl> <Input {...field} /> </FormControl> <FormMessage /> </FormItem> )} />
              <FormField control={claimForm.control} name="patientId" render={({ field }) => ( <FormItem> <FormLabel>Patient ID</FormLabel> <FormControl> <Input {...field} /> </FormControl> <FormMessage /> </FormItem> )} />
              <FormField control={claimForm.control} name="service" render={({ field }) => ( <FormItem> <FormLabel>Service</FormLabel> <FormControl> <Input {...field} /> </FormControl> <FormMessage /> </FormItem> )} />
              <FormField control={claimForm.control} name="date" render={({ field }) => ( <FormItem> <FormLabel>Date</FormLabel> <FormControl> <Input type="date" {...field} /> </FormControl> <FormMessage /> </FormItem> )} />
              <FormField control={claimForm.control} name="cost" render={({ field }) => ( <FormItem> <FormLabel>Cost ($)</FormLabel> <FormControl> <Input type="number" {...field} /> </FormControl> <FormMessage /> </FormItem> )} />
            </div>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isLoading ? 'Analyzing...' : 'Analyze for Fraud'}
            </Button>
          </form>
        </Form>
      )
    } else {
       return (
        <Form {...prescriptionForm}>
          <form onSubmit={prescriptionForm.handleSubmit(handleAnalyze)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField control={prescriptionForm.control} name="prescriptionId" render={({ field }) => ( <FormItem> <FormLabel>Prescription ID</FormLabel> <FormControl> <Input {...field} /> </FormControl> <FormMessage /> </FormItem> )} />
                <FormField control={prescriptionForm.control} name="patientId" render={({ field }) => ( <FormItem> <FormLabel>Patient ID</FormLabel> <FormControl> <Input {...field} /> </FormControl> <FormMessage /> </FormItem> )} />
                <FormField control={prescriptionForm.control} name="drug" render={({ field }) => ( <FormItem> <FormLabel>Drug</FormLabel> <FormControl> <Input {...field} /> </FormControl> <FormMessage /> </FormItem> )} />
                <FormField control={prescriptionForm.control} name="doctor" render={({ field }) => ( <FormItem> <FormLabel>Prescribing Doctor</FormLabel> <FormControl> <Input {...field} /> </FormControl> <FormMessage /> </FormItem> )} />
                <FormField control={prescriptionForm.control} name="date" render={({ field }) => ( <FormItem> <FormLabel>Date</FormLabel> <FormControl> <Input type="date" {...field} /> </FormControl> <FormMessage /> </FormItem> )} />
            </div>
             <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isLoading ? 'Analyzing...' : 'Analyze for Fraud'}
            </Button>
          </form>
        </Form>
      )
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-2">
            <ShieldAlert /> AI Fraud Detection
        </h1>
        <p className="text-muted-foreground">
          Analyze medical claims and prescription logs for suspicious activity.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Analyze Data</CardTitle>
          <CardDescription>Select the data type and provide the details to be analyzed.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2 max-w-sm">
            <Label htmlFor="data-type">Data Type</Label>
            <Select onValueChange={handleDataTypeChange} defaultValue={dataType}>
                <SelectTrigger id="data-type">
                    <SelectValue placeholder="Select data type" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="Insurance Claim">Insurance Claim</SelectItem>
                    <SelectItem value="Prescription Log">Prescription Log</SelectItem>
                </SelectContent>
            </Select>
          </div>
          <div className="mt-6">
            {renderForm()}
          </div>
        </CardContent>
      </Card>

      {error && (
        <Alert variant="destructive">
          <ShieldAlert className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {analysisResult && (
        <Card>
          <CardHeader>
            <CardTitle>Analysis Report</CardTitle>
            <CardDescription>The AI has analyzed the provided data for potential fraud.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <Alert variant={analysisResult.isSuspicious ? 'destructive' : 'default'}>
                {analysisResult.isSuspicious ? <ShieldAlert className="h-4 w-4" /> : <ShieldCheck className="h-4 w-4" />}
                <AlertTitle>{analysisResult.isSuspicious ? 'Suspicious Activity Detected' : 'No Suspicious Activity Detected'}</AlertTitle>
                <AlertDescription>
                   {analysisResult.summary}
                </AlertDescription>
            </Alert>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <Label>Fraud Risk Score: {analysisResult.riskScore}/100</Label>
                    <Progress value={analysisResult.riskScore} className={cn(analysisResult.riskScore > 75 ? '[&>div]:bg-red-500' : analysisResult.riskScore > 50 ? '[&>div]:bg-orange-500' : '[&>div]:bg-primary')} />
                </div>
                <div>
                    <h3 className="font-semibold text-lg mb-2">Analysis Reasons</h3>
                    <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
                        {analysisResult.reasons.map((reason, index) => (
                            <li key={index}>{reason}</li>
                        ))}
                    </ul>
                </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
