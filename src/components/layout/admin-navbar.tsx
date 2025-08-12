"use client";

import Link from "next/link";
import { useTheme } from "next-themes";
import { useSession } from "next-auth/react";
import { useCustomSignOut } from "@/components/custom-signout";
import {
  Sun,
  Moon,
  Globe,
  LogOut,
} from "lucide-react";

export function AdminNavbar() {
  const { theme, setTheme } = useTheme();
  const { data: session } = useSession();
  const customSignOut = useCustomSignOut();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <nav className="mx-auto flex max-w-7xl items-center justify-between p-4 lg:px-8">
        {/* Logo - links to admin dashboard */}
        <div className="flex lg:flex-1">
          <Link href="/admin/dashboard" className="-m-1.5 p-1.5">
            <span className="sr-only">LanguageHelp Admin</span>
            <div className="flex items-center space-x-2">
              <Globe className="h-8 w-8 text-primary" />
              <span className="text-xl font-bold text-foreground">
                LanguageHelp
              </span>
              <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 rounded-full">
                Admin
              </span>
            </div>
          </Link>
        </div>

        {/* Right side actions - theme toggle and logout */}
        <div className="flex items-center space-x-4">
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

          {/* Logout button */}
          {session && (
            <button
              onClick={customSignOut}
              className="flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-950/50 transition-colors"
              aria-label="Sign out"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          )}
        </div>
      </nav>
    </header>
  );
}
