import { z } from 'zod';
import type { Timestamp } from 'firebase/firestore';

// -----------------------------
// Care Event Types & Schemas
// -----------------------------
export const CareEventTypeSchema = z.enum([
  'MedicationDispensed',
  'LabOrderCreated',
  'LabResultsReceived',
  'DoctorReviewedResults',
  'AppointmentScheduled',
  'AppointmentCompleted',
  'PrescriptionIssued',
  'ReferralMade',
  'ImagingOrdered',
  'ImagingCompleted',
]);
export type CareEventType = z.infer<typeof CareEventTypeSchema>;

export const CareEventStatusSchema = z.enum([
  'pending',
  'in_progress',
  'completed',
  'cancelled',
]);
export type CareEventStatus = z.infer<typeof CareEventStatusSchema>;

export const CareEventPrioritySchema = z.enum(['low', 'medium', 'high', 'urgent']);
export type CareEventPriority = z.infer<typeof CareEventPrioritySchema>;

export const CareEventNotificationSchema = z.object({
  sent: z.boolean().default(false),
  title: z.string().min(1),
  message: z.string().min(1),
});
export type CareEventNotification = z.infer<typeof CareEventNotificationSchema>;

export const CareEventMetadataSchema = z
  .object({
    doctorId: z.string().optional(),
    doctorName: z.string().optional(),
    medicationName: z.string().optional(),
    labTestType: z.string().optional(),
    appointmentId: z.string().optional(),
    pharmacyName: z.string().optional(),
    resultsSummary: z.string().optional(),
  })
  // Allow future keys to be added without breaking validation
  .catchall(z.unknown());
export type CareEventMetadata = z.infer<typeof CareEventMetadataSchema>;

export const CareEventSchema = z.object({
  id: z.string(),
  patientId: z.string(),
  eventType: CareEventTypeSchema,
  status: CareEventStatusSchema,
  timestamp: z.any() as unknown as z.ZodType<Timestamp>,
  metadata: CareEventMetadataSchema.default({}),
  relatedEvents: z.array(z.string()).default([]),
  priority: CareEventPrioritySchema.default('medium'),
  readByPatient: z.boolean().default(false),
  notification: CareEventNotificationSchema,
});
export type CareEvent = z.infer<typeof CareEventSchema>;

// -----------------------------
// Care Pathway Types & Schemas
// -----------------------------
export const CarePathwayTypeSchema = z.enum([
  'lab_test',
  'medication_refill',
  'specialist_referral',
]);
export type CarePathwayType = z.infer<typeof CarePathwayTypeSchema>;

export const CarePathwayStepStatusSchema = z.enum([
  'not_started',
  'in_progress',
  'completed',
]);
export type CarePathwayStepStatus = z.infer<typeof CarePathwayStepStatusSchema>;

export const CarePathwayStepSchema = z.object({
  stepId: z.string(),
  name: z.string(),
  status: CarePathwayStepStatusSchema.default('not_started'),
  eventId: z.string().optional(),
  completedAt: z.any().optional() as unknown as z.ZodType<Timestamp | undefined>,
});
export type CarePathwayStep = z.infer<typeof CarePathwayStepSchema>;

export const CarePathwaySchema = z.object({
  id: z.string(),
  patientId: z.string(),
  pathwayType: CarePathwayTypeSchema,
  startDate: z.any() as unknown as z.ZodType<Timestamp>,
  expectedCompletionDate: z.any() as unknown as z.ZodType<Timestamp>,
  steps: z.array(CarePathwayStepSchema),
  currentStepIndex: z.number().int().nonnegative().default(0),
  overallStatus: z.string().default('not_started'),
});
export type CarePathway = z.infer<typeof CarePathwaySchema>;

// -----------------------------
// Filters & Helpers
// -----------------------------
export type TimelineFilters = {
  eventType?: CareEventType | 'all';
  search?: string;
  actionRequired?: boolean; // pending or in_progress
  dateFrom?: Date;
  dateTo?: Date;
};
