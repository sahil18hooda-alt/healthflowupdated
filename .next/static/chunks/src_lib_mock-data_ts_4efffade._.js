(globalThis.TURBOPACK = globalThis.TURBOPACK || []).push([typeof document === "object" ? document.currentScript : undefined, {

"[project]/src/lib/mock-data.ts [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "addAppointmentRequest": (()=>addAppointmentRequest),
    "addMedication": (()=>addMedication),
    "getAppointmentRequests": (()=>getAppointmentRequests),
    "getEmployeeAppointments": (()=>getEmployeeAppointments),
    "getPatientAppointments": (()=>getPatientAppointments),
    "mockAttendance": (()=>mockAttendance),
    "mockDoctors": (()=>mockDoctors),
    "mockMedications": (()=>mockMedications),
    "mockReviews": (()=>mockReviews),
    "updateAppointmentRequestStatus": (()=>updateAppointmentRequestStatus)
});
'use client';
// Helper to get data from localStorage or use initial mock data
function getStoredData(key, initialData) {
    if ("TURBOPACK compile-time falsy", 0) {
        "TURBOPACK unreachable";
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
function setStoredData(key, data) {
    if ("TURBOPACK compile-time falsy", 0) {
        "TURBOPACK unreachable";
    }
    try {
        window.localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
        console.error(`Error writing ${key} to localStorage`, error);
    }
}
const mockDoctors = [
    {
        id: '1',
        name: 'Dr. Anjali Sharma',
        specialization: 'Cardiologist',
        availability: 'Mon, Wed, Fri (9 AM - 1 PM)',
        imageId: 'doctor-2'
    },
    {
        id: '2',
        name: 'Dr. Vikram Singh',
        specialization: 'Neurologist',
        availability: 'Tue, Thu (10 AM - 4 PM)',
        imageId: 'doctor-1'
    },
    {
        id: '3',
        name: 'Dr. Priya Patel',
        specialization: 'Pediatrician',
        availability: 'Mon - Fri (9 AM - 5 PM)',
        imageId: 'doctor-4'
    },
    {
        id: '4',
        name: 'Dr. Rohan Mehra',
        specialization: 'Orthopedic Surgeon',
        availability: 'Mon, Thu (2 PM - 6 PM)',
        imageId: 'doctor-5'
    },
    {
        id: '5',
        name: 'Dr. Sameer Gupta',
        specialization: 'General Physician',
        availability: 'Mon - Sat (8 AM - 12 PM)',
        imageId: 'doctor-3'
    },
    {
        id: '6',
        name: 'Dr. Aisha Khan',
        specialization: 'Dermatologist',
        availability: 'Wed, Fri, Sat (11 AM - 3 PM)',
        imageId: 'doctor-6'
    }
];
const mockReviews = [
    {
        id: '1',
        patientName: 'Aarav Kumar',
        rating: 5,
        comment: 'The staff was incredibly supportive and the facility was top-notch. Highly recommend!',
        date: '2024-07-15'
    },
    {
        id: '2',
        patientName: 'Saanvi Mehta',
        rating: 4,
        comment: 'Good experience overall. The wait time was a bit long, but the doctor was very thorough.',
        date: '2024-07-12'
    },
    {
        id: '3',
        patientName: 'Rohan Desai',
        rating: 3,
        comment: 'The services are okay, but the administration process could be more streamlined.',
        date: '2024-07-10'
    },
    {
        id: '4',
        patientName: 'Diya Sharma',
        rating: 5,
        comment: 'Excellent care and attention to detail. Dr. Singh is a true professional.',
        date: '2024-06-28'
    }
];
const initialPatientAppointments = [
    {
        id: '1',
        doctorName: 'Dr. Anjali Sharma',
        patientName: 'Patient Zero',
        date: '2024-08-10',
        time: '10:00 AM',
        type: 'Hospital',
        status: 'Upcoming'
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
        status: 'Completed'
    }
];
const initialEmployeeAppointments = [
    {
        id: '1',
        doctorName: 'Dr. Employee',
        patientName: 'Ravi Kumar',
        date: '2024-08-10',
        time: '11:00 AM',
        type: 'Hospital',
        status: 'Upcoming'
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
        status: 'Completed'
    }
];
const initialAppointmentRequests = [
    {
        id: 'req1',
        doctor: 'Dr. Anjali Sharma',
        date: new Date('2024-08-20'),
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
        date: new Date('2024-08-21'),
        time: '11:30 AM',
        type: 'Online',
        patientName: 'Sunita Devi',
        status: 'Pending',
        problemDescription: 'I need a follow up on my recent MRI scan for my migraines.',
        problemSummary: 'Patient requests a follow-up appointment to discuss recent MRI results for migraines.'
    }
];
const getPatientAppointments = (patientName)=>{
    const allAppointments = getStoredData('allAppointments', [
        ...initialPatientAppointments,
        ...initialEmployeeAppointments
    ]);
    return allAppointments.filter((app)=>app.patientName === patientName);
};
const getEmployeeAppointments = (doctorName)=>{
    const allAppointments = getStoredData('allAppointments', [
        ...initialPatientAppointments,
        ...initialEmployeeAppointments
    ]);
    return allAppointments.filter((app)=>app.doctorName === doctorName);
};
const getAppointmentRequests = ()=>{
    const requests = getStoredData('appointmentRequests', initialAppointmentRequests);
    return requests.map((req)=>({
            ...req,
            date: new Date(req.date)
        }));
};
const addAppointmentRequest = (request, patientName)=>{
    const requests = getAppointmentRequests();
    const newRequest = {
        ...request,
        id: `req${Date.now()}`,
        status: 'Pending',
        patientName
    };
    const updatedRequests = [
        newRequest,
        ...requests
    ];
    setStoredData('appointmentRequests', updatedRequests);
    return newRequest;
};
const updateAppointmentRequestStatus = (id, status)=>{
    const requests = getAppointmentRequests();
    const requestIndex = requests.findIndex((req)=>req.id === id);
    if (requestIndex > -1) {
        const request = requests[requestIndex];
        request.status = status;
        if (status === 'Accepted') {
            const allAppointments = getStoredData('allAppointments', [
                ...initialPatientAppointments,
                ...initialEmployeeAppointments
            ]);
            const newAppointment = {
                id: `app${Date.now()}`,
                doctorName: request.doctor,
                patientName: request.patientName,
                date: request.date.toISOString().split('T')[0],
                time: request.time,
                type: request.type,
                status: 'Upcoming',
                problemSummary: request.problemSummary
            };
            if (newAppointment.type === 'Online') {
                const randomString = Math.random().toString(36).substring(2, 11).replace(/\d/g, '').match(/.{1,3}/g).join('-');
                newAppointment.meetingLink = `https://meet.google.com/${randomString}`;
            }
            setStoredData('allAppointments', [
                ...allAppointments,
                newAppointment
            ]);
        }
        setStoredData('appointmentRequests', requests);
        return requests[requestIndex];
    }
    return undefined;
};
const mockAttendance = [
    {
        id: '1',
        date: '2024-07-22',
        checkIn: '08:55 AM',
        checkOut: '05:05 PM',
        status: 'Present'
    },
    {
        id: '2',
        date: '2024-07-21',
        checkIn: '09:05 AM',
        checkOut: '05:00 PM',
        status: 'Present'
    },
    {
        id: '3',
        date: '2024-07-20',
        checkIn: null,
        checkOut: null,
        status: 'Absent'
    }
];
let mockMedications = [
    {
        id: '1',
        name: 'Aspirin',
        dosage: '75mg',
        frequency: 'Once a day',
        time: [
            '09:00 PM'
        ]
    },
    {
        id: '2',
        name: 'Metformin',
        dosage: '500mg',
        frequency: 'Twice a day',
        time: [
            '08:00 AM',
            '08:00 PM'
        ]
    },
    {
        id: '3',
        name: 'Vitamin D3',
        dosage: '1000 IU',
        frequency: 'Once a day',
        time: [
            '09:00 AM'
        ]
    }
];
const addMedication = (medication)=>{
    const newMedication = {
        ...medication,
        id: `med${mockMedications.length + 1}`
    };
    mockMedications.push(newMedication);
    return newMedication;
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
}]);

//# sourceMappingURL=src_lib_mock-data_ts_4efffade._.js.map