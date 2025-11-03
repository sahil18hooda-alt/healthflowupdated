'use client';

import { mockDoctors } from '@/lib/mock-data';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import ProfileCard from '@/components/ProfileCard';

function DoctorsContent() {
  const searchParams = useSearchParams();

  const createLink = (href: string) => {
    const params = new URLSearchParams(searchParams.toString());
    const baseHref = href.split('?')[0];
    const hrefParams = new URLSearchParams(href.split('?')[1] || '');
    hrefParams.forEach((value, key) => {
      params.set(key, value);
    });

    return `${baseHref}?${params.toString()}`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Find a Doctor</h1>
          <p className="text-muted-foreground">
            Browse our list of specialists and book an appointment today.
          </p>
        </div>
      </div>

      {/* Doctor Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {mockDoctors.map((doctor) => {
          const placeholder = PlaceHolderImages.find(
            (p) => p.id === doctor.imageId
          );
          return (
            <ProfileCard
              key={doctor.id}
              name={doctor.name}
              title={doctor.specialization}
              status={doctor.availability}
              contactText="Book Appointment"
              avatarUrl={placeholder?.imageUrl}
              onContactClick={() => {
                window.location.href = createLink(
                  `/appointments?tab=book&doctor=${encodeURIComponent(
                    doctor.name
                  )}`
                );
              }}
            />
          );
        })}
      </div>

      {/* Small note for transparency */}
      <p className="text-xs text-muted-foreground text-center mt-6">
        Live availability powered by{' '}
        <Link
          href="https://srmglobalhospitals.com/best-doctors/"
          target="_blank"
          className="underline hover:text-primary"
        >
          SRM Global Hospitals
        </Link>
        .
      </p>
    </div>
  );
}

export default function DoctorsPage() {
  return (
    <Suspense fallback={<div>Loading doctors...</div>}>
      <DoctorsContent />
    </Suspense>
  );
}
