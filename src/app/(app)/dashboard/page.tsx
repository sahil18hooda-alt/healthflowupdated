'use client';

import PatientDashboard from '@/components/dashboard/patient-dashboard';
import EmployeeDashboard from '@/components/dashboard/employee-dashboard';

export default function DashboardPage() {
  // Since there's no login, we can't determine the role.
  // For now, let's default to the patient dashboard.
  // In a real scenario, you might have a different default view.
  return <PatientDashboard name="Guest"/>;
}
