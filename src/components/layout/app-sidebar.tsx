'use client';

import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { Hospital, LayoutDashboard, Stethoscope, Calendar, Star, Clock, User, Bell, Pill, Settings, BrainCircuit, Bot, Route, ShieldAlert, Activity, FilePlus, CalendarClock, TestTube, Cross, Beaker, Users as UsersIcon, ScanSearch, Dumbbell, MessageSquare } from 'lucide-react';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
} from '@/components/ui/sidebar';

const patientNavGroups = [
    {
        title: 'Health Tools',
        items: [
            { href: '/symptom-analyzer', icon: <Bot />, label: 'Symptom Analyzer' },
            { href: '/ai-therapist', icon: <BrainCircuit />, label: 'AI Therapist' },
            { href: '/inquiries', icon: <Route />, label: 'Inquiry Assistant' },
            { href: '/lab-report-analyzer', icon: <TestTube />, label: 'Lab Report Analyzer' },
            { href: '/medication-checker', icon: <Beaker />, label: 'Interaction Checker' },
            { href: '/queue-status', icon: <UsersIcon />, label: 'Queue Status' },
            { href: '/imaging-diagnosis', icon: <ScanSearch />, label: 'AI Imaging' },
            { href: '/fitness-coach', icon: <Dumbbell />, label: 'Fitness Coach' },
        ]
    },
    {
        title: 'Appointments',
        items: [
            { href: '/appointments', icon: <Calendar />, label: 'My Appointments' },
            { href: '/doctors', icon: <Stethoscope />, label: 'Find a Doctor' },
            { href: '/doctor-chat', icon: <MessageSquare />, label: 'Chat with Doctor' },
        ]
    },
];

const employeeNavGroups = [
    {
        title: 'Management',
        items: [
            { href: '/appointments', icon: <Calendar />, label: 'Appointments' },
            { href: '/requests', icon: <Bell />, label: 'Requests' },
            { href: '/attendance', icon: <Clock />, label: 'Attendance' },
        ]
    },
    {
        title: 'AI Tools',
        items: [
             { href: '/fraud-detection', icon: <ShieldAlert />, label: 'Fraud Detection' },
             { href: '/predictive-risk-model', icon: <Activity />, label: 'Predictive Risk' },
             { href: '/medical-notes', icon: <FilePlus />, label: 'Medical Notes' },
             { href: '/schedule-assistant', icon: <CalendarClock />, label: 'Schedule Assistant' },
             { href: '/decision-support', icon: <Bot />, label: 'Decision Support' },
        ]
    }
];


export default function AppSidebar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const role = searchParams.get('role');

  const isPatient = role !== 'employee';
  const navGroups = isPatient ? patientNavGroups : employeeNavGroups;

  const isNavItemActive = (href: string) => {
    return pathname === href;
  };
  
  const createLink = (href: string) => {
    const params = new URLSearchParams(searchParams.toString());
    return `${href}?${params.toString()}`;
  }

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <Link href={createLink("/dashboard")} className="flex items-center gap-2">
          <Hospital className="h-7 w-7 text-primary" />
          <span className="font-bold text-lg font-headline">HealthFlow</span>
        </Link>
      </SidebarHeader>

      <SidebarContent>
        <SidebarMenu>
            <SidebarMenuItem>
                <Link href={createLink("/dashboard")} className="w-full">
                    <SidebarMenuButton
                    isActive={isNavItemActive('/dashboard')}
                    icon={<LayoutDashboard />}
                    >
                    Dashboard
                    </SidebarMenuButton>
                </Link>
            </SidebarMenuItem>

            <Accordion type="multiple" className="w-full" defaultValue={['Health Tools', 'Appointments', 'Management', 'AI Tools']}>
            {navGroups.map((group) => (
                <AccordionItem value={group.title} key={group.title} className="border-none">
                    <AccordionTrigger className="text-sm font-medium text-muted-foreground hover:no-underline px-2 py-1.5 hover:bg-accent hover:text-accent-foreground rounded-md group-data-[collapsible=icon]:hidden">
                        {group.title}
                    </AccordionTrigger>
                    <AccordionContent className="pb-0">
                        <SidebarMenu>
                        {group.items.map((item) => (
                            <SidebarMenuItem key={item.href}>
                                <Link href={createLink(item.href)} className="w-full">
                                    <SidebarMenuButton
                                    isActive={isNavItemActive(item.href)}
                                    icon={item.icon}
                                    >
                                    {item.label}
                                    </SidebarMenuButton>
                                </Link>
                            </SidebarMenuItem>
                        ))}
                        </SidebarMenu>
                    </AccordionContent>
                </AccordionItem>
            ))}
            </Accordion>
            
            {isPatient && (
                <>
                    <SidebarMenuItem>
                        <Link href={createLink("/medications")} className="w-full">
                            <SidebarMenuButton
                            isActive={isNavItemActive('/medications')}
                            icon={<Pill />}
                            >
                            Medications
                            </SidebarMenuButton>
                        </Link>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                        <Link href={createLink("/reviews")} className="w-full">
                            <SidebarMenuButton
                            isActive={isNavItemActive('/reviews')}
                            icon={<Star />}
                            >
                            Reviews
                            </SidebarMenuButton>
                        </Link>
                    </SidebarMenuItem>
                </>
            )}

        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
                <Link href={createLink("/settings")} className="w-full">
                    <SidebarMenuButton
                    isActive={isNavItemActive('/settings')}
                    icon={<Settings />}
                    >
                    Settings
                    </SidebarMenuButton>
                </Link>
            </SidebarMenuItem>
          </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
