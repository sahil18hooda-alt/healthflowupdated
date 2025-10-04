'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Users, Clock, Loader2, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { getWaitingTimeEstimate } from '@/ai/flows/ai-queue-management';
import type { QueueManagementOutput, QueueManagementInput } from '@/lib/types';
import { format } from 'date-fns';

const formSchema = z.object({
  queueType: z.enum(['Appointments', 'Lab / Blood Work', 'Pharmacy']),
});

const serviceConfig = {
    'Appointments': { baseQueue: 5, avgTime: 15 },
    'Lab / Blood Work': { baseQueue: 10, avgTime: 10 },
    'Pharmacy': { baseQueue: 8, avgTime: 5 },
};

export default function QueueStatusPage() {
  const [analysis, setAnalysis] = useState<QueueManagementOutput | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // This effect runs only on the client, after hydration
    setIsClient(true);
  }, []);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      queueType: 'Appointments',
    },
  });

  const handleEstimate = async (values: z.infer<typeof formSchema>) => {
    if (!isClient) return; // Don't run on the server or during hydration

    setIsLoading(true);
    setError(null);
    setAnalysis(null);

    try {
        const now = new Date();
        const config = serviceConfig[values.queueType];
        
        // Simulate real-world data gathering that can only happen on the client
        const input: QueueManagementInput = {
            queueType: values.queueType,
            currentTime: format(now, 'p'), // e.g., "4:30 PM"
            currentDay: format(now, 'EEEE'), // e.g., "Tuesday"
            queueLength: config.baseQueue + Math.floor(Math.random() * 5) - 2, // Add some randomness
            avgServiceTime: config.avgTime,
        };

      const result = await getWaitingTimeEstimate(input);
      setAnalysis(result);
      setLastUpdated(now);
    } catch (err) {
      console.error(err);
      setError('An error occurred while estimating the wait time. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Clock /> Live Queue Status
        </h1>
        <p className="text-muted-foreground">
          Get real-time, AI-powered wait time estimates for hospital services.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Select a Service</CardTitle>
          <CardDescription>Choose the queue you are interested in to get an estimated wait time.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleEstimate)} className="flex items-end gap-4">
              <FormField
                control={form.control}
                name="queueType"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Service / Department</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a service" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Appointments">Appointments Desk</SelectItem>
                        <SelectItem value="Lab / Blood Work">Lab / Blood Work</SelectItem>
                        <SelectItem value="Pharmacy">Pharmacy</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isLoading || !isClient}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isLoading ? 'Estimating...' : 'Estimate Wait Time'}
              </Button>
            </form>
            {!isClient && <p className="text-sm text-muted-foreground mt-2">Loading client components...</p>}
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

      {analysis && lastUpdated && (
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-muted-foreground font-normal">Estimated Wait Time</CardTitle>
            <CardDescription className="text-6xl font-bold text-primary">{analysis.estimatedWaitTime} min</CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-lg text-muted-foreground italic">"{analysis.queueStatus}"</p>
            <p className="text-xs text-muted-foreground">Last updated: {format(lastUpdated, 'PPP p')}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
