'use client';

import * as React from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command"

import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { LogOut, UserCircle, Search, Bell, LayoutDashboard, Stethoscope, Calendar, Bot, Beaker, FileText } from 'lucide-react';
import { SidebarTrigger } from '../ui/sidebar';
import { Input } from '../ui/input';
import { ThemeToggle } from '../theme-toggle';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { mockDoctors } from '@/lib/mock-data';
import { useRouter } from 'next/navigation';


const patientNavItems = [
    { href: '/dashboard', icon: <LayoutDashboard />, label: 'Dashboard' },
    { href: '/appointments', icon: <Calendar />, label: 'Appointments' },
    { href: '/doctors', icon: <Stethoscope />, label: 'Find a Doctor' },
  { href: '/symptom-analyzer', icon: <Bot />, label: 'Symptom Analyzer' },
  { href: '/medication-checker', icon: <Beaker />, label: 'Interaction Checker' },
];

const employeeNavItems = [
    { href: '/dashboard', icon: <LayoutDashboard />, label: 'Dashboard' },
    { href: '/appointments', icon: <Calendar />, label: 'Appointments' },
    { href: '/requests', icon: <Bell />, label: 'Requests' },
];


export default function AppHeader() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const role = searchParams.get('role');
  const isPatient = role !== 'employee';
  const navItems = isPatient ? patientNavItems : employeeNavItems;

  const [open, setOpen] = React.useState(false)

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if ((e.key === "k" && (e.metaKey || e.ctrlKey))) {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }
    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])


  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('');
  };

  const user = { name: role === 'employee' ? 'Dr. Arjun Sharma' : 'Guest', email: role === 'employee' ? 'arjun.sharma@healthflow.com' : 'guest@example.com' };

  const runCommand = (command: () => void) => {
    setOpen(false)
    command()
  }

  const createLink = (href: string) => {
    const params = new URLSearchParams(searchParams.toString());
    return `${href}?${params.toString()}`;
  }

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background/80 px-4 backdrop-blur-sm md:px-6">
      <SidebarTrigger className="md:hidden" />
      
      <div className="flex-1">
        <Button
            variant="outline"
            className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm text-muted-foreground ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:w-[200px] lg:w-[320px]"
            onClick={() => setOpen(true)}
        >
            <div className="flex items-center gap-2">
                <Search className="h-4 w-4" />
                <span>Search...</span>
            </div>
            <kbd className="pointer-events-none hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
                <span className="text-xs">⌘</span>K
            </kbd>
        </Button>
      </div>

       <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Type a command or search..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Suggestions">
            {navItems.map(item => (
                <CommandItem key={item.href} onSelect={() => runCommand(() => router.push(createLink(item.href)))}>
                    {item.icon}
                    <span>{item.label}</span>
                </CommandItem>
            ))}
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="Doctors">
            {mockDoctors.map(doctor => (
                <CommandItem key={doctor.id} onSelect={() => runCommand(() => router.push(createLink(`/appointments?tab=book&doctor=${encodeURIComponent(doctor.name)}`)))}>
                    <Stethoscope />
                    <span>{doctor.name}</span>
                </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </CommandDialog>

      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" className="rounded-full">
            <Bell className="h-5 w-5" />
            <span className="sr-only">Toggle notifications</span>
        </Button>
        <ThemeToggle />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-10 w-10 rounded-full">
              <Avatar className="h-10 w-10">
                <AvatarImage src={role === 'employee' ? `https://images.unsplash.com/photo-1612349316228-5942a9b489c2` : `https://avatar.vercel.sh/guest.png`} alt={user?.name} />
                <AvatarFallback>
                  {user ? getInitials(user.name) : <UserCircle />}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{user?.name}</p>
                <p className="text-xs leading-none text-muted-foreground">
                  {user?.email}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
