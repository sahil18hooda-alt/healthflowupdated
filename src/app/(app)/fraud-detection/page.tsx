'use client';

import { useState } from 'react';
import { ShieldAlert, ShieldCheck, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { fraudDetection, FraudDetectionOutput } from '@/ai/flows/ai-fraud-detection';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

const exampleData = {
    'Insurance Claim': JSON.stringify([
        { "claimId": "C-1001", "patientId": "P-XYZ", "service": "MRI Scan", "date": "2024-07-20", "cost": 1500 },
        { "claimId": "C-1002", "patientId": "P-XYZ", "service": "MRI Scan", "date": "2024-07-20", "cost": 1500 }
    ], null, 2),
    'Prescription Log': JSON.stringify([
        { "prescriptionId": "RX-55A", "patientId": "P-ABC", "drug": "Oxycodone 10mg", "doctor": "Dr. Smith", "date": "2024-07-15" },
        { "prescriptionId": "RX-99B", "patientId": "P-ABC", "drug": "Oxycodone 10mg", "doctor": "Dr. Jones", "date": "2024-07-18" }
    ], null, 2)
};

export default function FraudDetectionPage() {
  const [dataType, setDataType] = useState<'Insurance Claim' | 'Prescription Log'>('Insurance Claim');
  const [jsonData, setJsonData] = useState(exampleData['Insurance Claim']);
  const [analysisResult, setAnalysisResult] = useState<FraudDetectionOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDataTypeChange = (value: 'Insurance Claim' | 'Prescription Log') => {
    setDataType(value);
    setJsonData(exampleData[value]);
    setAnalysisResult(null);
  };

  const handleAnalyze = async () => {
    try {
        JSON.parse(jsonData);
    } catch (e) {
        setError('Invalid JSON format. Please check the data and try again.');
        return;
    }

    setIsLoading(true);
    setError(null);
    setAnalysisResult(null);

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
          <CardDescription>Select the data type and provide the JSON data to be analyzed.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
             <div className="space-y-2">
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
             <div className="md:col-span-3 space-y-2">
                <Label htmlFor="json-data">Claim or Log Data (JSON format)</Label>
                <Textarea
                    id="json-data"
                    placeholder="Enter JSON data here..."
                    value={jsonData}
                    onChange={(e) => setJsonData(e.target.value)}
                    rows={10}
                    disabled={isLoading}
                    className="font-mono text-xs"
                />
             </div>
          </div>
          <Button onClick={handleAnalyze} disabled={isLoading || !jsonData.trim()}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isLoading ? 'Analyzing...' : 'Analyze for Fraud'}
          </Button>
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
