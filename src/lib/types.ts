export type UserRole = 'patient' | 'employee';

export type User = {
  id: string;
  name:string;
  email: string;
  role: UserRole;
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
  id: string;
  doctorName: string;
  patientName: string;
  date: string;
  time: string;
  type: 'Hospital' | 'Online';
  status: 'Upcoming' | 'Completed' | 'Cancelled';
};

export type AppointmentRequest = {
  id: string;
  doctor: string;
  date: Date;
  time: string;
  type: 'Hospital' | 'Online';
  patientName: string;
  status: 'Pending' | 'Accepted' | 'Declined';
};


export type AttendanceRecord = {
  id: string;
  date: string;
  checkIn: string | null;
  checkOut: string | null;
  status: 'Present' | 'Absent';
};
