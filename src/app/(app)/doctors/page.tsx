'use client';

import { mockDoctors } from '@/lib/mock-data';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Suspense, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

import { FlipCard } from '@/components/animate-ui/components/community/flip-card';

function DoctorsContent() {
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState('');

  const createLink = (href: string) => {
    const params = new URLSearchParams(searchParams.toString());
    const baseHref = href.split('?')[0];
    const hrefParams = new URLSearchParams(href.split('?')[1] || '');
    hrefParams.forEach((value, key) => {
      params.set(key, value);
    });
    return `${baseHref}?${params.toString()}`;
  };

  const filteredDoctors = mockDoctors.filter(doctor =>
    doctor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doctor.specialization.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white">Find a Doctor</h1>
        <p className="mt-2 text-lg text-gray-600 dark:text-gray-300">
          Search by doctor name or specialization.
        </p>
      </div>

      <div className="flex justify-center">
        <div className="w-full max-w-lg">
          <Input
            type="text"
            placeholder="Search by Doctor Name or Department..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
        {filteredDoctors.map((doctor, index) => {
          const placeholder = PlaceHolderImages.find((p) => p.id === doctor.imageId);
          const cardData = {
            name: doctor.name,
            specialization: doctor.specialization,
            image: placeholder?.imageUrl || '',
            bio: doctor.description || '',
            id: doctor.id,
            createLink: createLink,
          };
          return <FlipCard key={index} data={cardData} />;
        })}
      </div>

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
