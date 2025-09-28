'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import LoginForm from '@/components/auth/login-form';

function LoginPageContent() {
  const searchParams = useSearchParams();
  const role = searchParams.get('role') === 'employee' ? 'employee' : 'patient';

  return <LoginForm role={role} />;
}

export default function LoginPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <LoginPageContent />
        </Suspense>
    );
}
