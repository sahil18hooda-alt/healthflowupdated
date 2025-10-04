'use server';
/**
 * @fileOverview An AI-powered clinical decision support flow for predicting patient risks.
 *
 * - predictiveRiskModel - A function that analyzes patient data to predict risks.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import type { PredictiveRiskInput, PredictiveRiskOutput } from '@/lib/types';

const PredictiveRiskInputSchema = z.object({
    patientData: z.string().describe('A comprehensive summary of a patient\'s clinical data, including demographics, medical history, vitals, and lab results.'),
});

const PredictiveRiskOutputSchema = z.object({
    readmissionRiskScore: z.number().describe('A percentage score (0-100) predicting the likelihood of hospital readmission.'),
    complicationRiskScore: z.number().describe('A percentage score (0-100) predicting the risk of post-discharge complications.'),
    riskFactors: z.array(z.object({
        factor: z.string().describe('The specific risk factor identified (e.g., "Age", "High Creatinine").'),
        explanation: z.string().describe('A brief explanation of why this factor increases risk.'),
    })).describe('A list of the most significant factors contributing to the patient\'s risk profile.'),
    recommendations: z.array(z.string()).describe('Actionable recommendations to mitigate the identified risks.'),
    summary: z.string().describe('A concise, high-level summary of the patient\'s overall risk profile.'),
});

const prompt = ai.definePrompt({
    name: 'predictiveRiskPrompt',
    input: {schema: PredictiveRiskInputSchema},
    output: {schema: PredictiveRiskOutputSchema},
    prompt: `You are an AI clinical decision support system. Your task is to analyze patient clinical data and predict the risk of hospital readmission and post-discharge complications.

Patient Data:
---
{{{patientData}}}
---

Analyze the provided data to identify key risk factors. Consider interactions between comorbidities, lab values, age, and recent treatments.
Based on your analysis:
1.  Calculate a 'readmissionRiskScore' (0-100%).
2.  Calculate a 'complicationRiskScore' (0-100%).
3.  List the primary 'riskFactors' and briefly explain their impact.
4.  Provide actionable 'recommendations' for the healthcare provider to mitigate these risks.
5.  Write a brief 'summary' of the patient's overall risk profile.
`,
});

const predictiveRiskModelFlow = ai.defineFlow(
    {
    name: 'predictiveRiskModelFlow',
    inputSchema: PredictiveRiskInputSchema,
    outputSchema: PredictiveRiskOutputSchema,
    },
    async (flowInput) => {
    const {output} = await prompt(flowInput);
    return output!;
    }
);


export async function predictiveRiskModel(input: PredictiveRiskInput): Promise<PredictiveRiskOutput> {
    return predictiveRiskModelFlow(input);
}
