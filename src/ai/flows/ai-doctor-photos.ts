'use server';

/**
 * @fileOverview AI-powered doctor photo generator.
 *
 * - generateDoctorPhoto - A function that generates an AI doctor photo.
 * - GenerateDoctorPhotoInput - The input type for the generateDoctorPhoto function.
 * - GenerateDoctorPhotoOutput - The return type for the generateDoctorPhoto function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateDoctorPhotoInputSchema = z.object({
  prompt: z
    .string()
    .describe('A description of the desired doctor, including gender, age, and ethnicity.'),
});
export type GenerateDoctorPhotoInput = z.infer<typeof GenerateDoctorPhotoInputSchema>;

const GenerateDoctorPhotoOutputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of the doctor, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type GenerateDoctorPhotoOutput = z.infer<typeof GenerateDoctorPhotoOutputSchema>;

export async function generateDoctorPhoto(input: GenerateDoctorPhotoInput): Promise<GenerateDoctorPhotoOutput> {
  return generateDoctorPhotoFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateDoctorPhotoPrompt',
  input: {schema: GenerateDoctorPhotoInputSchema},
  output: {schema: GenerateDoctorPhotoOutputSchema},
  prompt: `Generate a professional headshot of a doctor with the following characteristics: {{{prompt}}}. The doctor should appear friendly and trustworthy.`,
});

const generateDoctorPhotoFlow = ai.defineFlow(
  {
    name: 'generateDoctorPhotoFlow',
    inputSchema: GenerateDoctorPhotoInputSchema,
    outputSchema: GenerateDoctorPhotoOutputSchema,
  },
  async input => {
    const {media} = await ai.generate({
      prompt: input.prompt,
      model: 'googleai/imagen-4.0-fast-generate-001',
    });

    return {
      photoDataUri: media!.url,
    };
  }
);
