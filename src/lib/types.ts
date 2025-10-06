

export type UserRole = 'patient' | 'employee';

export type User = {
  id: string;
  name:string;
  email: string;
  role: UserRole;
  healthProfile?: HealthProfile;
};

export type Doctor = {
  id: string;
  name: string;
  specialization: string;
  availability: string;
  imageId: string;
};

export type HospitalReview = {
  id: string;
  patientName: string;
  rating: number;
  comment: string;
  date: string;
};

export type Appointment = {
  id:string;
  doctorName: string;
  patientName: string;
  date: string;
  time: string;
  type: 'Hospital' | 'Online';
  status: 'Upcoming' | 'Completed' | 'Cancelled';
  meetingLink?: string;
  problemSummary?: string;
};

export type AppointmentRequest = {
  id: string;
  doctor: string;
  date: Date;
  time: string;
  type: 'Hospital' | 'Online';
  patientName: string;
  status: 'Pending' | 'Accepted' | 'Declined';
  problemDescription?: string;
  fileDataUri?: string;
  problemSummary?: string;
};


export type AttendanceRecord = {
  id: string;
  date: string;
  checkIn: string | null;
  checkOut: string | null;
  status: 'Present' | 'Absent';
};

export type Medication = {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  time: string[];
};

export type WearableData = {
    steps: number;
    heartRate: number;
    calories: number;
    activeMinutes: number;
}

export type HealthProfile = {
  primaryGoal: 'lose-weight' | 'gain-muscle' | 'improve-endurance' | 'reduce-stress' | 'eat-healthier' | 'improve-sleep' | '';
  activityLevel: 'sedentary' | 'lightly-active' | 'moderately-active' | 'very-active' | '';
  dietaryPreferences: Array<'vegetarian' | 'vegan' | 'gluten-free' | 'dairy-free' | 'none'>;
  sleepHours: number;
  stressLevel: 'low' | 'moderate' | 'high' | '';
  steps?: number;
  calories?: number;
  activeMinutes?: number;
};

export interface FraudDetectionInput {
  dataType: 'Insurance Claim' | 'Prescription Log';
  data: string;
}

export interface FraudDetectionOutput {
  isSuspicious: boolean;
  riskScore: number;
  reasons: string[];
  summary: string;
}

export interface PredictiveRiskInput {
  patientData: string;
}

export interface PredictiveRiskOutput {
  readmissionRiskScore: number;
  complicationRiskScore: number;
  riskFactors: Array<{
    factor: string;
    explanation: string;
  }>;
  recommendations: string[];
  summary: string;
}

export interface ScheduleAppointmentInput {
  doctor: string;
  patient: string;
  appointmentType: string;
  durationInMinutes: number;
  preferredDateRange: {
    start: string;
    end: string;
  };
  existingCommitments: string;
}

export interface ScheduleAppointmentOutput {
  suggestedAppointmentSlot: string;
  reasoning: string;
}

export interface LabReportAnalysisInput {
    reportImage: string;
}

export interface LabReportAnalysisOutput {
    summary: string;
    keyMetrics: Array<{
        metric: string;
        value: string;
        normalRange: string;
        interpretation: "High" | "Low" | "Normal" | "Borderline High" | "Borderline Low" | "N/A";
    }>;
    disclaimer: string;
}

export interface MedicationInteractionInput {
    medications: string[];
}

export interface MedicationInteractionOutput {
    summary: string;
    interactions: Array<{
        medications: string[];
        severity: 'Minor' | 'Moderate' | 'Major';
        description: string;
    }>;
    disclaimer: string;
}

export interface QueueManagementInput {
  queueType: 'Appointments' | 'Lab / Blood Work' | 'Pharmacy';
  currentTime: string;
  currentDay: string;
  queueLength: number;
  avgServiceTime: number;
}

export interface QueueManagementOutput {
  estimatedWaitTime: number;
  queueStatus: string;
}

export interface ImagingDiagnosisInput {
  image: string; // data URI
}

export interface ImagingDiagnosisOutput {
  potentialConditions: Array<{
    condition: string;
    confidence: number; // e.g., 95 for 95%
  }>;
  summary: string;
  observations: string;
  disclaimer: string;
  heatmapDataUri?: string;
}

export type ImagingReport = {
    id: string;
    userId: string;
    imageUrl: string;
    analysis: ImagingDiagnosisOutput;
    createdAt: string;
}

export interface FitnessCoachOutput {
  weeklySummary: {
    theme: string;
    motivationalQuote: string;
  };
  actionableTips: Array<{
    category: 'Fitness' | 'Nutrition' | 'Wellness' | 'Sleep';
    tip: string;
  }>;
}
