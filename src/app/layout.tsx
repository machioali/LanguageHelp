import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/components/providers/theme-provider';
import { AuthProvider } from '@/components/providers/auth-provider';
import { ToastProvider } from '@/components/providers/toast-provider';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import './globals.css';
import { metadata } from './metadata';

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
  fallback: ['system-ui', 'arial'],
  adjustFontFallback: false,
});

// Metadata is exported from ./metadata.ts

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <body className="min-h-screen bg-background font-sans antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            <div className="relative flex min-h-screen flex-col">
              <Navbar />
              <main className="flex-1">
                {children}
              </main>
              <Footer />
            </div>
            <ToastProvider />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}