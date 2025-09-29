'use client';

import { useState } from 'react';
import { Syringe, PlusCircle, XCircle, Loader2, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { drugInteractionChecker, DrugInteractionOutput } from '@/ai/flows/drug-interaction-flow';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';

export default function DrugInteractionCheckerPage() {
  const [drugs, setDrugs] = useState<string[]>(['', '']);
  const [result, setResult] = useState<DrugInteractionOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDrugChange = (index: number, value: string) => {
    const newDrugs = [...drugs];
    newDrugs[index] = value;
    setDrugs(newDrugs);
  };

  const addDrugInput = () => {
    setDrugs([...drugs, '']);
  };

  const removeDrugInput = (index: number) => {
    const newDrugs = drugs.filter((_, i) => i !== index);
    setDrugs(newDrugs);
  };

  const handleCheck = async () => {
    const validDrugs = drugs.map(d => d.trim()).filter(d => d !== '');
    if (validDrugs.length < 2) {
      setError('Please enter at least two drugs to check for interactions.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const apiResult = await drugInteractionChecker({ drugs: validDrugs });
      setResult(apiResult);
    } catch (err) {
      console.error(err);
      setError('An error occurred while checking for interactions. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-2">
            <Syringe /> Drug Interaction Checker
        </h1>
        <p className="text-muted-foreground">
          Check for potential interactions between multiple medications.
        </p>
      </div>

       <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>For Informational Purposes Only</AlertTitle>
        <AlertDescription>
          This tool does not replace professional medical advice. Consult your doctor or pharmacist before making any changes to your medication regimen.
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <CardTitle>Enter Medications</CardTitle>
          <CardDescription>Add two or more drugs to check for interactions.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            {drugs.map((drug, index) => (
              <div key={index} className="flex items-center gap-2">
                <Input
                  placeholder={`Drug name ${index + 1}`}
                  value={drug}
                  onChange={(e) => handleDrugChange(index, e.target.value)}
                  disabled={isLoading}
                />
                {drugs.length > 2 && (
                  <Button variant="ghost" size="icon" onClick={() => removeDrugInput(index)} disabled={isLoading}>
                    <XCircle className="h-5 w-5 text-destructive" />
                  </Button>
                )}
              </div>
            ))}
          </div>
          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={addDrugInput} disabled={isLoading}>
              <PlusCircle className="mr-2 h-4 w-4" /> Add another drug
            </Button>
            <Button onClick={handleCheck} disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isLoading ? 'Checking...' : 'Check for Interactions'}
            </Button>
          </div>
        </CardContent>
      </Card>

       {error && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {result && (
        <Card>
          <CardHeader>
             <CardTitle className="flex items-center justify-between">
                <span>Interaction Result</span>
                 <Badge variant={result.hasInteraction ? 'destructive' : 'default'}>
                    {result.hasInteraction ? 'Interactions Found' : 'No Major Interactions Found'}
                </Badge>
            </CardTitle>
            <CardDescription>This is a summary of potential interactions. It is not a complete list.</CardDescription>
          </CardHeader>
          <CardContent>
             <div className="prose prose-sm max-w-none text-foreground">
                <p>{result.interactionSummary}</p>
              </div>
          </CardContent>
        </Card>
      )}

    </div>
  );
}
