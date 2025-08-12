import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Interpreter Sign In | LanguageHelp',
  description: 'Sign in to your interpreter account to access your dashboard and manage interpretation sessions.',
};

export default function InterpreterSignInLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section>
      {children}
    </section>
  );
}