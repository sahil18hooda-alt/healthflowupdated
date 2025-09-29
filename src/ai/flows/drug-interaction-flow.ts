'use server';
/**
 * @fileOverview A drug interaction checker AI flow.
 *
 * - drugInteractionChecker - A function that checks for interactions between drugs.
 * - DrugInteractionInput - The input type for the drugInteractionChecker function.
 * - DrugInteractionOutput - The return type for the drugInteractionChecker function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const DrugInteractionInputSchema = z.object({
  drugs: z.array(z.string()).describe('A list of drugs to check for interactions.'),
});
export type DrugInteractionInput = z.infer<typeof DrugInteractionInputSchema>;

const DrugInteractionOutputSchema = z.object({
  hasInteraction: z.boolean().describe('Whether there are any potential interactions.'),
  interactionSummary: z.string().describe('A summary of the potential interactions.'),
});
export type DrugInteractionOutput = z.infer<typeof DrugInteractionOutputSchema>;

export async function drugInteractionChecker(input: DrugInteractionInput): Promise<DrugInteractionOutput> {
  return drugInteractionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'drugInteractionPrompt',
  input: {schema: DrugInteractionInputSchema},
  output: {schema: DrugInteractionOutputSchema},
  prompt: `You are an AI-powered drug interaction checker.
  Your task is to identify potential interactions between the following drugs:
  {{#each drugs}}
  - {{{this}}}
  {{/each}}

  If there are interactions, describe them. If not, state that no significant interactions were found.
  
  IMPORTANT: You must include a disclaimer that you are not a real doctor and this tool is for informational purposes only. The user should consult a healthcare professional.`,
});

const drugInteractionFlow = ai.defineFlow(
  {
    name: 'drugInteractionFlow',
    inputSchema: DrugInteractionInputSchema,
    outputSchema: DrugInteractionOutputSchema,
  },
  async input => {
    if (input.drugs.length < 2) {
        return {
            hasInteraction: false,
            interactionSummary: 'Please provide at least two drugs to check for interactions.'
        };
    }
    const {output} = await prompt(input);
    return output!;
  }
);
