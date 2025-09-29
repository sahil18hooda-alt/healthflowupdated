'use server';

import { config } from 'dotenv';
config();

import '@/ai/flows/ai-chatbot-assistant.ts';
import '@/ai/flows/ai-doctor-photos.ts';
import '@/ai/flows/symptom-analyzer-flow.ts';
