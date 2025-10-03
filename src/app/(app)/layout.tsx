'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { SidebarProvider } from '@/components/ui/sidebar';
import AppSidebar from '@/components/layout/app-sidebar';
import AppHeader from '@/components/layout/app-header';
import { useAuth } from '@/hooks/use-auth';
import Chatbot from '@/components/chatbot';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // If the auth state is resolved and there's no user, redirect to home.
    if (!loading && !user) {
      router.push('/');
    }
  }, [user, loading, router]);

  // While loading, show a full-screen loader.
  // This prevents rendering of any child components until auth state is confirmed.
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        Loading...
      </div>
    );
  }

  // Once loaded and user is confirmed, render the main app layout.
  return (
    <SidebarProvider>
      <div className="flex min-h-screen">
        <AppSidebar />
        <div className="flex flex-1 flex-col">
          <AppHeader />
          <main className="flex-1 p-4 md:p-6 lg:p-8">
            {children}
          </main>
        </div>
      </div>
      <Chatbot />
    </SidebarProvider>
  );
}
