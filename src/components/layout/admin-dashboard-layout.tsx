'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import {
  Home,
  Users,
  UserPlus,
  Shield,
  FileText,
  BarChart3,
  Settings,
  LogOut,
  Bell,
  Menu,
  X,
  Search,
  Globe,
  HelpCircle,
  Moon,
  Sun,
  Plus,
  Database,
  Activity,
  AlertTriangle,
  Briefcase
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { useTheme } from 'next-themes';

interface AdminDashboardLayoutProps {
  children: React.ReactNode;
}

const navigation = [
  { name: 'Dashboard', href: '/admin/dashboard', icon: Home },
  { name: 'Users', href: '/admin/users', icon: Users },
  { name: 'Job Management', href: '/admin/jobs', icon: Briefcase },
  { name: 'Applications', href: '/admin/applications', icon: FileText },
  { name: 'Create Admin', href: '/admin/create-admin', icon: Shield },
  { name: 'Create Interpreter', href: '/admin/create-interpreter', icon: UserPlus },
  { name: 'Analytics', href: '/admin/analytics', icon: BarChart3 },
  { name: 'System Health', href: '/admin/system', icon: Activity },
  { name: 'Reports', href: '/admin/reports', icon: Database },
  { name: 'Settings', href: '/admin/settings', icon: Settings },
];

export function AdminDashboardLayout({ children }: AdminDashboardLayoutProps) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const { theme, setTheme } = useTheme();
  const [sidebarOpen, setSidebarOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState('');

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Mobile sidebar */}
      <div className={cn(
        "fixed inset-0 z-40 lg:hidden",
        sidebarOpen ? "block" : "hidden"
      )}>
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)} />
        <div className="relative flex w-full max-w-xs flex-1 flex-col bg-white dark:bg-gray-800">
          <div className="absolute right-0 top-0 -mr-12 pt-2">
            <button
              type="button"
              className="ml-1 flex h-10 w-10 items-center justify-center rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-6 w-6 text-white" />
            </button>
          </div>
          <div className="h-0 flex-1 overflow-y-auto pb-4 pt-5">
            <div className="flex flex-shrink-0 items-center px-4">
              <div className="flex items-center space-x-2">
                <Shield className="h-6 w-6 text-primary" />
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">Admin Panel</h1>
              </div>
            </div>
            <nav className="mt-5 space-y-1 px-2">
              {navigation.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      isActive
                        ? 'bg-primary text-primary-foreground'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white',
                      'group flex items-center rounded-md px-2 py-2 text-sm font-medium'
                    )}
                  >
                    <item.icon
                      className={cn(
                        isActive ? 'text-primary-foreground' : 'text-gray-400 group-hover:text-gray-500 dark:group-hover:text-gray-300',
                        'mr-3 h-5 w-5 flex-shrink-0'
                      )}
                    />
                    {item.name}
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <div className="flex flex-grow flex-col overflow-y-auto border-r border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800 pt-5">
          <div className="flex flex-shrink-0 items-center px-4">
            <div className="flex items-center space-x-2">
              <Shield className="h-6 w-6 text-primary" />
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">Admin Panel</h1>
            </div>
          </div>
          <div className="mt-5 flex flex-grow flex-col">
            <nav className="flex-1 space-y-1 px-2 pb-4">
              {navigation.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      isActive
                        ? 'bg-primary text-primary-foreground'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white',
                      'group flex items-center rounded-md px-2 py-2 text-sm font-medium'
                    )}
                  >
                    <item.icon
                      className={cn(
                        isActive ? 'text-primary-foreground' : 'text-gray-400 group-hover:text-gray-500 dark:group-hover:text-gray-300',
                        'mr-3 h-5 w-5 flex-shrink-0'
                      )}
                    />
                    {item.name}
                  </Link>
                );
              })}
            </nav>

            {/* Admin Panel Info */}
            <div className="px-2 pb-4">
              <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg p-3">
                <div className="flex items-center space-x-2 mb-2">
                  <AlertTriangle className="h-4 w-4 text-primary" />
                  <span className="text-xs font-medium text-gray-900 dark:text-gray-100">Admin Access</span>
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  You have full administrative privileges. Use with caution.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-1 flex-col lg:pl-64">
        {/* Enhanced Top Navbar */}
        <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-gray-200/20 dark:bg-gray-800/80 dark:border-gray-700/20">
          <div className="flex h-16 items-center justify-between px-4">
            {/* Left section - Mobile menu + Brand */}
            <div className="flex items-center space-x-4">
              <button
                type="button"
                className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary/20 lg:hidden dark:text-gray-400 dark:hover:bg-gray-700"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu className="h-5 w-5" />
              </button>
              
              {/* Logo and brand name for mobile */}
              <Link href="/admin/dashboard" className="flex items-center space-x-2 lg:hidden">
                <Shield className="h-6 w-6 text-primary" />
                <span className="text-lg font-bold text-gray-900 dark:text-white">Admin Panel</span>
              </Link>
            </div>

            {/* Center section - Search */}
            <div className="flex-1 max-w-md mx-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Input
                  type="search"
                  placeholder="Search users, applications..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 pr-4 py-2 w-full bg-gray-50/50 border-gray-200/50 focus:bg-white focus:border-primary/30 dark:bg-gray-700/50 dark:border-gray-600/50 dark:focus:bg-gray-700"
                />
              </div>
            </div>

            {/* Right section - Actions */}
            <div className="flex items-center space-x-2">
              {/* Quick Actions */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-9 w-9 p-0 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem asChild>
                    <Link href="/admin/jobs" className="flex items-center">
                      <Briefcase className="mr-2 h-4 w-4" />
                      Manage Jobs
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/admin/create-interpreter" className="flex items-center">
                      <UserPlus className="mr-2 h-4 w-4" />
                      Create Interpreter
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/admin/create-admin" className="flex items-center">
                      <Shield className="mr-2 h-4 w-4" />
                      Create Admin
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Theme toggle */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="h-9 w-9 p-0 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                <span className="sr-only">Toggle theme</span>
              </Button>

              {/* Help button */}
              <Button
                variant="ghost"
                size="sm"
                className="h-9 w-9 p-0 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <HelpCircle className="h-4 w-4" />
              </Button>

              {/* Notifications */}
              <Button
                variant="ghost"
                size="sm"
                className="relative h-9 w-9 p-0 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <Bell className="h-4 w-4" />
                <Badge className="absolute -right-1 -top-1 h-5 w-5 p-0 text-xs bg-red-500 hover:bg-red-500">
                  5
                </Badge>
              </Button>

              {/* Profile dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-9 w-9 rounded-full p-0 hover:bg-gray-100 dark:hover:bg-gray-700">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={session?.user?.image || ''} alt={session?.user?.name || ''} />
                      <AvatarFallback className="text-sm bg-gradient-to-br from-primary to-primary/80">
                        {session?.user?.name?.[0] || 'A'}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-64 p-2">
                  {/* User Info Header */}
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg mb-2">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={session?.user?.image || ''} alt={session?.user?.name || ''} />
                      <AvatarFallback className="bg-gradient-to-br from-primary to-primary/80">
                        {session?.user?.name?.[0] || 'A'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">
                        {session?.user?.name || 'Admin'}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                        {session?.user?.email}
                      </p>
                      <Badge variant="secondary" className="text-xs mt-1 bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">
                        Administrator
                      </Badge>
                    </div>
                  </div>
                  
                  <DropdownMenuSeparator className="my-2" />
                  
                  {/* Quick Actions */}
                  <div className="space-y-1">
                    <DropdownMenuItem asChild>
                      <Link href="/admin/profile" className="flex items-center px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700">
                        <Shield className="mr-3 h-4 w-4 text-gray-500" />
                        <span>Admin Profile</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/admin/settings" className="flex items-center px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700">
                        <Settings className="mr-3 h-4 w-4 text-gray-500" />
                        <span>System Settings</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/admin/system" className="flex items-center px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700">
                        <Activity className="mr-3 h-4 w-4 text-gray-500" />
                        <span>System Health</span>
                      </Link>
                    </DropdownMenuItem>
                  </div>
                  
                  <DropdownMenuSeparator className="my-2" />
                  
                  {/* Sign out */}
                  <DropdownMenuItem
                    onClick={() => signOut({ callbackUrl: '/' })}
                    className="flex items-center px-3 py-2 rounded-md text-red-600 hover:bg-red-50 focus:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/50 dark:focus:bg-red-950/50"
                  >
                    <LogOut className="mr-3 h-4 w-4" />
                    <span>Sign out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1">
          <div className="py-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
