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

export type HealthProfile = {
  id: string;
  userId: string;
  age: number;
  gender: 'male' | 'female' | 'other' | 'prefer-not-to-say';
  primaryGoal: 'lose-weight' | 'gain-muscle' | 'improve-endurance' | 'reduce-stress' | 'eat-healthier' | 'improve-sleep';
  activityLevel: 'sedentary' | 'lightly-active' | 'moderately-active' | 'very-active';
  dietaryPreferences: Array<'vegetarian' | 'vegan' | 'gluten-free' | 'dairy-free' | 'none'>;
  sleepHours: number;
  stressLevel: 'low' | 'moderate' | 'high';
  updatedAt: string; // ISO 8601 date string
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
