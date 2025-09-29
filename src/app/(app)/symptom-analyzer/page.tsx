'use client';

import { useState } from 'react';
import { Bot, User, Loader2, AlertTriangle, ShieldCheck, HeartPulse, Radiation } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { symptomAnalyzer, SymptomAnalyzerOutput } from '@/ai/flows/symptom-analyzer-flow';
import { cn } from '@/lib/utils';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';

export default function SymptomAnalyzerPage() {
  const [symptoms, setSymptoms] = useState('');
  const [analysis, setAnalysis] = useState<SymptomAnalyzerOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    if (symptoms.trim() === '') return;
    setIsLoading(true);
    setError(null);
    setAnalysis(null);

    try {
      const result = await symptomAnalyzer({ symptoms });
      setAnalysis(result);
    } catch (err) {
      console.error(err);
      setError('An error occurred while analyzing symptoms. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const seriousnessConfig = {
    Low: { icon: <ShieldCheck className="h-4 w-4" />, color: 'bg-green-100 text-green-800' },
    Medium: { icon: <HeartPulse className="h-4 w-4" />, color: 'bg-yellow-100 text-yellow-800' },
    High: { icon: <AlertTriangle className="h-4 w-4" />, color: 'bg-orange-100 text-orange-800' },
    Emergency: { icon: <Radiation className="h-4 w-4" />, color: 'bg-red-100 text-red-800' },
  };


  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-2">
            <Bot /> AI Symptom Analyzer
        </h1>
        <p className="text-muted-foreground">
          Describe your symptoms, and our AI will provide a preliminary analysis.
        </p>
      </div>

      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Disclaimer</AlertTitle>
        <AlertDescription>
          This tool is for informational purposes only and is not a substitute for professional medical advice. Always consult a doctor for any health concerns.
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <CardTitle>Describe Your Symptoms</CardTitle>
          <CardDescription>Be as detailed as possible for a more accurate analysis.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-start gap-4">
            <User className="h-8 w-8 text-muted-foreground mt-2" />
            <Textarea
              placeholder="e.g., I have a headache, a fever of 101°F, and a sore throat..."
              value={symptoms}
              onChange={(e) => setSymptoms(e.target.value)}
              rows={4}
              className="flex-1"
              disabled={isLoading}
            />
          </div>
          <Button onClick={handleAnalyze} disabled={isLoading || !symptoms.trim()}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isLoading ? 'Analyzing...' : 'Analyze My Symptoms'}
          </Button>
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
            <CardTitle className="flex items-center justify-between">
                <span>AI Analysis</span>
                 <Badge className={cn("text-sm", seriousnessConfig[analysis.seriousness].color)}>
                    {seriousnessConfig[analysis.seriousness].icon}
                    Seriousness: {analysis.seriousness}
                </Badge>
            </CardTitle>
            <CardDescription>Based on the symptoms you provided, here is a preliminary analysis.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold text-lg mb-2">Potential Conditions</h3>
              <div className="flex flex-wrap gap-2">
                {analysis.potentialConditions.map((condition, index) => (
                  <Badge key={index} variant="secondary">{condition}</Badge>
                ))}
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-2">Detailed Analysis</h3>
              <div className="prose prose-sm max-w-none text-foreground">
                <p>{analysis.analysis}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
