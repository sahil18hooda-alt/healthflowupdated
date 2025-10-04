'use client';

import { useState } from 'react';
import { Bot, Loader2, Send, Route, AlertTriangle, ShieldCheck, MailQuestion } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { inquiryTriage, InquiryTriageOutput } from '@/ai/flows/inquiry-triage-flow';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export default function InquiryTriagePage() {
  const [message, setMessage] = useState('');
  const [triageResult, setTriageResult] = useState<InquiryTriageOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const urgencyConfig = {
    Low: { icon: <ShieldCheck className="h-4 w-4" />, color: 'bg-green-100 text-green-800' },
    Medium: { icon: <MailQuestion className="h-4 w-4" />, color: 'bg-yellow-100 text-yellow-800' },
    High: { icon: <AlertTriangle className="h-4 w-4" />, color: 'bg-orange-100 text-orange-800' },
    Emergency: { icon: <AlertTriangle className="h-4 w-4" />, color: 'bg-red-100 text-red-800' },
  };

  const handleTriage = async () => {
    if (message.trim() === '') return;
    setIsLoading(true);
    setError(null);
    setTriageResult(null);

    try {
      const result = await inquiryTriage({ message });
      setTriageResult(result);
    } catch (err) {
      console.error(err);
      setError('An error occurred while analyzing your inquiry. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-2">
            <Route /> Inquiry Assistant
        </h1>
        <p className="text-muted-foreground">
          Not sure where to send your question? Our AI can help route you to the right place.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Submit Your Question</CardTitle>
          <CardDescription>Enter your question below, and we'll suggest the best department to handle it.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder="e.g., 'I need to refill my prescription for Metformin, but I also have a question about my last bill...'"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={5}
            disabled={isLoading}
          />
          <Button onClick={handleTriage} disabled={isLoading || !message.trim()}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isLoading ? 'Analyzing...' : 'Analyze Inquiry'}
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

      {triageResult && (
        <Card>
          <CardHeader>
            <CardTitle>Analysis Complete</CardTitle>
            <CardDescription>Here's where we recommend sending your inquiry for the fastest response.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                <div className="p-4 bg-muted rounded-lg">
                    <p className="text-sm text-muted-foreground">Topic</p>
                    <p className="text-lg font-semibold">{triageResult.topic}</p>
                </div>
                <div className="p-4 bg-muted rounded-lg">
                    <p className="text-sm text-muted-foreground">Urgency</p>
                     <Badge className={cn("text-base font-semibold", urgencyConfig[triageResult.urgency].color)}>
                        {urgencyConfig[triageResult.urgency].icon}
                        {triageResult.urgency}
                    </Badge>
                </div>
                <div className="p-4 bg-muted rounded-lg">
                    <p className="text-sm text-muted-foreground">Recommended Department</p>
                    <p className="text-lg font-semibold">{triageResult.department}</p>
                </div>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-2">Summary of Your Request</h3>
              <p className="text-muted-foreground italic">"{triageResult.summary}"</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
