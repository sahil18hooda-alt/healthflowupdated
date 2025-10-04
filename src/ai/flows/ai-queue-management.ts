'use server';
/**
 * @fileOverview An AI flow for estimating wait times in a hospital queue.
 *
 * - getWaitingTimeEstimate - A function that provides an estimated wait time.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import type { QueueManagementInput, QueueManagementOutput } from '@/lib/types';

const QueueManagementInputSchema = z.object({
    queueType: z.enum(['Appointments', 'Lab / Blood Work', 'Pharmacy']),
    currentTime: z.string().describe('The current time of day (e.g., "10:30 AM").'),
    currentDay: z.string().describe('The current day of the week (e.g., "Monday").'),
    queueLength: z.number().describe('The number of people currently in the queue.'),
    avgServiceTime: z.number().describe('The average service time in minutes for one person.'),
});

const QueueManagementOutputSchema = z.object({
    estimatedWaitTime: z.number().describe('The estimated wait time in minutes.'),
    queueStatus: z.string().describe('A brief, contextual status of the queue (e.g., "The queue is longer than usual.").'),
});

const prompt = ai.definePrompt({
    name: 'getWaitingTimeEstimatePrompt',
    input: {schema: QueueManagementInputSchema},
    output: {schema: QueueManagementOutputSchema},
    prompt: `You are an expert queue management system for a hospital. Your task is to provide an accurate wait time estimate based on several factors.

Factors to consider:
- Peak Hours: Mornings (9 AM - 11 AM) and Afternoons (2 PM - 4 PM) are typically busier.
- Day of the Week: Mondays and Fridays are the busiest days. Weekends are generally quieter.
- Queue Length: The more people, the longer the wait.
- Service Time: The time it takes to serve one person.

Current Situation:
- Service: {{{queueType}}}
- Day: {{{currentDay}}}
- Time: {{{currentTime}}}
- People in Queue: {{{queueLength}}}
- Average Service Time: {{{avgServiceTime}}} minutes per person

Calculate the 'estimatedWaitTime'. A simple calculation would be queueLength * avgServiceTime, but you must adjust this based on the time and day. Add a few extra minutes during peak times or busy days.

Also, provide a contextual 'queueStatus' message. For example, if it's Monday morning, you could say, "The queue is longer than usual due to the morning rush." If the queue is short, say "The queue is moving quickly."`,
});

const getWaitingTimeEstimateFlow = ai.defineFlow(
    {
        name: 'getWaitingTimeEstimateFlow',
        inputSchema: QueueManagementInputSchema,
        outputSchema: QueueManagementOutputSchema,
    },
    async (flowInput) => {
        const {output} = await prompt(flowInput);
        return output!;
    }
);

export async function getWaitingTimeEstimate(input: QueueManagementInput): Promise<QueueManagementOutput> {
    return getWaitingTimeEstimateFlow(input);
}
