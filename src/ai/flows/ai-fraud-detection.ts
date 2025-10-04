'use server';
/**
 * @fileOverview An AI-powered fraud detection flow for analyzing medical claims and prescriptions.
 *
 * - fraudDetection - A function that handles the fraud detection analysis.
 * - FraudDetectionInput - The input type for the fraudDetection function.
 * - FraudDetectionOutput - The return type for the fraudDetection function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

export const FraudDetectionInputSchema = z.object({
  dataType: z.enum(['Insurance Claim', 'Prescription Log']),
  data: z.string().describe('The JSON data of the claim or log to be analyzed.'),
});
export type FraudDetectionInput = z.infer<typeof FraudDetectionInputSchema>;

export const FraudDetectionOutputSchema = z.object({
  isSuspicious: z.boolean().describe('Whether the data is flagged as suspicious.'),
  riskScore: z.number().describe('A numerical score from 0 to 100 indicating the likelihood of fraud.'),
  reasons: z.array(z.string()).describe('A list of specific reasons why the data was flagged as suspicious.'),
  summary: z.string().describe('A concise, high-level summary of the findings.'),
});
export type FraudDetectionOutput = z.infer<typeof FraudDetectionOutputSchema>;

export async function fraudDetection(input: FraudDetectionInput): Promise<FraudDetectionOutput> {
  const prompt = ai.definePrompt({
    name: 'fraudDetectionPrompt',
    input: {schema: FraudDetectionInputSchema},
    output: {schema: FraudDetectionOutputSchema},
    prompt: `You are an expert in healthcare fraud detection. Analyze the provided {{{dataType}}} data for any signs of fraudulent activity.

Data:
\`\`\`json
{{{data}}}
\`\`\`

Look for common red flags such as:
- Duplicate claims for the same service, patient, and date.
- Billing for services not rendered or "phantom billing".
- Upcoding: billing for a more expensive service than what was actually provided.
- Unbundling: billing services separately that should be a single service.
- Prescription patterns like "doctor shopping" for controlled substances.
- Mismatched patient information, provider details, or dates.

Based on your analysis, determine if the activity is suspicious, provide a risk score (0-100), list the specific reasons for your conclusion, and give a brief summary. If no fraud is detected, state that clearly.`,
  });

  const fraudDetectionFlow = ai.defineFlow(
    {
      name: 'fraudDetectionFlow',
      inputSchema: FraudDetectionInputSchema,
      outputSchema: FraudDetectionOutputSchema,
    },
    async input => {
      const {output} = await prompt(input);
      return output!;
    }
  );
  return fraudDetectionFlow(input);
}