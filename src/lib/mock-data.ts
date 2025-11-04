import type { Doctor, HospitalReview, Appointment, AttendanceRecord, AppointmentRequest, Medication, ChatMessage } from './types';
export type { ChatMessage } from './types';

const APPOINTMENTS_STORAGE_KEY = 'allAppointments_v2';
const REQUESTS_STORAGE_KEY = 'appointmentRequests_v2';

// Custom event for storage updates
const dispatchStorageEvent = (key: string) => {
    if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('storage-update', { detail: { key } }));
    }
};


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
        dispatchStorageEvent(key);
    } catch (error) {
        console.error(`Error writing ${key} to localStorage`, error);
    }
}

export const mockDoctors: Doctor[] = [
  {
    id: '1',
    name: 'Dr. Arjun Sharma',
    specialization: 'Cardiologist',
    availability: 'Mon, Wed, Fri (9 AM - 1 PM)',
    imageId: 'doctor-2',
    description: 'A highly experienced cardiologist with over 15 years of practice, specializing in interventional cardiology and cardiac imaging.',
    profile: {
      id: 'prof1',
      doctorId: '1',
      education: [
        { institution: 'All India Institute of Medical Sciences, New Delhi', degree: 'MD, Cardiology', year: '2008' },
        { institution: 'Jawaharlal Institute of Postgraduate Medical Education & Research, Puducherry', degree: 'MBBS', year: '2004' },
      ],
      experience: [
        { hospital: 'Fortis Escorts Heart Institute, New Delhi', position: 'Senior Consultant Cardiologist', years: '2012-Present' },
        { hospital: 'Apollo Hospitals, Chennai', position: 'Consultant Cardiologist', years: '2008-2012' },
      ],
      publications: [
        { title: 'Innovations in Cardiac Catheterization', journal: 'Indian Heart Journal', year: '2020' },
        { title: 'A Study on Heart Failure Management', journal: 'Journal of the American College of Cardiology', year: '2018' },
      ],
      awards: [
        { name: 'Best Cardiologist of the Year', year: '2021' },
        { name: 'Excellence in Patient Care', year: '2019' },
      ],
      personalStatement: 'My mission is to provide cutting-edge, compassionate cardiac care. I believe in a patient-centric approach, where we work together to achieve the best possible outcomes for your heart health. Continuous learning and a commitment to excellence are the cornerstones of my practice.',
    },
  },
  {
    id: '2',
    name: 'Dr. Vikram Singh',
    specialization: 'Neurologist',
    availability: 'Tue, Thu (10 AM - 4 PM)',
    imageId: 'doctor-1',
    description: 'A leading neurologist known for his work in treating complex neurological disorders, including epilepsy and stroke.',
    profile: {
      id: 'prof2',
      doctorId: '2',
      education: [
        { institution: 'National Institute of Mental Health and Neurosciences, Bengaluru', degree: 'DM, Neurology', year: '2010' },
        { institution: 'King George\'s Medical University, Lucknow', degree: 'MBBS', year: '2006' },
      ],
      experience: [
        { hospital: 'Medanta - The Medicity, Gurugram', position: 'Head of Neurology', years: '2015-Present' },
        { hospital: 'PGIMER, Chandigarh', position: 'Assistant Professor of Neurology', years: '2010-2015' },
      ],
      publications: [
        { title: 'Advances in Stroke Rehabilitation', journal: 'Annals of Indian Academy of Neurology', year: '2022' },
      ],
      awards: [
        { name: 'Pioneer in Neurology', year: '2020' },
      ],
      personalStatement: 'I am dedicated to advancing the field of neurology through both clinical practice and research. My focus is on providing comprehensive care for patients with complex neurological conditions, always with a human touch.',
    },
  },
  {
    id: '3',
    name: 'Dr. Nandani Mehra',
    specialization: 'Pediatrician',
    availability: 'Mon - Fri (9 AM - 5 PM)',
    imageId: 'doctor-3',
    description: 'A dedicated pediatrician with a passion for child wellness and development, offering comprehensive care for children of all ages.',
    profile: {
      id: 'prof3',
      doctorId: '3',
      education: [
        { institution: 'Lady Hardinge Medical College, New Delhi', degree: 'MD, Pediatrics', year: '2012' },
        { institution: 'Maulana Azad Medical College, New Delhi', degree: 'MBBS', year: '2008' },
      ],
      experience: [
        { hospital: 'Sir Ganga Ram Hospital, New Delhi', position: 'Consultant Pediatrician', years: '2014-Present' },
      ],
      publications: [],
      awards: [],
      personalStatement: 'I believe in a holistic approach to child health, focusing on both physical and emotional well-being. My goal is to create a friendly and trusting environment where children and parents feel comfortable and supported.',
    },
  },
  {
    id: '4',
    name: 'Dr. Rohan Mehra',
    specialization: 'Orthopedic Surgeon',
    availability: 'Mon, Thu (2 PM - 6 PM)',
    imageId: 'doctor-5',
    description: 'A skilled orthopedic surgeon specializing in joint replacement and sports injuries, committed to helping patients regain mobility.',
    profile: {
      id: 'prof4',
      doctorId: '4',
      education: [
        { institution: 'Smt. NHL Municipal Medical College, Ahmedabad', degree: 'MS, Orthopedics', year: '2014' },
        { institution: 'B. J. Medical College, Ahmedabad', degree: 'MBBS', year: '2010' },
      ],
      experience: [
        { hospital: 'Kokilaben Dhirubhai Ambani Hospital, Mumbai', position: 'Orthopedic Surgeon', years: '2016-Present' },
      ],
      publications: [],
      awards: [],
      personalStatement: 'My focus is on restoring function and relieving pain for my patients. I am committed to using the latest surgical techniques to ensure the best possible outcomes.',
    },
  },
  {
    id: '5',
    name: 'Dr. Sunita Gupta',
    specialization: 'General Physician',
    availability: 'Mon - Sat (8 AM - 12 PM)',
    imageId: 'doctor-4',
    description: 'A compassionate general physician with a focus on preventative care and managing chronic conditions.',
    profile: {
      id: 'prof5',
      doctorId: '5',
      education: [
        { institution: 'Armed Forces Medical College, Pune', degree: 'MD, General Medicine', year: '2005' },
        { institution: 'Grant Medical College, Mumbai', degree: 'MBBS', year: '2000' },
      ],
      experience: [
        { hospital: 'Lilavati Hospital and Research Centre, Mumbai', position: 'Consultant Physician', years: '2008-Present' },
      ],
      publications: [],
      awards: [],
      personalStatement: 'I believe in building long-term relationships with my patients, providing them with continuous and comprehensive care. My approach is to empower patients with knowledge about their health.',
    },
  },
  {
    id: '6',
    name: 'Dr. Amir Khan',
    specialization: 'Dermatologist',
    availability: 'Wed, Fri, Sat (11 AM - 3 PM)',
    imageId: 'doctor-6',
    description: 'A board-certified dermatologist with expertise in cosmetic dermatology and treatment of skin conditions.',
    profile: {
      id: 'prof6',
      doctorId: '6',
      education: [
        { institution: 'Christian Medical College, Vellore', degree: 'MD, Dermatology, Venereology & Leprosy', year: '2016' },
        { institution: 'Kasturba Medical College, Mangalore', degree: 'MBBS', year: '2012' },
      ],
      experience: [
        { hospital: 'Jaslok Hospital, Mumbai', position: 'Dermatologist', years: '2018-Present' },
      ],
      publications: [],
      awards: [],
      personalStatement: 'I am passionate about helping people achieve healthy, beautiful skin. I offer a range of treatments, from medical dermatology to the latest cosmetic procedures, all tailored to individual needs.',
    },
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

const futureYear = new Date().getFullYear() + 1;

const initialPatientAppointments: Appointment[] = [
    {
        id: '1',
        doctorName: 'Dr. Arjun Sharma',
        patientName: 'Guest',
        date: `${futureYear}-08-10`,
        time: '10:00 AM',
        type: 'Hospital',
        status: 'Upcoming',
    },
    {
        id: '2',
        doctorName: 'Dr. Nandani Mehra',
        patientName: 'Guest',
        date: `${futureYear}-08-15`,
        time: '02:30 PM',
        type: 'Online',
        status: 'Upcoming',
        meetingLink: 'https://meet.google.com/mno-pqr-stu'
    },
    {
        id: '3',
        doctorName: 'Dr. Sunita Gupta',
        patientName: 'Guest',
        date: '2024-07-05',
        time: '09:00 AM',
        type: 'Hospital',
        status: 'Completed',
    },
    {
        id: '4',
        doctorName: 'Dr. Vikram Singh',
        patientName: 'Guest',
        date: `${futureYear}-08-20`,
        time: '11:00 AM',
        type: 'Online',
        status: 'Upcoming',
        meetingLink: 'https://meet.google.com/abc-def-ghi'
    }
];

const initialEmployeeAppointments: Appointment[] = [
    {
        id: 'emp1',
        doctorName: 'Dr. Arjun Sharma',
        patientName: 'Ravi Kumar',
        date: `${futureYear}-08-10`,
        time: '11:00 AM',
        type: 'Hospital',
        status: 'Upcoming',
    },
    {
        id: 'emp2',
        doctorName: 'Dr. Arjun Sharma',
        patientName: 'Sunita Devi',
        date: `${futureYear}-08-11`,
        time: '03:00 PM',
        type: 'Online',
        status: 'Upcoming',
        meetingLink: 'https://meet.google.com/vwx-yza-bcd'
    },
     {
        id: 'emp3',
        doctorName: 'Dr. Arjun Sharma',
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
      doctor: 'Dr. Arjun Sharma',
      date: new Date(`${futureYear}-08-20`),
      time: '10:00 AM',
      type: 'Hospital',
      patientName: 'Ravi Kumar',
      status: 'Pending',
      problemDescription: 'I have been having chest pains for the last two days. It gets worse when I walk.',
      problemSummary: 'Patient reports chest pain for two days, aggravated by walking.'
    },
    {
      id: 'req2',
      doctor: 'Dr. Vikram Singh',
      date: new Date(`${futureYear}-08-21`),
      time: '11:30 AM',
      type: 'Online',
      patientName: 'Sunita Devi',
      status: 'Pending',
      problemDescription: 'I need a follow up on my recent MRI scan for my migraines.',
      problemSummary: 'Patient requests a follow-up appointment to discuss recent MRI results for migraines.'
    },
  ];

const initialChatMessages: ChatMessage[] = [
  { id: 'msg1', sender: 'Dr. Arjun Sharma', receiver: 'Guest', content: "Hello! I\'ve reviewed the report you sent over. I\'m happy to discuss the results with you. What\'s on your mind?", timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString()},
  { id: 'msg2', sender: 'Guest', receiver: 'Dr. Arjun Sharma', content: "Thanks, Doctor. I was a bit worried about the \'minor opacity\' mentioned in the summary. What does that mean?", timestamp: new Date(Date.now() - 1000 * 60 * 3).toISOString()},
  { id: 'msg3', sender: 'Dr. Arjun Sharma', receiver: 'Guest', content: "That\'s a very common question. An \'opacity\' is just a term for an area that looks lighter on an X-ray. In your case, it\'s very small and likely just some leftover inflammation from a past cold. It\'s not something to be concerned about at this stage.", timestamp: new Date(Date.now() - 1000 * 60 * 1).toISOString()},
];

export const getMessages = () => {
    return getStoredData<ChatMessage[]>('chatMessages', initialChatMessages);
}

export const addMessage = (sender: string, receiver: string, content: string, attachment?: string): ChatMessage => {
    const messages = getMessages();
    const newMessage: ChatMessage = {
        id: `msg${Date.now()}`,
        sender,
        receiver,
        content,
        timestamp: new Date().toISOString(),
        attachment: attachment
    };
    const updatedMessages = [...messages, newMessage];
    setStoredData('chatMessages', updatedMessages);
    return newMessage;
};

export const deleteMessage = (messageId: string) => {
    const messages = getMessages();
    const updatedMessages = messages.filter(msg => msg.id !== messageId);
    setStoredData('chatMessages', updatedMessages);
};


// !! IMPORTANT !!
// Replace this with your actual n8n webhook URL.
const N8N_MEET_WEBHOOK_URL = 'PASTE_YOUR_N8N_WEBHOOK_URL_HERE';


export const getPatientAppointments = (patientName: string) => {
    const allAppointments = getStoredData<Appointment[]>(APPOINTMENTS_STORAGE_KEY, [...initialPatientAppointments, ...initialEmployeeAppointments]);
    return allAppointments.filter(app => app.patientName === patientName);
};

export const getEmployeeAppointments = (doctorName: string) => {
    const allAppointments = getStoredData<Appointment[]>(APPOINTMENTS_STORAGE_KEY, [...initialPatientAppointments, ...initialEmployeeAppointments]);
    return allAppointments.filter(app => app.doctorName === doctorName);
};

export const getAppointmentRequests = () => {
    const requests = getStoredData<AppointmentRequest[]>(REQUESTS_STORAGE_KEY, initialAppointmentRequests);
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
    setStoredData(REQUESTS_STORAGE_KEY, updatedRequests);
    return newRequest;
}

export const updateAppointmentRequestStatus = async (id: string, status: 'Accepted' | 'Declined') => {
    const requests = getAppointmentRequests();
    const requestIndex = requests.findIndex(req => req.id === id);

    if(requestIndex > -1) {
        const request = requests[requestIndex];
        request.status = status;
        
        if (status === 'Accepted') {
            const allAppointments = getStoredData<Appointment[]>(APPOINTMENTS_STORAGE_KEY, [...initialPatientAppointments, ...initialEmployeeAppointments]);
            const newAppointment: Appointment = {
                id: `app${Date.now()}`,
                doctorName: request.doctor,
                patientName: request.patientName,
                date: request.date.toISOString().split('T')[0],
                time: request.time,
                type: request.type,
                status: 'Upcoming',
                problemSummary: request.problemSummary,
            };
            
            if (newAppointment.type === 'Online') {
                 // UNCOMMENT THE CODE BELOW AND PROVIDE YOUR N8N WEBHOOK URL
                 /*
                try {
                    const response = await fetch(N8N_MEET_WEBHOOK_URL, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ 
                            summary: `Appointment: ${newAppointment.doctorName} and ${newAppointment.patientName}`,
                            startDateTime: new Date(`${newAppointment.date}T${newAppointment.time}`).toISOString()
                        }),
                    });
                    if (!response.ok) throw new Error('n8n webhook failed');
                    const { meetLink } = await response.json();
                    newAppointment.meetingLink = meetLink;
                } catch (error) {
                    console.error("Failed to generate Google Meet link via n8n:", error);
                    // Fallback to a random link if n8n fails
                    const randomString = Math.random().toString(36).substring(2, 11).replace(/\d/g, '').match(/.{1,3}/g)!.join('-');
                    newAppointment.meetingLink = `https://meet.google.com/${randomString}`;
                }
                */
                const randomString = Math.random().toString(36).substring(2, 11).replace(/\d/g, '').match(/.{1,3}/g)!.join('-');
                newAppointment.meetingLink = `https://meet.google.com/${randomString}`;
            }
            
            setStoredData(APPOINTMENTS_STORAGE_KEY, [...allAppointments, newAppointment]);
        }
        
        setStoredData(REQUESTS_STORAGE_KEY, requests);
        
        return requests[requestIndex];
    }
    return undefined;
};

export const addAppointment = async (appointment: Omit<Appointment, 'id' | 'status'>) => {
    const allAppointments = getStoredData<Appointment[]>(APPOINTMENTS_STORAGE_KEY, [...initialPatientAppointments, ...initialEmployeeAppointments]);
    const newAppointment: Appointment = {
        ...appointment,
        id: `app${Date.now()}`,
        status: 'Upcoming',
    };
    
    if (newAppointment.type === 'Online' && !newAppointment.meetingLink) {
        // UNCOMMENT THE CODE BELOW AND PROVIDE YOUR N8N WEBHOOK URL
        /*
        try {
            const response = await fetch(N8N_MEET_WEBHOOK_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    summary: `Appointment: ${newAppointment.doctorName} and ${newAppointment.patientName}`,
                    startDateTime: new Date(`${newAppointment.date}T${newAppointment.time}`).toISOString()
                }),
            });
            if (!response.ok) throw new Error('n8n webhook failed');
            const { meetLink } = await response.json();
            newAppointment.meetingLink = meetLink;
        } catch (error) {
            console.error("Failed to generate Google Meet link via n8n:", error);
            // Fallback to a random link if n8n fails
            const randomString = Math.random().toString(36).substring(2, 11).replace(/\d/g, '').match(/.{1,3}/g)!.join('-');
            newAppointment.meetingLink = `https://meet.google.com/${randomString}`;
        }
        */
        const randomString = Math.random().toString(36).substring(2, 11).replace(/\d/g, '').match(/.{1,3}/g)!.join('-');
        newAppointment.meetingLink = `https://meet.google.com/${randomString}`;
    }
    
    setStoredData(APPOINTMENTS_STORAGE_KEY, [...allAppointments, newAppointment]);
    return newAppointment;
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
