'use server';
/**
 * @fileOverview An AI-powered fitness coach that provides personalized recommendations.
 *
 * - getFitnessPlan - A function that generates a fitness plan based on a user's health profile.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import type { HealthProfile, FitnessCoachOutput } from '@/lib/types';

const HealthProfileSchema = z.object({
    primaryGoal: z.enum(['lose-weight', 'gain-muscle', 'improve-endurance', 'reduce-stress', 'eat-healthier', 'improve-sleep', '']),
    activityLevel: z.enum(['sedentary', 'lightly-active', 'moderately-active', 'very-active', '']),
    dietaryPreferences: z.array(z.string()),
    sleepHours: z.number(),
    stressLevel: z.enum(['low', 'moderate', 'high', '']),
    // Wearable Data
    steps: z.number().optional(),
    calories: z.number().optional(),
    activeMinutes: z.number().optional(),
});

const FitnessCoachOutputSchema = z.object({
  weeklySummary: z.object({
    theme: z.string().describe("A central theme for the week, like 'Foundation Building' or 'Mindful Movement'."),
    motivationalQuote: z.string().describe("An inspiring quote to keep the user motivated."),
  }),
  dailyAnalysis: z.object({
      feedback: z.string().describe("A summary of today's performance, comparing wearable data to the user's primary goal."),
      revisedTargets: z.object({
          steps: z.string().describe("A specific, numerical target for today's steps. E.g., 'Aim for 2,000 more steps' or 'You've hit your goal! Great job!'"),
          calories: z.string().describe("A specific, numerical target for today's calorie intake. E.g., 'You have room for a 300-calorie snack' or 'Try to stick to your current calorie count.'"),
      }),
  }),
});


const prompt = ai.definePrompt({
    name: 'fitnessCoachPrompt',
    input: { schema: HealthProfileSchema },
    output: { schema: FitnessCoachOutputSchema },
    prompt: `You are an expert AI fitness and wellness coach (a "Smart Coach"). Your goal is to create a supportive, encouraging, and effective plan for the user based on their unique health profile and recent activity from their wearable device.

User's Health Profile:
- Primary Goal: {{{primaryGoal}}}
- Activity Level: {{{activityLevel}}}
- Dietary Preferences: {{#each dietaryPreferences}}{{{this}}}{{/each}}
- Average Sleep: {{{sleepHours}}} hours/night
- Stress Level: {{{stressLevel}}}

Today's Wearable Data:
- Steps: {{{steps}}}
- Calories Burned: {{{calories}}}
- Active Minutes: {{{activeMinutes}}}

Based on this complete profile, generate a 'weeklySummary' and a 'dailyAnalysis'.

1.  **Weekly Summary**:
    -   Create a concise 'theme' for the week that aligns with the user's primary goal.
    -   Provide a short, powerful 'motivationalQuote'.

2.  **Daily Analysis**:
    -   Write a 'feedback' summary that directly compares today's wearable data against what would be expected for their 'primaryGoal'.
    -   **Crucially, calculate and provide specific, numerical 'revisedTargets' for today.**
        - For 'steps', if the user is below a typical 10,000 step goal, calculate the difference and suggest it (e.g., "Aim for 2,500 more steps to hit your goal"). If they've met it, congratulate them.
        - For 'calories', analyze their burn vs. a standard target (approx. 2000-2500, adjusted for activity level). If their goal is 'lose-weight' and they have a calorie deficit, tell them how much room they have. If their goal is 'gain-muscle', suggest a calorie surplus. Provide a concrete number.

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
