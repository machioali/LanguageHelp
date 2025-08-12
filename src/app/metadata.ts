import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: {
    default: 'LanguageHelp - Global Interpreter & Translation Platform',
    template: '%s | LanguageHelp'
  },
  description: 'Connect with certified interpreters and AI-powered translation tools instantly. Professional interpretation services for healthcare, legal, business, and more.',
  keywords: ['interpretation', 'translation', 'multilingual', 'interpreter', 'language services', 'healthcare interpretation', 'legal translation'],
  authors: [{ name: 'LanguageHelp Team' }],
  creator: 'LanguageHelp',
  publisher: 'LanguageHelp',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXTAUTH_URL || 'https://localhost:3000'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'LanguageHelp - Global Interpreter & Translation Platform',
    description: 'Connect with certified interpreters and AI-powered translation tools instantly.',
    url: 'https://languagehelp.com',
    siteName: 'LanguageHelp',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'LanguageHelp Platform',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'LanguageHelp - Global Interpreter & Translation Platform',
    description: 'Connect with certified interpreters and AI-powered translation tools instantly.',
    images: ['/og-image.jpg'],
    creator: '@languagehelp',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
  },
};