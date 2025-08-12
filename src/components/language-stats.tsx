'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Globe } from 'lucide-react';
import { 
  LANGUAGES, 
  getAllRegions, 
  getLanguagesByRegion, 
  getPopularLanguages 
} from '@/lib/languages';

export function LanguageStats() {
  const totalLanguages = LANGUAGES.length;
  const allRegions = getAllRegions();
  const popularLanguages = getPopularLanguages();
  
  const regionStats = allRegions.map(region => ({
    region,
    count: getLanguagesByRegion(region).length
  })).sort((a, b) => b.count - a.count);

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Globe className="h-6 w-6 text-primary" />
          Language Coverage Overview
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Total Languages */}
          <div className="text-center p-6 bg-primary/5 rounded-lg">
            <div className="text-4xl font-bold text-primary mb-2">
              {totalLanguages}+
            </div>
            <div className="text-lg text-muted-foreground">
              Languages Available
            </div>
          </div>

          {/* Popular Languages */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Most Requested Languages</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
              {popularLanguages.map((lang) => (
                <Badge key={lang.code} variant="secondary" className="justify-center p-2">
                  {lang.name}
                </Badge>
              ))}
            </div>
          </div>

          {/* Regional Breakdown */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Regional Coverage</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {regionStats.map(({ region, count }) => (
                <div key={region} className="flex justify-between items-center p-3 border rounded-lg">
                  <span className="text-sm font-medium">{region}</span>
                  <Badge variant="outline">{count} languages</Badge>
                </div>
              ))}
            </div>
          </div>

          {/* Sample Languages by Region */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Sample Languages by Region</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {allRegions.slice(0, 6).map((region) => {
                const regionLangs = getLanguagesByRegion(region).slice(0, 5);
                return (
                  <div key={region} className="border rounded-lg p-4">
                    <h4 className="font-medium mb-2 text-primary">{region}</h4>
                    <div className="space-y-1">
                      {regionLangs.map((lang) => (
                        <div key={lang.code} className="text-sm flex justify-between">
                          <span>{lang.name}</span>
                          {lang.nativeName && lang.nativeName !== lang.name && (
                            <span className="text-muted-foreground">{lang.nativeName}</span>
                          )}
                        </div>
                      ))}
                      {getLanguagesByRegion(region).length > 5 && (
                        <div className="text-xs text-muted-foreground">
                          +{getLanguagesByRegion(region).length - 5} more...
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
