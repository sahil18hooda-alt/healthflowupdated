import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Pill, Stethoscope } from 'lucide-react';

const QuickLink = ({ icon, title, href }: { icon: React.ReactNode, title: string, href: string }) => (
    <a href={href} className="flex flex-col items-center justify-center gap-2 rounded-lg bg-accent/50 p-4 text-center transition-colors hover:bg-accent">
        <div className="rounded-full bg-background p-3">{icon}</div>
        <span className="text-sm font-medium">{title}</span>
    </a>
);

export default function PatientDashboard({ name }: { name: string }) {
  return (
    <div className="grid gap-6">
      <div className="space-y-1.5">
        <h1 className="text-3xl font-bold">Welcome back, {name}!</h1>
        <p className="text-muted-foreground">Here&apos;s a summary of your health dashboard.</p>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="flex flex-col">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Appointment</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="flex-1 flex flex-col justify-center">
            <div className="text-2xl font-bold">Dr. Anjali Sharma</div>
            <p className="text-xs text-muted-foreground">Cardiology</p>
            <p className="mt-2 font-semibold">Tomorrow at 10:00 AM</p>
          </CardContent>
        </Card>

        <Card className="flex flex-col">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Medicine Schedule</CardTitle>
            <Pill className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="flex-1 flex flex-col justify-center">
            <div className="text-2xl font-bold">Aspirin 75mg</div>
            <p className="text-xs text-muted-foreground">Next dose</p>
            <p className="mt-2 font-semibold">Today at 09:00 PM</p>
          </CardContent>
        </Card>
        
        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle>Quick Links</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-4">
            <QuickLink icon={<Calendar className="h-6 w-6 text-primary" />} title="Book Appointment" href="/appointments" />
            <QuickLink icon={<Stethoscope className="h-6 w-6 text-primary" />} title="Find a Doctor" href="/doctors" />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
