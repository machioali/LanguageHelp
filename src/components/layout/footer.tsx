"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { Globe, Mail, Phone, MapPin } from "lucide-react";
import { UserRole } from "@/lib/constants";

const navigation = {
  services: [
    { name: "Real-time Interpretation", href: "/services#interpretation" },
    { name: "Document Translation", href: "/services#translation" },
    { name: "Interpreter Portal", href: "/interpreter-portal" },
    { name: "Industry Solutions", href: "/services#industries" },
  ],
  company: [
    { name: "About Us", href: "/about" },
    { name: "Our Interpreters", href: "/about#interpreters" },
    { name: "Careers", href: "/careers" },
    { name: "Press", href: "/press" },
  ],
  support: [
    { name: "Help Center", href: "/help" },
    { name: "Contact Us", href: "/contact" },
    { name: "System Status", href: "/status" },
    { name: "API Documentation", href: "/docs" },
  ],
  legal: [
    { name: "Privacy Policy", href: "/privacy" },
    { name: "Terms of Service", href: "/terms" },
    { name: "HIPAA Compliance", href: "/compliance" },
    { name: "Security", href: "/security" },
  ],
};

const social = [
  {
    name: "Twitter",
    href: "#",
    icon: (props: any) => (
      <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
        <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
      </svg>
    ),
  },
  {
    name: "LinkedIn",
    href: "#",
    icon: (props: any) => (
      <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
  },
];

export function Footer() {
  const pathname = usePathname();
  const { data: session } = useSession();
  
  // Check if we're on client auth pages
  const isOnClientAuthPage = pathname?.startsWith('/auth/signin') || pathname?.startsWith('/auth/signup');
  
  // Check if we're on admin pages
  const isOnAdminPage = pathname?.startsWith('/admin/');
  const isAdminUser = session?.user?.role === UserRole.ADMIN;
  
  // Check if we're on interpreter portal pages AND user is a signed-in interpreter
  const isOnInterpreterPortal = pathname?.startsWith('/interpreter-portal');
  const isInterpreterSignedIn = session?.user?.role === UserRole.INTERPRETER;
  
  // Check if user is a signed-in client
  const isClientSignedIn = session?.user?.role === UserRole.CLIENT;
  
  // Show minimal footer on client auth pages, for signed-in clients, on admin pages, or for signed-in interpreters on interpreter portal pages
  const showMinimalFooter = isOnClientAuthPage || isClientSignedIn || (isOnAdminPage && isAdminUser) || (isOnInterpreterPortal && isInterpreterSignedIn);

  if (showMinimalFooter) {
    return (
      <footer className="bg-background border-t" aria-labelledby="footer-heading">
        <h2 id="footer-heading" className="sr-only">
          Footer
        </h2>
        <div className="mx-auto max-w-7xl px-6 py-8">
          <div className="text-center">
            <p className="text-xs leading-5 text-muted-foreground">
              &copy; 2024 LanguageHelp, Inc. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    );
  }

  // Full footer for non-client users or non-auth pages
  return (
    <footer className="bg-background border-t" aria-labelledby="footer-heading">
      <h2 id="footer-heading" className="sr-only">
        Footer
      </h2>
      <div className="mx-auto max-w-7xl px-6 pb-8 pt-16 sm:pt-24 lg:px-8 lg:pt-32">
        <div className="xl:grid xl:grid-cols-3 xl:gap-8">
          <div className="space-y-8">
            <div className="flex items-center space-x-2">
              <Globe className="h-8 w-8 text-primary" />
              <span className="text-xl font-bold text-foreground">
                LanguageHelp
              </span>
            </div>
            <p className="text-sm leading-6 text-muted-foreground">
              Breaking language barriers with instant access to certified
              interpreters and AI-powered translation tools. Making communication
              across languages feel effortless.
            </p>
            <div className="flex space-x-6">
              {social.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <span className="sr-only">{item.name}</span>
                  <item.icon className="h-6 w-6" aria-hidden="true" />
                </a>
              ))}
            </div>
          </div>
          <div className="mt-16 grid grid-cols-2 gap-8 xl:col-span-2 xl:mt-0">
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="text-sm font-semibold leading-6 text-foreground">
                  Services
                </h3>
                <ul role="list" className="mt-6 space-y-4">
                  {navigation.services.map((item) => (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        className="text-sm leading-6 text-muted-foreground hover:text-foreground"
                      >
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-10 md:mt-0">
                <h3 className="text-sm font-semibold leading-6 text-foreground">
                  Company
                </h3>
                <ul role="list" className="mt-6 space-y-4">
                  {navigation.company.map((item) => (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        className="text-sm leading-6 text-muted-foreground hover:text-foreground"
                      >
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="text-sm font-semibold leading-6 text-foreground">
                  Support
                </h3>
                <ul role="list" className="mt-6 space-y-4">
                  {navigation.support.map((item) => (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        className="text-sm leading-6 text-muted-foreground hover:text-foreground"
                      >
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-10 md:mt-0">
                <h3 className="text-sm font-semibold leading-6 text-foreground">
                  Legal
                </h3>
                <ul role="list" className="mt-6 space-y-4">
                  {navigation.legal.map((item) => (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        className="text-sm leading-6 text-muted-foreground hover:text-foreground"
                      >
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-16 border-t border-border pt-8 sm:mt-20 lg:mt-24">
          <div className="md:flex md:items-center md:justify-between">
            <div className="flex space-x-6 md:order-2">
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Phone className="h-4 w-4" />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Mail className="h-4 w-4" />
                <span>support@languagehelp.com</span>
              </div>
            </div>
            <p className="mt-8 text-xs leading-5 text-muted-foreground md:order-1 md:mt-0">
              &copy; 2024 LanguageHelp, Inc. All rights reserved. HIPAA Compliant | GDPR Compliant | ISO 27001 Certified
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
