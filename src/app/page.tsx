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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
        <RoleCard
          role="patient"
          title="Patient Portal"
          description="Access your health records, book appointments, and connect with your doctor."
          icon={<HeartPulse className="w-12 h-12 text-primary" />}
        />
        <RoleCard
          role="employee"
          title="Employee Portal"
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
