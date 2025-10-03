# HealthFlow: A Modern Healthcare Management Platform

HealthFlow is a comprehensive, full-featured web application designed to streamline the connection between patients and healthcare providers. It features distinct portals for patients and employees, each with a tailored set of tools to manage appointments, track health data, and leverage AI for a better healthcare experience.

This project is built with a modern tech stack, including **Next.js**, **TypeScript**, **Firebase**, and **Genkit** for AI features.

## Core Features

### Patient Portal

*   **Personalized Dashboard**: At-a-glance view of upcoming appointments and health summaries.
*   **Find a Doctor**: Browse a directory of specialists and initiate the booking process.
*   **Appointment Management**: Schedule new appointments, view upcoming visits, and track the status of requests. The booking form uses an AI-powered triage to summarize the patient's issue for the doctor.
*   **AI Health Tools**:
    *   **Symptom Analyzer**: Get a preliminary AI-based analysis of symptoms.
    *   **AI Therapist**: A supportive chatbot for mental wellness conversations.
    *   **Personalized Health Tips**: Receive daily wellness advice based on a detailed health profile and mock environmental factors (like weather and air quality).
*   **Medication Tracker**: Manage and track daily medication schedules.
*   **Leave Reviews**: Share feedback on the hospital and its services.

### Employee Portal (Doctors & Staff)

*   **At-a-Glance Dashboard**: View daily schedules, pending requests, and key metrics like patient engagement.
*   **Appointment & Request Management**: Review incoming appointment requests from patients, view AI-generated summaries, and accept or decline them.
*   **Attendance Tracking**: A simple system for employees to clock in and out.
*   **Automated Inquiry Triage**: An AI tool to analyze patient messages and route them to the appropriate department (e.g., Pharmacy, Billing).

## Tech Stack & Architecture

*   **Framework**: Next.js 14+ (App Router)
*   **Language**: TypeScript
*   **Backend-as-a-Service (BaaS)**: Firebase
    *   **Authentication**: Handles secure, role-based user login (email/password).
    *   **Database**: Firestore is used to store all application data, with separate collections for `users` (patients) and `employees` to ensure data segregation and security.
*   **Generative AI**: Genkit with Google's Gemini models for all AI-driven features.
*   **UI & Styling**:
    *   **Component Library**: ShadCN UI for a consistent, accessible, and modern set of components.
    *   **CSS**: Tailwind CSS for utility-first styling.
*   **State Management**: Primarily uses React Context API (`useContext`) for managing global state like authentication and theme.

## Getting Started

To run this project locally, follow these steps:

1.  **Install Dependencies**:
    ```bash
    npm install
    ```

2.  **Set Up Environment Variables**:
    This project uses Firebase. Ensure you have a Firebase project configured. The necessary client-side keys are stored in `src/firebase/config.ts`. For Genkit (AI) features, you will need to set up a `.env` file with your `GEMINI_API_KEY`.

    ```
    # .env
    GEMINI_API_KEY=your_google_ai_api_key_here
    ```

3.  **Run the Development Servers**:
    This project requires two concurrent development processes: one for the Next.js frontend and one for the Genkit AI flows.

    *   **Terminal 1: Run the Next.js App**
        ```bash
        npm run dev
        ```
        This will start the main application on `http://localhost:9002`.

    *   **Terminal 2: Run the Genkit Flows**
        ```bash
        npm run genkit:watch
        ```
        This starts the Genkit development server, which watches for changes in your AI flows.

4.  **Explore the App**:
    *   Open `http://localhost:9002` in your browser.
    *   Sign up as both a "Patient" and an "Employee" to explore the two distinct user experiences.
