import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sign Up - LanguageHelp',
  description: 'Create a new account on LanguageHelp to access interpretation services.',
};

export default function SignUpLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      {children}
    </div>
  );
}