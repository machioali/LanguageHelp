"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { useSession } from "next-auth/react";
import { useCustomSignOut } from "@/components/custom-signout";
import { AdminNavbar } from "./admin-navbar";
import { InterpreterNavbar } from "./interpreter-navbar";
import {
  Menu,
  X,
  Sun,
  Moon,
  Globe,
  User,
  LogOut,
  Settings,
  Calendar,
  MessageSquare,
  ChevronDown,
} from "lucide-react";
import { UserRole } from "@/lib/constants";

const navigation = [
  { name: "Services", href: "/services" },
  { name: "Interpreter Portal", href: "/interpreter-portal" },
  { name: "Pricing", href: "/pricing" },
  { name: "About", href: "/about" },
  { name: "Contact", href: "/contact" },
];

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const { data: session } = useSession();
  const pathname = usePathname();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const customSignOut = useCustomSignOut();

  // Check if we're on admin pages
  const isOnAdminPage = pathname?.startsWith('/admin/');
  const isAdminUser = session?.user?.role === UserRole.ADMIN;
  
  // Check if we're on interpreter portal pages
  const isOnInterpreterPage = pathname?.startsWith('/interpreter-portal/');
  const isInterpreterUser = session?.user?.role === UserRole.INTERPRETER;
  
  // Check if user is a signed-in client
  const isClientSignedIn = session?.user?.role === UserRole.CLIENT;
  
  // Check if we're on client auth pages
  const isOnAuthPage = pathname?.startsWith('/auth/signin') || pathname?.startsWith('/auth/signup');

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false);
      }
    };

    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setUserMenuOpen(false);
      }
    };

    if (userMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscapeKey);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [userMenuOpen]);

  // If we're on admin pages and user is admin, use AdminNavbar
  if (isOnAdminPage && isAdminUser) {
    return <AdminNavbar />;
  }

  // If we're on interpreter portal pages and user is interpreter, use InterpreterNavbar
  if (isOnInterpreterPage && isInterpreterUser) {
    return <InterpreterNavbar />;
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <nav className="mx-auto flex max-w-7xl items-center justify-between p-4 lg:px-8">
        {/* Logo */}
        <div className="flex lg:flex-1">
          <Link href="/" className="-m-1.5 p-1.5">
            <span className="sr-only">LanguageHelp</span>
            <div className="flex items-center space-x-2">
              <Globe className="h-8 w-8 text-primary" />
              <span className="text-xl font-bold text-foreground">
                LanguageHelp
              </span>
            </div>
          </Link>
        </div>

        {/* Mobile menu button */}
        <div className="flex lg:hidden">
          <button
            type="button"
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-foreground"
            onClick={() => setMobileMenuOpen(true)}
          >
            <span className="sr-only">Open main menu</span>
            <Menu className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>

        {/* Desktop navigation */}
        <div className="hidden lg:flex lg:gap-x-12">
          {isClientSignedIn ? (
            // No navigation links for signed-in clients - they use dropdown and dashboard
            null
          ) : (
            // Full navigation for non-clients or signed-out users
            navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-sm font-semibold leading-6 text-foreground hover:text-primary transition-colors"
              >
                {item.name}
              </Link>
            ))
          )}
        </div>

        {/* Right side actions */}
        <div className="hidden lg:flex lg:flex-1 lg:justify-end lg:items-center lg:space-x-4">
          {/* Theme toggle */}
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="p-2 rounded-md hover:bg-accent transition-colors relative w-9 h-9 flex items-center justify-center"
            aria-label="Toggle theme"
          >
            <Sun className="h-5 w-5 absolute rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="h-5 w-5 absolute rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </button>

          {session ? (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className={`flex items-center space-x-2 p-2 rounded-lg hover:bg-accent transition-all duration-200 ${
                  userMenuOpen ? 'bg-accent shadow-sm' : ''
                }`}
                aria-expanded={userMenuOpen}
                aria-haspopup="true"
              >
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-primary to-primary/80 text-primary-foreground">
                  <User className="h-4 w-4" />
                </div>
                <div className="flex flex-col items-start">
                  <span className="text-sm font-medium text-foreground">
                    {session.user?.name || 'User'}
                  </span>
                  {session.user?.name && session.user?.email && (
                    <span className="text-xs text-muted-foreground truncate max-w-[120px]">
                      {session.user.email}
                    </span>
                  )}
                </div>
                <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform duration-200 ${
                  userMenuOpen ? 'rotate-180' : ''
                }`} />
              </button>

              {userMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-background border rounded-xl shadow-xl py-2 z-50 animate-in slide-in-from-top-2 duration-200">
                  <div className="px-4 py-2 border-b border-border">
                    <p className="text-sm font-medium text-foreground">
                      {session.user?.name || 'User'}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {session.user?.email}
                    </p>
                  </div>
                  <div className="py-1">
                    <Link
                      href="/dashboard"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center px-4 py-2.5 text-sm text-foreground hover:bg-accent transition-colors group"
                    >
                      <Settings className="h-4 w-4 mr-3 text-muted-foreground group-hover:text-foreground transition-colors" />
                      Dashboard
                    </Link>
                    <Link
                      href="/dashboard/profile"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center px-4 py-2.5 text-sm text-foreground hover:bg-accent transition-colors group"
                    >
                      <User className="h-4 w-4 mr-3 text-muted-foreground group-hover:text-foreground transition-colors" />
                      My Account
                    </Link>
                    <Link
                      href="/book"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center px-4 py-2.5 text-sm text-foreground hover:bg-accent transition-colors group"
                    >
                      <Calendar className="h-4 w-4 mr-3 text-muted-foreground group-hover:text-foreground transition-colors" />
                      Book Session
                    </Link>
                  </div>
                  <div className="border-t border-border pt-1">
                    <button
                      onClick={() => {
                        customSignOut();
                        setUserMenuOpen(false);
                      }}
                      className="flex items-center w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-950/50 transition-colors group"
                    >
                      <LogOut className="h-4 w-4 mr-3" />
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center space-x-4">
              <Link
                href="/auth/signin"
                className="text-sm font-semibold leading-6 text-foreground hover:text-primary transition-colors"
              >
                Sign In
              </Link>
              <Link
                href="/book"
                className="rounded-md bg-primary px-3.5 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm hover:bg-primary/90 transition-colors"
              >
                Start Interpreting
              </Link>
            </div>
          )}
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden">
          <div className="fixed inset-0 z-50" />
          <div className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-background px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-border">
            <div className="flex items-center justify-between">
              <Link href="/" className="-m-1.5 p-1.5">
                <span className="sr-only">LanguageHelp</span>
                <div className="flex items-center space-x-2">
                  <Globe className="h-8 w-8 text-primary" />
                  <span className="text-xl font-bold text-foreground">
                    LanguageHelp
                  </span>
                </div>
              </Link>
              <button
                type="button"
                className="-m-2.5 rounded-md p-2.5 text-foreground"
                onClick={() => setMobileMenuOpen(false)}
              >
                <span className="sr-only">Close menu</span>
                <X className="h-6 w-6" aria-hidden="true" />
              </button>
            </div>
            <div className="mt-6 flow-root">
              <div className="-my-6 divide-y divide-border">
                <div className="space-y-2 py-6">
                  {isClientSignedIn ? (
                    // No navigation links for signed-in clients - they use dropdown and dashboard
                    null
                  ) : (
                    // Full navigation for non-clients or signed-out users
                    navigation.map((item) => (
                      <Link
                        key={item.name}
                        href={item.href}
                        className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-foreground hover:bg-accent"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {item.name}
                      </Link>
                    ))
                  )}
                </div>
                <div className="py-6">
                  {/* Theme toggle for mobile */}
                  <div className="-mx-3 flex items-center justify-between px-3 py-2.5 text-base font-semibold leading-7 text-foreground">
                    <span>Theme</span>
                    <button
                      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                      className="p-2 rounded-md hover:bg-accent transition-colors relative w-9 h-9 flex items-center justify-center"
                      aria-label="Toggle theme"
                    >
                      <Sun className="h-5 w-5 absolute rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                      <Moon className="h-5 w-5 absolute rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                      <span className="sr-only">Toggle theme</span>
                    </button>
                  </div>
                  
                  {session ? (
                    <div className="space-y-2">
                      <Link
                        href="/dashboard"
                        className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-foreground hover:bg-accent"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Dashboard
                      </Link>
                      <button
                        onClick={() => {
                          customSignOut();
                          setMobileMenuOpen(false);
                        }}
                        className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-foreground hover:bg-accent w-full text-left"
                      >
                        Sign Out
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <Link
                        href="/auth/signin"
                        className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-foreground hover:bg-accent"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Sign In
                      </Link>
                      <Link
                        href="/book"
                        className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 bg-primary text-primary-foreground hover:bg-primary/90"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Start Interpreting
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}