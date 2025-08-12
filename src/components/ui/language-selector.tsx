'use client';

import React, { useState, useMemo } from 'react';
import { Check, ChevronDown, Search, Globe, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  LANGUAGES, 
  getPopularLanguages, 
  getAllRegions, 
  getLanguagesByRegion, 
  searchLanguages,
  type Language 
} from '@/lib/languages';

interface LanguageSelectorProps {
  value?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  showNativeNames?: boolean;
  showRegions?: boolean;
}

export function LanguageSelector({
  value,
  onValueChange,
  placeholder = "Select language...",
  disabled = false,
  className,
  showNativeNames = true,
  showRegions = false,
}: LanguageSelectorProps) {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  
  const selectedLanguage = useMemo(() => {
    return LANGUAGES.find(lang => lang.code === value);
  }, [value]);

  const popularLanguages = useMemo(() => getPopularLanguages(), []);
  const allRegions = useMemo(() => getAllRegions(), []);
  
  const filteredLanguages = useMemo(() => {
    if (!searchQuery) return LANGUAGES;
    return searchLanguages(searchQuery);
  }, [searchQuery]);

  const handleSelect = (languageCode: string) => {
    onValueChange?.(languageCode);
    setOpen(false);
    setSearchQuery("");
  };

  const renderLanguageItem = (language: Language, isSelected: boolean = false) => (
    <div className="flex items-center justify-between w-full">
      <div className="flex items-center gap-2 flex-1 min-w-0">
        <div className="flex-1 min-w-0">
          <div className="font-medium truncate">{language.name}</div>
          {showNativeNames && language.nativeName && language.nativeName !== language.name && (
            <div className="text-xs text-muted-foreground truncate">
              {language.nativeName}
            </div>
          )}
        </div>
        {showRegions && language.region && (
          <Badge variant="outline" className="text-xs shrink-0">
            {language.region}
          </Badge>
        )}
      </div>
      {isSelected && (
        <Check className="h-4 w-4 shrink-0 ml-2" />
      )}
    </div>
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("w-full justify-between", className)}
          disabled={disabled}
        >
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <Globe className="h-4 w-4 shrink-0 text-muted-foreground" />
            {selectedLanguage ? (
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <span className="truncate">{selectedLanguage.name}</span>
                {showNativeNames && selectedLanguage.nativeName && selectedLanguage.nativeName !== selectedLanguage.name && (
                  <span className="text-sm text-muted-foreground truncate">
                    ({selectedLanguage.nativeName})
                  </span>
                )}
              </div>
            ) : (
              <span className="text-muted-foreground truncate">{placeholder}</span>
            )}
          </div>
          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[400px] p-0" align="start">
        <Tabs defaultValue="search" className="w-full">
          <div className="flex items-center border-b px-3">
            <TabsList className="grid w-full grid-cols-3 h-9">
              <TabsTrigger value="search" className="text-xs">Search</TabsTrigger>
              <TabsTrigger value="popular" className="text-xs">Popular</TabsTrigger>
              <TabsTrigger value="regions" className="text-xs">Regions</TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="search" className="m-0">
            <div className="border-0">
              <div className="flex items-center border-b px-3 py-2">
                <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
                <Input
                  placeholder="Search languages..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="border-0 p-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                />
                {searchQuery && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-4 w-4 p-0 ml-2"
                    onClick={() => setSearchQuery("")}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                )}
              </div>
              <ScrollArea className="h-[300px]">
                {filteredLanguages.length === 0 ? (
                  <div className="py-6 text-center text-sm">
                    No languages found.
                  </div>
                ) : (
                  <div className="p-1">
                    {filteredLanguages.map((language) => (
                      <Button
                        key={language.code}
                        variant="ghost"
                        className="w-full justify-start px-3 py-2 h-auto text-left"
                        onClick={() => handleSelect(language.code)}
                      >
                        {renderLanguageItem(language, selectedLanguage?.code === language.code)}
                      </Button>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </div>
          </TabsContent>
          
          <TabsContent value="popular" className="m-0">
            <ScrollArea className="h-[300px]">
              <div className="p-2">
                <div className="px-2 py-1.5 text-sm font-medium text-muted-foreground">
                  Most Requested Languages ({popularLanguages.length})
                </div>
                {popularLanguages.map((language) => (
                  <Button
                    key={language.code}
                    variant="ghost"
                    className="w-full justify-start px-3 py-2 h-auto"
                    onClick={() => handleSelect(language.code)}
                  >
                    {renderLanguageItem(language, selectedLanguage?.code === language.code)}
                  </Button>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>
          
          <TabsContent value="regions" className="m-0">
            <ScrollArea className="h-[300px]">
              <div className="p-2">
                {allRegions.map((region, index) => {
                  const regionLanguages = getLanguagesByRegion(region);
                  return (
                    <div key={region}>
                      <div className="px-2 py-1.5 text-sm font-medium text-muted-foreground sticky top-0 bg-background">
                        {region} ({regionLanguages.length})
                      </div>
                      {regionLanguages.map((language) => (
                        <Button
                          key={language.code}
                          variant="ghost"
                          className="w-full justify-start px-3 py-1 h-auto text-sm"
                          onClick={() => handleSelect(language.code)}
                        >
                          {renderLanguageItem(language, selectedLanguage?.code === language.code)}
                        </Button>
                      ))}
                      {index < allRegions.length - 1 && <Separator className="my-2" />}
                    </div>
                  );
                })}
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </PopoverContent>
    </Popover>
  );
}
