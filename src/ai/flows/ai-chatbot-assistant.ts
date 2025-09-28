'use server';

/**
 * @fileOverview An AI chatbot assistant for answering common questions about the platform.
 *
 * - aiChatbotAssistant - A function that handles the chatbot assistant process.
 * - AIChatbotAssistantInput - The input type for the aiChatbotAssistant function.
 * - AIChatbotAssistantOutput - The return type for the aiChatbotAssistant function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AIChatbotAssistantInputSchema = z.object({
  query: z.string().describe('The user query or question.'),
});
export type AIChatbotAssistantInput = z.infer<typeof AIChatbotAssistantInputSchema>;

const AIChatbotAssistantOutputSchema = z.object({
  response: z.string().describe('The response from the AI chatbot assistant.'),
});
export type AIChatbotAssistantOutput = z.infer<typeof AIChatbotAssistantOutputSchema>;

export async function aiChatbotAssistant(input: AIChatbotAssistantInput): Promise<AIChatbotAssistantOutput> {
  return aiChatbotAssistantFlow(input);
}

const prompt = ai.definePrompt({
  name: 'aiChatbotAssistantPrompt',
  input: {schema: AIChatbotAssistantInputSchema},
  output: {schema: AIChatbotAssistantOutputSchema},
  prompt: `You are a helpful AI chatbot assistant designed to answer common questions about the HealthFlow platform.

  Your goal is to provide clear, concise, and informative responses to user queries.

  Here are some example questions you should be able to answer:
  - How do I book an appointment?
  - What are the available services on this platform?
  - How do I find a doctor?
  - How do I upload my prescription?
  - What do I do in case of a medical emergency?

  Now, respond to the following query:
  {{{query}}}`,
});

const aiChatbotAssistantFlow = ai.defineFlow(
  {
    name: 'aiChatbotAssistantFlow',
    inputSchema: AIChatbotAssistantInputSchema,
    outputSchema: AIChatbotAssistantOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
