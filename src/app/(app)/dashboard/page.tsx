'use client';

import PatientDashboard from '@/components/dashboard/patient-dashboard';
import EmployeeDashboard from '@/components/dashboard/employee-dashboard';
import { useAuth } from '@/hooks/use-auth';

export default function DashboardPage() {
  const { user } = useAuth();
  
  if (!user) {
    return null;
  }

  return user.role === 'patient' ? <PatientDashboard name={user.name}/> : <EmployeeDashboard name={user.name} />;
}
