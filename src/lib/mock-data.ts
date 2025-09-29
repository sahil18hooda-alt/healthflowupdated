import type { Doctor, HospitalReview, Appointment, AttendanceRecord, AppointmentRequest, Medication } from './types';

export const mockDoctors: Doctor[] = [
  {
    id: '1',
    name: 'Dr. Anjali Sharma',
    specialization: 'Cardiologist',
    availability: 'Mon, Wed, Fri (9 AM - 1 PM)',
    imageId: 'doctor-2',
  },
  {
    id: '2',
    name: 'Dr. Vikram Singh',
    specialization: 'Neurologist',
    availability: 'Tue, Thu (10 AM - 4 PM)',
    imageId: 'doctor-1',
  },
  {
    id: '3',
    name: 'Dr. Priya Patel',
    specialization: 'Pediatrician',
    availability: 'Mon - Fri (9 AM - 5 PM)',
    imageId: 'doctor-4',
  },
  {
    id: '4',
    name: 'Dr. Rohan Mehra',
    specialization: 'Orthopedic Surgeon',
    availability: 'Mon, Thu (2 PM - 6 PM)',
    imageId: 'doctor-5',
  },
  {
    id: '5',
    name: 'Dr. Sameer Gupta',
    specialization: 'General Physician',
    availability: 'Mon - Sat (8 AM - 12 PM)',
    imageId: 'doctor-3',
  },
  {
    id: '6',
    name: 'Dr. Aisha Khan',
    specialization: 'Dermatologist',
    availability: 'Wed, Fri, Sat (11 AM - 3 PM)',
    imageId: 'doctor-6',
  },
];

export const mockReviews: HospitalReview[] = [
  {
    id: '1',
    patientName: 'Aarav Kumar',
    rating: 5,
    comment: 'The staff was incredibly supportive and the facility was top-notch. Highly recommend!',
    date: '2024-07-15',
  },
  {
    id: '2',
    patientName: 'Saanvi Mehta',
    rating: 4,
    comment: 'Good experience overall. The wait time was a bit long, but the doctor was very thorough.',
    date: '2024-07-12',
  },
  {
    id: '3',
    patientName: 'Rohan Desai',
    rating: 3,
    comment: 'The services are okay, but the administration process could be more streamlined.',
    date: '2024-07-10',
  },
  {
    id: '4',
    patientName: 'Diya Sharma',
    rating: 5,
    comment: 'Excellent care and attention to detail. Dr. Singh is a true professional.',
    date: '2024-06-28',
  },
];

export let mockPatientAppointments: Appointment[] = [
    {
        id: '1',
        doctorName: 'Dr. Anjali Sharma',
        patientName: 'Patient Zero',
        date: '2024-08-10',
        time: '10:00 AM',
        type: 'Hospital',
        status: 'Upcoming',
    },
    {
        id: '2',
        doctorName: 'Dr. Priya Patel',
        patientName: 'Patient Zero',
        date: '2024-08-15',
        time: '02:30 PM',
        type: 'Online',
        status: 'Upcoming',
    },
    {
        id: '3',
        doctorName: 'Dr. Sameer Gupta',
        patientName: 'Patient Zero',
        date: '2024-07-05',
        time: '09:00 AM',
        type: 'Hospital',
        status: 'Completed',
    }
];

export let mockEmployeeAppointments: Appointment[] = [
    {
        id: '1',
        doctorName: 'Dr. Employee',
        patientName: 'Ravi Kumar',
        date: '2024-08-10',
        time: '11:00 AM',
        type: 'Hospital',
        status: 'Upcoming',
    },
    {
        id: '2',
        doctorName: 'Dr. Employee',
        patientName: 'Sunita Devi',
        date: '2024-08-11',
        time: '03:00 PM',
        type: 'Online',
        status: 'Upcoming',
    },
     {
        id: '3',
        doctorName: 'Dr. Employee',
        patientName: 'Amit Patel',
        date: '2024-07-08',
        time: '01:00 PM',
        type: 'Hospital',
        status: 'Completed',
    }
];

export const mockAttendance: AttendanceRecord[] = [
    {
        id: '1',
        date: '2024-07-22',
        checkIn: '08:55 AM',
        checkOut: '05:05 PM',
        status: 'Present',
    },
    {
        id: '2',
        date: '2024-07-21',
        checkIn: '09:05 AM',
        checkOut: '05:00 PM',
        status: 'Present',
    },
    {
        id: '3',
        date: '2024-07-20',
        checkIn: null,
        checkOut: null,
        status: 'Absent',
    },
];

export let mockAppointmentRequests: AppointmentRequest[] = [
    {
      id: 'req1',
      doctor: 'Dr. Anjali Sharma',
      date: new Date('2024-08-20'),
      time: '10:00 AM',
      type: 'Hospital',
      patientName: 'Ravi Kumar',
      status: 'Pending',
    },
    {
      id: 'req2',
      doctor: 'Dr. Vikram Singh',
      date: new Date('2024-08-21'),
      time: '11:30 AM',
      type: 'Online',
      patientName: 'Sunita Devi',
      status: 'Pending',
    },
  ];
  
export const addAppointmentRequest = (request: Omit<AppointmentRequest, 'id' | 'status' | 'patientName'>, patientName: string) => {
    const newRequest: AppointmentRequest = {
        ...request,
        id: `req${Date.now()}`,
        status: 'Pending',
        patientName,
    };
    mockAppointmentRequests.unshift(newRequest);
    return newRequest;
}

export const updateAppointmentRequestStatus = (id: string, status: 'Accepted' | 'Declined') => {
    const requestIndex = mockAppointmentRequests.findIndex(req => req.id === id);
    if(requestIndex > -1) {
        mockAppointmentRequests[requestIndex].status = status;
        const request = mockAppointmentRequests[requestIndex];
        
        if (status === 'Accepted') {
            const newAppointment: Appointment = {
                id: `app${Date.now()}`,
                doctorName: request.doctor,
                patientName: request.patientName,
                date: request.date.toISOString().split('T')[0],
                time: request.time,
                type: request.type,
                status: 'Upcoming'
            };
            
            // This is a mock. In a real app, you'd have a global state or a refetch mechanism.
            // For now, let's assume we can push to both patient and employee arrays.
            // This won't update the UI automatically without more complex state management.
            mockPatientAppointments.push(newAppointment);

            // Add to the specific doctor's list as well
            if (request.doctor === 'Dr. Employee' || mockDoctors.find(d => d.name === request.doctor)) {
                 mockEmployeeAppointments.push(newAppointment);
            }
        }
        return mockAppointmentRequests[requestIndex];
    }
    return undefined;
};

export const mockMedications: Medication[] = [
    {
        id: '1',
        name: 'Aspirin',
        dosage: '75mg',
        frequency: 'Once a day',
        time: ['09:00 PM'],
    },
    {
        id: '2',
        name: 'Metformin',
        dosage: '500mg',
        frequency: 'Twice a day',
        time: ['08:00 AM', '08:00 PM'],
    },
    {
        id: '3',
        name: 'Vitamin D3',
        dosage: '1000 IU',
        frequency: 'Once a day',
        time: ['09:00 AM'],
    }
];

export const addMedication = (medication: Omit<Medication, 'id'>): Medication => {
    const newMedication: Medication = {
        ...medication,
        id: `med${mockMedications.length + 1}`,
    };
    mockMedications.push(newMedication);
    return newMedication;
};
