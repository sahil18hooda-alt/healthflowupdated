'use server';
/**
 * @fileOverview An AI flow to simulate a chat between a patient and a doctor.
 *
 * - doctorChat - A function that handles the AI doctor conversation.
 * - DoctorChatInput - The input type for the doctorChat function.
 * - DoctorChatOutput - The return type for the doctorChat function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const DoctorChatInputSchema = z.object({
  history: z.array(z.object({
    role: z.enum(['user', 'model']),
    content: z.string(),
  })).describe('The conversation history.'),
});
export type DoctorChatInput = z.infer<typeof DoctorChatInputSchema>;

const DoctorChatOutputSchema = z.object({
  response: z.string().describe('The response from the AI doctor.'),
});
export type DoctorChatOutput = z.infer<typeof DoctorChatOutputSchema>;

export async function doctorChat(input: DoctorChatInput): Promise<DoctorChatOutput> {
  return doctorChatFlow(input);
}

const prompt = ai.definePrompt({
  name: 'doctorChatPrompt',
  input: {schema: DoctorChatInputSchema},
  output: {schema: DoctorChatOutputSchema},
  prompt: `You are a compassionate and helpful AI Doctor. Your goal is to answer patient questions, provide clear explanations, and offer support regarding their health concerns.
  Listen carefully, ask clarifying questions, and provide knowledgeable and empathetic responses.
  You are not a replacement for a human doctor, so you must include a disclaimer that the user should consult a professional for a real diagnosis or in an emergency.

  Here is the conversation history:
  {{#each history}}
    {{role}}: {{{content}}}
  {{/each}}

  Now, provide a helpful response to the last user message, acting as a doctor.`,
});

const doctorChatFlow = ai.defineFlow(
  {
    name: 'doctorChatFlow',
    inputSchema: DoctorChatInputSchema,
    outputSchema: DoctorChatOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
