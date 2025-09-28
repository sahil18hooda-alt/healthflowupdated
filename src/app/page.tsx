import { Stethoscope, User } from 'lucide-react';
import Link from 'next/link';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-background to-accent/30 p-4">
      <div className="text-center mb-12">
        <h1 className="font-headline text-5xl md:text-7xl font-bold text-primary-foreground bg-clip-text text-transparent bg-gradient-to-r from-primary via-blue-500 to-primary">
          HealthFlow
        </h1>
        <p className="mt-4 text-lg md:text-xl text-foreground/80 max-w-2xl mx-auto">
          Your seamless connection to modern healthcare. Manage appointments, consult with experts, and take control of your health journey.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
        <RoleCard
          role="patient"
          title="I'm a Patient"
          description="Access your health records, book appointments, and connect with your doctor."
          icon={<User className="w-12 h-12 text-primary" />}
        />
        <RoleCard
          role="employee"
          title="I'm an Employee"
          description="Manage your schedule, view patient information, and provide care."
          icon={<Stethoscope className="w-12 h-12 text-primary" />}
        />
      </div>
       <footer className="absolute bottom-4 text-center text-foreground/60 text-sm">
        <p>Built for a better healthcare experience.</p>
      </footer>
    </main>
  );
}

interface RoleCardProps {
  role: 'patient' | 'employee';
  title: string;
  description: string;
  icon: React.ReactNode;
}

function RoleCard({ role, title, description, icon }: RoleCardProps) {
  return (
    <Link href={`/login?role=${role}`} className="group">
      <Card className="h-full transform transition-transform duration-300 group-hover:scale-105 group-hover:shadow-2xl group-hover:shadow-primary/20">
        <CardHeader className="items-center text-center">
          <div className="p-4 bg-primary/10 rounded-full mb-4">
            {icon}
          </div>
          <CardTitle className="text-2xl font-bold">{title}</CardTitle>
          <CardDescription className="text-base">{description}</CardDescription>
        </CardHeader>
        <CardContent className="text-center">
            <span className="font-semibold text-primary group-hover:underline">
              Continue as {role === 'patient' ? 'Patient' : 'Employee'} &rarr;
            </span>
        </CardContent>
      </Card>
    </Link>
  );
}
