import type { Metadata } from "next";
import { Inter } from 'next/font/google';
import { InterpreterDashboardProtection } from '@/components/interpreter-protection';

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: "Interpreter Dashboard | LanguageHelp",
  description: "Professional interpreter dashboard for managing sessions, earnings, and account settings.",
};

export default function InterpreterDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <InterpreterDashboardProtection>
      <div className={`${inter.className} min-h-screen bg-background`}>
        <div className="flex flex-col">
          <main className="flex-1">
            {children}
          </main>
        </div>
      </div>
    </InterpreterDashboardProtection>
  );
}
