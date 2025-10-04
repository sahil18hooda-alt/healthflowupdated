import { Stethoscope, User } from 'lucide-react';
import Link from 'next/link';

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <div className="text-center mb-12">
        <h1 className="font-headline text-5xl md:text-7xl font-bold text-primary-foreground bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-600">
          HealthFlow
        </h1>
        <p className="mt-4 text-lg md:text-xl text-foreground/80 max-w-2xl mx-auto">
          Your seamless connection to modern healthcare.
        </p>
         <p className="mt-2 text-md text-foreground/60">Choose your portal to get started.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-2xl w-full">
        <Link href="/dashboard?role=patient">
            <Card className="text-center hover:shadow-lg hover:border-primary/50 transition-all duration-300 transform hover:-translate-y-1">
                <CardHeader>
                    <User className="h-12 w-12 mx-auto text-primary" />
                    <CardTitle className="mt-4">Patient Portal</CardTitle>
                    <CardDescription>Access your health records, book appointments, and connect with your doctor.</CardDescription>
                </CardHeader>
            </Card>
        </Link>
        <Link href="/dashboard?role=employee">
            <Card className="text-center hover:shadow-lg hover:border-primary/50 transition-all duration-300 transform hover:-translate-y-1">
                <CardHeader>
                    <Stethoscope className="h-12 w-12 mx-auto text-primary" />
                    <CardTitle className="mt-4">Doctor Portal</CardTitle>
                    <CardDescription>Manage your appointments, view patient requests, and track your schedule.</CardDescription>
                </CardHeader>
            </Card>
        </Link>
      </div>

       <footer className="absolute bottom-4 text-center text-foreground/60 text-sm">
        <p>Built for a better healthcare experience.</p>
      </footer>
    </main>
  );
}
