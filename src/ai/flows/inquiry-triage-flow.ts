'use server';
/**
 * @fileOverview An AI flow for triaging patient inquiries.
 *
 * - inquiryTriage - A function that handles the inquiry triage process.
 * - InquiryTriageInput - The input type for the inquiryTriage function.
 * - InquiryTriageOutput - The return type for the inquiryTriage function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const InquiryTriageInputSchema = z.object({
  message: z.string().describe("The patient's inquiry message."),
});
export type InquiryTriageInput = z.infer<typeof InquiryTriageInputSchema>;

const InquiryTriageOutputSchema = z.object({
  topic: z.enum(['Prescription', 'Scheduling', 'Medical Question', 'Billing', 'Other']).describe('The main topic of the inquiry.'),
  urgency: z.enum(['Low', 'Medium', 'High', 'Emergency']).describe('The urgency level of the inquiry.'),
  department: z.enum(['Pharmacy', 'Appointments Desk', 'Nursing Staff', 'Billing Department', 'General Info']).describe('The recommended department for routing.'),
  summary: z.string().describe('A brief summary of the patient\'s request.'),
});
export type InquiryTriageOutput = z.infer<typeof InquiryTriageOutputSchema>;

export async function inquiryTriage(input: InquiryTriageInput): Promise<InquiryTriageOutput> {
  return inquiryTriageFlow(input);
}

const prompt = ai.definePrompt({
  name: 'inquiryTriagePrompt',
  input: {schema: InquiryTriageInputSchema},
  output: {schema: InquiryTriageOutputSchema},
  prompt: `You are an AI assistant in a hospital responsible for triaging incoming patient inquiries.
  Your task is to analyze the patient's message and categorize it for efficient routing.

  Analyze the following message:
  Message: "{{{message}}}"

  Based on the message, determine the topic, urgency level, and the most appropriate department to handle the request. Provide a short, one-sentence summary of the core request.
  - For prescription refills or questions, route to 'Pharmacy'.
  - For booking, changing, or canceling appointments, route to 'Appointments Desk'.
  - For medical questions, symptoms, or health concerns, route to 'Nursing Staff'.
  - For questions about bills or insurance, route to 'Billing Department'.
  - If the inquiry is a medical emergency (e.g., mentions "severe pain," "can't breathe," "bleeding"), set urgency to 'Emergency' and route to 'Nursing Staff'.
  - For all other general questions, route to 'General Info'.
  `,
});

const inquiryTriageFlow = ai.defineFlow(
  {
    name: 'inquiryTriageFlow',
    inputSchema: InquiryTriageInputSchema,
    outputSchema: InquiryTriageOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
