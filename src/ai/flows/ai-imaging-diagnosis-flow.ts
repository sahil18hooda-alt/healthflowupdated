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
    heatmapDataUri: z.string().optional().describe('A data URI of the generated heatmap visualization.'),
});

const textAnalysisPrompt = ai.definePrompt({
    name: 'imagingDiagnosisTextPrompt',
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

const generateHeatmapFlow = ai.defineFlow(
    {
        name: 'generateHeatmapFlow',
        inputSchema: ImagingDiagnosisInputSchema,
        outputSchema: z.string(),
    },
    async (flowInput) => {
        const {media} = await ai.generate({
            model: 'googleai/gemini-2.5-flash-image-preview',
            prompt: [
                {media: {url: flowInput.image}},
                {text: 'Based on the provided medical image (like an X-ray or CT scan), generate a simulated Grad-CAM heatmap. The heatmap should be a plausible visualization of where an AI might focus its attention to make a diagnosis. Overlay this heatmap onto the original image. The heatmap should use a color scale from yellow (low attention) to red (high attention) and be semi-transparent.'},
            ],
            config: {
                responseModalities: ['TEXT', 'IMAGE'],
            },
        });
        return media!.url;
    }
);


const diagnoseImageFlow = ai.defineFlow(
    {
        name: 'diagnoseImageFlow',
        inputSchema: ImagingDiagnosisInputSchema,
        outputSchema: ImagingDiagnosisOutputSchema,
    },
    async (flowInput) => {
        // Run text analysis and heatmap generation in parallel
        const [textAnalysisResult, heatmapResult] = await Promise.all([
            textAnalysisPrompt(flowInput),
            generateHeatmapFlow(flowInput)
        ]);
        
        const { output } = textAnalysisResult;
        
        if (!output) {
            throw new Error('Text analysis failed to produce an output.');
        }

        return {
            ...output,
            heatmapDataUri: heatmapResult,
        };
    }
);

export async function diagnoseImage(input: ImagingDiagnosisInput): Promise<ImagingDiagnosisOutput> {
    return diagnoseImageFlow(input);
}
