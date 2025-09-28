'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Hospital, LayoutDashboard, Stethoscope, Calendar, Star, Clock, User } from 'lucide-react';

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar';
import { useAuth } from '@/hooks/use-auth';

const patientNavItems = [
  { href: '/dashboard', icon: <LayoutDashboard />, label: 'Dashboard' },
  { href: '/doctors', icon: <Stethoscope />, label: 'Doctors' },
  { href: '/appointments', icon: <Calendar />, label: 'Appointments' },
  { href: '/reviews', icon: <Star />, label: 'Reviews' },
];

const employeeNavItems = [
  { href: '/dashboard', icon: <LayoutDashboard />, label: 'Dashboard' },
  { href: '/appointments', icon: <Calendar />, label: 'Appointments' },
  { href: '/attendance', icon: <Clock />, label: 'Attendance' },
];

export default function AppSidebar() {
  const pathname = usePathname();
  const { user } = useAuth();

  const navItems = user?.role === 'patient' ? patientNavItems : employeeNavItems;

  return (
    <Sidebar>
      <SidebarHeader>
        <Link href="/dashboard" className="flex items-center gap-2">
          <Hospital className="h-7 w-7 text-primary" />
          <span className="font-bold text-lg font-headline">HealthFlow</span>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {navItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <Link href={item.href} legacyBehavior passHref>
                <SidebarMenuButton
                  isActive={pathname === item.href}
                  tooltip={{ children: item.label }}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  );
}
