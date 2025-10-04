'use server';
/**
 * @fileOverview An AI flow for providing diagnostic decision support.
 *
 * - analyzeSymptoms - A function that handles the symptom analysis.
 * - AnalyzeSymptomsInput - The input type for the analyzeSymptoms function.
 * - AnalyzeSymptomsOutput - The return type for the analyzeSymptoms function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeSymptomsInputSchema = z.object({
  symptoms: z.string().describe("Detailed notes on the patient's symptoms."),
  history: z.string().optional().describe("The patient's relevant medical history."),
  demographics: z.string().optional().describe("The patient's demographic information (e.g., age, gender)."),
});
export type AnalyzeSymptomsInput = z.infer<typeof AnalyzeSymptomsInputSchema>;

const AnalyzeSymptomsOutputSchema = z.object({
  possibleConditions: z.string().describe("A list of potential medical conditions that fit the symptom profile, each with a brief explanation."),
  confidenceLevels: z.string().optional().describe("The AI's assessment of the likelihood for each suggested condition (e.g., 'High confidence', 'Moderate confidence')."),
  disclaimer: z.string().describe("A mandatory disclaimer stating the AI's output is for informational purposes only."),
});
export type AnalyzeSymptomsOutput = z.infer<typeof AnalyzeSymptomsOutputSchema>;

export async function analyzeSymptoms(input: AnalyzeSymptomsInput): Promise<AnalyzeSymptomsOutput> {
  return analyzeSymptomsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeSymptomsPrompt',
  input: {schema: AnalyzeSymptomsInputSchema},
  output: {schema: AnalyzeSymptomsOutputSchema},
  prompt: `You are an AI diagnostic assistant. Your role is to help a physician formulate a differential diagnosis based on patient information.
  Analyze the provided symptoms, medical history, and demographics to identify potential medical conditions.

  Patient Symptoms: {{{symptoms}}}
  {{#if history}}
  Medical History: {{{history}}}
  {{/if}}
  {{#if demographics}}
  Patient Demographics: {{{demographics}}}
  {{/if}}

  Based on your analysis:
  1.  Provide a list of 'possibleConditions' that could explain the symptoms.
  2.  Provide your 'confidenceLevels' for each condition.
  3.  You MUST include the following 'disclaimer': "This analysis is AI-generated and for informational purposes only. It is not a substitute for professional medical judgment. All diagnoses must be confirmed by a qualified healthcare provider."
  `,
});

const analyzeSymptomsFlow = ai.defineFlow(
  {
    name: 'analyzeSymptomsFlow',
    inputSchema: AnalyzeSymptomsInputSchema,
    outputSchema: AnalyzeSymptomsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
