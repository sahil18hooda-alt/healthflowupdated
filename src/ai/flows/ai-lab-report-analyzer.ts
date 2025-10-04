'use server';
/**
 * @fileOverview An AI-powered lab report analyzer that interprets uploaded lab report images.
 *
 * - analyzeLabReport - A function that handles the lab report analysis.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import type { LabReportAnalysisInput, LabReportAnalysisOutput } from '@/lib/types';

const LabReportAnalysisInputSchema = z.object({
  reportImage: z
    .string()
    .describe(
      "A photo of the lab report, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});

const LabReportAnalysisOutputSchema = z.object({
  summary: z.string().describe("A concise, high-level overview of the lab report's findings in plain language."),
  keyMetrics: z.array(z.object({
    metric: z.string().describe('The name of the lab metric (e.g., "Hemoglobin").'),
    value: z.string().describe("The patient's measured value for the metric (e.g., '14.5 g/dL')."),
    normalRange: z.string().describe("The normal reference range for the metric (e.g., '13.5-17.5 g/dL')."),
    interpretation: z.enum(["High", "Low", "Normal", "Borderline High", "Borderline Low", "N/A"]).describe("The AI's interpretation of the value compared to the normal range."),
  })).describe("An array of key metrics extracted from the report."),
  disclaimer: z.string().describe("A mandatory warning stating the AI analysis is not a substitute for professional medical advice."),
});

const prompt = ai.definePrompt({
    name: 'analyzeLabReportPrompt',
    input: {schema: LabReportAnalysisInputSchema},
    output: {schema: LabReportAnalysisOutputSchema},
    prompt: `You are an expert AI medical assistant specializing in interpreting lab reports for patients. Analyze the provided image of a lab report.

Lab Report Image: {{media url=reportImage}}

Your task is to:
1.  Read the text from the image, identifying key medical metrics, the patient's measured values, and the standard reference ranges.
2.  For each key metric, compare the patient's value to the normal range to determine if it's High, Low, Normal, Borderline High, or Borderline Low.
3.  Generate a brief, easy-to-understand 'summary' of the overall findings.
4.  Compile a list of 'keyMetrics', where each item includes the metric name, its value, the normal range, and your interpretation.
5.  You MUST include the following 'disclaimer': "This AI analysis is for informational purposes only and is not a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition."
`,
});


const analyzeLabReportFlow = ai.defineFlow(
    {
    name: 'analyzeLabReportFlow',
    inputSchema: LabReportAnalysisInputSchema,
    outputSchema: LabReportAnalysisOutputSchema,
    },
    async (flowInput) => {
        const {output} = await prompt(flowInput);
        return output!;
    }
);


export async function analyzeLabReport(input: LabReportAnalysisInput): Promise<LabReportAnalysisOutput> {
    return analyzeLabReportFlow(input);
}
