import { Stethoscope, HeartPulse, Hospital, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-blue-100 via-white to-white p-4">
      <div className="text-center mb-12">
        <h1 className="font-headline text-5xl md:text-7xl font-bold text-primary-foreground bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-600">
          HealthFlow
        </h1>
        <p className="mt-4 text-lg md:text-xl text-foreground/80 max-w-2xl mx-auto">
          Your seamless connection to modern healthcare. Manage appointments, consult with experts, and take control of your health journey.
        </p>
        <Badge variant="secondary" className="mt-6 text-base py-2 px-4 rounded-full shadow-md border-green-200 bg-green-100 text-green-800">
            <ShieldCheck className="w-5 h-5 mr-2" />
            Trusted by 10,000+ patients
        </Badge>
      </div>

      <div className="text-center">
        <Button asChild size="lg">
          <Link href="/dashboard">Go to Dashboard</Link>
        </Button>
      </div>

       <footer className="absolute bottom-4 text-center text-foreground/60 text-sm">
        <p>Built for a better healthcare experience.</p>
      </footer>
    </main>
  );
}
