'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LanguageSelector } from '@/components/ui/language-selector';
import { LanguageStats } from '@/components/language-stats';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import { getLanguageByCode } from '@/lib/languages';

export default function LanguageDemoPage() {
  const [selectedLanguage, setSelectedLanguage] = useState<string>('');
  const [showStats, setShowStats] = useState(true);

  const selectedLangData = selectedLanguage ? getLanguageByCode(selectedLanguage) : null;

  return (
    <div className="min-h-screen bg-background py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Link href="/">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Home
                </Button>
              </Link>
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-foreground">
              Language Selector Demo
            </h1>
            <p className="text-lg text-muted-foreground mt-2">
              Experience our enhanced language selection with 180+ languages
            </p>
          </div>
          <Button 
            variant="outline" 
            onClick={() => setShowStats(!showStats)}
          >
            {showStats ? 'Hide' : 'Show'} Language Stats
          </Button>
        </div>

        {/* Success Message */}
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
            <div>
              <h3 className="font-semibold text-green-800 dark:text-green-400">
                Language Support Expanded!
              </h3>
              <p className="text-green-700 dark:text-green-300 text-sm">
                We've upgraded from 100+ to 180+ languages, including major world languages, 
                regional dialects, and sign languages.
              </p>
            </div>
          </div>
        </div>

        {/* Language Selector Demo */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Try the Language Selector</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Select a Language
                </label>
                <LanguageSelector
                  value={selectedLanguage}
                  onValueChange={setSelectedLanguage}
                  placeholder="Choose from 180+ languages..."
                  showNativeNames={true}
                  showRegions={false}
                />
              </div>

              {selectedLangData && (
                <div className="mt-4 p-4 bg-primary/5 rounded-lg">
                  <h3 className="font-semibold text-primary mb-2">Selected Language:</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Name:</span>
                      <span className="text-sm">{selectedLangData.name}</span>
                    </div>
                    {selectedLangData.nativeName && selectedLangData.nativeName !== selectedLangData.name && (
                      <div className="flex justify-between">
                        <span className="text-sm font-medium">Native Name:</span>
                        <span className="text-sm">{selectedLangData.nativeName}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Code:</span>
                      <Badge variant="outline" className="text-xs">
                        {selectedLangData.code}
                      </Badge>
                    </div>
                    {selectedLangData.region && (
                      <div className="flex justify-between">
                        <span className="text-sm font-medium">Region:</span>
                        <Badge variant="secondary" className="text-xs">
                          {selectedLangData.region}
                        </Badge>
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div className="text-sm text-muted-foreground">
                <strong>Features:</strong>
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li>Search across all 180+ languages</li>
                  <li>Browse by popular languages</li>
                  <li>Filter by geographical regions</li>
                  <li>Native script display</li>
                  <li>Keyboard navigation support</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Implementation Benefits</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium">Expanded Coverage</h4>
                    <p className="text-sm text-muted-foreground">
                      From 100+ to 180+ languages including major world languages, 
                      regional dialects, and sign languages.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium">Better User Experience</h4>
                    <p className="text-sm text-muted-foreground">
                      Organized tabs for search, popular languages, and regional browsing 
                      make finding languages easier.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium">Native Script Support</h4>
                    <p className="text-sm text-muted-foreground">
                      Languages display in both English and their native scripts 
                      for better recognition.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium">Smart Search</h4>
                    <p className="text-sm text-muted-foreground">
                      Search by language name, native name, or language code 
                      for quick discovery.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium">Regional Organization</h4>
                    <p className="text-sm text-muted-foreground">
                      Languages grouped by geographical regions for logical browsing 
                      and cultural relevance.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Language Statistics */}
        {showStats && (
          <div>
            <LanguageStats />
          </div>
        )}

        {/* Call to Action */}
        <div className="text-center py-8">
          <h2 className="text-2xl font-bold mb-4">Ready to Connect Globally?</h2>
          <p className="text-lg text-muted-foreground mb-6">
            With 180+ languages at your fingertips, breaking language barriers has never been easier.
          </p>
          <div className="flex gap-4 justify-center">
            <Button size="lg" asChild>
              <Link href="/dashboard">
                Try the Dashboard
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/book">
                Book a Session
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
