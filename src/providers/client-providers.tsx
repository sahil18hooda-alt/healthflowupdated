'use client';

import { ThemeProvider } from '@/providers/theme-provider';
import { FirebaseClientProvider } from '@/firebase/client-provider';
import { Toaster } from '@/components/ui/toaster';
import TargetCursor from '@/components/TargetCursor';

export function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <FirebaseClientProvider>
        <TargetCursor targetSelector='a, button, [role="button"], [tabindex]' />
        {children}
        <Toaster />
      </FirebaseClientProvider>
    </ThemeProvider>
  );
}
