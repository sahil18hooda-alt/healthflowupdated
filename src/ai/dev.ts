'use server';

import { config } from 'dotenv';
config();

import '@/ai/flows/ai-chatbot-assistant.ts';
import '@/ai/flows/ai-doctor-photos.ts';
import '@/ai/flows/symptom-analyzer-flow.ts';
import '@/ai/flows/ai-therapist-flow.ts';
import '@/ai/flows/inquiry-triage-flow.ts';
import '@/ai/flows/ai-fraud-detection.ts';
import '@/ai/flows/ai-predictive-risk-model.ts';
