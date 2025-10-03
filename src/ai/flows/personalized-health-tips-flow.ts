'use server';
/**
 * @fileOverview An AI flow for generating personalized health tips for patients.
 *
 * - getPersonalizedHealthTips - A function that generates health tips based on a user's health profile and real-time data.
 * - HealthTipsInput - The input type for the getPersonalizedHealthTips function.
 * - HealthTipsOutput - The return type for the getPersonalizedHealthTips function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

// Define the structure for the user's health profile
const UserProfileSchema = z.object({
  name: z.string().describe("The patient's name."),
  primaryGoal: z.string().describe('The main health goal of the user (e.g., lose-weight, reduce-stress).'),
  activityLevel: z.string().describe('The user\'s current activity level (e.g., sedentary, active).'),
  sleepHours: z.number().describe('The average number of hours the user sleeps per night.'),
  stressLevel: z.string().describe('The user\'s self-reported stress level (e.g., low, high).'),
});

// Define the structure for real-time environmental data
const RealTimeDataSchema = z.object({
  weather: z.string().describe('The current weather conditions (e.g., "Sunny", "Rainy").'),
  airQuality: z.string().describe('A descriptive air quality index (e.g., "Good", "Moderate", "Unhealthy").'),
});

// Define the input for the entire flow
export const HealthTipsInputSchema = z.object({
  userProfile: UserProfileSchema,
  realTimeData: RealTimeDataSchema,
});
export type HealthTipsInput = z.infer<typeof HealthTipsInputSchema>;

// Define the output structure for the generated tips
export const HealthTipsOutputSchema = z.object({
  greeting: z.string().describe("A personalized greeting for the user."),
  nutritionTip: z.string().describe('A personalized nutrition tip based on the user profile and context.'),
  exerciseTip: z.string().describe('A personalized exercise recommendation based on the user profile and context.'),
  wellbeingTip: z.string().describe('A personalized stress management or mental well-being tip.'),
  contextualTip: z.string().describe('A special tip that directly relates to the current weather or air quality.'),
});
export type HealthTipsOutput = z.infer<typeof HealthTipsOutputSchema>;

// Export the main function to be called from the frontend
export async function getPersonalizedHealthTips(input: HealthTipsInput): Promise<HealthTipsOutput> {
  return personalizedHealthTipsFlow(input);
}

// Define the AI prompt with the new, more detailed input and output schemas
const prompt = ai.definePrompt({
  name: 'personalizedHealthTipsPrompt',
  input: {schema: HealthTipsInputSchema},
  output: {schema: HealthTipsOutputSchema},
  prompt: `You are a holistic AI wellness coach named "Kai". Your goal is to provide personalized, actionable, and encouraging daily health tips.

  User Profile:
  - Name: {{{userProfile.name}}}
  - Primary Goal: {{{userProfile.primaryGoal}}}
  - Activity Level: {{{userProfile.activityLevel}}}
  - Average Sleep: {{{userProfile.sleepHours}}} hours
  - Stress Level: {{{userProfile.stressLevel}}}

  Current Conditions:
  - Weather: {{{realTimeData.weather}}}
  - Air Quality: {{{realTimeData.airQuality}}}

  Based on all this information, generate a set of tips for {{{userProfile.name}}}.

  1. **Greeting**: Start with a friendly, personalized greeting.
  2. **Nutrition Tip**: Provide a unique nutrition tip relevant to their goal.
  3. **Exercise Tip**: Suggest a physical activity. If the weather is bad (e.g., Rainy, Extreme Heat) or air quality is poor (e.g., Unhealthy), suggest an indoor activity. Otherwise, suggest an outdoor one.
  4. **Wellbeing Tip**: Give a simple technique for relaxation or mental well-being, especially considering their stress and sleep levels.
  5. **Contextual Tip**: Create a special tip that specifically acknowledges and addresses today's weather or air quality. For example, if it's sunny, suggest getting some Vitamin D. If air quality is poor, recommend staying indoors.

  Keep all tips concise (1-2 sentences) and maintain a positive, encouraging tone. Address the user by name where it feels natural.
  `,
});

// Define the Genkit flow
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
