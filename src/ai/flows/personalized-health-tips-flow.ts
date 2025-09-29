'use server';
/**
 * @fileOverview An AI flow for generating personalized health tips for patients.
 *
 * - getPersonalizedHealthTips - A function that generates health tips based on user profile.
 * - HealthTipsInput - The input type for the getPersonalizedHealthTips function.
 * - HealthTipsOutput - The return type for the getPersonalizedHealthTips function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const HealthTipsInputSchema = z.object({
  name: z.string().describe("The patient's name."),
  // In a real app, you would include more profile data like age, gender, conditions, etc.
});
export type HealthTipsInput = z.infer<typeof HealthTipsInputSchema>;

const HealthTipsOutputSchema = z.object({
  nutritionTips: z.array(z.string()).describe('A list of personalized nutrition tips.'),
  exerciseTips: z.array(z.string()).describe('A list of personalized exercise recommendations.'),
  stressManagementTips: z.array(z.string()).describe('A list of personalized stress management techniques.'),
});
export type HealthTipsOutput = z.infer<typeof HealthTipsOutputSchema>;

export async function getPersonalizedHealthTips(input: HealthTipsInput): Promise<HealthTipsOutput> {
  return personalizedHealthTipsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'personalizedHealthTipsPrompt',
  input: {schema: HealthTipsInputSchema},
  output: {schema: HealthTipsOutputSchema},
  prompt: `You are a health and wellness coach AI. Your goal is to provide personalized, actionable, and encouraging health tips to a user named {{{name}}}.

  Based on the user's name, generate a set of tips for the following categories:
  1.  **Nutrition**: Provide 3 unique and easy-to-follow dietary tips.
  2.  **Exercise**: Suggest 3 different types of physical activities.
  3.  **Stress Management**: Recommend 3 simple techniques for relaxation and mental well-being.

  Keep the tips concise (1-2 sentences each) and positive in tone. Address the user directly by name in your introduction. For example: "Here are some tips for you, {{{name}}}!".
  `,
});

const personalizedHealthTipsFlow = ai.defineFlow(
  {
    name: 'personalizedHealthTipsFlow',
    inputSchema: HealthTipsInputSchema,
    outputSchema: HealthTipsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
