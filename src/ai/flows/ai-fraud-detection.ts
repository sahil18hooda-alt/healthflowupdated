'use server';
/**
 * @fileOverview An AI flow for detecting fraudulent activity in medical claims and prescriptions.
 *
 * - fraudDetection - A function that handles the fraud detection process.
 * - FraudDetectionInput - The input type for the fraudDetection function.
 * - FraudDetectionOutput - The return type for the fraudDetection function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const FraudDetectionInputSchema = z.object({
  dataType: z.enum(['Insurance Claim', 'Prescription Log']),
  jsonData: z.string().describe('The JSON data of the claim or log to be analyzed.'),
});
export type FraudDetectionInput = z.infer<typeof FraudDetectionInputSchema>;

const FraudDetectionOutputSchema = z.object({
  isSuspicious: z.boolean().describe('A flag indicating if the data is suspicious.'),
  riskScore: z.number().min(0).max(100).describe('A numerical score from 0 to 100 indicating the likelihood of fraud.'),
  reasons: z.array(z.string()).describe('A list of specific reasons why the data was flagged as suspicious.'),
  summary: z.string().describe('A concise, high-level summary of the findings.'),
});
export type FraudDetectionOutput = z.infer<typeof FraudDetectionOutputSchema>;

export async function fraudDetection(input: FraudDetectionInput): Promise<FraudDetectionOutput> {
  return fraudDetectionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'fraudDetectionPrompt',
  input: {schema: FraudDetectionInputSchema},
  output: {schema: FraudDetectionOutputSchema},
  prompt: `You are an expert AI healthcare fraud detection analyst. Your task is to analyze the provided JSON data, which represents either an 'Insurance Claim' or a 'Prescription Log', and identify any signs of fraudulent activity.

  Analyze the following data:
  Data Type: {{{dataType}}}
  Data:
  \`\`\`json
  {{{jsonData}}}
  \`\`\`

  Look for common red flags, including but not limited to:
  - For Insurance Claims: Duplicate claims, billing for services not rendered, upcoding (billing for a more expensive service), or inconsistent patient information.
  - For Prescription Logs: Overlapping prescriptions for controlled substances from multiple doctors (doctor shopping), unusually high quantities, or frequent early refills.

  Based on your analysis:
  1. Set 'isSuspicious' to true if you find any credible red flags, otherwise set it to false.
  2. Provide a 'riskScore' from 0 (no risk) to 100 (high certainty of fraud).
  3. List the specific 'reasons' for your suspicion in a clear, itemized format. If not suspicious, provide a reason for the low risk.
  4. Write a brief 'summary' of your overall findings.
  `,
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
