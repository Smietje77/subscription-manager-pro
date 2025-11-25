'use client';

import { ReactNode } from 'react';
import { Navbar } from './navbar';
import { Sidebar } from './sidebar';
import { MobileNav } from './mobile-nav';
import { cn } from '@/lib/utils';

interface DashboardLayoutProps {
  children: ReactNode;
  className?: string;
}

export function DashboardLayout({ children, className }: DashboardLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar className="hidden md:flex" />
        <main className={cn('flex-1 overflow-auto', className)}>
          <div className="container mx-auto p-6">{children}</div>
        </main>
      </div>
      <MobileNav />
    </div>
  );
}
