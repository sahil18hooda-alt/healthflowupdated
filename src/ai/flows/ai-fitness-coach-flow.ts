'use server';
/**
 * @fileOverview An AI-powered fitness coach that provides personalized recommendations.
 *
 * - getFitnessPlan - A function that generates a fitness plan based on a user's health profile.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import type { HealthProfile, FitnessCoachOutput } from '@/lib/types';

const HealthProfileSchema = z.object({
    primaryGoal: z.enum(['lose-weight', 'gain-muscle', 'improve-endurance', 'reduce-stress', 'eat-healthier', 'improve-sleep', '']),
    activityLevel: z.enum(['sedentary', 'lightly-active', 'moderately-active', 'very-active', '']),
    dietaryPreferences: z.array(z.string()),
    sleepHours: z.number(),
    stressLevel: z.enum(['low', 'moderate', 'high', '']),
});

const FitnessCoachOutputSchema = z.object({
  weeklySummary: z.object({
    theme: z.string().describe("A central theme for the week, like 'Foundation Building' or 'Mindful Movement'."),
    motivationalQuote: z.string().describe("An inspiring quote to keep the user motivated."),
  }),
  actionableTips: z.array(z.object({
    category: z.enum(['Fitness', 'Nutrition', 'Wellness', 'Sleep']),
    tip: z.string().describe("A specific, actionable tip for the user to follow."),
  })).describe("A list of personalized tips across different health categories."),
});


const prompt = ai.definePrompt({
    name: 'fitnessCoachPrompt',
    input: { schema: HealthProfileSchema },
    output: { schema: FitnessCoachOutputSchema },
    prompt: `You are an expert AI fitness and wellness coach. Your goal is to create a supportive, encouraging, and effective plan for the user based on their unique health profile.

User's Health Profile:
- Primary Goal: {{{primaryGoal}}}
- Activity Level: {{{activityLevel}}}
- Dietary Preferences: {{#each dietaryPreferences}}{{{this}}}{{/each}}
- Average Sleep: {{{sleepHours}}} hours/night
- Stress Level: {{{stressLevel}}}

Based on this profile, generate a 'weeklySummary' and a set of 'actionableTips'.

1.  **Weekly Summary**:
    -   Create a concise 'theme' for the week that aligns with the user's primary goal.
    -   Provide a short, powerful 'motivationalQuote'.

2.  **Actionable Tips**:
    -   Provide at least four practical and personalized tips.
    -   Ensure the tips cover a range of categories: 'Fitness', 'Nutrition', 'Wellness', and 'Sleep'.
    -   The tips must be highly relevant to the user's 'primaryGoal'. For example, if the goal is 'lose-weight', nutrition tips should focus on calorie deficit and fitness tips on calorie expenditure. If the goal is 'reduce-stress', wellness tips should focus on mindfulness and relaxation techniques.

Your tone should be positive, knowledgeable, and motivating.
`,
});


const getFitnessPlanFlow = ai.defineFlow(
    {
    name: 'getFitnessPlanFlow',
    inputSchema: HealthProfileSchema,
    outputSchema: FitnessCoachOutputSchema,
    },
    async (profile) => {
        const { output } = await prompt(profile);
        return output!;
    }
);


export async function getFitnessPlan(input: HealthProfile): Promise<FitnessCoachOutput> {
    return getFitnessPlanFlow(input);
}
