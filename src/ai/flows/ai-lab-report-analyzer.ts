'use server';
/**
 * @fileOverview An AI-powered lab report analyzer that interprets uploaded lab report images,
 * providing detailed explanations and actionable insights.
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
  overallSummary: z.string().describe("A concise, high-level summary of the most important findings from the entire lab report. e.g., 'Your results show mild dehydration and iron deficiency.'"),
  keyMetrics: z.array(z.object({
    metric: z.string().describe('The name of the lab metric (e.g., "Hemoglobin").'),
    value: z.string().describe("The patient's measured value for the metric (e.g., '14.5 g/dL')."),
    normalRange: z.string().describe("The normal reference range for the metric (e.g., '13.5-17.5 g/dL')."),
    interpretation: z.enum(["High", "Low", "Normal", "Borderline High", "Borderline Low", "N/A"]).describe("The AI's interpretation of the value compared to the normal range."),
    explanation: z.string().optional().describe("For 'Normal' values, a brief reassurance. e.g., 'Your hemoglobin level is within the normal range.'"),
    possibleCauses: z.string().optional().describe("For abnormal values, a list of possible medical or lifestyle causes."),
    healthImplications: z.string().optional().describe("For abnormal values, a description of potential short or long-term health impacts/risks."),
    recommendedActions: z.string().optional().describe("For abnormal values, a list of recommended actions, such as diet changes, retesting, or consulting a doctor."),
    recommendedDepartment: z.string().optional().describe("For abnormal values, the suggested specialist department to consult (e.g., 'Endocrinology', 'Hematology')."),
  })).describe("An array of key metrics extracted from the report."),
  disclaimer: z.string().describe("A mandatory warning stating the AI analysis is not a substitute for professional medical advice."),
});

const prompt = ai.definePrompt({
    name: 'analyzeLabReportPrompt',
    input: {schema: LabReportAnalysisInputSchema},
    output: {schema: LabReportAnalysisOutputSchema},
    prompt: `You are an expert AI medical assistant specializing in interpreting lab reports for patients. Analyze the provided image of a lab report.

Lab Report Image: {{media url=reportImage}}

Your task is to provide a comprehensive, intelligent interpretation.
1.  Read the text from the image, identifying key medical metrics, the patient's measured values, and the standard reference ranges.
2.  For each key metric, compare the patient's value to the normal range to determine if it's High, Low, Normal, Borderline High, or Borderline Low.
3.  For 'Normal' values, provide a brief, reassuring 'explanation'.
4.  For any 'High', 'Low', or 'Borderline' values, you MUST provide:
    a.  An 'explanation' of what the parameter measures.
    b.  A list of 'possibleCauses' (both medical and lifestyle).
    c.  A summary of 'healthImplications' or risks.
    d.  A list of actionable 'recommendedActions' (e.g., diet changes, lifestyle adjustments, consulting a doctor).
    e.  The single most appropriate 'recommendedDepartment' to consult for this specific issue (e.g., Endocrinology, Hematology, Nephrology).
5.  After analyzing all metrics, create a concise 'overallSummary' of the most critical findings.
6.  You MUST include the following 'disclaimer': "This AI analysis is for informational purposes only and is not a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition."
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
