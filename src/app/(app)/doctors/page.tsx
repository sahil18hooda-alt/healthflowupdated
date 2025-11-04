'use client';

import { mockDoctors } from '@/lib/mock-data';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import ChromaGrid from '@/components/ChromaGrid';

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

  const doctorItems = mockDoctors.map((doctor, index) => {
    const placeholder = PlaceHolderImages.find((p) => p.id === doctor.imageId);
    const colors = [
      { borderColor: "#3B82F6", gradient: "linear-gradient(145deg, #3B82F6, #000)" },
      { borderColor: "#10B981", gradient: "linear-gradient(180deg, #10B981, #000)" },
      { borderColor: "#F59E0B", gradient: "linear-gradient(165deg, #F59E0B, #000)" },
      { borderColor: "#EF4444", gradient: "linear-gradient(195deg, #EF4444, #000)" },
      { borderColor: "#8B5CF6", gradient: "linear-gradient(225deg, #8B5CF6, #000)" },
      { borderColor: "#06B6D4", gradient: "linear-gradient(135deg, #06B6D4, #000)" },
    ];
    const color = colors[index % colors.length];

    return {
      image: placeholder?.imageUrl,
      title: doctor.name,
      subtitle: doctor.specialization,
      handle: doctor.availability,
      borderColor: color.borderColor,
      gradient: color.gradient,
      url: createLink(`/appointments?tab=book&doctor=${encodeURIComponent(doctor.name)}`),
    };
  });

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
      <div style={{ height: 'auto', position: 'relative' }}>
        <ChromaGrid 
          items={doctorItems}
          radius={300}
          damping={0.45}
          fadeOut={0.6}
          ease="power3.out"
          columns={3}
        />
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
