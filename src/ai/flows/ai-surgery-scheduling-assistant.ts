'use server';
/**
 * @fileOverview An AI-powered scheduling assistant to find optimal appointment slots.
 *
 * - scheduleAppointment - A function that handles the appointment scheduling analysis.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import type { ScheduleAppointmentInput, ScheduleAppointmentOutput } from '@/lib/types';

const ScheduleAppointmentInputSchema = z.object({
    doctor: z.string().describe('The name of the doctor for the appointment.'),
    patient: z.string().describe('The name of the patient.'),
    appointmentType: z.string().describe('The type or name of the appointment/procedure.'),
    durationInMinutes: z.number().describe('The required duration of the appointment in minutes.'),
    preferredDateRange: z.object({
        start: z.string().describe('The start of the preferred date range (YYYY-MM-DD).'),
        end: z.string().describe('The end of the preferred date range (YYYY-MM-DD).'),
    }),
    existingCommitments: z.string().describe("A list of the doctor's existing commitments with start and end times."),
});

const ScheduleAppointmentOutputSchema = z.object({
    suggestedAppointmentSlot: z.string().describe('The suggested optimal start and end time for the new appointment in "YYYY-MM-DD HH:MM - YYYY-MM-DD HH:MM" format. If no slot is found, this should state "No available slot found."'),
    reasoning: z.string().describe('A brief explanation for why this slot was chosen or why no slot was found.'),
});

const prompt = ai.definePrompt({
    name: 'scheduleAppointmentPrompt',
    input: {schema: ScheduleAppointmentInputSchema},
    output: {schema: ScheduleAppointmentOutputSchema},
    prompt: `You are an expert AI assistant for scheduling complex medical appointments. Your task is to find the best available time slot for a new appointment based on a set of constraints.

Appointment Details:
- Doctor: {{{doctor}}}
- Patient: {{{patient}}}
- Appointment Type: {{{appointmentType}}}
- Duration: {{{durationInMinutes}}} minutes
- Preferred Date Range: Between {{{preferredDateRange.start}}} and {{{preferredDateRange.end}}}.

Doctor's Existing Commitments:
---
{{{existingCommitments}}}
---

Analyze the existing commitments and find an open slot within the preferred date range that can accommodate the new appointment's duration. Prioritize the earliest available slot.

Your response must include the best suggested slot and a brief reasoning for your choice. If no suitable slot is found, state that clearly.
`,
});

const scheduleAppointmentFlow = ai.defineFlow(
    {
        name: 'scheduleAppointmentFlow',
        inputSchema: ScheduleAppointmentInputSchema,
        outputSchema: ScheduleAppointmentOutputSchema,
    },
    async (flowInput) => {
        const {output} = await prompt(flowInput);
        return output!;
    }
);

export async function scheduleAppointment(input: ScheduleAppointmentInput): Promise<ScheduleAppointmentOutput> {
    return scheduleAppointmentFlow(input);
}
