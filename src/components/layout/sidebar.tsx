'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  CreditCard,
  BarChart3,
  Settings,
  User,
  Package,
  Users,
  FolderTree,
} from 'lucide-react';

interface SidebarProps {
  className?: string;
}

const userNavItems = [
  {
    title: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    title: 'Subscriptions',
    href: '/subscriptions',
    icon: CreditCard,
  },
  {
    title: 'Analytics',
    href: '/analytics',
    icon: BarChart3,
  },
  {
    title: 'Settings',
    href: '/settings',
    icon: Settings,
  },
  {
    title: 'Profile',
    href: '/profile',
    icon: User,
  },
];

const adminNavItems = [
  {
    title: 'Admin Dashboard',
    href: '/admin',
    icon: LayoutDashboard,
  },
  {
    title: 'Products',
    href: '/admin/products',
    icon: Package,
  },
  {
    title: 'Users',
    href: '/admin/users',
    icon: Users,
  },
  {
    title: 'Categories',
    href: '/admin/categories',
    icon: FolderTree,
  },
];

export function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith('/admin');

  const navItems = isAdmin ? adminNavItems : userNavItems;

  return (
    <aside
      className={cn(
        'flex h-full w-64 flex-col border-r bg-background',
        className
      )}
    >
      <div className="flex-1 overflow-auto py-6">
        <nav className="space-y-1 px-3">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors',
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                )}
              >
                <Icon className="h-5 w-5" />
                {item.title}
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
