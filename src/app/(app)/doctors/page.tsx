'use client';

import { mockDoctors } from '@/lib/mock-data';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Suspense, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

function DoctorCard({ doctor, placeholder, createLink }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden transform hover:scale-105 transition-transform duration-300 ease-in-out">
      <div className="flex">
        <div className="flex-shrink-0">
          <img className="h-48 w-48 object-cover" src={placeholder?.imageUrl} alt={doctor.name} />
        </div>
        <div className="p-6 flex flex-col justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{doctor.name}</h2>
            <p className="text-md text-gray-600 dark:text-gray-300">{doctor.specialization}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">{doctor.description}</p>
          </div>
          <div className="mt-4 flex space-x-3">
            <Link href={createLink(`/appointments?tab=book&doctor=${encodeURIComponent(doctor.name)}`)} passHref>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors duration-300">
                Book an Appointment
              </Button>
            </Link>
            <Link href={`/doctors/${doctor.id}`} passHref>
              <Button variant="outline" className="font-bold py-2 px-4 rounded transition-colors duration-300">
                View Profile
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

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

      <div className="grid grid-cols-1 gap-8">
        {filteredDoctors.map((doctor, index) => {
          const placeholder = PlaceHolderImages.find((p) => p.id === doctor.imageId);
          return <DoctorCard key={index} doctor={doctor} placeholder={placeholder} createLink={createLink} />;
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
