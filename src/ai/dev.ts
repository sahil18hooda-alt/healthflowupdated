'use server';

import { config } from 'dotenv';
config();

import '@/ai/flows/ai-chatbot-assistant.ts';
import '@/ai/flows/ai-doctor-photos.ts';
import '@/ai/flows/symptom-analyzer-flow.ts';
import '@/ai/flows/ai-therapist-flow.ts';
import '@/ai/flows/inquiry-triage-flow.ts';
import '@/ai/flows/ai-predictive-risk-model.ts';
import '@/ai/flows/ai-medical-notes-generation.ts';
import '@/ai/flows/ai-surgery-scheduling-assistant.ts';
import '@/ai/flows/ai-lab-report-analyzer.ts';
import '@/ai/flows/ai-medication-interaction-checker.ts';
import '@/ai/flows/ai-queue-management.ts';
import '@/ai/flows/ai-imaging-diagnosis-flow.ts';
import '@/ai/flows/ai-fitness-coach-flow.ts';
