'use server';
/**
 * @fileOverview An AI-powered flow to check for interactions between medications.
 *
 * - checkMedicationInteractions - A function that handles the interaction analysis.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import type { MedicationInteractionInput, MedicationInteractionOutput } from '@/lib/types';

const MedicationInteractionInputSchema = z.object({
  medications: z.array(z.string()).min(2, "At least two medications are required for an interaction check."),
});

const MedicationInteractionOutputSchema = z.object({
  summary: z.string().describe("A high-level summary of whether any interactions were found."),
  interactions: z.array(z.object({
    medications: z.array(z.string()).length(2).describe('The pair of medications that have an interaction.'),
    severity: z.enum(['Minor', 'Moderate', 'Major']).describe('The severity of the interaction.'),
    description: z.string().describe('A plain-language explanation of the interaction, its effects, and what to do.'),
  })).describe("An array detailing each specific interaction found."),
  disclaimer: z.string().describe("A mandatory warning stating the AI analysis is not a substitute for professional medical advice."),
});

const prompt = ai.definePrompt({
    name: 'medicationInteractionPrompt',
    input: {schema: MedicationInteractionInputSchema},
    output: {schema: MedicationInteractionOutputSchema},
    prompt: `You are an expert pharmacologist. Your task is to check for potential interactions between a given list of medications.

Medication List:
{{#each medications}}
- {{{this}}}
{{/each}}

Analyze all possible pairs of medications from the list for known interactions.
For each interaction you find, you must provide:
1.  The pair of 'medications' involved.
2.  The 'severity' of the interaction, classified as 'Minor', 'Moderate', or 'Major'.
3.  A clear 'description' of the interaction, what it means, and what the user should do.

If you find one or more interactions, the 'summary' must be "Interactions Found".
If you find no interactions, the 'summary' must be "No Interactions Found" and the 'interactions' array must be empty.

You MUST include the following 'disclaimer': "This tool is for informational purposes only and is not a substitute for professional medical advice. Always consult with your doctor or pharmacist before making any changes to your medication regimen."
`,
});

const checkMedicationInteractionsFlow = ai.defineFlow(
    {
    name: 'checkMedicationInteractionsFlow',
    inputSchema: MedicationInteractionInputSchema,
    outputSchema: MedicationInteractionOutputSchema,
    },
    async (flowInput) => {
        const {output} = await prompt(flowInput);
        return output!;
    }
);

export async function checkMedicationInteractions(input: MedicationInteractionInput): Promise<MedicationInteractionOutput> {
    return checkMedicationInteractionsFlow(input);
}
