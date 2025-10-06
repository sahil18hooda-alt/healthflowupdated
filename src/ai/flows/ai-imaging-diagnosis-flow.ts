'use server';
/**
 * @fileOverview An AI flow for analyzing medical imaging scans.
 *
 * - diagnoseImage - A function that handles the image analysis.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import type { ImagingDiagnosisInput, ImagingDiagnosisOutput } from '@/lib/types';

const ImagingDiagnosisInputSchema = z.object({
  image: z
    .string()
    .describe(
      "A medical image (e.g., X-ray, CT scan) as a data URI. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});

const ImagingDiagnosisOutputSchema = z.object({
    potentialConditions: z.array(z.object({
        condition: z.string().describe('The name of the potential condition detected (e.g., "Pneumonia", "Metastatic bone tumor").'),
        confidence: z.number().describe('The AI\'s confidence in this finding, from 0 to 100.'),
    })).describe('A list of potential conditions identified in the image.'),
    summary: z.string().describe('A high-level summary of the overall findings, written in clear, accessible language.'),
    observations: z.string().describe('A more detailed, point-by-point breakdown of what the AI observed in the image (e.g., "Observed an opacity in the lower left lung lobe.").'),
    disclaimer: z.string().describe('A mandatory warning that this analysis is not a substitute for a professional diagnosis.'),
});

const prompt = ai.definePrompt({
    name: 'imagingDiagnosisPrompt',
    input: {schema: ImagingDiagnosisInputSchema},
    output: {schema: ImagingDiagnosisOutputSchema},
    prompt: `You are an expert AI radiology assistant. Your task is to analyze a medical image and provide a preliminary diagnostic report for informational purposes.

Image to Analyze: {{media url=image}}

Analyze the image for any abnormalities or significant findings.
1.  Identify a list of 'potentialConditions'. For each condition, provide your 'confidence' score as a percentage (0-100).
2.  Write a concise 'summary' of your findings in simple terms.
3.  Provide a bulleted list of detailed 'observations'.
4.  You MUST include the following 'disclaimer': "This AI-generated analysis is for informational purposes only and is NOT a substitute for a professional diagnosis from a qualified radiologist or physician. Please consult with your healthcare provider to review these findings."

If the image does not appear to be a medical scan or is unclear, state that in the summary and observations.
`,
});

const diagnoseImageFlow = ai.defineFlow(
    {
        name: 'diagnoseImageFlow',
        inputSchema: ImagingDiagnosisInputSchema,
        outputSchema: ImagingDiagnosisOutputSchema,
    },
    async (flowInput) => {
        const {output} = await prompt(flowInput);
        return output!;
    }
);

export async function diagnoseImage(input: ImagingDiagnosisInput): Promise<ImagingDiagnosisOutput> {
    return diagnoseImageFlow(input);
}
