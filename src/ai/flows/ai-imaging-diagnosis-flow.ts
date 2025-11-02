'use server';
/**
 * @fileOverview An AI flow for analyzing medical imaging scans.
 *
 * - diagnoseImage - A function that handles the image analysis.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import type { ImagingDiagnosisInput, ImagingDiagnosisOutput } from '@/lib/types';
import { gemini15Pro } from '@genkit-ai/googleai';

// Detect whether the Google GenAI API key is available so we can gracefully
// degrade instead of throwing runtime errors in local/dev environments.
const HAS_GENAI_KEY = !!process.env.GOOGLE_GENAI_API_KEY;

const ImagingDiagnosisInputSchema = z.object({
  image: z
    .string()
    .describe(
      "A medical image (e.g., X-ray, CT scan) as a data URI. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});

const ImagingDiagnosisOutputSchema = z.object({
    potentialConditions: z.array(z.object({
        condition: z.string().describe('The name of the potential condition detected (e.g., \"Pneumonia\", \"Metastatic bone tumor\").'),
        confidence: z.number().describe('The AI\'s confidence in this finding, from 0 to 100.'),
    })).describe('A list of potential conditions identified in the image.'),
    summary: z.string().describe('A high-level summary of the overall findings, written in clear, accessible language.'),
    observations: z.string().describe('A more detailed, point-by-point breakdown of what the AI observed in the image (e.g., \"Observed an opacity in the lower left lung lobe.\").'),
    recommendedDepartment: z.string().describe('The single most appropriate medical department for follow-up based on the findings (e.g., \"Pulmonology\", \"Oncology\", \"Orthopedics\").'),
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
4.  Based on your findings, determine the single most appropriate 'recommendedDepartment' for a follow-up (e.g., \"Pulmonology\", \"Oncology\", \"Orthopedics\").
5.  You MUST include the following 'disclaimer': \"This AI-generated analysis is for informational purposes only and is NOT a substitute for a professional diagnosis from a qualified radiologist or physician. Please consult with your healthcare provider to review these findings.\"

If the image does not appear to be a medical scan or is unclear, state that in the summary and observations, and set the department to \"General Practice\".
`,
});

const generateHeatmapFlow = ai.defineFlow(
    {
        name: 'generateHeatmapFlow',
        inputSchema: ImagingDiagnosisInputSchema,
        outputSchema: z.string(),
    },
    async (flowInput) => {
        // If no key, skip invoking the model. The caller will handle undefined heatmap
        // by omitting it from the report.
        if (!HAS_GENAI_KEY) {
            // Returning an empty transparent PNG data URI as a benign placeholder.
            // Consumers can treat empty string as \"no heatmap\".
            return '';
        }

        try {
            const result: any = await ai.generate({
                model: gemini15Pro,
                prompt: [
                    {media: {url: flowInput.image}},
                    {text: 'Based on the provided medical image (like an X-ray or CT scan), generate a simulated Grad-CAM heatmap. The heatmap should be a plausible visualization of where an AI might focus its attention to make a diagnosis. Overlay this heatmap onto the original image. The heatmap should use a color scale from yellow (low attention) to red (high attention) and be semi-transparent.'},
                ],
                config: {
                    responseModalities: ['TEXT', 'IMAGE'],
                },
            });

            // Try to extract an image data URI or URL from a few possible shapes
            const media = (result && (result.media || result.image || result.images || result.output)) as any;

            const fromMedia = (() => {
                if (!media) return '';
                // If a single object with url
                if (typeof media === 'object' && media !== null && 'url' in media && media.url) return media.url as string;
                // If an array of media items
                if (Array.isArray(media) && media.length > 0) {
                    const first = media[0];
                    if (first && typeof first === 'object' && 'url' in first && first.url) return first.url as string;
                }
                return '';
            })();

            if (fromMedia && typeof fromMedia === 'string') return fromMedia;

            // Fallback: sometimes models return a data URI in text
            const text: string | undefined = (result && (result.text || result.outputText || result.response)) as any;
            if (typeof text === 'string') {
                const match = text.match(/data:image\/(?:png|jpeg|jpg);base64,[A-Za-z0-9+/=]+/);
                if (match) return match[0];
            }

            return '';
        } catch (e) {
            // Best-effort heatmap; swallow errors and let caller handle
            return '';
        }
    }
);


const diagnoseImageFlow = ai.defineFlow(
    {
        name: 'diagnoseImageFlow',
        inputSchema: ImagingDiagnosisInputSchema,
        outputSchema: ImagingDiagnosisOutputSchema,
    },
    async (flowInput) => {
        // Helper fallback when AI service is unavailable or fails.
const fallback = (): ImagingDiagnosisOutput => ({
            potentialConditions: [],
            summary: 'AI service is not available. Showing a safe, generic summary based on the uploaded image. Please try again later or contact support if the issue persists.',
            observations: '- The provided image could not be analyzed by the AI service.\\n- Ensure the file is a supported medical image (JPG/PNG).',
            recommendedDepartment: 'General Practice',
            disclaimer: 'This AI-generated analysis is for informational purposes only and is NOT a substitute for a professional diagnosis from a qualified radiologist or physician. Please consult with your healthcare provider to review these findings.',
            heatmapDataUri: undefined,
            usingFallback: true,
        });

        // If no API key configured, return a graceful fallback immediately.
        if (!HAS_GENAI_KEY) {
            return fallback();
        }

        try {
            // Run text analysis and heatmap generation concurrently. Heatmap is best-effort.
            const [textAnalysisResult, heatmapMaybe] = await Promise.all([
                textAnalysisPrompt(flowInput),
                // Heatmap generation should not fail the entire flow.
                generateHeatmapFlow(flowInput).catch(() => ''),
            ]);

            const { output } = textAnalysisResult;
            if (!output) {
                // Unexpected: model returned no structured output
                return fallback();
            }

return {
                ...output,
                heatmapDataUri: heatmapMaybe || undefined,
                usingFallback: false,
            };
        } catch (err) {
            // Any runtime/model error -> graceful fallback
            return fallback();
        }
    }
);

export async function diagnoseImage(input: ImagingDiagnosisInput): Promise<ImagingDiagnosisOutput> {
    return diagnoseImageFlow(input);
}
