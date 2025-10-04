'use client';

import { SidebarProvider } from '@/components/ui/sidebar';
import AppSidebar from '@/components/layout/app-sidebar';
import AppHeader from '@/components/layout/app-header';
import Chatbot from '@/components/chatbot';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  // Removed authentication checks.
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
