(globalThis.TURBOPACK = globalThis.TURBOPACK || []).push([typeof document === "object" ? document.currentScript : undefined, {

"[project]/src/lib/mock-data.ts [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "addAppointment": (()=>addAppointment),
    "addAppointmentRequest": (()=>addAppointmentRequest),
    "addMedication": (()=>addMedication),
    "addMessage": (()=>addMessage),
    "deleteMessage": (()=>deleteMessage),
    "getAppointmentRequests": (()=>getAppointmentRequests),
    "getEmployeeAppointments": (()=>getEmployeeAppointments),
    "getMessages": (()=>getMessages),
    "getPatientAppointments": (()=>getPatientAppointments),
    "mockAttendance": (()=>mockAttendance),
    "mockDoctors": (()=>mockDoctors),
    "mockMedications": (()=>mockMedications),
    "mockReviews": (()=>mockReviews),
    "updateAppointmentRequestStatus": (()=>updateAppointmentRequestStatus)
});
// Custom event for storage updates
const dispatchStorageEvent = (key)=>{
    if ("TURBOPACK compile-time truthy", 1) {
        window.dispatchEvent(new CustomEvent('storage-update', {
            detail: {
                key
            }
        }));
    }
};
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
        dispatchStorageEvent(key);
    } catch (error) {
        console.error(`Error writing ${key} to localStorage`, error);
    }
}
const mockDoctors = [
    {
        id: '1',
        name: 'Dr. Arjun Sharma',
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
        name: 'Dr. Rohan Patel',
        specialization: 'Pediatrician',
        availability: 'Mon - Fri (9 AM - 5 PM)',
        imageId: 'doctor-3'
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
        name: 'Dr. Sunita Gupta',
        specialization: 'General Physician',
        availability: 'Mon - Sat (8 AM - 12 PM)',
        imageId: 'doctor-4'
    },
    {
        id: '6',
        name: 'Dr. Amir Khan',
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
        doctorName: 'Dr. Arjun Sharma',
        patientName: 'Guest',
        date: '2024-08-10',
        time: '10:00 AM',
        type: 'Hospital',
        status: 'Upcoming'
    },
    {
        id: '2',
        doctorName: 'Dr. Rohan Patel',
        patientName: 'Guest',
        date: '2024-08-15',
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
        status: 'Completed'
    }
];
const initialEmployeeAppointments = [
    {
        id: 'emp1',
        doctorName: 'Dr. Arjun Sharma',
        patientName: 'Ravi Kumar',
        date: '2024-08-10',
        time: '11:00 AM',
        type: 'Hospital',
        status: 'Upcoming'
    },
    {
        id: 'emp2',
        doctorName: 'Dr. Arjun Sharma',
        patientName: 'Sunita Devi',
        date: '2024-08-11',
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
        status: 'Completed'
    }
];
const initialAppointmentRequests = [
    {
        id: 'req1',
        doctor: 'Dr. Arjun Sharma',
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
const initialChatMessages = [
    {
        id: 'msg1',
        sender: 'Dr. Arjun Sharma',
        receiver: 'Guest',
        content: "Hello! I've reviewed the report you sent over. I'm happy to discuss the results with you. What's on your mind?",
        timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString()
    },
    {
        id: 'msg2',
        sender: 'Guest',
        receiver: 'Dr. Arjun Sharma',
        content: "Thanks, Doctor. I was a bit worried about the 'minor opacity' mentioned in the summary. What does that mean?",
        timestamp: new Date(Date.now() - 1000 * 60 * 3).toISOString()
    },
    {
        id: 'msg3',
        sender: 'Dr. Arjun Sharma',
        receiver: 'Guest',
        content: "That's a very common question. An 'opacity' is just a term for an area that looks lighter on an X-ray. In your case, it's very small and likely just some leftover inflammation from a past cold. It's not something to be concerned about at this stage.",
        timestamp: new Date(Date.now() - 1000 * 60 * 1).toISOString()
    }
];
const getMessages = ()=>{
    return getStoredData('chatMessages', initialChatMessages);
};
const addMessage = (sender, receiver, content, attachment)=>{
    const messages = getMessages();
    const newMessage = {
        id: `msg${Date.now()}`,
        sender,
        receiver,
        content,
        timestamp: new Date().toISOString(),
        attachment: attachment
    };
    const updatedMessages = [
        ...messages,
        newMessage
    ];
    setStoredData('chatMessages', updatedMessages);
    return newMessage;
};
const deleteMessage = (messageId)=>{
    const messages = getMessages();
    const updatedMessages = messages.filter((msg)=>msg.id !== messageId);
    setStoredData('chatMessages', updatedMessages);
};
// !! IMPORTANT !!
// Replace this with your actual n8n webhook URL.
const N8N_MEET_WEBHOOK_URL = 'PASTE_YOUR_N8N_WEBHOOK_URL_HERE';
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
const updateAppointmentRequestStatus = async (id, status)=>{
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
                */ const randomString = Math.random().toString(36).substring(2, 11).replace(/\d/g, '').match(/.{1,3}/g).join('-');
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
const addAppointment = async (appointment)=>{
    const allAppointments = getStoredData('allAppointments', [
        ...initialPatientAppointments,
        ...initialEmployeeAppointments
    ]);
    const newAppointment = {
        ...appointment,
        id: `app${Date.now()}`,
        status: 'Upcoming'
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
        */ const randomString = Math.random().toString(36).substring(2, 11).replace(/\d/g, '').match(/.{1,3}/g).join('-');
        newAppointment.meetingLink = `https://meet.google.com/${randomString}`;
    }
    setStoredData('allAppointments', [
        ...allAppointments,
        newAppointment
    ]);
    return newAppointment;
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
"[project]/src/app/(app)/doctor-chat/page.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": (()=>DoctorChatPage)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$user$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__User$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/user.js [app-client] (ecmascript) <export default as User>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$send$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Send$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/send.js [app-client] (ecmascript) <export default as Send>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$left$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowLeft$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/arrow-left.js [app-client] (ecmascript) <export default as ArrowLeft>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$paperclip$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Paperclip$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/paperclip.js [app-client] (ecmascript) <export default as Paperclip>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trash$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Trash2$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/trash-2.js [app-client] (ecmascript) <export default as Trash2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/button.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/input.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$scroll$2d$area$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/scroll-area.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$avatar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/avatar.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/utils.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/image.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$mock$2d$data$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/mock-data.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$use$2d$toast$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/hooks/use-toast.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
;
;
;
;
;
;
;
;
;
;
function DoctorChatContent() {
    _s();
    const searchParams = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSearchParams"])();
    const { toast } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$use$2d$toast$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useToast"])();
    const role = searchParams.get('role');
    const isDoctor = role === 'employee';
    const [messages, setMessages] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [input, setInput] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [isLoading, setIsLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const scrollAreaRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const fileInputRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const doctorImage = `https://images.unsplash.com/photo-1612349316228-5942a9b489c2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw3fHxkb2N0b3J8ZW58MHx8fHwxNzIyMzgxODg5fDA&ixlib=rb-4.1.0&q=80&w=1080`;
    const patientImage = `https://avatar.vercel.sh/guest.png`;
    const senderName = isDoctor ? 'Dr. Arjun Sharma' : 'Guest';
    const receiverName = isDoctor ? 'Guest' : 'Dr. Arjun Sharma';
    const senderAvatar = isDoctor ? doctorImage : patientImage;
    const receiverAvatar = isDoctor ? patientImage : doctorImage;
    const fetchMessages = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "DoctorChatContent.useCallback[fetchMessages]": ()=>{
            setMessages((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$mock$2d$data$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getMessages"])());
        }
    }["DoctorChatContent.useCallback[fetchMessages]"], []);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "DoctorChatContent.useEffect": ()=>{
            fetchMessages();
            const handleStorageUpdate = {
                "DoctorChatContent.useEffect.handleStorageUpdate": (e)=>{
                    const event = e;
                    if (event.detail.key === 'chatMessages') {
                        fetchMessages();
                    }
                }
            }["DoctorChatContent.useEffect.handleStorageUpdate"];
            window.addEventListener('storage-update', handleStorageUpdate);
            // Fallback polling
            const interval = setInterval(fetchMessages, 5000);
            return ({
                "DoctorChatContent.useEffect": ()=>{
                    window.removeEventListener('storage-update', handleStorageUpdate);
                    clearInterval(interval);
                }
            })["DoctorChatContent.useEffect"];
        }
    }["DoctorChatContent.useEffect"], [
        fetchMessages
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "DoctorChatContent.useEffect": ()=>{
            if (scrollAreaRef.current) {
                setTimeout({
                    "DoctorChatContent.useEffect": ()=>{
                        const viewport = scrollAreaRef.current?.querySelector('div[data-radix-scroll-area-viewport]');
                        if (viewport) {
                            viewport.scrollTop = viewport.scrollHeight;
                        }
                    }
                }["DoctorChatContent.useEffect"], 100);
            }
        }
    }["DoctorChatContent.useEffect"], [
        messages
    ]);
    const handleSend = async ()=>{
        if (input.trim() === '' || isLoading) return;
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$mock$2d$data$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["addMessage"])(senderName, receiverName, input);
        setInput('');
    };
    const handleAttachmentClick = ()=>{
        fileInputRef.current?.click();
    };
    const handleFileChange = (event)=>{
        const file = event.target.files?.[0];
        if (!file) return;
        if (file.size > 2 * 1024 * 1024) {
            toast({
                title: "File Too Large",
                description: "Please select an image smaller than 2MB.",
                variant: "destructive"
            });
            return;
        }
        const reader = new FileReader();
        reader.onload = (e)=>{
            const imageBase64 = e.target?.result;
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$mock$2d$data$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["addMessage"])(senderName, receiverName, '', imageBase64);
        };
        reader.readAsDataURL(file);
        // Reset file input value
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };
    const handleDelete = (messageId)=>{
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$mock$2d$data$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["deleteMessage"])(messageId);
        toast({
            title: 'Message Deleted',
            description: 'The message has been removed from the conversation.'
        });
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex flex-col h-[calc(100vh-10rem)]",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex-1 flex flex-col bg-card border rounded-lg shadow-sm",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("header", {
                    className: "flex items-center gap-4 p-4 border-b",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                            variant: "ghost",
                            size: "icon",
                            asChild: true,
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                href: isDoctor ? "/dashboard?role=employee" : "/appointments",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$left$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowLeft$3e$__["ArrowLeft"], {}, void 0, false, {
                                    fileName: "[project]/src/app/(app)/doctor-chat/page.tsx",
                                    lineNumber: 125,
                                    columnNumber: 21
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/app/(app)/doctor-chat/page.tsx",
                                lineNumber: 124,
                                columnNumber: 17
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/app/(app)/doctor-chat/page.tsx",
                            lineNumber: 123,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$avatar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Avatar"], {
                            children: [
                                receiverAvatar && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$avatar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AvatarImage"], {
                                    src: receiverAvatar,
                                    alt: receiverName
                                }, void 0, false, {
                                    fileName: "[project]/src/app/(app)/doctor-chat/page.tsx",
                                    lineNumber: 129,
                                    columnNumber: 36
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$avatar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AvatarFallback"], {
                                    children: receiverName.charAt(0)
                                }, void 0, false, {
                                    fileName: "[project]/src/app/(app)/doctor-chat/page.tsx",
                                    lineNumber: 130,
                                    columnNumber: 17
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/(app)/doctor-chat/page.tsx",
                            lineNumber: 128,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                    className: "font-semibold text-lg",
                                    children: receiverName
                                }, void 0, false, {
                                    fileName: "[project]/src/app/(app)/doctor-chat/page.tsx",
                                    lineNumber: 133,
                                    columnNumber: 17
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-sm text-muted-foreground",
                                    children: "Online now"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/(app)/doctor-chat/page.tsx",
                                    lineNumber: 134,
                                    columnNumber: 17
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/(app)/doctor-chat/page.tsx",
                            lineNumber: 132,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/app/(app)/doctor-chat/page.tsx",
                    lineNumber: 122,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$scroll$2d$area$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ScrollArea"], {
                    className: "flex-1 p-6",
                    ref: scrollAreaRef,
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "space-y-6",
                        children: messages.map((message)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('group flex items-end gap-3', message.sender === senderName ? 'justify-end' : 'justify-start'),
                                children: [
                                    message.sender === senderName && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                        variant: "ghost",
                                        size: "icon",
                                        className: "h-6 w-6 invisible group-hover:visible",
                                        onClick: ()=>handleDelete(message.id),
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trash$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Trash2$3e$__["Trash2"], {
                                            className: "h-4 w-4 text-destructive"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/(app)/doctor-chat/page.tsx",
                                            lineNumber: 150,
                                            columnNumber: 25
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/(app)/doctor-chat/page.tsx",
                                        lineNumber: 149,
                                        columnNumber: 22
                                    }, this),
                                    message.sender !== senderName && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$avatar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Avatar"], {
                                        className: "h-8 w-8",
                                        children: [
                                            receiverAvatar && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$avatar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AvatarImage"], {
                                                src: receiverAvatar,
                                                alt: receiverName
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/(app)/doctor-chat/page.tsx",
                                                lineNumber: 155,
                                                columnNumber: 41
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$avatar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AvatarFallback"], {
                                                children: receiverName.charAt(0)
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/(app)/doctor-chat/page.tsx",
                                                lineNumber: 156,
                                                columnNumber: 22
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/(app)/doctor-chat/page.tsx",
                                        lineNumber: 154,
                                        columnNumber: 19
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('max-w-md rounded-lg px-3 py-2 text-sm', message.sender === senderName ? 'bg-primary text-primary-foreground' : 'bg-muted'),
                                        children: [
                                            message.attachment && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "mb-2",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                                    src: message.attachment,
                                                    alt: "Attachment",
                                                    width: 200,
                                                    height: 200,
                                                    className: "rounded-md object-cover"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/(app)/doctor-chat/page.tsx",
                                                    lineNumber: 169,
                                                    columnNumber: 25
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/(app)/doctor-chat/page.tsx",
                                                lineNumber: 168,
                                                columnNumber: 21
                                            }, this),
                                            message.content && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "whitespace-pre-wrap",
                                                children: message.content
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/(app)/doctor-chat/page.tsx",
                                                lineNumber: 172,
                                                columnNumber: 39
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-xs text-right mt-1 opacity-70",
                                                children: new Date(message.timestamp).toLocaleTimeString([], {
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                })
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/(app)/doctor-chat/page.tsx",
                                                lineNumber: 173,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/(app)/doctor-chat/page.tsx",
                                        lineNumber: 159,
                                        columnNumber: 17
                                    }, this),
                                    message.sender === senderName && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$avatar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Avatar"], {
                                        className: "h-8 w-8",
                                        children: [
                                            senderAvatar && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$avatar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AvatarImage"], {
                                                src: senderAvatar,
                                                alt: senderName
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/(app)/doctor-chat/page.tsx",
                                                lineNumber: 177,
                                                columnNumber: 38
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$avatar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AvatarFallback"], {
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$user$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__User$3e$__["User"], {}, void 0, false, {
                                                    fileName: "[project]/src/app/(app)/doctor-chat/page.tsx",
                                                    lineNumber: 178,
                                                    columnNumber: 37
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/(app)/doctor-chat/page.tsx",
                                                lineNumber: 178,
                                                columnNumber: 21
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/(app)/doctor-chat/page.tsx",
                                        lineNumber: 176,
                                        columnNumber: 19
                                    }, this),
                                    message.sender !== senderName && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                        variant: "ghost",
                                        size: "icon",
                                        className: "h-6 w-6 invisible group-hover:visible",
                                        onClick: ()=>handleDelete(message.id),
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trash$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Trash2$3e$__["Trash2"], {
                                            className: "h-4 w-4 text-destructive"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/(app)/doctor-chat/page.tsx",
                                            lineNumber: 183,
                                            columnNumber: 25
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/(app)/doctor-chat/page.tsx",
                                        lineNumber: 182,
                                        columnNumber: 21
                                    }, this)
                                ]
                            }, message.id, true, {
                                fileName: "[project]/src/app/(app)/doctor-chat/page.tsx",
                                lineNumber: 141,
                                columnNumber: 15
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/src/app/(app)/doctor-chat/page.tsx",
                        lineNumber: 139,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/src/app/(app)/doctor-chat/page.tsx",
                    lineNumber: 138,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "border-t p-4 bg-background/50 rounded-b-lg",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center gap-2",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                type: "file",
                                ref: fileInputRef,
                                onChange: handleFileChange,
                                accept: "image/*",
                                className: "hidden"
                            }, void 0, false, {
                                fileName: "[project]/src/app/(app)/doctor-chat/page.tsx",
                                lineNumber: 192,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                size: "icon",
                                variant: "ghost",
                                onClick: handleAttachmentClick,
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$paperclip$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Paperclip$3e$__["Paperclip"], {
                                    className: "h-5 w-5"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/(app)/doctor-chat/page.tsx",
                                    lineNumber: 194,
                                    columnNumber: 17
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/app/(app)/doctor-chat/page.tsx",
                                lineNumber: 193,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "relative flex-1",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Input"], {
                                        type: "text",
                                        placeholder: "Type your message...",
                                        value: input,
                                        onChange: (e)=>setInput(e.target.value),
                                        onKeyDown: (e)=>e.key === 'Enter' && handleSend(),
                                        disabled: isLoading,
                                        className: "pr-12"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/(app)/doctor-chat/page.tsx",
                                        lineNumber: 197,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                        type: "submit",
                                        size: "icon",
                                        className: "absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8",
                                        onClick: handleSend,
                                        disabled: isLoading || !input.trim(),
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$send$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Send$3e$__["Send"], {
                                            className: "h-4 w-4"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/(app)/doctor-chat/page.tsx",
                                            lineNumber: 213,
                                            columnNumber: 17
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/(app)/doctor-chat/page.tsx",
                                        lineNumber: 206,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/(app)/doctor-chat/page.tsx",
                                lineNumber: 196,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/(app)/doctor-chat/page.tsx",
                        lineNumber: 191,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/src/app/(app)/doctor-chat/page.tsx",
                    lineNumber: 190,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/app/(app)/doctor-chat/page.tsx",
            lineNumber: 121,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/app/(app)/doctor-chat/page.tsx",
        lineNumber: 120,
        columnNumber: 5
    }, this);
}
_s(DoctorChatContent, "WHnvCGG0ZEHnX38DtYfs2D/wliY=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSearchParams"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$use$2d$toast$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useToast"]
    ];
});
_c = DoctorChatContent;
function DoctorChatPage() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Suspense"], {
        fallback: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            children: "Loading..."
        }, void 0, false, {
            fileName: "[project]/src/app/(app)/doctor-chat/page.tsx",
            lineNumber: 225,
            columnNumber: 29
        }, void 0),
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(DoctorChatContent, {}, void 0, false, {
            fileName: "[project]/src/app/(app)/doctor-chat/page.tsx",
            lineNumber: 226,
            columnNumber: 13
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/app/(app)/doctor-chat/page.tsx",
        lineNumber: 225,
        columnNumber: 9
    }, this);
}
_c1 = DoctorChatPage;
var _c, _c1;
__turbopack_context__.k.register(_c, "DoctorChatContent");
__turbopack_context__.k.register(_c1, "DoctorChatPage");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
}]);

//# sourceMappingURL=src_f163eac5._.js.map