import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { mockDoctors } from '@/lib/mock-data';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function DoctorsContent() {
  const searchParams = useSearchParams();
  const role = searchParams.get('role');

  const createLink = (href: string) => {
    const params = new URLSearchParams(searchParams.toString());
    const baseHref = href.split('?')[0];
    const hrefParams = new URLSearchParams(href.split('?')[1] || '');
    hrefParams.forEach((value, key) => {
        params.set(key, value);
    });

    return `${baseHref}?${params.toString()}`;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Find a Doctor</h1>
        <p className="text-muted-foreground">
          Browse our list of specialists and book an appointment today.
        </p>
      </div>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {mockDoctors.map((doctor) => {
          const placeholder = PlaceHolderImages.find(p => p.id === doctor.imageId);
          return (
            <Card key={doctor.id} className="flex flex-col">
              <CardHeader className="items-center text-center">
                {placeholder && (
                    <Image
                        src={placeholder.imageUrl}
                        alt={`Photo of ${doctor.name}`}
                        width={128}
                        height={128}
                        className="rounded-full border-4 border-primary/20 shadow-lg"
                        data-ai-hint={placeholder.imageHint}
                    />
                )}
              </CardHeader>
              <CardContent className="flex-1 text-center">
                <CardTitle>{doctor.name}</CardTitle>
                <CardDescription className="text-primary font-semibold">{doctor.specialization}</CardDescription>
                <p className="mt-4 text-sm text-muted-foreground">{doctor.availability}</p>
              </CardContent>
              <CardFooter>
                <Button className="w-full" asChild>
                  <Link href={createLink(`/appointments?tab=book&doctor=${encodeURIComponent(doctor.name)}`)}>Book Appointment</Link>
                </Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>
    </div>
  );
}


export default function DoctorsPage() {
    return (
        <Suspense fallback={<div>Loading doctors...</div>}>
            <DoctorsContent />
        </Suspense>
    )
}
