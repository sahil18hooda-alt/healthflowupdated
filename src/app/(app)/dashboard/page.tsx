'use client';

import { useSearchParams } from 'next/navigation';
import PatientDashboard from '@/components/dashboard/patient-dashboard';
import EmployeeDashboard from '@/components/dashboard/employee-dashboard';
import { Suspense } from 'react';

function DashboardContent() {
    const searchParams = useSearchParams();
    const role = searchParams.get('role');

    if (role === 'employee') {
        return <EmployeeDashboard name="Doctor" />;
    }
    
    // Default to patient dashboard
    return <PatientDashboard name="Guest" />;
}


export default function DashboardPage() {
  return (
    <Suspense fallback={<div>Loading Dashboard...</div>}>
        <DashboardContent />
    </Suspense>
  );
}
