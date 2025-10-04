'use server';
/**
 * @fileOverview An AI-powered medical notes generator.
 *
 * - generateMedicalNotes - A function that handles the medical notes generation.
 * - MedicalNotesInput - The input type for the generateMedicalNotes function.
 * - MedicalNotesOutput - The return type for the generateMedicalNotes function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const MedicalNotesInputSchema = z.object({
  chatLog: z.string().describe("The full transcript of the patient consultation."),
  symptoms: z.string().describe("A list of key symptoms to focus on."),
});
export type MedicalNotesInput = z.infer<typeof MedicalNotesInputSchema>;

const MedicalNotesOutputSchema = z.object({
  medicalNotes: z.string().describe("The formatted, structured medical notes in SOAP format."),
});
export type MedicalNotesOutput = z.infer<typeof MedicalNotesOutputSchema>;

export async function generateMedicalNotes(input: MedicalNotesInput): Promise<MedicalNotesOutput> {
  return generateMedicalNotesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateMedicalNotesPrompt',
  input: {schema: MedicalNotesInputSchema},
  output: {schema: MedicalNotesOutputSchema},
  prompt: `You are an AI medical scribe. Your task is to convert a patient consultation transcript into a formal, structured medical note using the SOAP format (Subjective, Objective, Assessment, Plan).

Analyze the provided chat log and key symptoms to extract all clinically relevant information.

Patient Chat Log:
---
{{{chatLog}}}
---

Key Symptoms to focus on: {{{symptoms}}}

Generate the medical notes with clear headings for each section (Subjective, Objective, Assessment, Plan).
- Subjective: The patient's reported symptoms, feelings, and history.
- Objective: Factual findings (if any are mentioned, otherwise state "No objective findings reported in log").
- Assessment: Your summary of the patient's condition and potential diagnosis.
- Plan: The treatment plan, including medications, therapies, follow-ups, or referrals.
`,
});

const generateMedicalNotesFlow = ai.defineFlow(
  {
    name: 'generateMedicalNotesFlow',
    inputSchema: MedicalNotesInputSchema,
    outputSchema: MedicalNotesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
