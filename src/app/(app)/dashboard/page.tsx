'use client';

import PatientDashboard from '@/components/dashboard/patient-dashboard';
import EmployeeDashboard from '@/components/dashboard/employee-dashboard';
import { useAuth } from '@/hooks/use-auth';
import { Loader2 } from 'lucide-react';

export default function DashboardPage() {
  const { user, loading } = useAuth();
  
  if (loading || !user) {
    return (
        <div className="flex h-full items-center justify-center">
            <div className="flex items-center gap-2">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
                <div className="text-lg font-semibold">Loading Dashboard...</div>
            </div>
        </div>
    );
  }

  return user.role === 'patient' ? <PatientDashboard name={user.name}/> : <EmployeeDashboard name={user.name} />;
}
