'use server';

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { ragWebsiteChat } from './rag-website-chat';

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
  prompt: `You are an AI assistant for HealthFlow, a comprehensive healthcare platform. Your primary role is to guide users through the website and help them find the information they need.

  If the user asks a question about the HealthFlow website, you should use the ragWebsiteChat tool to find the answer.

  HealthFlow offers a variety of services, including:

  *   **Appointments:**
      *   Book new appointments with specialists.
      *   View your upcoming and past appointments.
      *   Manage appointment requests.
  *   **Find a Doctor:**
      *   Browse a list of available doctors and their specializations.
  *   **AI-Powered Tools:**
      *   **Symptom Analyzer:** Get a preliminary analysis of your symptoms.
      *   **Medication Interaction Checker:** Check for potential interactions between your medications.
      *   **AI Therapist:** A supportive chatbot for mental wellness.
      *   **AI Fitness Coach:** Get personalized fitness advice.
      *   **Document Assistant:** Extract information from your medical documents.
      *   And more!
  *   **Care Coordination:**
      *   View your personalized care pathways and timeline.

  When a user asks a question, provide a clear and concise answer that directs them to the relevant section of the HealthFlow website.

  Here are some examples of how you can guide users:

  *   If a user asks "How do I book an appointment?", you can respond with: "You can book an appointment by navigating to the 'Appointments' page and clicking on the 'Book New' tab. From there, you can select a doctor, date, and time that works for you."
  *   If a user asks "What is the Symptom Analyzer?", you can respond with: "The Symptom Analyzer is an AI-powered tool that can help you understand your symptoms. You can find it in the 'AI-Powered Tools' section of the dashboard or by navigating to the 'Symptom Analyzer' page."
  *   If a user asks about their schedule, you can say: "You can view your schedule on the 'Appointments' page."

  Now, respond to the following query:
  {{{query}}}`,
});

const aiChatbotAssistantFlow = ai.defineFlow(
  {
    name: 'aiChatbotAssistantFlow',
    inputSchema: AIChatbotAssistantInputSchema,
    outputSchema: AIChatbotAssistantOutputSchema,
    tools: [ragWebsiteChat]
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
