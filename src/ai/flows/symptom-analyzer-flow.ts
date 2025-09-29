'use server';
/**
 * @fileOverview A symptom analyzer AI flow.
 *
 * - symptomAnalyzer - A function that handles the symptom analysis process.
 * - SymptomAnalyzerInput - The input type for the symptomAnalyzer function.
 * - SymptomAnalyzerOutput - The return type for the symptomAnalyzer function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SymptomAnalyzerInputSchema = z.object({
  symptoms: z.string().describe('A description of the user\'s symptoms.'),
});
export type SymptomAnalyzerInput = z.infer<typeof SymptomAnalyzerInputSchema>;

const SymptomAnalyzerOutputSchema = z.object({
  analysis: z.string().describe('A detailed analysis of the symptoms provided.'),
  potentialConditions: z.array(z.string()).describe('A list of potential conditions.'),
  seriousness: z.enum(['Low', 'Medium', 'High', 'Emergency']).describe('The estimated seriousness of the symptoms.'),
});
export type SymptomAnalyzerOutput = z.infer<typeof SymptomAnalyzerOutputSchema>;

export async function symptomAnalyzer(input: SymptomAnalyzerInput): Promise<SymptomAnalyzerOutput> {
  return symptomAnalyzerFlow(input);
}

const prompt = ai.definePrompt({
  name: 'symptomAnalyzerPrompt',
  input: {schema: SymptomAnalyzerInputSchema},
  output: {schema: SymptomAnalyzerOutputSchema},
  prompt: `You are an AI medical assistant. A user is providing their symptoms.
  Your task is to analyze the symptoms, provide a list of potential conditions, estimate the seriousness, and give a detailed analysis.

  IMPORTANT: You must include a disclaimer that you are not a real doctor and the user should consult a healthcare professional for any medical advice.

  User symptoms: {{{symptoms}}}
  `,
});

const symptomAnalyzerFlow = ai.defineFlow(
  {
    name: 'symptomAnalyzerFlow',
    inputSchema: SymptomAnalyzerInputSchema,
    outputSchema: SymptomAnalyzerOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
