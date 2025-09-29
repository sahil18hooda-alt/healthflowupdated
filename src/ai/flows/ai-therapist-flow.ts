'use server';
/**
 * @fileOverview An AI therapist for providing mental health support.
 *
 * - aiTherapist - A function that handles the AI therapist conversation.
 * - AITherapistInput - The input type for the aiTherapist function.
 * - AITherapistOutput - The return type for the aiTherapist function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AITherapistInputSchema = z.object({
  history: z.array(z.object({
    role: z.enum(['user', 'model']),
    content: z.string(),
  })).describe('The conversation history.'),
});
export type AITherapistInput = z.infer<typeof AITherapistInputSchema>;

const AITherapistOutputSchema = z.object({
  response: z.string().describe('The response from the AI therapist.'),
});
export type AITherapistOutput = z.infer<typeof AITherapistOutputSchema>;

export async function aiTherapist(input: AITherapistInput): Promise<AITherapistOutput> {
  return aiTherapistFlow(input);
}

const prompt = ai.definePrompt({
  name: 'aiTherapistPrompt',
  input: {schema: AITherapistInputSchema},
  output: {schema: AITherapistOutputSchema},
  prompt: `You are a compassionate and empathetic AI therapist. Your goal is to provide a safe space for users to express their thoughts and feelings.
  Listen carefully, ask thoughtful questions, and provide supportive and non-judgmental responses.
  You are not a replacement for a human therapist, so you must include a disclaimer that the user should consult a professional for serious issues.

  Here is the conversation history:
  {{#each history}}
    {{role}}: {{{content}}}
  {{/each}}

  Now, provide a therapeutic response to the last user message.`,
});

const aiTherapistFlow = ai.defineFlow(
  {
    name: 'aiTherapistFlow',
    inputSchema: AITherapistInputSchema,
    outputSchema: AITherapistOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
