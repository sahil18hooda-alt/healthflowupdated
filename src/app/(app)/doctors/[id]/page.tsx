'use client';

import { mockDoctors } from '@/lib/mock-data';
import { notFound } from 'next/navigation';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function DoctorProfilePage({ params }: { params: { id: string } }) {
  const doctor = mockDoctors.find((d) => d.id === params.id);

  if (!doctor || !doctor.profile) {
    return notFound();
  }

  const placeholder = PlaceHolderImages.find((p) => p.id === doctor.imageId);

  return (
    <div className="container mx-auto py-10 px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-1">
          <Card className="overflow-hidden shadow-lg transform hover:scale-105 transition-transform duration-300">
            <CardContent className="p-6 text-center">
              <Avatar className="w-32 h-32 mx-auto mb-4 border-4 border-gray-200 dark:border-gray-700">
                <AvatarImage src={placeholder?.imageUrl} alt={doctor.name} />
                <AvatarFallback>{doctor.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{doctor.name}</h1>
              <p className="text-lg text-blue-600 dark:text-blue-400 font-semibold">{doctor.specialization}</p>
              <div className="mt-4">
                <Badge>{doctor.availability}</Badge>
              </div>
              <Link href={`/appointments?tab=book&doctor=${encodeURIComponent(doctor.name)}`} passHref>
                <Button className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded transition-colors duration-300">
                  Book an Appointment
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
        <div className="lg:col-span-2">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl font-bold">Personal Statement</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 dark:text-gray-300">{doctor.profile.personalStatement}</p>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl font-bold">Education</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {doctor.profile.education.map((edu, index) => (
                    <li key={index} className="text-gray-700 dark:text-gray-300">
                      <p className="font-semibold">{edu.degree}</p>
                      <p>{edu.institution}</p>
                      <p className="text-sm text-gray-500">{edu.year}</p>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl font-bold">Experience</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {doctor.profile.experience.map((exp, index) => (
                    <li key={index} className="text-gray-700 dark:text-gray-300">
                      <p className="font-semibold">{exp.position}</p>
                      <p>{exp.hospital}</p>
                      <p className="text-sm text-gray-500">{exp.years}</p>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          {doctor.profile.publications && doctor.profile.publications.length > 0 && (
            <Card className="mt-6 shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl font-bold">Publications</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {doctor.profile.publications.map((pub, index) => (
                    <li key={index} className="text-gray-700 dark:text-gray-300">
                      <p className="font-semibold">{pub.title}</p>
                      <p className="italic">{pub.journal}, {pub.year}</p>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {doctor.profile.awards && doctor.profile.awards.length > 0 && (
            <Card className="mt-6 shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl font-bold">Awards</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {doctor.profile.awards.map((award, index) => (
                    <li key={index} className="text-gray-700 dark:text-gray-300">
                      <p className="font-semibold">{award.name} ({award.year})</p>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
