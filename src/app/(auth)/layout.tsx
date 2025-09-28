import Link from 'next/link';
import { Hospital } from 'lucide-react';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-background to-accent/30 p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
            <Link href="/" className="inline-flex items-center gap-2 mb-4">
              <Hospital className="h-8 w-8 text-primary" />
              <h1 className="text-3xl font-bold font-headline text-foreground">
                HealthFlow
              </h1>
            </Link>
            <p className="text-muted-foreground">Your partner in health and wellness.</p>
        </div>
        {children}
      </div>
    </div>
  );
}
