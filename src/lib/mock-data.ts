
'use client';

import type { Doctor, HospitalReview, Appointment, AttendanceRecord, AppointmentRequest, Medication } from './types';

// Helper to get data from localStorage or use initial mock data
function getStoredData<T>(key: string, initialData: T): T {
    if (typeof window === 'undefined') {
        return initialData;
    }
    try {
        const item = window.localStorage.getItem(key);
        return item ? JSON.parse(item) : initialData;
    } catch (error) {
        console.error(`Error reading ${key} from localStorage`, error);
        return initialData;
    }
}

// Helper to set data in localStorage
function setStoredData<T>(key: string, data: T) {
    if (typeof window === 'undefined') {
        return;
    }
    try {
        window.localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
        console.error(`Error writing ${key} to localStorage`, error);
    }
}

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

const initialPatientAppointments: Appointment[] = [
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
        meetingLink: 'https://meet.google.com/mno-pqr-stu'
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

const initialEmployeeAppointments: Appointment[] = [
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
        meetingLink: 'https://meet.google.com/vwx-yza-bcd'
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

const initialAppointmentRequests: AppointmentRequest[] = [
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

export const getPatientAppointments = () => getStoredData('patientAppointments', initialPatientAppointments);
export const getEmployeeAppointments = () => getStoredData('employeeAppointments', initialEmployeeAppointments);
export const getAppointmentRequests = () => {
    const requests = getStoredData('appointmentRequests', initialAppointmentRequests);
    // Dates need to be revived from strings
    return requests.map(req => ({...req, date: new Date(req.date)}));
};


export const addAppointmentRequest = (request: Omit<AppointmentRequest, 'id' | 'status' | 'patientName'>, patientName: string) => {
    const requests = getAppointmentRequests();
    const newRequest: AppointmentRequest = {
        ...request,
        id: `req${Date.now()}`,
        status: 'Pending',
        patientName,
    };
    const updatedRequests = [newRequest, ...requests];
    setStoredData('appointmentRequests', updatedRequests);
    return newRequest;
}

export const updateAppointmentRequestStatus = (id: string, status: 'Accepted' | 'Declined') => {
    const requests = getAppointmentRequests();
    const requestIndex = requests.findIndex(req => req.id === id);

    if(requestIndex > -1) {
        requests[requestIndex].status = status;
        setStoredData('appointmentRequests', requests);
        const request = requests[requestIndex];
        
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
            
            if (newAppointment.type === 'Online') {
                const randomString = Math.random().toString(36).substring(2, 11).replace(/\d/g, '').match(/.{1,3}/g)!.join('-');
                newAppointment.meetingLink = `https://meet.google.com/${randomString}`;
            }
            
            // This logic assumes we know which user this appointment belongs to, which we don't here.
            // A real app would have user IDs. For now, we'll add to a generic patient list and doctor list.
            const patientAppointments = getPatientAppointments();
            setStoredData('patientAppointments', [...patientAppointments, newAppointment]);

            // If the doctor is the generic 'Dr. Employee' or one of the mock doctors, add to their schedule.
            // This is a simplification for the prototype.
            if (request.doctor === 'Dr. Employee' || mockDoctors.some(d => d.name === request.doctor)) {
                 const employeeAppointments = getEmployeeAppointments();
                 setStoredData('employeeAppointments', [...employeeAppointments, newAppointment]);
            }
        }
        return requests[requestIndex];
    }
    return undefined;
};


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

export let mockMedications: Medication[] = [
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
