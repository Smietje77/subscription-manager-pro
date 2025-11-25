'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/components/providers/auth-provider';
import { Navbar } from '@/components/layout/navbar';
import { Sidebar } from '@/components/layout/sidebar';
import { LoadingSpinner } from '@/components/ui/spinner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar } from '@/components/ui/avatar';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';
import {
  Search,
  MoreVertical,
  User,
  Shield,
  Ban,
  Mail,
} from 'lucide-react';

interface UserData {
  id: string;
  email: string;
  fullName: string | null;
  avatarUrl: string | null;
  role: 'end_user' | 'support' | 'admin' | 'super_admin';
  status: 'active' | 'blocked' | 'trial' | 'inactive';
  createdAt: string;
  subscriptionCount: number;
}

// Mock data for demonstration
const mockUsers: UserData[] = [
  {
    id: '1',
    email: 'john@example.com',
    fullName: 'John Doe',
    avatarUrl: null,
    role: 'end_user',
    status: 'active',
    createdAt: '2024-01-15T10:00:00Z',
    subscriptionCount: 5,
  },
  {
    id: '2',
    email: 'jane@example.com',
    fullName: 'Jane Smith',
    avatarUrl: null,
    role: 'admin',
    status: 'active',
    createdAt: '2024-02-01T10:00:00Z',
    subscriptionCount: 12,
  },
  {
    id: '3',
    email: 'bob@example.com',
    fullName: 'Bob Wilson',
    avatarUrl: null,
    role: 'end_user',
    status: 'trial',
    createdAt: '2024-03-10T10:00:00Z',
    subscriptionCount: 2,
  },
];

export default function AdminUsersPage() {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');

  // In a real app, this would fetch from the API
  const { data: users, isLoading } = useQuery({
    queryKey: ['admin-users'],
    queryFn: async () => {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));
      return mockUsers;
    },
    enabled: !!user,
  });

  const handleRoleChange = (userId: string, newRole: string) => {
    toast.info(`Role change to ${newRole} not implemented yet`);
  };

  const handleBlockUser = (userId: string) => {
    toast.info('Block user not implemented yet');
  };

  const handleSendEmail = (email: string) => {
    window.location.href = `mailto:${email}`;
  };

  const filteredUsers = users?.filter(
    (u) =>
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.fullName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'super_admin':
        return 'destructive';
      case 'admin':
        return 'default';
      case 'support':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'active':
        return 'default';
      case 'blocked':
        return 'destructive';
      case 'trial':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen">
        <Sidebar />
        <div className="flex-1">
          <Navbar />
          <div className="container mx-auto p-8">
            <LoadingSpinner text="Loading users..." />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1">
        <Navbar />
        <div className="container mx-auto space-y-6 p-8">
          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold">Users</h1>
            <p className="mt-2 text-muted-foreground">
              Manage user accounts and permissions
            </p>
          </div>

          {/* Search */}
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="text-sm text-muted-foreground">
              {filteredUsers?.length || 0} users
            </div>
          </div>

          {/* Users Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Subscriptions</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers?.map((u) => (
                  <TableRow key={u.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          {u.avatarUrl ? (
                            <img
                              src={u.avatarUrl}
                              alt={u.fullName || u.email}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center bg-primary text-primary-foreground">
                              <User className="h-5 w-5" />
                            </div>
                          )}
                        </Avatar>
                        <div>
                          <p className="font-medium">
                            {u.fullName || 'No name'}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {u.email}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getRoleBadgeVariant(u.role) as any}>
                        {u.role.replace('_', ' ')}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusBadgeVariant(u.status) as any}>
                        {u.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{u.subscriptionCount}</TableCell>
                    <TableCell>
                      {new Date(u.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => handleSendEmail(u.email)}
                          >
                            <Mail className="mr-2 h-4 w-4" />
                            Send Email
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleRoleChange(u.id, 'admin')}
                          >
                            <Shield className="mr-2 h-4 w-4" />
                            Change Role
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => handleBlockUser(u.id)}
                            className="text-destructive"
                          >
                            <Ban className="mr-2 h-4 w-4" />
                            Block User
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredUsers?.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      <p className="text-muted-foreground">No users found</p>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </div>
  );
}
