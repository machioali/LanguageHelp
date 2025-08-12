import React from 'react';

export function SimpleFooter() {
  return (
    <footer className="bg-background border-t py-4">
      <div className="container mx-auto px-4">
        <p className="text-xs text-center text-muted-foreground">
          &copy; 2024 LanguageHelp, Inc. All rights reserved. HIPAA Compliant | GDPR Compliant | ISO 27001 Certified
        </p>
      </div>
    </footer>
  );
}