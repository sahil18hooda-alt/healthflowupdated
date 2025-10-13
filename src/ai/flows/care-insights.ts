'use server';

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const CareInsightsInput = z.object({
  patientSummary: z.string().describe('Brief context about patient and current journey.'),
  recentEvents: z
    .array(
      z.object({
        eventType: z.string(),
        status: z.string(),
        timestamp: z.string().describe('ISO timestamp or relative time'),
        keyInfo: z.string().describe('Key details like doctor name, lab test, medication, etc.'),
      })
    )
    .describe('Recent timeline events (most recent first).')
    .default([]),
  pathwayContext: z
    .object({
      pathwayType: z.string(),
      currentStep: z.string(),
      pendingSteps: z.array(z.string()),
      estimatedCompletion: z.string().optional(),
    })
    .optional(),
});

const CareInsightsOutput = z.object({
  suggestion: z.string().describe('Next best action to reduce patient anxiety and move care forward.'),
  rationale: z.string().describe('Why this step is appropriate now.'),
  urgency: z.enum(['low', 'medium', 'high', 'urgent']).describe('How urgent is this action.'),
  patientFriendlyMessage: z
    .string()
    .describe('Plain-language reassurance and guidance for the patient.'),
});

const prompt = ai.definePrompt({
  name: 'careInsightsPrompt',
  input: { schema: CareInsightsInput },
  output: { schema: CareInsightsOutput },
  prompt: `You are a care coordination assistant. Based on the patient's recent events and pathway context, recommend the single next best action. Be concrete and kind.

Patient Summary:
---
{{{patientSummary}}}
---

Recent Events (most recent first):
{{#each recentEvents}}
- [{{eventType}} | {{status}} | {{timestamp}}] {{keyInfo}}
{{/each}}

Pathway Context (if any):
{{#if pathwayContext}}
Type: {{pathwayContext.pathwayType}}
Current step: {{pathwayContext.currentStep}}
Pending: {{#each pathwayContext.pendingSteps}}{{this}}, {{/each}}
ETA: {{pathwayContext.estimatedCompletion}}
{{/if}}

Return your recommendation with a compassionate, patient-centered message.`,
});

const careInsightsFlow = ai.defineFlow(
  {
    name: 'careInsightsFlow',
    inputSchema: CareInsightsInput,
    outputSchema: CareInsightsOutput,
  },
  async (flowInput) => {
    const { output } = await prompt(flowInput);
    return output!;
  }
);

export async function careInsights(input: z.infer<typeof CareInsightsInput>) {
  return careInsightsFlow(input);
}
